import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String, // hashed already
        profileImage: String,
        otp: String,
        otpExpiry: Date,
    },
    { timestamps: true }
);

export const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
