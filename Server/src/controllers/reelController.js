import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Reel from '../models/Reel.js';

// Get directory name (ES module equivalent to __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload a new reel
// @route   POST /api/reels
// @access  Public
export const uploadReel = async (req, res) => {
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
      description: req.body.description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Reel uploaded successfully',
      data: reel
    });
  } catch (error) {
    console.error('Error uploading reel:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// @desc    Get all reels
// @route   GET /api/reels
// @access  Public
export const getReels = async (req, res) => {
  try {
    // Fetch all reels, sorted by creation date (newest first)
    const reels = await Reel.find().sort({ createdAt: -1 });
    
    // Return the reels
    res.status(200).json({
      success: true,
      count: reels.length,
      data: reels
    });
  } catch (error) {
    console.error('Error fetching reels:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// @desc    Get a single reel
// @route   GET /api/reels/:id
// @access  Public
export const getReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    
    if (!reel) {
      return res.status(404).json({
        success: false,
        message: 'Reel not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: reel
    });
  } catch (error) {
    console.error('Error fetching reel:', error);
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Reel not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// @desc    Update a reel (like/unlike)
// @route   PUT /api/reels/:id
// @access  Public
export const updateReel = async (req, res) => {
  try {
    let reel = await Reel.findById(req.params.id);
    
    if (!reel) {
      return res.status(404).json({
        success: false,
        message: 'Reel not found'
      });
    }
    
    // Check what type of update is being performed
    const { action } = req.body;
    
    if (action === 'like') {
      // Increment likes
      reel.likes += 1;
    } else if (action === 'unlike') {
      // Decrement likes, but not below zero
      reel.likes = Math.max(0, reel.likes - 1);
    } else if (action === 'share') {
      // Increment shares
      reel.shares += 1;
    } else {
      // For general updates, use the provided fields
      const { description } = req.body;
      if (description !== undefined) {
        reel.description = description;
      }
    }
    
    // Save the updated reel
    await reel.save();
    
    res.status(200).json({
      success: true,
      message: 'Reel updated successfully',
      data: reel
    });
  } catch (error) {
    console.error('Error updating reel:', error);
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Reel not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// @desc    Delete a reel
// @route   DELETE /api/reels/:id
// @access  Public
export const deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    
    if (!reel) {
      return res.status(404).json({
        success: false,
        message: 'Reel not found'
      });
    }
    
    // Get the full path of the file to delete
    const filePath = path.join(__dirname, '../../..', reel.media.filePath);
    
    // Delete the file from the filesystem if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete the reel from the database
    await reel.remove();
    
    res.status(200).json({
      success: true,
      message: 'Reel deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting reel:', error);
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Reel not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};
