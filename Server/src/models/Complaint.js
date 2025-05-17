import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    data: {
      type: Buffer, // Store image data directly as a buffer
      required: true
    },
    contentType: {
      type: String, // Store the MIME type of the image
      required: true
    },
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    lat: {
      type: Number
    },
    long: {
      type: Number
    }
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  statusUpdates: [{
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved', 'rejected']
    },
    comment: {
      type: String
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
