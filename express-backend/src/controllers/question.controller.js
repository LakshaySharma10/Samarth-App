import Question from '../models/question.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new Question
export const createQuestion = asyncHandler(async (req, res) => {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(new ApiResponse(201, question, 'Question created successfully'));
});

// Get all Questions
export const getQuestions = asyncHandler(async (req, res) => {
    const questions = await Question.find();
    res.status(200).json(new ApiResponse(200, questions));
});

// Get a Question by ID
export const getQuestionById = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    if (!question) {
        throw new ApiError(404, 'Question not found');
    }
    res.status(200).json(new ApiResponse(200, question));
});

// Update a Question
export const updateQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) {
        throw new ApiError(404, 'Question not found');
    }
    res.status(200).json(new ApiResponse(200, question, 'Question updated successfully'));
});

// Delete a Question
export const deleteQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
        throw new ApiError(404, 'Question not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'Question deleted successfully'));
});
