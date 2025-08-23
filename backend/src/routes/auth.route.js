import { Router } from "express";
import {
    registerUser,
    refreshAccessToken,
    generateAccessAndRefreshToken,
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword,
    updateAccountDetails,
    updateUserAvatar,
    verifyOTP
} from "../controllers/auth.controller.js";

import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    registerUser
)
router.post("/verify-otp", verifyOTP);
router.route("/login").post(loginUser);

// Secured Route
router.route("/logout").post(verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/update-account").patch(verifyJWT, upload.none(), updateAccountDetails);
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.post("/refresh-token", refreshAccessToken);


export default router;