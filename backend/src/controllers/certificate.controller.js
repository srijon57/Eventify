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

    // Validate event
    const eventDetails = await Event.findById(event);
    if (!eventDetails) {
        throw new ApiError(404, "Event not found");
    }

    // Check registration
    const registration = await Registration.findOne({
        user: userId,
        event: eventDetails._id,
    });
    if (!registration) {
        throw new ApiError(403, "User not registered for this event");
    }

    // Check if certificate already exists in database (optional tracking)
    const existingCertificate = await Certificate.findOne({
        user: userId,
        event: eventDetails._id,
    });

    // Check time restriction (one week after event)
    const now = new Date();
    const oneWeekAfterEvent = new Date(eventDetails.eventTime.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (now < oneWeekAfterEvent) {
        return res.status(400).json(
            new ApiResponse(400, null, "Certificates can be generated only after one week of event completion")
        );
    }

    const user = await User.findById(userId);

    // Create PDF document
    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }
    });

    // Set response headers for PDF download
    const filename = `certificate_${eventDetails.title}_${user.username}.pdf`
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\s+/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF directly to response
    doc.pipe(res);

    // Certificate border
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
       .stroke("#1f4e79")
       .lineWidth(3);

    // Event image (if available)
    let imageLoaded = false;
    if (eventDetails.image) {
        try {
            const response = await axios.get(eventDetails.image, {
                responseType: "arraybuffer",
                timeout: 10000
            });
            const imgBuffer = Buffer.from(response.data, "binary");
            const imgX = doc.page.width / 2 - 75; // Center the image
            doc.image(imgBuffer, imgX, 60, { width: 150 });
            imageLoaded = true;
        } catch (err) {
            console.warn("Could not load event image:", err.message);
        }
    }

    // Adjust starting position based on image presence
    const startY = imageLoaded ? 220 : 120;
    let currentY = startY;

    // Main title - PROPERLY CENTERED
    doc.fontSize(32)
       .fillColor("#1f4e79")
       .font('Helvetica-Bold');
    
    // Center text by using the text method with alignment
    doc.text("Certificate of Participation", 50, currentY, {
        align: "center",
        width: doc.page.width - 100, // Full width minus margins
        underline: false
    });
    
    currentY += 80;

    // Recipient text - PROPERLY CENTERED
    doc.fontSize(20)
       .fillColor("#000000")
       .font('Helvetica')
       .text("This is to certify that", 50, currentY, {
            align: "center",
            width: doc.page.width - 100
        });
    
    currentY += 40;

    // Username - PROPERLY CENTERED
    doc.fontSize(28)
       .fillColor("#1f4e79")
       .font('Helvetica-Bold')
       .text(user.username.toUpperCase(), 50, currentY, {
            align: "center",
            width: doc.page.width - 100
        });
    
    currentY += 50;

    // Student details - PROPERLY CENTERED
    doc.fontSize(16)
       .fillColor("#333333")
       .font('Helvetica')
       .text(`Student ID: ${user.studentId || 'N/A'}`, 50, currentY, {
            align: "center",
            width: doc.page.width - 100
        });
    
    currentY += 25;

    doc.text(`Department: ${user.department || 'N/A'}`, 50, currentY, {
        align: "center",
        width: doc.page.width - 100
    });
    
    currentY += 60;

    // Participation text - PROPERLY CENTERED
    doc.fontSize(18)
       .fillColor("#1f4e79")
       .text("has successfully participated in", 50, currentY, {
            align: "center",
            width: doc.page.width - 100
        });
    
    currentY += 40;

    // Event title - PROPERLY CENTERED
    doc.fontSize(24)
       .fillColor("#000000")
       .font('Helvetica-BoldOblique')
       .text(eventDetails.title, 50, currentY, {
            align: "center",
            width: doc.page.width - 100
        });
    
    currentY += 80;

    // Event details - PROPERLY CENTERED
    doc.fontSize(14)
       .fillColor("#555555")
       .font('Helvetica')
       .text(`Event Date: ${eventDetails.eventTime.toLocaleDateString()}`, 50, currentY, {
            align: "center",
            width: doc.page.width - 100
        });
    
    currentY += 25;

    doc.text(`Organized by: ${eventDetails.organizingClub}`, 50, currentY, {
        align: "center",
        width: doc.page.width - 100
    });
    
    currentY += 60;

    // Certificate date - PROPERLY CENTERED
    doc.fontSize(12)
       .fillColor("#777777")
       .text(`Certificate Generated on: ${new Date().toLocaleDateString()}`, 50, currentY, {
            align: "center",
            width: doc.page.width - 100
        });
    
    currentY += 40;

    // Footer - PROPERLY CENTERED
    doc.fontSize(12)
       .fillColor("#888888")
       .text("Powered By Eventify", 50, doc.page.height - 80, {
            align: "center",
            width: doc.page.width - 100
        });

    // Add decorative elements
    doc.strokeColor("#e0e0e0")
       .lineWidth(1);
    
    // Left decorative line
    doc.moveTo(80, startY - 20)
       .lineTo(180, startY - 20)
       .stroke();
    
    // Right decorative line
    doc.moveTo(doc.page.width - 180, startY - 20)
       .lineTo(doc.page.width - 80, startY - 20)
       .stroke();

    // Track certificate generation in database (optional)
    if (!existingCertificate) {
        try {
            await Certificate.create({
                user: userId,
                event: eventDetails._id,
                certificateUrl: `generated://${filename}`,
                generatedAt: new Date()
            });
        } catch (dbError) {
            console.warn("Failed to track certificate in database:", dbError.message);
        }
    }

    // Finalize PDF
    doc.end();
});

export { createCertificate };