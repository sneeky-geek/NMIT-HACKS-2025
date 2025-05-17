import NgoActivity from '../models/NgoActivity.js';
import User from '../models/User.js';

// Create a new NGO activity
export const createActivity = async (req, res) => {
  try {
    console.log('Create Activity Request - User ID:', req.userId, 'User Type:', req.userType);
    console.log('Request Body:', req.body);
    
    const { name, description, date, time, location, volunteersNeeded } = req.body;
    const ngoId = req.userId; // From authentication middleware
    
    // Verify user exists and check userType
    const ngo = await User.findById(ngoId);
    if (!ngo) {
      console.error(`NGO not found with ID: ${ngoId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`User found: ${ngo._id}, User type: ${ngo.userType}`);
    
    // Verify user is an NGO
    if (ngo.userType !== 'ngo') {
      console.error(`Unauthorized attempt to create activity by non-NGO user: ${ngoId}, type: ${ngo.userType}`);
      return res.status(403).json({ message: 'Only NGOs can create activities' });
    }
    
    // Create new activity
    const activity = new NgoActivity({
      name,
      description,
      date: new Date(date),
      time,
      location,
      volunteersNeeded,
      ngoId
    });
    
    // Validate activity before saving
    try {
      await activity.validate();
    } catch (validationError) {
      console.error('Activity validation error:', validationError);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationError.errors 
      });
    }
    
    // Save the activity
    await activity.save();
    console.log(`New activity created: ${activity._id} by NGO: ${ngoId}`);
    
    res.status(201).json({
      message: 'NGO activity created successfully',
      activity
    });
  } catch (error) {
    console.error('Error creating NGO activity:', error);
    res.status(500).json({ 
      message: 'Failed to create activity', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Get all NGO activities (public)
export const getActivities = async (req, res) => {
  try {
    const activities = await NgoActivity.find({ status: { $ne: 'cancelled' } })
      .sort({ date: 1 })
      .populate('ngoId', 'firstName lastName ngoDetails.organizationName');
    
    // If user is authenticated, check if they've volunteered for any activities
    if (req.userId) {
      const user = await User.findById(req.userId);
      if (user) {
        activities.forEach(activity => {
          // Check if user has already volunteered for this activity
          if (user.volunteeredEvents && user.volunteeredEvents.includes(activity._id.toString())) {
            activity._doc.userHasVolunteered = true;
          }
          
          // Add volunteer count for easier access
          activity._doc.volunteerCount = activity.volunteers ? activity.volunteers.length : 0;
        });
      }
    } else {
      // Add volunteer count for non-authenticated users
      activities.forEach(activity => {
        activity._doc.volunteerCount = activity.volunteers ? activity.volunteers.length : 0;
      });
    }
    
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
    
    // Check if user is an NGO - NGOs should not be able to volunteer
    if (user.userType === 'ngo') {
      return res.status(403).json({ message: 'NGO users cannot register as volunteers' });
    }
    
    const activity = await NgoActivity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    // Check if activity is open for volunteering
    if (activity.status !== 'upcoming' && activity.status !== 'ongoing') {
      return res.status(400).json({ message: `Cannot volunteer for ${activity.status} activities` });
    }
    
    // Check if user already registered in activity's volunteers
    const alreadyRegisteredInActivity = activity.volunteers.some(
      volunteer => volunteer.userId.toString() === userId.toString()
    );
    
    // Check if user already registered in user's volunteeredEvents
    const alreadyRegisteredInUser = user.volunteeredEvents.includes(activityId);
    
    if (alreadyRegisteredInActivity || alreadyRegisteredInUser) {
      return res.status(400).json({ message: 'You have already registered for this activity' });
    }
    
    // Check if max volunteers reached
    if (activity.volunteers.length >= activity.volunteersNeeded) {
      return res.status(400).json({ message: 'Maximum volunteers limit reached' });
    }
    
    // Add volunteer to activity
    activity.volunteers.push({
      userId,
      name,
      phoneNumber,
      joinedAt: new Date()
    });
    
    // Save the activity
    await activity.save();
    
    // Add tokens to user (10 tokens per volunteering activity)
    const tokenReward = 10;
    user.tokens += tokenReward;
    
    // Add activity to user's volunteered events list if not already there
    if (!user.volunteeredEvents.includes(activityId)) {
      user.volunteeredEvents.push(activityId);
    }
    
    // Save the updated user
    await user.save();
    
    res.status(200).json({
      message: 'Successfully registered as volunteer',
      volunteerCount: activity.volunteers.length,
      tokensEarned: tokenReward,
      totalTokens: user.tokens,
      volunteeredEvents: user.volunteeredEvents
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
    
    // Verify user is an NGO
    const ngo = await User.findById(ngoId);
    if (!ngo || ngo.userType !== 'ngo') {
      return res.status(403).json({ message: 'Only NGOs can view volunteer details' });
    }
    
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
