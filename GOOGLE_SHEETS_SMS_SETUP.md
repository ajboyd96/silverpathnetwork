# Silver Path Network - Google Sheets SMS Verification Setup

This system uses Google Apps Script to manage verification codes from a Google Sheet and send emails when leads request verification.

## 📋 Complete Setup Guide

### Step 1: Prepare Your Google Sheet

1. **Open your Google Sheet:** https://docs.google.com/spreadsheets/d/1MZYgrMksEKzKksiXYf7B2dNnrzu9prScwbCZ0TWmIxc/edit

2. **Set up Sheet 1 (Verification Codes):**
   - Column A: Row numbers (1, 2, 3, etc.)
   - Column B: 6-digit codes (the 50 codes you generated)
   - Column C: Code description (optional) - leave blank
   - Column D: Assigned phone number - leave blank initially
   - Column E: Assignment timestamp - leave blank initially

3. **Create Sheet 2 (Lead Info):**
   - Create a new sheet tab named "Lead Info"
   - The script will automatically add headers when first lead is submitted

### Step 2: Set Up Google Apps Script

1. **Open Google Apps Script:**
   - Go to https://script.google.com
   - Click "New Project"

2. **Add the Script Code:**
   - Delete the default code
   - Copy the entire contents of `google-apps-script.js`
   - Paste it into the script editor

3. **Configure the Script:**
   - Find the line: `const SPREADSHEET_ID = '1MZYgrMksEKzKksiXYf7B2dNnrzu9prScwbCZ0TWmIxc';`
   - Verify this matches your Google Sheet ID
   - Update `ADMIN_EMAIL = 'ajboyd96@gmail.com';` if needed

4. **Set Permissions:**
   - Click the lock icon (Permissions)
   - Review and accept permissions for:
     - Google Sheets access
     - Gmail sending
     - Properties service

5. **Deploy as Web App:**
   - Click "Deploy" > "New Deployment"
   - Choose type: "Web app"
   - Description: "Silver Path SMS Verification"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"
   - **Copy the deployment URL** - you'll need this!

### Step 3: Update Assessment Form

1. **Edit assessment.html:**
   - Find the line: `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`
   - Replace with your actual deployment URL from Step 2

2. **Test the Connection:**
   - Save and deploy your website
   - Try the assessment form to ensure it connects properly

### Step 4: Test the Complete Flow

1. **Test Verification Code Request:**
   - Go to your assessment form
   - Fill out the contact information
   - Click "Send Verification Code"
   - Check ajboyd96@gmail.com for the email with the code

2. **Test Code Verification:**
   - Enter the code from the email
   - Verify it accepts the correct code
   - Check that the lead appears in Sheet 2

3. **Check Sheet Updates:**
   - Verify the code is marked as "used" in Sheet 1
   - Confirm lead data appears in Sheet 2

## 🔧 How It Works

### Email Flow:
1. **Lead fills form** → Triggers Google Apps Script
2. **Script picks random code** from Sheet 1, assigns to phone number
3. **If same lead clicks again** → Script reuses their assigned code
4. **Sends email to ajboyd96@gmail.com** with lead info and code
5. **Also sends email to lead** with their verification code
6. **Lead enters code** → Script verifies against stored session
7. **Successful verification** → Lead data saved to Sheet 2

### Code Assignment Logic:
- **First time lead:** Gets random code from available pool
- **Same lead requests again:** Gets same code as before
- **After 50 codes assigned:** System resets and starts over
- **Codes are reusable** across different cycles

### Email Templates:

**Admin Email (to ajboyd96@gmail.com):**
```
Subject: Silver Path Network - New Lead Verification: [FirstName] [LastName]

Hi [FirstName],

Thanks for your submission! Use code [6-digit code] to verify your number with Silver Path Network.

LEAD INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: [FirstName] [LastName]
📧 Email: [email@domain.com]
📱 Phone: [phone number]
🔐 Verification Code: [6-digit code]
⏰ Code Expires: 5 minutes from now
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This lead is requesting final expense insurance information. They will need to enter the verification code above to complete their application.

Best regards,
Silver Path Network System
```

**Lead Email:**
```
Subject: Silver Path Network - Your Verification Code

Hi [FirstName],

Your verification code is: [6-digit code]

Please enter this code on the website to complete your application.

This code expires in 5 minutes.

Best regards,
Silver Path Network Team
```

## 📊 Google Sheet Structure

### Sheet 1: Verification Codes
| A (Row) | B (Code) | C (Description) | D (Assigned Phone) | E (Assignment Time) |
|---------|----------|-----------------|-------------------|-------------------|
| 1       | 123456   |                 | 5551234567        | 2024-01-01...     |
| 2       | 789012   |                 |                   |                   |
| 3       | 345678   |                 | 5559876543        | 2024-01-01...     |

### Sheet 2: Lead Info
| Lead ID | Timestamp | First Name | Last Name | Email | Phone | Code Used | Age Range | Tobacco | Coverage | Goal | Health | Timing | Status |
|---------|-----------|------------|-----------|-------|-------|-----------|-----------|---------|----------|------|--------|--------|--------|
| SP123... | 2024... | John | Doe | john@... | 555... | 123456 | 50-60 | No | $25k | Funeral | Good | ASAP | New Lead |

## 🛠️ Customization Options

### Change Email Recipients:
```javascript
const ADMIN_EMAIL = 'your-email@domain.com';
```

### Modify Email Templates:
Edit the email content in the `sendVerificationCode` function

### Adjust Code Expiration:
```javascript
expires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
```

### Change Maximum Attempts:
```javascript
maxAttempts: 3
```

## 🚨 Troubleshooting

### Common Issues:

1. **"Script not authorized" error:**
   - Re-run permissions setup
   - Make sure script is deployed with "Anyone" access

2. **Codes not being marked as used:**
   - Check Sheet 1 column structure
   - Verify column headers match script expectations

3. **Emails not sending:**
   - Check Gmail API permissions
   - Verify email addresses are correct
   - Check script execution transcript for errors

4. **Lead data not saving:**
   - Ensure "Lead Info" sheet exists
   - Check column permissions in Google Sheets

### Testing Functions:

Run these in the Apps Script editor to test:

```javascript
// Test sending verification
testSendVerification()

// Clean up expired sessions
cleanupExpiredSessions()
```

## 🔒 Security Features

- **Session expiration:** 5 minutes
- **Attempt limiting:** 3 tries per code
- **Unique session IDs:** Prevent code reuse
- **Automatic cleanup:** Expired sessions removed
- **Code tracking:** Each code used only once

## 📈 Monitoring

### Check Script Execution:
- Apps Script dashboard shows execution logs
- Monitor for errors or failures
- Set up email notifications for script errors

### Sheet Analytics:
- Track code usage rate
- Monitor lead conversion
- Analyze form completion rates

## 🚀 Going Live

1. ✅ **Set up Google Sheet** with codes and Lead Info tab
2. ✅ **Deploy Google Apps Script** and get URL
3. ✅ **Update assessment.html** with script URL
4. ✅ **Test complete flow** end-to-end
5. ✅ **Deploy website** with updated assessment form
6. ✅ **Monitor first few leads** to ensure everything works

Your SMS verification system is now ready to capture and verify high-quality leads!

## 💰 Cost Analysis

- **Google Apps Script:** Free (within usage limits)
- **Google Sheets:** Free 
- **Gmail API:** Free (within daily limits)
- **No per-SMS costs** like Twilio
- **Scales to thousands of leads** without additional costs

This system provides enterprise-level lead verification at zero ongoing cost!