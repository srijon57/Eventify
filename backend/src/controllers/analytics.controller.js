import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Event } from "../models/Event.model.js";
import { Registration } from "../models/Registration.model.js";

const getTopAttendedEvent = asyncHandler(async (req, res) => {
    const topEvents = await Registration.aggregate([
        { $group: { _id: "$event", totalRegistrations: { $sum: 1 } } },
        { $sort: { totalRegistrations: -1 } },
        { $limit: 3 },
        {
            $lookup: {
                from: "events",
                localField: "_id",
                foreignField: "_id",
                as: "eventDetails"
            }
        },
        { $unwind: "$eventDetails" },
        {
            $project: {
                _id: 0,
                eventId: "$_id",
                title: "$eventDetails.title",
                image: "$eventDetails.image",
                date: "$eventDetails.eventTime",
                totalRegistrations: 1
            }
        }
    ]);
    if (!topEvents || topEvents.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No events found")
        );
    }
    return res.status(200).json(
        new ApiResponse(200, topEvents, "Top attended events fetched successfully")
    );
});

const getTopViewedEvent = asyncHandler(async (req, res) => {
    const topEvents = await Event.find()
        .sort({ viewsCount: -1, createdAt: -1 })
        .limit(3)
        .populate("createdBy", "username email profileImage");
    if (!topEvents || topEvents.length === 0) {
        throw new ApiError(404, "No events found");
    }
    return res.status(200).json(
        new ApiResponse(200, topEvents, "Top viewed events fetched successfully")
    );
});

export {
    getTopAttendedEvent,
    getTopViewedEvent
};
