import twilio from 'twilio';

// Check if we're in development/test mode
const USE_MOCK_OTP = process.env.NODE_ENV === 'development' || !process.env.TWILIO_VERIFY_SERVICE_SID;

// Initialize Twilio client if we're not using mock
let client;
if (!USE_MOCK_OTP) {
    client = twilio(
        process.env.TWILIO_ACCOUNT_SID?.trim(),
        process.env.TWILIO_AUTH_TOKEN?.trim()
    );
}

// Ensure the service SID is trimmed of any whitespace
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID?.trim();

console.log('Twilio Configuration:', {
    useMockOTP: USE_MOCK_OTP,
    accountSid: process.env.TWILIO_ACCOUNT_SID ? `${process.env.TWILIO_ACCOUNT_SID.substring(0, 5)}...` : undefined,
    verifySid: verifyServiceSid ? `${verifyServiceSid.substring(0, 5)}...` : undefined
});

// Store OTPs in memory for development/testing (not for production)
const mockOtps = new Map();

export function toE164(phoneNumber, defaultCountryCode = '+91') {
    // If already in E.164, return as is
    if (phoneNumber.startsWith('+')) return phoneNumber;
    // Remove any non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    return `${defaultCountryCode}${digits}`;
}

export const sendOTP = async (phoneNumber) => {
    try {
        // Always format to E.164 with +91 as default
        const formattedPhone = toE164(phoneNumber);

        // If in development/test mode or missing Twilio creds, use a mock OTP
        if (USE_MOCK_OTP) {
            console.log('Using mock OTP for development');
            // Generate a 6-digit OTP
            const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
            
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
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({
                to: formattedPhone,
                channel: 'sms'
            });
        return verification;
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
