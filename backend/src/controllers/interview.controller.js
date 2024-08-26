import Interview from '../models/interview.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new Interview
export const createInterview = asyncHandler(async (req, res) => {
    const interview = new Interview(req.body);
    await interview.save();
    res.status(201).json(new ApiResponse(201, interview, 'Interview created successfully'));
});

// Get all Interviews
export const getInterviews = asyncHandler(async (req, res) => {
    const interviews = await Interview.find();
    res.status(200).json(new ApiResponse(200, interviews));
});

// Get an Interview by ID
export const getInterviewById = asyncHandler(async (req, res) => {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
        throw new ApiError(404, 'Interview not found');
    }
    res.status(200).json(new ApiResponse(200, interview));
});

// Update an Interview
export const updateInterview = asyncHandler(async (req, res) => {
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!interview) {
        throw new ApiError(404, 'Interview not found');
    }
    res.status(200).json(new ApiResponse(200, interview, 'Interview updated successfully'));
});

// Delete an Interview
export const deleteInterview = asyncHandler(async (req, res) => {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) {
        throw new ApiError(404, 'Interview not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'Interview deleted successfully'));
});
