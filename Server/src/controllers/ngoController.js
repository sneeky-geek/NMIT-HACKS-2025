import NgoActivity from '../models/NgoActivity.js';
import User from '../models/User.js';

// Create a new NGO activity
export const createActivity = async (req, res) => {
  try {
    const { name, description, date, time, location, volunteersNeeded } = req.body;
    const ngoId = req.userId; // From authentication middleware
    
    // Verify user is an NGO
    const ngo = await User.findById(ngoId);
    if (!ngo || ngo.userType !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can create activities' });
    }
    
    const activity = new NgoActivity({
      name,
      description,
      date: new Date(date),
      time,
      location,
      volunteersNeeded,
      ngoId
    });
    
    await activity.save();
    
    res.status(201).json({
      message: 'NGO activity created successfully',
      activity
    });
  } catch (error) {
    console.error('Error creating NGO activity:', error);
    res.status(500).json({ message: 'Failed to create activity' });
  }
};

// Get all NGO activities (public)
export const getActivities = async (req, res) => {
  try {
    const activities = await NgoActivity.find({ status: { $ne: 'cancelled' } })
      .sort({ date: 1 })
      .populate('ngoId', 'firstName lastName ngoDetails.organizationName');
      
    res.status(200).json({ activities });
  } catch (error) {
    console.error('Error fetching NGO activities:', error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
};

// Get single NGO activity details
export const getActivityDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await NgoActivity.findById(id)
      .populate('ngoId', 'firstName lastName ngoDetails.organizationName');
      
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.status(200).json({ activity });
  } catch (error) {
    console.error('Error fetching activity details:', error);
    res.status(500).json({ message: 'Failed to fetch activity details' });
  }
};

// Get NGO's own activities
export const getMyActivities = async (req, res) => {
  try {
    const ngoId = req.userId;
    
    const activities = await NgoActivity.find({ ngoId })
      .sort({ date: 1 });
      
    res.status(200).json({ activities });
  } catch (error) {
    console.error('Error fetching NGO activities:', error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
};

// Register a volunteer for an activity
export const registerVolunteer = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { name, phoneNumber } = req.body;
    const userId = req.userId;
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const activity = await NgoActivity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    // Check if user already registered
    const alreadyRegistered = activity.volunteers.some(
      volunteer => volunteer.userId.toString() === userId.toString()
    );
    
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'You have already registered for this activity' });
    }
    
    // Check if max volunteers reached
    if (activity.volunteers.length >= activity.volunteersNeeded) {
      return res.status(400).json({ message: 'Maximum volunteers limit reached' });
    }
    
    // Add volunteer
    activity.volunteers.push({
      userId,
      name,
      phoneNumber
    });
    
    await activity.save();
    
    res.status(200).json({
      message: 'Successfully registered as volunteer',
      volunteerCount: activity.volunteers.length
    });
  } catch (error) {
    console.error('Error registering volunteer:', error);
    res.status(500).json({ message: 'Failed to register volunteer' });
  }
};

// Update activity status
export const updateActivityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ngoId = req.userId;
    
    const activity = await NgoActivity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    // Verify ownership
    if (activity.ngoId.toString() !== ngoId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this activity' });
    }
    
    // Update status
    activity.status = status;
    await activity.save();
    
    res.status(200).json({
      message: 'Activity status updated successfully',
      activity
    });
  } catch (error) {
    console.error('Error updating activity status:', error);
    res.status(500).json({ message: 'Failed to update activity status' });
  }
};

// Get volunteers for a specific activity (NGO only)
export const getActivityVolunteers = async (req, res) => {
  try {
    const { id } = req.params;
    const ngoId = req.userId;
    
    const activity = await NgoActivity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    // Verify ownership
    if (activity.ngoId.toString() !== ngoId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these volunteers' });
    }
    
    res.status(200).json({
      volunteers: activity.volunteers,
      volunteerCount: activity.volunteers.length
    });
  } catch (error) {
    console.error('Error fetching activity volunteers:', error);
    res.status(500).json({ message: 'Failed to fetch volunteers' });
  }
};
