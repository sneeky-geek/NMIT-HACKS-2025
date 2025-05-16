import twilio from 'twilio';

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

export const sendOTP = async (phoneNumber) => {
    try {
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({
                to: phoneNumber,
                channel: 'sms'
            });
        return verification;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

export const verifyOTP = async (phoneNumber, code) => {
    try {
        const verificationCheck = await client.verify.v2.services(verifyServiceSid)
            .verificationChecks
            .create({
                to: phoneNumber,
                code: code
            });
        return verificationCheck;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
};
