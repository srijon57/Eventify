import { Event } from "../models/Event.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Registration } from "../models/registration.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";

const createEvent = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        location,
        eventTime,
        category,
        organizingClub,
        registrationDeadline,
    } = req.body;

    if (
        ![
            title,
            description,
            location,
            eventTime,
            category,
            organizingClub,
        ].every((field) => field?.trim())
    ) {
        throw new ApiError(
            400,
            "All fields except image and registrationDeadline are required"
        );
    }

    let imageUrl = "";
    const imagePath = req.files?.image?.[0]?.path;

    if (!imagePath) {
        throw new ApiError(400, "Event image is required");
    }

    const uploadImage = await uploadOnCloudinary(imagePath);

    if (!uploadImage) {
        throw new ApiError(500, "Failed to upload event image in Cloudinary");
    }

    imageUrl = uploadImage.url;

    const parsedEventTime = new Date(eventTime);
    let deadline = registrationDeadline
        ? new Date(registrationDeadline)
        : new Date(parsedEventTime.getTime() - 60 * 60 * 1000);

    const event = await Event.create({
        title: title.trim(),
        description: description,
        image: imageUrl,
        location: location.trim(),
        eventTime: new Date(eventTime),
        category,
        organizingClub: organizingClub,
        createdBy: req.user?._id,
        registrationDeadline: deadline,
    });

    res.status(201).json(
        new ApiResponse(201, "Event created successfully", event)
    );
});

const sendEventEmail = asyncHandler(async (req, res) => {
    const { event } = req.params;

    const eventDetails = await Event.findById(event).populate(
        "createdBy",
        "username email"
    );
    if (!eventDetails) {
        return res.status(404).json({ message: "Event not found" });
    }

    const registrations = await Registration.find({ event }).populate(
        "user",
        "username email studentId department"
    );

    if (!registrations.length) {
        return res
            .status(400)
            .json({ message: "No participants registered for this event." });
    }

    const subject = `🎉 Reminder: ${eventDetails.title} is coming up!`;

    const text = `
    Event: ${eventDetails.title}
    Description: ${eventDetails.description}
    Location: ${eventDetails.location}
    Time: ${eventDetails.eventTime.toLocaleString()}
    Organized by: ${eventDetails.organizingClub}
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f9f9f9; border: 1px solid #ddd;">
    <h2 style="color: #2c3e50; text-align: center;">${eventDetails.title}</h2>
    
    <p style="font-size: 16px; color: #555;"><strong>Description:</strong> ${
        eventDetails.description
    }</p>
    
    <p style="font-size: 16px; color: #555;"><strong>📍 Location:</strong> ${
        eventDetails.location
    }</p>
    
    <p style="font-size: 16px; color: #555;"><strong>🕒 Time:</strong> ${eventDetails.eventTime.toLocaleString()}</p>
    
    <p style="font-size: 16px; color: #555;"><strong>👥 Organized by:</strong> ${
        eventDetails.organizingClub
    }</p>
    
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;" />
    
    <p style="font-size: 14px; color: #777; text-align: center;">
        You’re receiving this reminder from <strong>Eventify</strong>. Don’t miss it! 🎊
    </p>
    </div>
    `;

    for (const reg of registrations) {
        if (reg.user?.email) {
            await sendEmail(reg.user.email, subject, text, html);
        }
    }

    res.status(200).json({
        message: `Event emails sent to ${registrations.length} participants.`,
    });
});

const updateEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        location,
        eventTime,
        category,
        organizingClub,
    } = req.body;

    const event = await Event.findById(id);
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this event");
    }

    if (title) event.title = title.trim();
    if (description) event.description = description;
    if (location) event.location = location.trim();
    if (eventTime) event.eventTime = new Date(eventTime);
    if (category) event.category = category;
    if (organizingClub) event.organizingClub = organizingClub;

    const imagePath = req.files?.image?.[0]?.path;
    if (imagePath) {
        const uploadImage = await uploadOnCloudinary(imagePath);
        if (!uploadImage)
            throw new ApiError(
                500,
                "Failed to upload event image in Cloudinary"
            );
        event.image = uploadImage.url;
    }

    await event.save();

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Event updated successfully"));
});

const getAllEvents = asyncHandler(async (req, res) => {
    const { category, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (category) {
        filter.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalEvents = await Event.countDocuments(filter);

    const events = await Event.find(filter)
        .sort({ eventTime: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("createdBy", "username profileImage email");

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                events,
                pagination: {
                    total: totalEvents,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(totalEvents / limit),
                },
            },
            "Events fetched successfully"
        )
    );
});

const getEventId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(id).populate(
        "createdBy",
        "username profileImage email"
    );

    if (!event) throw new ApiError(404, "Event not found");

    const hasViewed = event.viewedBy
        .map((u) => u.toString())
        .includes(userId.toString());

    if (!hasViewed) {
        event.viewsCount += 1;
        event.viewedBy.push(userId);
        await event.save();
    }

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Event fetched successfully"));
});

