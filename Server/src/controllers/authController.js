import User from '../models/User.js';
import { sendOTP, verifyOTP as verifyTwilioOTP, toE164, canSendOTP } from '../config/twilio.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            phoneNumber: rawPhoneNumber, 
            email,
            dateOfBirth,
            address,
            city,
            state,
            pincode
        } = req.body;
        
        // Always format phone number to E.164 format for consistent storage
        const phoneNumber = toE164(rawPhoneNumber);

        // Basic validation
        if (!firstName || !lastName || !phoneNumber || !email || !dateOfBirth) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                errors: {
                    firstName: firstName ? undefined : 'First name is required',
                    lastName: lastName ? undefined : 'Last name is required',
                    phoneNumber: phoneNumber ? undefined : 'Phone number is required',
                    email: email ? undefined : 'Email is required',
                    dateOfBirth: dateOfBirth ? undefined : 'Date of birth is required'
                }
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ phoneNumber }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user with formatted phone number
        const user = new User({ 
            firstName,
            lastName,
            phoneNumber,  // This is now in E.164 format
            email,
            dateOfBirth,
            profile: {
                address,
                city,
                state,
                pincode
            }
        });
        
        console.log('Creating user with phone:', phoneNumber);

        // Validate the user model
        await user.validate();

        // Save to MongoDB
        try {
            await user.save();
            console.log('User saved successfully with ID:', user._id);
        } catch (saveError) {
            console.error('Error saving user to MongoDB:', saveError);
            throw saveError;
        }

        // Send OTP - no need to format again as it's already in E.164
        const otpResult = await sendOTP(phoneNumber);
        
        if (otpResult.status === 'pending') {
            res.status(201).json({ 
                message: 'User created successfully. OTP sent to your phone number.',
                userId: user._id
            });
        } else if (otpResult.status === 'rate_limited') {
            // OTP was rate limited but user was created
            res.status(429).json({ 
                message: 'User created successfully, but you need to wait before requesting an OTP.', 
                userId: user._id,
                error: otpResult.error,
                timeRemaining: otpResult.timeRemaining
            });
        } else {
            // OTP failed to send but user was created
            res.status(201).json({ 
                message: 'User created successfully, but OTP sending failed. Please try logging in.', 
                userId: user._id,
                otpError: otpResult.error || 'Unknown error sending OTP'
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: error.errors
            });
        }

        res.status(500).json({ message: 'Registration failed' });
    }
};


export const verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;
        
        // Format phone number to E.164
        const formattedPhone = toE164(phoneNumber);
        
        console.log('Verifying OTP for phone:', formattedPhone, 'with code:', code);
        
        // Find user by phone number
        const user = await User.findOne({ phoneNumber: formattedPhone });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if we need to use the fallback verification method
        // If user has an OTP stored in their document, use that instead of Twilio
        if (user.otp && user.otp === code) {
            console.log('Using fallback OTP verification method');
            
            // Clear the OTP from the user document
            user.otp = undefined;
            user.verified = true;
            await user.save();
            
            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user._id,
                    userType: user.userType // Include actual user type from database
                }, 
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            
            return res.status(200).json({
                message: 'OTP verified successfully (fallback method)',
                token,
                user: {
                    _id: user._id,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth,
                    verified: user.verified,
                    profile: user.profile
                }
            });
        }
        
        // Try Twilio verification if fallback didn't work
        try {
            // Verify OTP with Twilio
            const verification = await verifyTwilioOTP(formattedPhone, code);
            
            if (verification.status === 'approved') {
                // Mark user as verified
                user.verified = true;
                await user.save();
                
                // Generate JWT token
                const token = jwt.sign(
                    { 
                        userId: user._id,
                        userType: user.userType // Include actual user type from database
                    }, 
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN }
                );
                
                return res.status(200).json({
                    message: 'OTP verified successfully',
                    token,
                    user: {
                        _id: user._id,
                        phoneNumber: user.phoneNumber,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        dateOfBirth: user.dateOfBirth,
                        verified: user.verified,
                        profile: user.profile
                    }
                });
            } else {
                res.status(400).json({ message: 'Invalid OTP' });
            }
        } catch (twilioError) {
            console.error('Twilio verification error:', twilioError);
            
            // If Twilio error is about rate limiting, check if we have a stored OTP as fallback
            if (twilioError.message && twilioError.message.includes('Too many requests') && user.otp) {
                return res.status(400).json({ 
                    message: 'Twilio rate limit reached. Please use the fallback OTP sent in the console.'
                });
            }
            
            res.status(400).json({ message: 'Invalid OTP or verification service unavailable' });
        }
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'OTP verification failed', error: error.message });
    }
};


export const login = async (req, res) => {
    try {
        console.log('Login attempt with request body:', req.body);
        console.log('Login request headers:', req.headers);
        
        const { phoneNumber: rawPhoneNumber, userType } = req.body;
        
        if (!rawPhoneNumber) {
            console.error('Login failed: No phone number provided');
            return res.status(400).json({ message: 'Phone number is required' });
        }
        
        const formattedPhone = toE164(rawPhoneNumber);
        console.log('Attempting login with formatted phone:', formattedPhone, 'userType:', userType);
        
        // Try to find the user using User model
        let user;
        try {
            user = await User.findOne({ phoneNumber: formattedPhone });
            console.log('User search result:', user ? 'Found' : 'Not found');
        } catch (dbError) {
            console.error('Database error during user lookup:', dbError);
        }
        
        if (!user) {
            console.log('User not found with phone number:', formattedPhone);
            return res.status(404).json({ message: 'User not found. Please sign up first.' });
        }
        
        console.log('User found:', user._id.toString());

        // Send OTP for login
        const otpResult = await sendOTP(formattedPhone);
        
        if (otpResult.status === 'pending') {
            res.status(200).json({ message: 'OTP sent to your phone number.' });
        } else if (otpResult.status === 'rate_limited') {
            // Handle rate limiting
            res.status(429).json({ 
                message: 'Too many OTP requests. Please wait before trying again.',
                error: otpResult.error,
                timeRemaining: otpResult.timeRemaining
            });
        } else {
            res.status(500).json({ message: 'Failed to send OTP for login.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};