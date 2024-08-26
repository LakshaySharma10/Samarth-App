import { Router } from 'express';
import {
    createInterview,
    getInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview
} from '../controllers/interview.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Routes requiring authentication
router.post('/create', verifyJWT, createInterview);
router.get('/all', verifyJWT, getInterviews);
router.get('/:id', verifyJWT, getInterviewById);
router.put('/:id', verifyJWT, updateInterview);
router.delete('/:id', verifyJWT, deleteInterview);

// Additional routes for interview management
router.get('/by-candidate/:candidateId', verifyJWT, getInterviewsByCandidate);
router.get('/by-position/:positionId', verifyJWT, getInterviewsByPosition);
router.get('/upcoming', verifyJWT, getUpcomingInterviews);
router.get('/past', verifyJWT, getPastInterviews);

export default router;
