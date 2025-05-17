import twilio from 'twilio';

// Force mock mode for development
const USE_MOCK_OTP = true;

console.log('USING MOCK OTP MODE - OTPs will be displayed in console');

// Initialize Twilio client with hardcoded credentials from .env for production use
let client;

// Get credentials from environment
const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim() || 'AC4822dd667d924dc4a9b2f979c096a206';
const authToken = process.env.TWILIO_AUTH_TOKEN?.trim() || '453412c76782db8a90f3697d3ac923e3';
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID?.trim() || 'VA6ef48272825eac962a4e5c04f4717a56';

try {
    client = twilio(accountSid, authToken);
    console.log('Twilio client initialized successfully with Account SID:', accountSid.substring(0, 5) + '...');
    console.log('Using Verify Service SID:', verifyServiceSid.substring(0, 5) + '...');
} catch (error) {
    console.error('Failed to initialize Twilio client:', error.message);
    throw new Error('Failed to initialize Twilio client. Please check your credentials.');
}

// verifyServiceSid is already declared above

console.log('Twilio Configuration:', {
    useMockOTP: USE_MOCK_OTP,
    accountSid: process.env.TWILIO_ACCOUNT_SID ? `${process.env.TWILIO_ACCOUNT_SID.substring(0, 5)}...` : undefined,
    verifySid: verifyServiceSid ? `${verifyServiceSid.substring(0, 5)}...` : undefined,
    mode: USE_MOCK_OTP ? 'MOCK (Development)' : 'PRODUCTION'
});

// Store OTPs in memory for development/testing (not for production)
const mockOtps = new Map();

// Rate limiter to prevent abuse - stores last OTP request time for each phone number
// This is a simple in-memory implementation (will reset when server restarts)
const otpRequestTimes = new Map();

// Cooldown period in milliseconds (60 seconds)
const OTP_COOLDOWN_MS = 60 * 1000;

export function toE164(phoneNumber, defaultCountryCode = '+91') {
    // If already in E.164, return as is
    if (phoneNumber.startsWith('+')) return phoneNumber;
    // Remove any non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    return `${defaultCountryCode}${digits}`;
}

/**
 * Check if a phone number can request a new OTP
 * @param {string} phoneNumber - The phone number to check
 * @returns {Object} - Object containing canSend (boolean) and timeRemaining (seconds)
 */
export const canSendOTP = (phoneNumber) => {
    // For demo purposes, always allow OTP requests
    return { canSend: true, timeRemaining: 0 };
    
    /* Rate limiting disabled for demo
    const formattedPhone = toE164(phoneNumber);
    const lastRequestTime = otpRequestTimes.get(formattedPhone);
    
    // If no previous request or cooldown period has passed
    if (!lastRequestTime) {
        return { canSend: true, timeRemaining: 0 };
    }
    
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    // Check if cooldown period has passed
    if (timeSinceLastRequest >= OTP_COOLDOWN_MS) {
        return { canSend: true, timeRemaining: 0 };
    }
    
    // Calculate remaining time in seconds
    const timeRemaining = Math.ceil((OTP_COOLDOWN_MS - timeSinceLastRequest) / 1000);
    return { canSend: false, timeRemaining };
    */
};

/**
 * Send an OTP to the specified phone number
 * @param {string} phoneNumber - The phone number to send OTP to
 * @param {boolean} forceMockOTP - Force using mock OTP regardless of environment
 * @returns {Object} - The verification result
 */
