import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { Event } from "../models/Event.model.js";
import { User } from "../models/User.model.js";
import { Registration } from "../models/Registration.model.js";
import { Certificate } from "../models/Certificate.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from "axios";

const createCertificate = asyncHandler(async (req, res) => {
    const { event } = req.params;
    const userId = req.user._id;

    const eventDetails = await Event.findById(event);
    if (!eventDetails) {
        throw new ApiError(404, "Event not found");
    }

    const registration = await Registration.findOne({
        user: userId,
        event: eventDetails._id,
    });
    if (!registration) {
        throw new ApiError(403, "User not registered for this event");
    }

    let existing = await Certificate.findOne({
        user: userId,
        event: eventDetails._id,
    });
    if (existing) {
        return res.download(existing.certificateUrl);
    }

    const now = new Date();
    const oneWeekAfterEvent = new Date(eventDetails.eventTime.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (now < oneWeekAfterEvent) {
        return res.status(400).json(new ApiResponse(400, null, "Certificates can be generated only after one week of event completion"));
    }

    const user = await User.findById(userId);

    const doc = new PDFDocument();
    if (!fs.existsSync("certificates")) {
        fs.mkdirSync("certificates");
    }
    const filePath = path.join(
        "certificates",
        `${user.username}_${eventDetails.title}.pdf`
    );
    doc.pipe(fs.createWriteStream(filePath));

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke(
        "#1f4e79"
    );

    if (eventDetails.image) {
        try {
            const response = await axios.get(eventDetails.image, {
                responseType: "arraybuffer",
            });
            const imgBuffer = Buffer.from(response.data, "binary");
            const imgX = doc.page.width / 2 - 100;
            doc.image(imgBuffer, imgX, 50, { width: 200 });
        } catch (err) {
            console.warn("Could not load event image:", err.message);
        }
    }

    doc.moveDown(10);

    doc.fontSize(32)
        .fillColor("#1f4e79")
        .text("Certificate of Participation", {
            align: "center",
            underline: true,
        });

    doc.moveDown(2);

    doc.fontSize(22)
        .fillColor("#000000")
        .text(`This is to certify that`, { align: "center" });

    doc.font("Helvetica-Bold")
        .fontSize(26)
        .fillColor("#333333")
        .text(`${user.username.toUpperCase()}`, { align: "center" });

    doc.moveDown(0.5);

    doc.font("Times-Roman")
        .fontSize(18)
        .text(`Student ID: ${user.studentId}`, { align: "center" })
        .text(`Department: ${user.department}`, { align: "center" });

    doc.moveDown(1.5);

    doc.fontSize(20)
        .fillColor("#1f4e79")
        .text(`has participated in`, { align: "center" });

    doc.font("Helvetica-BoldOblique")
        .fontSize(24)
        .fillColor("#000000")
        .text(`${eventDetails.title}`, { align: "center" });

    doc.moveDown(1);
    doc.fontSize(14)
        .fillColor("#555555")
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });

    doc.moveDown(0.5);

    doc.fontSize(18)
        .fillColor("#555555")
        .text(`Organized by: ${eventDetails.organizingClub}`, {
            align: "center",
        });

    doc.moveDown(1);
    doc.fontSize(14)
        .fillColor("#555555")
        .text(`Powered By Eventify`, { align: "center" });

    doc.moveDown(3);

    doc.end();

    const certificate = new Certificate({
        user: userId,
        event: eventDetails._id,
        certificateUrl: filePath,
    });
    await certificate.save();

    res.download(filePath, (err) => {
        if (err) throw new ApiError(500, "Error sending certificate file");
    });
});
export { createCertificate };
