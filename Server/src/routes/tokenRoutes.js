import express from 'express';
import { getUserTokens, redeemTokens, getVolunteeringHistory } from '../controllers/tokenController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user's token balance
router.get('/balance', auth, getUserTokens);

// Redeem tokens
router.post('/redeem', auth, redeemTokens);

// Get user's volunteering history
router.get('/history', auth, getVolunteeringHistory);

export default router;
