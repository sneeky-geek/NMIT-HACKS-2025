import Complaint from '../models/Complaint.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new complaint
const createComplaint = async (req, res) => {
  try {
    const { title, description, address, lat, long } = req.body;
    
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    // Create a new complaint with image stored in DB
    const complaint = new Complaint({
      userId: req.user.id, // From auth middleware
      title,
      description,
      image: {
        data: req.file.buffer, // Store the file buffer directly
        contentType: req.file.mimetype, // Store the mime type
      },
      address,
      location: {
        lat: lat || null,
        long: long || null
      }
    });
    
    await complaint.save();
    
    // Remove the large image buffer from the response
    const responseComplaint = complaint.toObject();
    delete responseComplaint.image.data;
    
    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: responseComplaint
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Server error while creating complaint' });
  }
};

// Get all complaints for a user
const getUserComplaints = async (req, res) => {
  try {
    let complaints = await Complaint.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    // Remove image data from response to reduce payload size
    complaints = complaints.map(complaint => {
      const complaintObj = complaint.toObject();
      if (complaintObj.image && complaintObj.image.data) {
        delete complaintObj.image.data;
      }
      return complaintObj;
    });
    
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({ message: 'Server error while fetching complaints' });
  }
};

// Get all complaints (admin or NGO access)
const getAllComplaints = async (req, res) => {
  try {
    let complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName email phoneNumber');
    
    // Remove image data from response to reduce payload size
    complaints = complaints.map(complaint => {
      const complaintObj = complaint.toObject();
      if (complaintObj.image && complaintObj.image.data) {
        delete complaintObj.image.data;
      }
      return complaintObj;
    });
    
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching all complaints:', error);
    res.status(500).json({ message: 'Server error while fetching complaints' });
  }
};

// Get complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'firstName lastName email phoneNumber');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if user is authorized to view this complaint
    if (req.user.userType !== 'admin' && req.user.userType !== 'ngo' && 
        complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }
    
    // Remove image data from response
    const complaintObj = complaint.toObject();
    if (complaintObj.image && complaintObj.image.data) {
      delete complaintObj.image.data;
    }
    
    res.status(200).json(complaintObj);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ message: 'Server error while fetching complaint' });
  }
};

// Update complaint status (admin or NGO access)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    if (!['pending', 'in-progress', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Update status
    complaint.status = status;
    
    // Add status update to history
    complaint.statusUpdates.push({
      status,
      comment: comment || '',
      updatedAt: new Date()
    });
    
    await complaint.save();
    
    res.status(200).json({
      message: 'Complaint status updated successfully',
      complaint
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Server error while updating complaint status' });
  }
};

// Delete complaint
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if user is authorized to delete this complaint
    if (req.user.userType !== 'admin' && complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this complaint' });
    }
    
    // The image is stored in the database, so no need to delete a physical file
    
    await Complaint.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: 'Server error while deleting complaint' });
  }
};

// Export all controller functions
// Add image retrieval endpoint
const getComplaintImage = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint || !complaint.image || !complaint.image.data || !complaint.image.contentType) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Set content type and send the image data
    res.set('Content-Type', complaint.image.contentType);
    return res.send(complaint.image.data);
  } catch (error) {
    console.error('Error fetching complaint image:', error);
    res.status(500).json({ message: 'Server error while fetching image' });
  }
};

export { 
  createComplaint, 
  getUserComplaints, 
  getAllComplaints, 
  getComplaintById, 
  updateComplaintStatus, 
  deleteComplaint,
  getComplaintImage 
};
