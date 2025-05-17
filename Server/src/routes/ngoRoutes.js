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
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/activities', getActivities);
router.get('/activities/:id', getActivityDetails);

// Protected routes (require authentication)
router.post('/activities', verifyToken, createActivity);
router.get('/my-activities', verifyToken, getMyActivities);
router.post('/activities/:activityId/volunteer', verifyToken, registerVolunteer);
router.put('/activities/:id/status', verifyToken, updateActivityStatus);
router.get('/activities/:id/volunteers', verifyToken, getActivityVolunteers);

export default router;
