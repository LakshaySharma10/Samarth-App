import { Router } from 'express';
import {
    createVacancy,
    getVacancies,
    getVacancyById,
    updateVacancy,
    deleteVacancy
} from '../controllers/vacancy.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Routes requiring authentication
router.post('/create', verifyJWT, createVacancy);
router.get('/all', verifyJWT, getVacancies);
router.get('/:id', verifyJWT, getVacancyById);
router.put('/:id', verifyJWT, updateVacancy);
router.delete('/:id', verifyJWT, deleteVacancy);

export default router;
