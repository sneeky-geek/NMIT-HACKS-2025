const fs = require('fs');
const path = require('path');
const Reel = require('../models/Reel');

// @desc    Upload a new reel
// @route   POST /api/reels
// @access  Public
exports.uploadReel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Determine media type from mimetype
    const isVideo = req.file.mimetype.startsWith('video/');
    const mediaType = isVideo ? 'video' : 'image';

    // Create a new reel record in the database
    const reel = await Reel.create({
      userId,
      media: {
        type: mediaType,
        fileName: req.file.filename,
        fileType: req.file.mimetype,
        filePath: `/uploads/${req.file.filename}`,
        fileSize: req.file.size
      },
      soundOn: mediaType === 'video' // Set sound on by default for videos
    });

    res.status(201).json({
      success: true,
      data: reel
    });
  } catch (error) {
    console.error('Error uploading reel:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all reels
// @route   GET /api/reels
// @access  Public
exports.getReels = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Build query based on parameters
    const query = {};
    if (userId) {
      query.userId = userId;
    }

    const reels = await Reel.find(query).sort({ createdAt: -1 });

    // Transform the response to include full URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const transformedReels = reels.map(reel => {
      const reelObj = reel.toObject();
      reelObj.media.url = `${baseUrl}${reelObj.media.filePath}`;
      return reelObj;
    });

    res.json({
      success: true,
      count: transformedReels.length,
      data: transformedReels
    });
  } catch (error) {
    console.error('Error getting reels:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get a single reel
// @route   GET /api/reels/:id
// @access  Public
exports.getReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: 'Reel not found'
      });
    }

    // Add the full URL to the media path
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const reelObj = reel.toObject();
    reelObj.media.url = `${baseUrl}${reelObj.media.filePath}`;

    res.json({
      success: true,
      data: reelObj
    });
  } catch (error) {
    console.error('Error getting reel:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update a reel (like/unlike)
// @route   PUT /api/reels/:id
// @access  Public
exports.updateReel = async (req, res) => {
  try {
    const { likes, soundOn } = req.body;
    const updateData = {};
    
    // Check which fields to update
    if (likes !== undefined) updateData.likes = likes;
    if (soundOn !== undefined) updateData.soundOn = soundOn;

    // Find and update the reel
    const reel = await Reel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: 'Reel not found'
      });
    }

    // Add the full URL to the media path
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const reelObj = reel.toObject();
    reelObj.media.url = `${baseUrl}${reelObj.media.filePath}`;

    res.json({
      success: true,
      data: reelObj
    });
  } catch (error) {
    console.error('Error updating reel:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete a reel
// @route   DELETE /api/reels/:id
// @access  Public
exports.deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: 'Reel not found'
      });
    }

    // Delete the file
    const filePath = path.join(__dirname, '../../', reel.media.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the reel record
    await reel.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting reel:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 