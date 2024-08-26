import Chat from '../models/chat.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new Chat
export const createChat = asyncHandler(async (req, res) => {
    const chat = new Chat(req.body);
    await chat.save();
    res.status(201).json(new ApiResponse(201, chat, 'Chat created successfully'));
});

// Get all Chats
export const getChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find();
    res.status(200).json(new ApiResponse(200, chats));
});

// Get a Chat by ID
export const getChatById = asyncHandler(async (req, res) => {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
        throw new ApiError(404, 'Chat not found');
    }
    res.status(200).json(new ApiResponse(200, chat));
});

// Update a Chat
export const updateChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chat) {
        throw new ApiError(404, 'Chat not found');
    }
    res.status(200).json(new ApiResponse(200, chat, 'Chat updated successfully'));
});

// Delete a Chat
export const deleteChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) {
        throw new ApiError(404, 'Chat not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'Chat deleted successfully'));
});
