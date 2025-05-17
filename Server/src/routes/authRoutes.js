import express from 'express';
import { register, verifyOTP, login } from '../controllers/authController.js';
import { registerNGO, getUserProfile } from '../controllers/ngoAuthController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/register-ngo', registerNGO);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);

// Protected routes
router.get('/profile', verifyToken, getUserProfile);

export default router;
