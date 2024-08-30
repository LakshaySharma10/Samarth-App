import { Router } from 'express';
import {
    createChat,
    getChats,
    getChatById,
    updateChat,
    deleteChat
} from '../controllers/chat.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Routes requiring authentication
router.post('/create', verifyJWT, createChat);
router.get('/all', verifyJWT, getChats);
router.get('/:id', verifyJWT, getChatById);
router.put('/:id', verifyJWT, updateChat);
router.delete('/:id', verifyJWT, deleteChat);

export default router;