const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this event");
    }

    await Event.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Event deleted successfully"));
});

const registerToEvent = asyncHandler(async (req, res) => {
    const { event } = req.params;
    let { studentId, department } = req.body || {};

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.studentId || !user.department) {
        studentId = studentId?.trim();
        department = department?.trim();

        if (!studentId || !department) {
            throw new ApiError(
                400,
                "Student ID and Department are required for first registration"
            );
        }

        user.studentId = studentId;
        user.department = department;
        await user.save();
    } else {
        studentId = user.studentId;
        department = user.department;
    }

    const eventDetails = await Event.findById(event);
    if (!eventDetails) {
        throw new ApiError(404, "Event not found");
    }

    const effectiveDeadline =
        eventDetails.registrationDeadline ||
        new Date(eventDetails.eventTime.getTime() - 60 * 60 * 1000);

    if (new Date() > effectiveDeadline) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    null,
                    "Registration is closed for this event"
                )
            );
    }

    const existingRegistration = await Registration.findOne({
        user: user._id,
        event: eventDetails._id,
    });

    if (existingRegistration) {
        throw new ApiError(400, "You have already registered for this event");
    }

    const registration = await Registration.create({
        user: user._id,
        event: eventDetails._id,
        studentId,
        department,
    });

    const populatedRegistration = await registration.populate({
        path: "user",
        select: "username email profileImage",
    });

    eventDetails.participantsCount += 1;
    await eventDetails.save();

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                populatedRegistration,
                "Registered for the event successfully"
            )
        );
});

const unregisterFromEvent = asyncHandler(async (req, res) => {
    const { event } = req.params;

    const eventDetails = await Event.findById(event);
    if (!eventDetails) {
        throw new ApiError(404, "Event not found");
    }

    const registration = await Registration.findOne({
        user: req.user._id,
        event: eventDetails._id,
    });

    if (!registration) {
        throw new ApiError(400, "You are not registered for this event");
    }

    await Registration.deleteOne({ _id: registration._id });

    eventDetails.participantsCount = Math.max(
        0,
        eventDetails.participantsCount - 1
    );
    await eventDetails.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Successfully unregistered from the event"
            )
        );
});

const getAllRegisteredUsersForEvent = asyncHandler(async (req, res) => {
    const { event } = req.params;
    const { page = 1, limit = 10 } = req.query; // default pagination

    const eventDetails = await Event.findById(event);
    if (!eventDetails) {
        throw new ApiError(404, "Event not found");
    }

    const filter = { event: eventDetails._id };

    const totalRegistrations = await Registration.countDocuments(filter);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const registrations = await Registration.find(filter)
        .populate({
            path: "user",
            select: "username email profileImage",
        })
        .select("studentId department createdAt")
        .skip(skip)
        .limit(parseInt(limit));

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                registrations,
                pagination: {
                    total: totalRegistrations,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(totalRegistrations / limit),
                },
            },
            "Registered users fetched successfully"
        )
    );
});

const getRegisteredEventsForUser = asyncHandler(async (req, res) => {
    const userId = req.params.id || req.user?._id;
    const { page = 1, limit = 10 } = req.query; // default pagination

    const filter = { user: userId };

    const totalRegistrations = await Registration.countDocuments(filter);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const registrations = await Registration.find(filter)
        .populate({
            path: "event",
            select: "title description location date image",
        })
        .skip(skip)
        .limit(parseInt(limit));

    if (!registrations || registrations.length === 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    [],
                    "No registered events found for the user"
                )
            );
    }

    const dashboardEvents = registrations.map((reg) => ({
        registrationId: reg._id,
        event: reg.event,
        studentId: reg.studentId,
        department: reg.department,
        registeredAt: reg.createdAt,
    }));

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                dashboardEvents,
                pagination: {
                    total: totalRegistrations,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(totalRegistrations / limit),
                },
            },
            "Registered events of this User fetched successfully"
        )
    );
});

const getPassedEvent = asyncHandler(async (req, res) => {
    const now = new Date();

    const passedEvent = await Event.find({ eventTime: { $lt: now } }).sort({
        eventTime: -1,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                passedEvent,
                "Passed events fetched successfully"
            )
        );
});

export {
    createEvent,
    updateEvent,
    getAllEvents,
    getEventId,
    deleteEvent,
    registerToEvent,
    unregisterFromEvent,
    getAllRegisteredUsersForEvent,
    getRegisteredEventsForUser,
    sendEventEmail,
    getPassedEvent,
};
