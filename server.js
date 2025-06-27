const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Rate limiting for SMS endpoints
const smsLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many SMS requests, please try again later.'
});

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error('Missing Twilio credentials. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in your .env file');
}

const client = twilio(accountSid, authToken);

// Store verification codes temporarily (in production, use Redis or database)
const verificationCodes = new Map();

// Generate random 6-digit code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Validate phone number format
function isValidPhoneNumber(phone) {
    const phoneRegex = /^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Format phone number for Twilio
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    if (cleaned.length === 10) {
        return '+1' + cleaned;
    }
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return '+' + cleaned;
    }
    return cleaned.startsWith('+') ? cleaned : '+1' + cleaned;
}

// Send verification code
app.post('/api/send-verification', smsLimit, async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number is required' 
            });
        }

        if (!isValidPhoneNumber(phone)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter a valid US phone number' 
            });
        }

        const formattedPhone = formatPhoneNumber(phone);
        const verificationCode = generateVerificationCode();
        
        // Store code with expiration (5 minutes)
        verificationCodes.set(formattedPhone, {
            code: verificationCode,
            expires: Date.now() + (5 * 60 * 1000),
            attempts: 0
        });

        // Send SMS via Twilio
        const message = await client.messages.create({
            body: `Your Silver Path Network verification code is: ${verificationCode}. This code expires in 5 minutes.`,
            from: twilioPhoneNumber,
            to: formattedPhone
        });

        console.log(`Verification code sent to ${formattedPhone}: ${message.sid}`);

        res.json({ 
            success: true, 
            message: 'Verification code sent successfully',
            messageId: message.sid
        });

    } catch (error) {
        console.error('Error sending verification:', error);
        
        if (error.code === 21614) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid phone number. Please check and try again.' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send verification code. Please try again.' 
        });
    }
});

// Verify code
app.post('/api/verify-code', async (req, res) => {
    try {
        const { phone, code } = req.body;

        if (!phone || !code) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number and verification code are required' 
            });
        }

        const formattedPhone = formatPhoneNumber(phone);
        const storedData = verificationCodes.get(formattedPhone);

        if (!storedData) {
            return res.status(400).json({ 
                success: false, 
                message: 'No verification code found for this number. Please request a new code.' 
            });
        }

        // Check expiration
        if (Date.now() > storedData.expires) {
            verificationCodes.delete(formattedPhone);
            return res.status(400).json({ 
                success: false, 
                message: 'Verification code has expired. Please request a new code.' 
            });
        }

        // Check attempts
        if (storedData.attempts >= 3) {
            verificationCodes.delete(formattedPhone);
            return res.status(400).json({ 
                success: false, 
                message: 'Too many verification attempts. Please request a new code.' 
            });
        }

        // Verify code
        if (storedData.code !== code.toString()) {
            storedData.attempts++;
            return res.status(400).json({ 
                success: false, 
                message: `Invalid verification code. ${3 - storedData.attempts} attempts remaining.` 
            });
        }

        // Success - remove code
        verificationCodes.delete(formattedPhone);

        res.json({ 
            success: true, 
            message: 'Phone number verified successfully' 
        });

    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Verification failed. Please try again.' 
        });
    }
});

// Submit assessment form (after verification)
app.post('/api/submit-assessment', async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            email, 
            phone, 
            assessmentData,
            isVerified 
        } = req.body;

        if (!isVerified) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number must be verified before submitting' 
            });
        }

        // Here you would typically:
        // 1. Save to database
        // 2. Send to CRM system
        // 3. Send confirmation email
        // 4. Trigger follow-up sequence

        console.log('Assessment submitted:', {
            name: `${firstName} ${lastName}`,
            email,
            phone,
            assessmentData
        });

        // Mock successful submission
        res.json({ 
            success: true, 
            message: 'Assessment submitted successfully. An agent will contact you within 24 hours.',
            leadId: `SP${Date.now()}` // Mock lead ID
        });

    } catch (error) {
        console.error('Error submitting assessment:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit assessment. Please try again.' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString() 
    });
});

// Cleanup expired codes every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [phone, data] of verificationCodes.entries()) {
        if (now > data.expires) {
            verificationCodes.delete(phone);
        }
    }
}, 10 * 60 * 1000);

app.listen(port, () => {
    console.log(`Silver Path Network SMS verification server running on port ${port}`);
    console.log(`Make sure to set your Twilio credentials in the .env file`);
});

module.exports = app;