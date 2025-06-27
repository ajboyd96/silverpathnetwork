# Silver Path Network - SMS Verification Setup

This project includes Twilio SMS verification for the assessment quiz to verify phone numbers and reduce spam leads.

## Prerequisites

1. **Node.js** (version 16 or higher)
2. **Twilio Account** with SMS capabilities
3. **Verified Twilio Phone Number**

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Twilio

1. Sign up for a Twilio account at [twilio.com](https://www.twilio.com)
2. Get a phone number from the Twilio Console
3. Find your Account SID and Auth Token in the Console

### 3. Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your Twilio credentials:
```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
PORT=3000
```

### 4. Run the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will run on `http://localhost:3000`

## How SMS Verification Works

1. **User fills out assessment form** with name, email, and phone number
2. **System sends verification code** via Twilio SMS to the provided phone number
3. **User enters 6-digit code** from their text message
4. **System verifies code** and allows assessment submission
5. **Lead is submitted** with verified phone number flag

## API Endpoints

### POST /api/send-verification
Sends SMS verification code to phone number
```json
{
  "phone": "5551234567"
}
```

### POST /api/verify-code
Verifies the SMS code
```json
{
  "phone": "5551234567",
  "code": "123456"
}
```

### POST /api/submit-assessment
Submits the completed assessment (requires verification)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "5551234567",
  "assessmentData": {...},
  "isVerified": true
}
```

## Security Features

- **Rate limiting**: Max 3 SMS requests per 15 minutes per IP
- **Code expiration**: Verification codes expire after 5 minutes
- **Attempt limiting**: Max 3 verification attempts per code
- **Phone validation**: US phone number format validation
- **Automatic cleanup**: Expired codes are automatically removed

## Deployment Options

### Option 1: Netlify Functions (Recommended)

1. Convert `server.js` to Netlify Functions format
2. Deploy via Netlify with environment variables
3. Update frontend API calls to use `/.netlify/functions/`

### Option 2: Heroku

1. Add `Procfile`:
```
web: node server.js
```

2. Set environment variables in Heroku dashboard
3. Deploy using Git or GitHub integration

### Option 3: Railway/Render

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

## Troubleshooting

### Common Issues

1. **"Missing Twilio credentials" error**
   - Check that `.env` file exists and has correct values
   - Verify Account SID and Auth Token are correct

2. **SMS not sending**
   - Verify phone number is in correct format (+1XXXXXXXXXX)
   - Check Twilio account balance
   - Ensure phone number is not blacklisted

3. **Rate limiting errors**
   - Wait 15 minutes before trying again
   - Check if multiple users are testing from same IP

### Testing

For testing without sending real SMS:
1. Set `NODE_ENV=development` in `.env`
2. Verification codes will be logged to console
3. Use any 6-digit code for verification

## Cost Considerations

- Twilio SMS costs approximately $0.0075 per message in the US
- Consider implementing additional validation to reduce unnecessary sends
- Monitor usage through Twilio Console

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use HTTPS** in production
3. **Implement additional rate limiting** based on phone number
4. **Monitor for abuse** through Twilio usage reports
5. **Consider adding CAPTCHA** for additional protection

## Support

For Twilio-specific issues, consult the [Twilio Documentation](https://www.twilio.com/docs)

For implementation questions, check the code comments in `server.js` and `assessment.html`