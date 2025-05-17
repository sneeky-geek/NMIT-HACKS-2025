import express from 'express';
import { 
  createActivity, 
  getActivities, 
  getActivityDetails, 
  getMyActivities, 
  registerVolunteer, 
  updateActivityStatus,
  getActivityVolunteers
} from '../controllers/ngoController.js';
import { verifyToken, isNGO } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (with optional auth for showing volunteer status)
router.get('/activities', verifyToken, getActivities);
router.get('/activities/:id', getActivityDetails);

// User routes (require authentication)
router.post('/activities/:activityId/volunteer', verifyToken, registerVolunteer);

// NGO-only routes (require authentication + NGO role)
router.post('/activities', verifyToken, isNGO, createActivity);
router.get('/my-activities', verifyToken, isNGO, getMyActivities);
router.put('/activities/:id/status', verifyToken, isNGO, updateActivityStatus);
router.get('/activities/:id/volunteers', verifyToken, isNGO, getActivityVolunteers);

export default router;
