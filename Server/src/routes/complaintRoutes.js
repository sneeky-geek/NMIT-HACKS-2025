import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { createComplaint, getUserComplaints, getAllComplaints, getComplaintById, updateComplaintStatus, deleteComplaint, getComplaintImage } from '../controllers/complaintController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);

// Set up multer to store images in memory instead of on disk
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Create a new complaint (requires auth + image upload)
router.post('/', auth, upload.single('image'), createComplaint);

// Get all complaints for the current user
router.get('/my-complaints', auth, getUserComplaints);

// Get all complaints (admin/NGO only)
router.get('/all', auth, (req, res, next) => {
  if (req.user.userType !== 'admin' && req.user.userType !== 'ngo') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  next();
}, getAllComplaints);

// Get complaint by ID
router.get('/:id', auth, getComplaintById);

// Get complaint image by ID
router.get('/:id/image', getComplaintImage);

// Update complaint status (admin/NGO only)
router.patch('/:id/status', auth, (req, res, next) => {
  if (req.user.userType !== 'admin' && req.user.userType !== 'ngo') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  next();
}, updateComplaintStatus);

// Delete complaint
router.delete('/:id', auth, deleteComplaint);

export default router;
