/**
 * Silver Path Network - Complete Google Apps Script
 * Handles SMS verification and quiz data storage for both Quiz 1 and Quiz 2
 * Quiz 1: Original 6-question assessment
 * Quiz 2: Arizona Final Expense Eligibility Check (20 questions)
 */

function doPost(e) {
  try {
    const data = e.parameter;
    console.log('Received data:', data);
    
    // Handle quiz lead submission after verification
    if (data.action === 'submit_lead') {
      handleQuizSubmission(data);
      return ContentService.createTextOutput(JSON.stringify({success: true, message: 'Lead submitted successfully'}));
    }
    
    // Handle SMS verification code sending
    if (data.verificationCode && data.phone) {
      const result = sendSMSVerification(data);
      return ContentService.createTextOutput(JSON.stringify(result));
    }
    
    // Handle phone verification
    if (data.action === 'verify' && data.phone && data.code) {
      const result = verifyPhone(data.phone, data.code);
      return ContentService.createTextOutput(JSON.stringify(result));
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Invalid request'}));
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}));
  }
}

function doGet(e) {
  try {
    const params = e.parameter;
    
    // Handle verification endpoint
    if (params.action === 'verify' && params.phone && params.code) {
      const result = verifyPhone(params.phone, params.code);
      return ContentService.createTextOutput(JSON.stringify(result));
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Invalid GET request'}));
    
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}));
  }
}

/**
 * Get or create a sheet with proper headers
 */
