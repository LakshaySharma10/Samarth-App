import { Router } from 'express';
import {
    createScore,
    getScores,
    getScoreById,
    updateScore,
    deleteScore
} from '../controllers/score.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Routes requiring authentication
router.post('/create', verifyJWT, createScore);
router.get('/all', verifyJWT, getScores);
router.get('/:id', verifyJWT, getScoreById);
router.put('/:id', verifyJWT, updateScore);
router.delete('/:id', verifyJWT, deleteScore);

export default router;