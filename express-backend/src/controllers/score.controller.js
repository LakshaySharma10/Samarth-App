import Score from '../models/score.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new Score
export const createScore = asyncHandler(async (req, res) => {
    const score = new Score(req.body);
    await score.save();
    res.status(201).json(new ApiResponse(201, score, 'Score created successfully'));
});

// Get all Scores
export const getScores = asyncHandler(async (req, res) => {
    const scores = await Score.find();
    res.status(200).json(new ApiResponse(200, scores));
});

// Get a Score by ID
export const getScoreById = asyncHandler(async (req, res) => {
    const score = await Score.findById(req.params.id);
    if (!score) {
        throw new ApiError(404, 'Score not found');
    }
    res.status(200).json(new ApiResponse(200, score));
});

// Update a Score
export const updateScore = asyncHandler(async (req, res) => {
    const score = await Score.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!score) {
        throw new ApiError(404, 'Score not found');
    }
    res.status(200).json(new ApiResponse(200, score, 'Score updated successfully'));
});

// Delete a Score
export const deleteScore = asyncHandler(async (req, res) => {
    const score = await Score.findByIdAndDelete(req.params.id);
    if (!score) {
        throw new ApiError(404, 'Score not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'Score deleted successfully'));
});
