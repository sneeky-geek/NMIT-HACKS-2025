import User from '../models/User.js';

// Get user tokens
export const getUserTokens = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      tokens: user.tokens
    });
  } catch (error) {
    console.error('Error fetching user tokens:', error);
    res.status(500).json({ message: 'Failed to fetch tokens' });
  }
};

// Redeem tokens
export const redeemTokens = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, rewardId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid redemption amount' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has enough tokens
    if (user.tokens < amount) {
      return res.status(400).json({ 
        message: 'Insufficient tokens', 
        available: user.tokens,
        required: amount
      });
    }
    
    // Deduct tokens
    user.tokens -= amount;
    await user.save();
    
    // In a real application, you would process the reward here
    // For now, just return success
    
    res.status(200).json({
      message: 'Tokens redeemed successfully',
      rewardId,
      amountSpent: amount,
      remainingTokens: user.tokens
    });
  } catch (error) {
    console.error('Error redeeming tokens:', error);
    res.status(500).json({ message: 'Failed to redeem tokens' });
  }
};

// Get user's volunteering history
export const getVolunteeringHistory = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get the user and populate their volunteered events
    const user = await User.findById(userId)
      .populate({
        path: 'volunteeredEvents',
        select: 'name description date time location status volunteersNeeded volunteers ngoId createdAt',
        populate: {
          path: 'ngoId',
          select: 'firstName lastName ngoDetails.organizationName'
        }
      });
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Transform the data to include user-specific participation information
    const history = user.volunteeredEvents.map(event => {
      // Find the user's volunteer entry in this event
      const userVolunteer = event.volunteers?.find(
        volunteer => volunteer.userId.toString() === userId.toString()
      );
      
      return {
        _id: event._id,
        name: event.name,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        status: event.status,
        ngoId: event.ngoId,
        participationDate: userVolunteer?.joinedAt || null,
        totalVolunteers: event.volunteers?.length || 0,
        volunteersNeeded: event.volunteersNeeded
      };
    });
    
    res.status(200).json({
      history: history,
      totalEvents: history.length
    });
  } catch (error) {
    console.error('Error fetching volunteering history:', error);
    res.status(500).json({ message: 'Failed to fetch volunteering history' });
  }
};