export const sendOTP = async (phoneNumber, forceMockOTP = false) => {
    try {
        // Always format to E.164 with +91 as default
        const formattedPhone = toE164(phoneNumber);
        
        // Rate limiting disabled for demo purposes
        // Always allow OTP requests regardless of timing
        const { canSend, timeRemaining } = canSendOTP(formattedPhone);
        // We've disabled the rate limiter in canSendOTP, but this is a safeguard
        // to ensure we never return rate_limited status
        
        // Update the last request time for rate limiting
        otpRequestTimes.set(formattedPhone, Date.now());
        
        // If in development/test mode or mock is forced, use a mock OTP
        if (USE_MOCK_OTP || forceMockOTP) {
            console.log('Using mock OTP for development');
            // Always use "200525" as the fixed OTP for demo purposes
            const mockOtp = "200525";
            
            // IMPORTANT: Store with the formatted phone number
            mockOtps.set(formattedPhone, mockOtp);
            console.log(`Mock OTP for ${formattedPhone}: ${mockOtp}`);
            
            // Debug: Log all stored mock OTPs
            console.log('Current mock OTPs:', Array.from(mockOtps.entries()));
            
            return {
                status: 'pending',
                to: formattedPhone
            };
        }
        
        // Use actual Twilio in production
        try {
            const verification = await client.verify.v2.services(verifyServiceSid)
                .verifications
                .create({
                    to: formattedPhone,
                    channel: 'sms'
                });
            return verification;
        } catch (twilioError) {
            // For demo purposes, don't return rate_limited status even for Twilio 429 errors
            if (twilioError.status === 429) {
                console.error('Twilio rate limit exceeded, but continuing for demo:', twilioError);
                // Return pending status instead of rate_limited for demo
                return {
                    status: 'pending',
                    to: formattedPhone
                };
            }
            
            // Re-throw other Twilio errors to be caught by the outer catch
            throw twilioError;
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        // Return a formatted error instead of throwing
        return {
            status: 'failed',
            error: error.message,
            to: phoneNumber
        };
    }
};

export const verifyOTP = async (phoneNumber, code) => {
    const formattedPhone = toE164(phoneNumber);

    try {
        console.log(`Attempting to verify OTP for ${formattedPhone} with code ${code}`);
        console.log(`Using ${USE_MOCK_OTP ? 'MOCK' : 'TWILIO'} verification mode`);
        
        // For demo purposes, always accept "200525" as valid OTP
        if (code === "200525") {
            console.log(`Demo OTP verification for ${formattedPhone}: approved (using fixed OTP 200525)`);
            return {
                status: 'approved',
                to: formattedPhone,
                valid: true
            };
        }
        
        // If in development/test mode, use the mock OTP
        if (USE_MOCK_OTP) {
            // Debug: Log all stored mock OTPs
            console.log('Current mock OTPs:', Array.from(mockOtps.entries()));
            
            const mockOtp = mockOtps.get(formattedPhone);
            console.log(`Mock OTP for ${formattedPhone}:`, mockOtp);
            
            // Check if the OTP matches
            const isValid = mockOtp === code;
            
            console.log(`Mock OTP verification for ${formattedPhone}: ${isValid ? 'approved' : 'rejected'}`);
            
            return {
                status: isValid ? 'approved' : 'rejected',
                to: formattedPhone,
                valid: isValid
            };
        }
        
        // For Twilio verification
        console.log(`Using Twilio Verify SID: ${verifyServiceSid?.substring(0, 5)}...`);
        
        if (!verifyServiceSid) {
            throw new Error('Twilio Verify Service SID is missing. Check your environment variables.');
        }
        
        // For demo purposes, skip actual Twilio verification if code is "200525"
        if (code === "200525") {
            console.log('Demo mode: Skipping Twilio verification and approving OTP 200525');
            return {
                status: 'approved',
                to: formattedPhone,
                valid: true
            };
        }
        
        // Verify OTP using Twilio in production
        try {
            const verificationCheck = await client.verify.v2.services(verifyServiceSid)
                .verificationChecks
                .create({
                    to: formattedPhone,
                    code: code
                });
            
            console.log('Twilio verification result:', verificationCheck.status);
            return verificationCheck;
        } catch (twilioError) {
            console.error('Twilio API error:', twilioError);
            throw twilioError;
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        // Return a formatted error instead of throwing
        return {
            status: 'failed',
            error: error.message,
            to: formattedPhone
        };
    }
};
