import { Event } from "../models/Event.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Registration } from "../models/registration.model.js";


const createEvent = asyncHandler(async (req, res) => { 
    const { title, description, location, eventTime, category, organizingClub } = req.body;

    if (![title, description, location, eventTime, category, organizingClub].every(field => field?.trim()))
    {
        throw new ApiError(400, "All fields except image are required");
    }

    let imageUrl = "";
    const imagePath = req.files?.image?.[0]?.path;

    if(!imagePath) {
        throw new ApiError(400, "Event image is required");
    }

    const uploadImage = await uploadOnCloudinary(imagePath);

    if(!uploadImage) {
        throw new ApiError(500, "Failed to upload event image in Cloudinary");
    }

    imageUrl = uploadImage.url;

    const event = await Event.create({
        title: title.trim(),
        description: description,
        image: imageUrl,
        location: location.trim(),
        eventTime: new Date(eventTime),
        category,
        organizingClub: organizingClub,
        createdBy: req.user?._id
    });

    res.status(201).json(
        new ApiResponse(201, "Event created successfully", event)
    );
})


const updateEvent = asyncHandler(async (req, res) => { 
    const { id } = req.params;
    const { title, description, location, eventTime, category, organizingClub } = req.body;

    const event = await Event.findById(id);
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if(event.createdBy.toString() !== req.user._id.toString()) {
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
        if (!uploadImage) throw new ApiError(500, "Failed to upload event image in Cloudinary");
        event.image = uploadImage.url;
    }

    await event.save();

    return res.status(200).json(
        new ApiResponse(200, event, "Event updated successfully")
    );
})


//updated -e
const getAllEvents = asyncHandler(async (req, res) => {
    const { category } = req.query;
    
    let filter = {};
    if (category) {
        filter.category = category;
    }

    const events = await Event.find(filter)
        .sort({ eventTime: -1 })
        .populate("createdBy", "username profileImage email");
    
    
    return res.status(200).json(
        new ApiResponse(200, { events }, "Events fetched successfully")
    );
});


//updated -e
const getEventId = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const event = await Event.findById(id)
        .populate("createdBy", "username profileImage email");

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    // Corrected line: Ensure the event object is wrapped in a 'data' key.
    return res.status(200).json(
        new ApiResponse(200, { event }, "Event fetched successfully")
    );
});

const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if(event.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this event");
    }

    await Event.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, null, "Event deleted successfully")
    );
})

const registerToEvent = asyncHandler(async (req, res) => { 
    const { event } = req.params;
    let { studentId, department } = req.body;

    studentId = studentId?.trim();
    department = department?.trim();

    if (!studentId || !department) {
        throw new ApiError(400, "Student ID and Department are required");
    }

    const eventDetails = await Event.findById(event);
    if (!eventDetails) {
        throw new ApiError(404, "Event not found");
    }

    const existingRegistration = await Registration.findOne({
        user: req.user._id,
        event: eventDetails._id
    });

    if (existingRegistration) {
        throw new ApiError(400, "You have already registered for this event");
    }

    const registration = await Registration.create({
        user: req.user._id,
        event: eventDetails._id,
        studentId,
        department
    });

    const populatedRegistration = await registration.populate({
        path: "user",
        select: "username email profileImage"
    });

    eventDetails.participantsCount += 1;
    await eventDetails.save();

    return res.status(201).json(
        new ApiResponse(201, populatedRegistration, "Registered for the event successfully")
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
        event: eventDetails._id
    });

    if (!registration) {
        throw new ApiError(400, "You are not registered for this event");
    }

    await Registration.deleteOne({ _id: registration._id });

    eventDetails.participantsCount = Math.max(0, eventDetails.participantsCount - 1);
    await eventDetails.save();

    return res.status(200).json(
        new ApiResponse(200, null, "Successfully unregistered from the event")
    );
});


const getAllRegisteredUsersForEvent = asyncHandler(async (req, res) => {
    const { event } = req.params;
    
    const eventDetails = await Event.findById(event);
    if (!eventDetails) {
        throw new ApiError(404, "Event not found");
    }

    const registrations = await Registration.find({
        event: eventDetails._id
    })
    .populate(
        {
            path: "user",
            select: "username email profileImage"
        }
    )
    .select("studentId department createdAt");

    return res.status(200).json(
        new ApiResponse(200, registrations, "Registered users fetched successfully")
    );

})

const getRegisteredEventsForUser = asyncHandler(async (req, res) => {
    const userId = req.params.id || req.user?._id;

    const registrations = await Registration.find({ user: userId })
        .populate({
            path: "event",
            select: "title description location date image"
        });

    if (!registrations || registrations.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No registered events found for the user")
        );
    }

    const dashboardEvents = registrations.map(reg => ({
        registrationId: reg._id,
        event: reg.event,
        studentId: reg.studentId,
        department: reg.department,
        registeredAt: reg.createdAt
    }));

    return res.status(200).json(
        new ApiResponse(200, dashboardEvents, "Registered events of this User fetched successfully")
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
    getRegisteredEventsForUser
};

// createEvent – Already done.

// getAllEvents – Fetch all events (with optional filtering by category, date, etc.).

// getEventById – Fetch details of a single event (for event details page).

// updateEvent – Update event details (only by the admin/creator).

// deleteEvent – Delete an event (only by the admin/creator).

// registerToEvent – Let a user register for an event (increment participantsCount and store registration).

// unregisterFromEvent – Let a user unregister from an event (decrement participantsCount).

// getRegisteredUsersForEvent – Admin can see all participants of a specific event.

// getEventsDashboardForUser – List of events a user has registered for, optionally filterable by category.

// getEventsCreatedByAdmin – Admin sees all events they have created.
