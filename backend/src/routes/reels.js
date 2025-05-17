const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadReel,
  getReels,
  getReel,
  updateReel,
  deleteReel
} = require('../controllers/reelController');

// Upload a new reel and get all reels
router.route('/')
  .post(upload.single('media'), uploadReel)
  .get(getReels);

// Get, update, or delete a specific reel
router.route('/:id')
  .get(getReel)
  .put(updateReel)
  .delete(deleteReel);

module.exports = router; 