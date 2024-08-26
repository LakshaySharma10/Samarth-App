import User from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { log } from "console";

// Generate access and refresh tokens
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Something went wrong while generating access and refresh tokens');
    }
};

// Register a new user
export const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password, fullName, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ApiError(400, 'User already exists'));
    }

    // Create the user
    const user = await User.create({
        username,
        email,
        password,
        fullName,
        role,
    });

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.status(201).json(new ApiResponse(201, { user, accessToken, refreshToken }));
});

// Login a user
export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError(404, 'Invalid credentials'));
    }

    // Check if the password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return next(new ApiError(401, 'Invalid credentials'));
    }

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.status(200).json(new ApiResponse(200, { user, accessToken, refreshToken }));
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    res.status(200).json(new ApiResponse(200, user));
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.fullName = req.body.fullName || user.fullName;

    if (req.body.password) {
        user.password = req.body.password; // Password will be hashed in the pre-save hook
    }

    await user.save();

    res.status(200).json(new ApiResponse(200, user));
});

// Delete user
export const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    await user.remove();

    res.status(200).json(new ApiResponse(200, 'User removed successfully'));
});

//logout user
export const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

// Refresh access token
export const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return next(new ApiError(401, 'Unauthorized request'));
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);

        if (!user) {
            return next(new ApiError(401, 'Invalid refresh token'));
        }

        if (incomingRefreshToken !== user.refreshToken) {
            return next(new ApiError(401, 'Refresh token is expired'));
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Refresh token generated'));
    } catch (error) {
        return next(new ApiError(401, error.message || 'Invalid refresh token'));
    }
});
