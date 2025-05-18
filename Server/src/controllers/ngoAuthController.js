import User from '../models/User.js';
import { sendOTP, verifyOTP as verifyTwilioOTP, toE164 } from '../config/twilio.js';
import jwt from 'jsonwebtoken';

export const registerNGO = async (req, res) => {
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
            pincode,
            // NGO specific fields
            organizationName,
            registrationNumber,
            website,
            description,
            causeAreas
        } = req.body;
        
        // Always format phone number to E.164 format for consistent storage
        const phoneNumber = toE164(rawPhoneNumber);

        // Basic validation
        if (!firstName || !lastName || !phoneNumber || !email || !dateOfBirth || !organizationName) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                errors: {
                    firstName: firstName ? undefined : 'First name is required',
                    lastName: lastName ? undefined : 'Last name is required',
                    phoneNumber: phoneNumber ? undefined : 'Phone number is required',
                    email: email ? undefined : 'Email is required',
                    dateOfBirth: dateOfBirth ? undefined : 'Date of birth is required',
                    organizationName: organizationName ? undefined : 'Organization name is required'
                }
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ phoneNumber }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new NGO user with formatted phone number
        const ngoUser = new User({ 
            firstName,
            lastName,
            userType: 'ngo',
            phoneNumber,  // This is now in E.164 format
            email,
            dateOfBirth,
            profile: {
                address,
                city,
                state,
                pincode
            },
            ngoDetails: {
                organizationName,
                registrationNumber,
                website,
                description,
                causeAreas: causeAreas || []
            }
        });
        
        console.log('Creating NGO user with phone:', phoneNumber);

        // Validate the user model
        await ngoUser.validate();

        // Save to MongoDB
        try {
            await ngoUser.save();
            console.log('NGO user saved successfully with ID:', ngoUser._id);
        } catch (saveError) {
            console.error('Error saving NGO user to MongoDB:', saveError);
            throw saveError;
        }

        // Send OTP - no need to format again as it's already in E.164
        const otpResult = await sendOTP(phoneNumber);
        
        if (otpResult.status === 'pending') {
            res.status(201).json({ 
                message: 'NGO account created successfully. OTP sent to your phone number.',
                userId: ngoUser._id
            });
        } else {
            // OTP failed to send but user was created
            res.status(201).json({ 
                message: 'NGO account created successfully, but OTP sending failed. Please try logging in.', 
                userId: ngoUser._id,
                otpError: otpResult.error || 'Unknown error sending OTP'
            });
        }
    } catch (error) {
        console.error('NGO Registration error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: error.errors
            });
        }

        res.status(500).json({ message: 'NGO Registration failed' });
    }
};

// Get user profile with type information
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        
        const user = await User.findById(userId).select('-otp');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Include the tokens field in the response
        res.status(200).json({ 
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                userType: user.userType,
                verified: user.verified,
                tokens: user.tokens, // Include tokens in user profile
                volunteeredEvents: user.volunteeredEvents, // Include volunteered events
                profile: user.profile,
                ngoDetails: user.userType === 'ngo' ? user.ngoDetails : undefined
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
};
