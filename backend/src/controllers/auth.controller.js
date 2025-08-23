import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js" 
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


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
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "Strict" })
            .cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "Strict" })
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

    if ([username, email, password].some(f => !f?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const isUserExists = await User.findOne({ $or: [{ username }, { email }] });
    if (isUserExists) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const profileImagePath = req.files?.avatar?.[0]?.path;
    if (!profileImagePath) {
        throw new ApiError(400, "Profile image is required");
    }

    const profileImage = await uploadOnCloudinary(profileImagePath);
    if (!profileImage) {
        throw new ApiError(400, "Profile image upload failed");
    }

    const user = await User.create({
        profileImage: profileImage.url,
        email,
        password,
        username: username.toLowerCase().trim()
    });

    if (!user) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const createdUser = await User.findById(user._id).select("-password");

    return res.status(201).json(
        new ApiResponse(201, { user: createdUser, accessToken, refreshToken }, "User Registered Successfully")
    );
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

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

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

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: 1
            }
        },
        {new : true}
        
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const getCurrentUser = asyncHandler( async(req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "User Fetched Successfully")
    )
});

const changePassword = asyncHandler(async(req, res) => {
    

    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user?._id);
    
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid Current Password");
    }

    user.password = newPassword;

    await user.save({
        validateBeforeSave: true
    })

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"))

})

export {
    registerUser,
    refreshAccessToken,
    generateAccessAndRefreshToken,
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword
}