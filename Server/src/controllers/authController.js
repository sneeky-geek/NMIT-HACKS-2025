import User from '../models/User.js';
import { sendOTP, verifyOTP } from '../config/twilio.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            phoneNumber, 
            email,
            dateOfBirth,
            address,
            city,
            state,
            pincode
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ phoneNumber }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({ 
            firstName,
            lastName,
            phoneNumber,
            email,
            dateOfBirth,
            profile: {
                address,
                city,
                state,
                pincode
            }
        });
        await user.save();

        // Send OTP
        await sendOTP(phoneNumber);

        res.status(201).json({ message: 'User created successfully. OTP sent to your phone number.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;
        const verification = await verifyOTP(phoneNumber, code);

        if (verification.status === 'approved') {
            const user = await User.findOne({ phoneNumber });
            if (user) {
                user.verified = true;
                await user.save();
                
                // Generate JWT token
                const token = jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN }
                );

                res.status(200).json({
                    message: 'OTP verified successfully',
                    token,
                    user: {
                        id: user._id,
                        phoneNumber: user.phoneNumber,
                        email: user.email,
                        verified: user.verified
                    }
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'OTP verification failed' });
    }
};

export const login = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Find user
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if verified
        if (!user.verified) {
            return res.status(403).json({ message: 'Account not verified' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                verified: user.verified,
                dateOfBirth: user.dateOfBirth
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};
