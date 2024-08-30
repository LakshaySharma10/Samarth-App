import { Router } from 'express';
import {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} from '../controllers/question.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Routes requiring authentication
router.post('/create', verifyJWT, createQuestion);
router.get('/all', verifyJWT, getQuestions);
router.get('/:id', verifyJWT, getQuestionById);
router.put('/:id', verifyJWT, updateQuestion);
router.delete('/:id', verifyJWT, deleteQuestion);

export default router;