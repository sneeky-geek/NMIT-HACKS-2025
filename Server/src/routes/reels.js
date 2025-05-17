import express from 'express';
import upload from '../middleware/upload.js';
import { 
  uploadReel, 
  getReels, 
  getReel, 
  updateReel, 
  deleteReel 
} from '../controllers/reelController.js';

const router = express.Router();

// Upload a new reel and get all reels
router.route('/')
  .post(upload.single('media'), uploadReel)
  .get(getReels);

// Get, update, or delete a specific reel
router.route('/:id')
  .get(getReel)
  .put(updateReel)
  .delete(deleteReel);

export default router;
