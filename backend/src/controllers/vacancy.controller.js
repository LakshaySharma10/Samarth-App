import Vacancy from '../models/vacancy.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new Vacancy
export const createVacancy = asyncHandler(async (req, res) => {
    const vacancy = new Vacancy(req.body);
    await vacancy.save();
    res.status(201).json(new ApiResponse(201, vacancy, 'Vacancy created successfully'));
});

// Get all Vacancies
export const getVacancies = asyncHandler(async (req, res) => {
    const vacancies = await Vacancy.find();
    res.status(200).json(new ApiResponse(200, vacancies));
});

// Get a Vacancy by ID
export const getVacancyById = asyncHandler(async (req, res) => {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) {
        throw new ApiError(404, 'Vacancy not found');
    }
    res.status(200).json(new ApiResponse(200, vacancy));
});

// Update a Vacancy
export const updateVacancy = asyncHandler(async (req, res) => {
    const vacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vacancy) {
        throw new ApiError(404, 'Vacancy not found');
    }
    res.status(200).json(new ApiResponse(200, vacancy, 'Vacancy updated successfully'));
});

// Delete a Vacancy
export const deleteVacancy = asyncHandler(async (req, res) => {
    const vacancy = await Vacancy.findByIdAndDelete(req.params.id);
    if (!vacancy) {
        throw new ApiError(404, 'Vacancy not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'Vacancy deleted successfully'));
});
