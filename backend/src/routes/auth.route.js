import { Router } from "express";
import {
    registerUser,
    refreshAccessToken,
    generateAccessAndRefreshToken,
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword
} from "../controllers/auth.controller.js";

import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    registerUser
)

router.route("/login").post(loginUser);

// Secured Route
router.route("/logout").post(verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.post("/refresh-token", refreshAccessToken);


export default router;