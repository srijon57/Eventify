import { Router } from "express";
import {
    createCertificate,
    
} from "../controllers/certificate.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/:event/create-certificate")
    .post(verifyJWT, createCertificate);

export default router;
