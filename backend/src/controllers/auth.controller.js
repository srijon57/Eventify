import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { PendingUser } from "../models/pendingUser.model.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("generateAccessAndRefreshToken error:", error);
        throw new ApiError(500, "Something went wrong");
    }
};

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
            })
            .cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
            })
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token Refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token");
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if ([username, email, password].some((f) => !f?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const isUserExists = await User.findOne({ $or: [{ username }, { email }] });
    if (isUserExists) {
        throw new ApiError(409, "User already exists");
    }

    let profileImageUrl = "";
    if (req.files?.avatar?.[0]?.path) {
        const profileImagePath = req.files?.avatar?.[0]?.path;
        const profileImage = await uploadOnCloudinary(profileImagePath);
        profileImageUrl = profileImage.url;
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await PendingUser.create({
        username: username.toLowerCase().trim(),
        email,
        password,  // store plain password (hashed later)
        profileImage: profileImageUrl,
        otp,
        otpExpiry: Date.now() + 10 * 60 * 1000,
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}`,
    });

    return res.status(200).json(new ApiResponse(200, {}, "OTP sent to email"));
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: 1,
            },
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User Fetched Successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Current Password");
    }

    user.password = newPassword;

    await user.save({
        validateBeforeSave: true,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { username } = req.body;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is required");
    }

    const updateData = { username: username.trim().toLowerCase() };

    const existingUsernameUser = await User.findOne({
        username: updateData.username,
        _id: { $ne: req.user._id },
    });
    if (existingUsernameUser) {
        throw new ApiError(409, "Username is already taken");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Username updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading in cloudinary");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                profileImage: avatar.url,
            },
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar Changed Successfully"));
});
const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) throw new ApiError(400, "No pending registration found");

    if (pendingUser.otp !== otp || pendingUser.otpExpiry < Date.now()) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    const user = await User.create({
        username: pendingUser.username,
        email: pendingUser.email,
        password: pendingUser.password,
        profileImage: pendingUser.profileImage || "", 
    });

    await PendingUser.deleteOne({ email });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            { user, accessToken, refreshToken },
            "Account verified & registered"
        )
    );
});


export {
    registerUser,
    refreshAccessToken,
    generateAccessAndRefreshToken,
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword,
    updateAccountDetails,
    updateUserAvatar,
    verifyOTP,
};
