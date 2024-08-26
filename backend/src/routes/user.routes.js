import { Router } from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    refreshAccessToken,
    deleteUser
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Routes requiring authentication
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/me').get(verifyJWT, getCurrentUser);
router.route('/change-password').put(verifyJWT, changeCurrentPassword);
router.route('/update-details').put(verifyJWT, updateAccountDetails);

// Admin routes (e.g., to delete a user)
router.route('/:id').delete(verifyJWT, deleteUser);

export default router;