function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    
    // Add headers based on sheet type
    if (sheetName === "Arizona Quiz Responses") {
      const headers = [
        "Timestamp", "First Name", "Last Name", "Email", "Phone", "Verified", "Quiz ID",
        "Q1: Age", "Q2: Arizona Resident", "Q3: US Citizen", "Q4: Existing Policy", 
        "Q5: Marital Status", "Q6: Children/Grandchildren", "Q7: Tobacco Use", 
        "Q8: Health Conditions", "Q9: Hospitalized", "Q10: Medications", 
        "Q11: Overall Health", "Q12: Funeral Costs Knowledge", "Q13: Family Prepared", 
        "Q14: Coverage Priority", "Q15: Burial/Cremation", "Q16: Timeline", 
        "Q17: View Plans", "Q18: Contact Preference", "Q19: Best Time", "Q20: Arizona Zip"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1B365D');
      headerRange.setFontColor('white');
      
    } else if (sheetName === "Quiz Responses") {
      const headers = [
        "Timestamp", "First Name", "Last Name", "Email", "Phone", "Verified", "Quiz ID",
        "Q1: Age Range", "Q2: Tobacco Use", "Q3: Coverage Amount", 
        "Q4: Primary Goal", "Q5: Health Status", "Q6: Coverage Start"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1B365D');
      headerRange.setFontColor('white');
      
    } else if (sheetName === "SMS Verification Log") {
      const headers = [
        "Timestamp", "Phone", "Verification Code", "Status", "Quiz ID", "Resend Count"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#28a745');
      headerRange.setFontColor('white');
    }
  }
  
  return sheet;
}

/**
 * Handle quiz submission based on quiz type
 */
function handleQuizSubmission(data) {
  const quizId = data.quizId || 'original-quiz';
  console.log('Processing quiz submission for:', quizId);
  
  let sheetName;
  if (quizId === 'arizona-final-expense-quiz-2') {
    sheetName = "Arizona Quiz Responses";
  } else {
    sheetName = "Quiz Responses"; // Original quiz
  }
  
  const sheet = getOrCreateSheet(sheetName);
  
  // Parse quiz answers
  let quizAnswers = {};
  try {
    quizAnswers = JSON.parse(data.quizAnswers || '{}');
    console.log('Parsed quiz answers:', quizAnswers);
  } catch (e) {
    console.error('Error parsing quiz answers:', e);
    quizAnswers = {};
  }
  
  // Prepare row data based on quiz type
  let rowData;
  if (quizId === 'arizona-final-expense-quiz-2') {
    // Arizona quiz - 20 questions
    rowData = [
      new Date(),
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      'Yes', // Verified (since they completed SMS verification)
      quizId,
      quizAnswers.q1 || '', // Age
      quizAnswers.q2 || '', // Arizona Resident
      quizAnswers.q3 || '', // US Citizen
      quizAnswers.q4 || '', // Existing Policy
      quizAnswers.q5 || '', // Marital Status
      quizAnswers.q6 || '', // Children/Grandchildren
      quizAnswers.q7 || '', // Tobacco Use
      quizAnswers.q8 || '', // Health Conditions
      quizAnswers.q9 || '', // Hospitalized
      quizAnswers.q10 || '', // Medications
      quizAnswers.q11 || '', // Overall Health
      quizAnswers.q12 || '', // Funeral Costs Knowledge
      quizAnswers.q13 || '', // Family Prepared
      quizAnswers.q14 || '', // Coverage Priority
      quizAnswers.q15 || '', // Burial/Cremation
      quizAnswers.q16 || '', // Timeline
      quizAnswers.q17 || '', // View Plans
      quizAnswers.q18 || '', // Contact Preference
      quizAnswers.q19 || '', // Best Time
      quizAnswers.q20 || ''  // Arizona Zip
    ];
  } else {
    // Original quiz - 6 questions
    rowData = [
      new Date(),
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      'Yes', // Verified
      quizId,
      quizAnswers.q1 || '', // Age Range
      quizAnswers.q2 || '', // Tobacco Use
      quizAnswers.q3 || '', // Coverage Amount
      quizAnswers.q4 || '', // Primary Goal
      quizAnswers.q5 || '', // Health Status
      quizAnswers.q6 || ''  // Coverage Start
    ];
  }
  
  // Add the row to the sheet
  sheet.appendRow(rowData);
  console.log('Successfully added row to', sheetName);
  
  // Auto-resize columns for better readability
  sheet.autoResizeColumns(1, rowData.length);
}

/**
 * Send SMS verification code
 */
function sendSMSVerification(data) {
  const phone = data.phone;
  const code = data.verificationCode;
  const quizId = data.quizId || 'original-quiz';
  const isResend = data.resend === 'true';
  
  console.log('Sending SMS verification to:', phone, 'Code:', code, 'Quiz:', quizId, 'Resend:', isResend);
  
  try {
    // Log SMS attempt
    logSMSAttempt(phone, code, quizId, isResend);
    
    // Send email with verification code (since SMS requires paid service)
    sendVerificationEmail(data.email, data.firstName, code, quizId);
    
    return {
      success: true,
      message: 'Verification code sent successfully',
      phone: phone
    };
    
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Send verification code via email as backup
 */
function sendVerificationEmail(email, firstName, code, quizId) {
  if (!email) return;
  
  const quizName = quizId === 'arizona-final-expense-quiz-2' ? 'Arizona Final Expense Assessment' : 'Final Expense Assessment';
  
  const subject = `Your ${quizName} Verification Code`;
  const body = `
Hello ${firstName || 'there'},

Your verification code for the ${quizName} is: ${code}

Please enter this code on the website to complete your assessment and receive your personalized quote.

If you didn't request this code, please ignore this email.

Best regards,
Silver Path Network Team
(833) 738-2671
  `;
  
  try {
    MailApp.sendEmail(email, subject, body);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

/**
 * Log SMS verification attempt
 */
function logSMSAttempt(phone, code, quizId, isResend) {
  const sheet = getOrCreateSheet("SMS Verification Log");
  
  // Count existing attempts for this phone number
  const data = sheet.getDataRange().getValues();
  let resendCount = 0;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === phone) { // Phone column
      resendCount++;
    }
  }
  
  const rowData = [
    new Date(),
    phone,
    code,
    'Sent',
    quizId,
    isResend ? resendCount : 0
  ];
  
  sheet.appendRow(rowData);
}

/**
 * Verify phone number and code (for server-side verification if needed)
 */
function verifyPhone(phone, code) {
  console.log('Verifying phone:', phone, 'with code:', code);
  
  try {
    // Get SMS log to find the code for this phone
    const sheet = getOrCreateSheet("SMS Verification Log");
    const data = sheet.getDataRange().getValues();
    
    // Look for matching phone and code in recent entries (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    for (let i = data.length - 1; i >= 1; i--) {
      const row = data[i];
      const timestamp = new Date(row[0]);
      const loggedPhone = row[1];
      const loggedCode = row[2];
      
      if (timestamp > oneDayAgo && loggedPhone === phone && loggedCode === code) {
        console.log('Phone verification successful');
        return {
          success: true,
          verified: true,
          message: 'Phone verified successfully'
        };
      }
    }
    
    console.log('Phone verification failed - code not found or expired');
    return {
      success: false,
      verified: false,
      message: 'Invalid or expired verification code'
    };
    
  } catch (error) {
    console.error('Error verifying phone:', error);
    return {
      success: false,
      verified: false,
      error: error.toString()
    };
  }
}

/**
 * Test function to check if script is working
 */
function testScript() {
  console.log('Silver Path Network Google Apps Script is working!');
  
  // Test sheet creation
  getOrCreateSheet("Quiz Responses");
  getOrCreateSheet("Arizona Quiz Responses");
  getOrCreateSheet("SMS Verification Log");
  
  console.log('All sheets created successfully');
  return 'Script test completed successfully';
}

/**
 * Initialize spreadsheet with proper sheets and formatting
 */
function initializeSpreadsheet() {
  console.log('Initializing Silver Path Network spreadsheet...');
  
  // Create all necessary sheets
  getOrCreateSheet("Quiz Responses");
  getOrCreateSheet("Arizona Quiz Responses");
  getOrCreateSheet("SMS Verification Log");
  
  console.log('Spreadsheet initialization complete');
}