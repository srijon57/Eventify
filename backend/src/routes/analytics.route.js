import { Router } from "express";
import { 
    getTopAttendedEvent,
    getTopViewedEvent
} from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/top-attended-event")
    .get(verifyJWT, getTopAttendedEvent);

router.route("/top-viewed-event")
    .get(verifyJWT, getTopViewedEvent);

export default router;
