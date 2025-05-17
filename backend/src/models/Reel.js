const mongoose = require('mongoose');

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
  likes: {
    type: Number,
    default: 0
  },
  soundOn: {
    type: Boolean,
    default: true
  },
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Reel', ReelSchema); 