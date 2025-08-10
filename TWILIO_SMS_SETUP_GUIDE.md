# Twilio SMS Integration Setup Guide

## Overview
This guide will help you set up automated SMS verification codes using Twilio API instead of manual text messages.

## Prerequisites
1. A Twilio account (sign up at https://www.twilio.com)
2. A verified Twilio phone number
3. Access to your Google Apps Script project

## Step 1: Set up Twilio Account

### 1.1 Create Twilio Account
1. Go to https://www.twilio.com and sign up
2. Verify your email and phone number
3. Complete the account setup process

### 1.2 Get Your Twilio Credentials
1. Log into your Twilio Console (https://console.twilio.com/)
2. Go to the Dashboard
3. Copy these three important values:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click the eye icon to reveal)
   - **Phone Number** (your Twilio phone number in +1XXXXXXXXXX format)

### 1.3 Purchase a Phone Number (if needed)
1. In Twilio Console, go to Phone Numbers > Manage > Buy a number
2. Search for a number in your desired area code
3. Purchase the number (usually $1/month)
4. This will be your "From" number for SMS messages

## Step 2: Configure Google Apps Script

### 2.1 Add Twilio Credentials to Script Properties
1. Open your Google Apps Script project
2. Go to **Project Settings** (gear icon in left sidebar)
3. Scroll down to **Script Properties**
4. Add these three properties by clicking "Add script property":

| Property Name | Value | Example Format |
|---------------|-------|---------|
| `TWILIO_ACCOUNT_SID` | Your Account SID from Twilio | ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
| `TWILIO_AUTH_TOKEN` | Your Auth Token from Twilio | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number | +15551234567 |

**Important:** Make sure the phone number includes the +1 country code!

### 2.2 Update Your Apps Script Code
1. Copy the contents of `google-apps-script-twilio-sms.js`
2. Replace your existing Google Apps Script code with the new Twilio-enabled version
3. Save the script
4. Deploy as a web app (if not already deployed)

## Step 3: Test the Integration

### 3.1 Test SMS Sending
1. Go to your website assessment form
2. Fill out the form with a real phone number (your own for testing)
3. Submit the form
4. You should receive an SMS with the verification code within seconds

### 3.2 Check Logs and Notifications
After testing, check:
1. **Google Apps Script Logs**: Go to Executions tab to see detailed logs
2. **Email Notifications**: Admin should receive confirmation emails
3. **Telegram Notifications**: Should show SMS status and details
4. **Twilio Console**: Check the SMS logs in your Twilio dashboard

## Step 4: Monitoring and Troubleshooting

### 4.1 Common Issues and Solutions

**Problem: "Twilio credentials not configured" error**
- Solution: Make sure all three Script Properties are set correctly
- Check spelling: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

**Problem: SMS not delivered**
- Check if phone number is in correct format (+1XXXXXXXXXX)
- Verify the phone number is not on Twilio's blacklist
- Check Twilio Console for error messages

**Problem: "Insufficient permissions" error**
- Make sure your Twilio account has SMS permissions
- Check if you have sufficient Twilio credit balance

**Problem: SMS delivery delays**
- Normal delay: 1-30 seconds
- Check Twilio status page for service issues
- Verify carrier compatibility

### 4.2 Fallback System
The system includes automatic fallback:
1. If SMS fails, it sends manual instructions to admin email
2. Telegram notifications include error details
3. Lead data is still stored for manual follow-up

### 4.3 Monitoring SMS Usage
1. Check Twilio Console > Usage to monitor SMS volume
2. Set up usage alerts in Twilio Console
3. Monitor costs (typically $0.0075 per SMS in US)

## Step 5: Compliance and Best Practices

### 5.1 SMS Compliance
- ✅ Your contact form already includes proper SMS consent checkbox
- ✅ Links to privacy policy and SMS policy are included
- ✅ Messages include opt-out instructions
- ✅ Messages identify your business clearly

### 5.2 Message Template
The automated messages follow this format:
```
Hi [FirstName], Thank you for choosing Silver Path Network. Your verification code is [CODE]. Enter this code to complete your application.
```

### 5.3 Rate Limiting
- Twilio has built-in rate limiting
- Consider implementing additional limits if needed
- Monitor for abuse or spam patterns

## Step 6: Twilio Dashboard Overview

### 6.1 Key Sections to Monitor
1. **Dashboard**: Overview of account usage
2. **Phone Numbers**: Manage your SMS-enabled numbers  
3. **Messaging**: View SMS logs and delivery status
4. **Usage**: Track costs and volume
5. **Console Logs**: Debug API calls and errors

### 6.2 Setting Up Alerts
1. Go to Usage > Alerts in Twilio Console
2. Set up alerts for:
   - Daily SMS usage thresholds
   - Account balance warnings
   - Error rate increases

## Step 7: Testing Checklist

Before going live, test these scenarios:

- [ ] New lead submission with valid US phone number
- [ ] Resend code functionality
- [ ] International phone number handling
- [ ] Invalid phone number error handling
- [ ] SMS delivery failure scenario
- [ ] Verification code entry and quiz completion
- [ ] Admin email notifications are working
- [ ] Telegram notifications include SMS status
- [ ] Google Sheets data is being saved correctly

## Step 8: Go Live

### 8.1 Update Your Google Apps Script
1. Replace your production Google Apps Script with the Twilio-enabled version
2. Make sure the SPREADSHEET_ID and other config is correct
3. Test with a few real submissions

### 8.2 Monitor Initial Performance
1. Watch the first few submissions closely
2. Check delivery rates in Twilio Console
3. Monitor for any error patterns
4. Be ready to revert to manual system if needed

## Costs and Scaling

### Estimated Costs (US SMS):
- SMS cost: $0.0075 per message
- Phone number: $1.00 per month
- For 1000 leads/month: ~$8.50 total

### Scaling Considerations:
- Twilio can handle high volumes automatically
- Consider multiple phone numbers for higher throughput
- Monitor delivery rates and adjust as needed

## Support and Help

### Twilio Support:
- Help Center: https://help.twilio.com/
- API Documentation: https://www.twilio.com/docs/sms
- Status Page: https://status.twilio.com/

### Silver Path Network System:
- Check Google Apps Script execution logs
- Monitor Telegram notifications for system status
- Review admin email notifications for issues

---

This automated SMS system will significantly improve your lead conversion by providing instant verification codes instead of manual delays. The system is designed to be reliable with proper error handling and fallback mechanisms.