/**
 * Silver Path Network - SMS Verification with Google Sheets
 * This Google Apps Script handles verification code selection and email sending
 * 
 * Setup Instructions:
 * 1. Open Google Apps Script (script.google.com)
 * 2. Create a new project and paste this code
 * 3. Deploy as web app with execute permissions for "Anyone"
 * 4. Copy the deployment URL and update your assessment form
 */

// Configuration
const SPREADSHEET_ID = '1MZYgrMksEKzKksiXYf7B2dNnrzu9prScwbCZ0TWmIxc';
const CODES_SHEET_NAME = 'Sheet1'; // Sheet with verification codes
const LEADS_SHEET_NAME = 'Lead Info'; // Sheet for lead information
const ADMIN_EMAIL = 'ajboyd96@gmail.com';

// Global variables to store active verification sessions
const activeVerifications = new Map();

/**
 * Main function to handle POST requests from the website
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'send_verification':
        return sendVerificationCode(data);
      case 'verify_code':
        return verifyCode(data);
      case 'submit_lead':
        return submitLead(data);
      default:
        return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return createResponse(false, 'Server error occurred');
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Silver Path Network SMS Verification API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Send verification code via email
 */
function sendVerificationCode(data) {
  try {
    const { firstName, lastName, email, phone } = data;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return createResponse(false, 'All fields are required');
    }
    
    // Get verification code for this lead (assigns random code or reuses existing)
    const verificationCode = getVerificationCodeForLead(phone);
    if (!verificationCode) {
      return createResponse(false, 'No verification codes available. Please try again later.');
    }
    
    // Store verification session
    const sessionId = Utilities.getUuid();
    const verificationData = {
      code: verificationCode,
      firstName,
      lastName, 
      email,
      phone,
      timestamp: new Date(),
      attempts: 0,
      maxAttempts: 3,
      expires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    };
    
    // Store in PropertiesService (temporary storage)
    PropertiesService.getScriptProperties().setProperty(
      sessionId, 
      JSON.stringify(verificationData)
    );
    
    // Send verification email to admin with complete lead info
    const adminEmailSubject = `Silver Path Network - New Lead Verification: ${firstName} ${lastName}`;
    const adminEmailBody = `Hi ${firstName},

Thanks for your submission! Use code ${verificationCode} to verify your number with Silver Path Network.

LEAD INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${firstName} ${lastName}
📧 Email: ${email}
📱 Phone: ${phone}
🔐 Verification Code: ${verificationCode}
⏰ Code Expires: 5 minutes from now
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This lead is requesting final expense insurance information. They will need to enter the verification code above to complete their application.

Best regards,
Silver Path Network System`;
    
    // Send email to admin (ajboyd96@gmail.com) with all lead details
    GmailApp.sendEmail(
      ADMIN_EMAIL,
      adminEmailSubject,
      adminEmailBody
    );
    
    // Note: Only admin receives email with verification code
    // Lead will see code in admin email sent to ajboyd96@gmail.com
    
    return createResponse(true, 'Verification code sent successfully', { sessionId });
    
  } catch (error) {
    console.error('Error sending verification code:', error);
    return createResponse(false, 'Failed to send verification code');
  }
}

/**
 * Verify the entered code
 */
function verifyCode(data) {
  try {
    const { sessionId, code } = data;
    
    if (!sessionId || !code) {
      return createResponse(false, 'Session ID and code are required');
    }
    
    // Get verification data
    const verificationJson = PropertiesService.getScriptProperties().getProperty(sessionId);
    if (!verificationJson) {
      return createResponse(false, 'Invalid or expired verification session');
    }
    
    const verificationData = JSON.parse(verificationJson);
    
    // Check expiration
    if (new Date() > new Date(verificationData.expires)) {
      PropertiesService.getScriptProperties().deleteProperty(sessionId);
      return createResponse(false, 'Verification code has expired');
    }
    
    // Check attempts
    if (verificationData.attempts >= verificationData.maxAttempts) {
      PropertiesService.getScriptProperties().deleteProperty(sessionId);
      return createResponse(false, 'Too many verification attempts');
    }
    
    // Verify code
    if (code.toString() !== verificationData.code.toString()) {
      verificationData.attempts++;
      PropertiesService.getScriptProperties().setProperty(
        sessionId, 
        JSON.stringify(verificationData)
      );
      
      const remainingAttempts = verificationData.maxAttempts - verificationData.attempts;
      return createResponse(false, `Invalid code. ${remainingAttempts} attempts remaining`);
    }
    
    // Code is correct - mark as verified
    verificationData.verified = true;
    PropertiesService.getScriptProperties().setProperty(
      sessionId, 
      JSON.stringify(verificationData)
    );
    
    return createResponse(true, 'Code verified successfully', { 
      sessionId,
      leadData: {
        firstName: verificationData.firstName,
        lastName: verificationData.lastName,
        email: verificationData.email,
        phone: verificationData.phone
      }
    });
    
  } catch (error) {
    console.error('Error verifying code:', error);
    return createResponse(false, 'Verification failed');
  }
}

/**
 * Submit verified lead to Lead Info sheet
 */
