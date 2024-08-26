import { Router } from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    logoutUser,
    refreshAccessToken
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser)

// Secured routes (requires JWT)
// router.use(verifyJWT);

router.route('/profile')
    .get(getUserProfile) // Retrieve profile
    .put(updateUserProfile); // Update profile

router.route('/refresh-token').post(refreshAccessToken);

router.route('/:id').delete(deleteUser); // Delete user by ID

export default router;
