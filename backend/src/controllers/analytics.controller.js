import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Event } from "../models/Event.model.js";
import { Registration } from "../models/registration.model.js";


const getTopAttendedEvent = asyncHandler(async (req, res) => {
    const topEvent = await Registration.aggregate([
        { $group: { _id: "$event", totalRegistrations: { $sum: 1 } } },
        { $sort: { totalRegistrations: -1 } },
        { $limit: 1 },
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

    if (!topEvent || topEvent.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, null, "No events found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, topEvent[0], "Top attended event fetched successfully")
    );
});

const getTopViewedEvent = asyncHandler(async (req, res) => {
    const topEvent = await Event.findOne()
        .sort({ viewsCount: -1, createdAt: -1 })
        .populate("createdBy", "username email profileImage");

    if (!topEvent) {
        throw new ApiError(404, "No events found");
    }

    return res.status(200).json(
        new ApiResponse(200, topEvent, "Top viewed event fetched successfully")
    );
});


export {
    getTopAttendedEvent,
    getTopViewedEvent
}