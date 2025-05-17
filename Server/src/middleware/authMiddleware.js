import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    // Get userType from token if available, otherwise fetch from database
    if (decoded.userType) {
      req.userType = decoded.userType;
    } else {
      // Fall back to database if not in token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.userType = user.userType;
    }
    
    // Log userType for debugging
    console.log(`Auth middleware: User ${req.userId} has userType: ${req.userType}`);
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is NGO
export const isNGO = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || user.userType !== 'ngo') {
      return res.status(403).json({ message: 'Access denied: NGO role required' });
    }
    
    next();
  } catch (error) {
    console.error('NGO check middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