function submitLead(data) {
  try {
    const { sessionId, assessmentData } = data;
    
    if (!sessionId) {
      return createResponse(false, 'Session ID is required');
    }
    
    // Get verification data
    const verificationJson = PropertiesService.getScriptProperties().getProperty(sessionId);
    if (!verificationJson) {
      return createResponse(false, 'Invalid verification session');
    }
    
    const verificationData = JSON.parse(verificationJson);
    
    // Check if verified
    if (!verificationData.verified) {
      return createResponse(false, 'Phone number not verified');
    }
    
    // Add lead to Lead Info sheet
    const leadId = addLeadToSheet(verificationData, assessmentData);
    
    // Clean up verification session
    PropertiesService.getScriptProperties().deleteProperty(sessionId);
    
    return createResponse(true, 'Lead submitted successfully', { leadId });
    
  } catch (error) {
    console.error('Error submitting lead:', error);
    return createResponse(false, 'Failed to submit lead');
  }
}

/**
 * Get verification code for a lead (assigns random code or returns existing)
 */
function getVerificationCodeForLead(phone) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(CODES_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // Check if this phone number already has an assigned code
    for (let i = 1; i < data.length; i++) {
      const assignedPhone = data[i][3]; // Column D: Assigned phone number
      if (assignedPhone === phone) {
        const code = data[i][1]; // Column B: Code
        console.log(`Reusing existing code for phone ${phone}: ${code}`);
        return code.toString();
      }
    }
    
    // No existing code for this lead, assign a new random code
    const availableCodes = [];
    for (let i = 1; i < data.length; i++) {
      const code = data[i][1]; // Column B: Code
      const assignedPhone = data[i][3]; // Column D: Assigned phone number
      
      if (code && !assignedPhone) {
        availableCodes.push({
          code: code,
          rowIndex: i + 1
        });
      }
    }
    
    if (availableCodes.length === 0) {
      // All codes assigned, start reusing from the beginning
      console.log('All codes assigned, resetting assignment cycle');
      
      // Clear all phone assignments to start over
      for (let i = 1; i < data.length; i++) {
        sheet.getRange(i + 1, 4).setValue(''); // Clear column D (assigned phone)
        sheet.getRange(i + 1, 5).setValue(''); // Clear column E (assignment timestamp)
      }
      
      // Now get all codes as available again
      for (let i = 1; i < data.length; i++) {
        const code = data[i][1];
        if (code) {
          availableCodes.push({
            code: code,
            rowIndex: i + 1
          });
        }
      }
    }
    
    if (availableCodes.length === 0) {
      console.error('No codes available in sheet');
      return null;
    }
    
    // Pick random code from available codes
    const randomIndex = Math.floor(Math.random() * availableCodes.length);
    const selectedCode = availableCodes[randomIndex];
    
    // Assign this code to the phone number
    sheet.getRange(selectedCode.rowIndex, 4).setValue(phone); // Column D: Assigned phone
    sheet.getRange(selectedCode.rowIndex, 5).setValue(new Date()); // Column E: Assignment timestamp
    
    console.log(`Assigned new random code for phone ${phone}: ${selectedCode.code}`);
    return selectedCode.code.toString();
    
  } catch (error) {
    console.error('Error getting verification code for lead:', error);
    return null;
  }
}

/**
 * Add lead information to the Lead Info sheet
 */
function addLeadToSheet(verificationData, assessmentData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let leadSheet = spreadsheet.getSheetByName(LEADS_SHEET_NAME);
    
    // Create Lead Info sheet if it doesn't exist
    if (!leadSheet) {
      leadSheet = spreadsheet.insertSheet(LEADS_SHEET_NAME);
      
      // Add headers
      const headers = [
        'Lead ID', 'Timestamp', 'First Name', 'Last Name', 'Email', 'Phone',
        'Verification Code Used', 'Age Range', 'Tobacco Use', 'Coverage Amount',
        'Insurance Goal', 'Health Status', 'Coverage Timing', 'Status'
      ];
      leadSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      leadSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1B365D').setFontColor('white');
    }
    
    // Generate lead ID
    const leadId = `SP${Date.now()}`;
    
    // Prepare row data
    const rowData = [
      leadId,
      new Date(),
      verificationData.firstName,
      verificationData.lastName,
      verificationData.email,
      verificationData.phone,
      verificationData.code,
      assessmentData?.answers?.[0] || '', // Age range
      assessmentData?.answers?.[1] || '', // Tobacco use
      assessmentData?.answers?.[2] || '', // Coverage amount
      assessmentData?.answers?.[3] || '', // Insurance goal
      assessmentData?.answers?.[4] || '', // Health status
      assessmentData?.answers?.[5] || '', // Coverage timing
      'New Lead'
    ];
    
    // Add row to sheet
    leadSheet.appendRow(rowData);
    
    // Auto-resize columns
    leadSheet.autoResizeColumns(1, rowData.length);
    
    return leadId;
    
  } catch (error) {
    console.error('Error adding lead to sheet:', error);
    throw error;
  }
}

/**
 * Create standardized response object
 */
function createResponse(success, message, data = {}) {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function for manual testing
 */
function testSendVerification() {
  const testData = {
    action: 'send_verification',
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    phone: '5551234567'
  };
  
  const result = sendVerificationCode(testData);
  console.log(result.getContent());
}

/**
 * Cleanup expired verification sessions (run this periodically)
 */
function cleanupExpiredSessions() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const now = new Date();
  
  for (const [key, value] of Object.entries(properties)) {
    try {
      const data = JSON.parse(value);
      if (data.expires && new Date(data.expires) < now) {
        PropertiesService.getScriptProperties().deleteProperty(key);
        console.log(`Cleaned up expired session: ${key}`);
      }
    } catch (error) {
      // Not a verification session, skip
    }
  }
}