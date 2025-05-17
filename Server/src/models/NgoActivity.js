import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const ngoActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  volunteersNeeded: {
    type: Number,
    required: true,
    min: 1
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  volunteers: [volunteerSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
});

// Virtual field to get volunteer count
ngoActivitySchema.virtual('volunteerCount').get(function() {
  return this.volunteers.length;
});

// When converting to JSON, include virtual fields
ngoActivitySchema.set('toJSON', { virtuals: true });
ngoActivitySchema.set('toObject', { virtuals: true });

const NgoActivity = mongoose.model('NgoActivity', ngoActivitySchema);

export default NgoActivity;
