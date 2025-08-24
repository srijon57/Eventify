import { Router } from "express";
import {
    createEvent,
    updateEvent,
    getAllEvents,
    getEventId,
    deleteEvent,
    registerToEvent,
    unregisterFromEvent,
    getAllRegisteredUsersForEvent,
    getRegisteredEventsForUser,
    sendEventEmail
} from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// secured router

router.route("/create-event")
    .post(verifyJWT, upload.fields([{ name: "image", maxCount: 1 }]), createEvent);

router.route("/get-all-events")
    .get(verifyJWT, getAllEvents);

router.route("/registered-events")
    .get(verifyJWT, getRegisteredEventsForUser);

router.route("/:id") 
    .patch(verifyJWT, upload.fields([{ name: "image", maxCount: 1 }]), updateEvent);

router.route("/:id")
    .get(verifyJWT, getEventId);

router.route("/:id")
    .delete(verifyJWT, deleteEvent);

router.route("/:event/register")
    .post(verifyJWT, registerToEvent);

router.route("/:event/unregister")
    .delete(verifyJWT, unregisterFromEvent);

router.route("/:event/registered-users")
    .get(verifyJWT, getAllRegisteredUsersForEvent);

router.route("/:event/send-event-email")
    .post(verifyJWT, sendEventEmail);

export default router;
