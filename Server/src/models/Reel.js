import mongoose from 'mongoose';

const ReelSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true
  },
  media: {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    }
  },
  description: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Reel = mongoose.model('Reel', ReelSchema);

export default Reel;
