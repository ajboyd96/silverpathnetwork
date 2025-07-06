/**
 * Silver Path Network - Enhanced SMS Verification with Lead Capture
 * This Google Apps Script handles verification codes, email sending, and lead capture with quiz data
 * Updated to support both Quiz 1 (6 questions) and Quiz 2 (Arizona - 20 questions)
 */

// Configuration - UPDATE THIS WITH YOUR SPREADSHEET ID
var SPREADSHEET_ID = '1MZYgrMksEKzKksiXYf7B2dNnrzu9prScwbCZ0TWmIxc';
var CODES_SHEET_NAME = 'Sheet1'; // Sheet with verification codes  
var LEADS_SHEET_NAME = 'Lead Info'; // Sheet for standard quiz lead information
var ARIZONA_SHEET_NAME = 'Arizona Quiz Responses'; // Sheet for Arizona quiz
var ADMIN_EMAIL = 'ajboyd96@gmail.com';

// Telegram Bot Configuration
var TELEGRAM_BOT_TOKEN = '8037279353:AAHpV-yEVV3uWMPmfVuq_dKY3d1h_RBmUwA';
var TELEGRAM_CHAT_ID = '7463862813';

/**
 * Handle GET requests
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Silver Path Network SMS Verification API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    console.log('=== RECEIVED POST REQUEST ===');
    console.log('Request parameters:', e.parameter);
    console.log('Parameter keys:', Object.keys(e.parameter));
    
    var params = e.parameter;
    
    // Log each parameter for debugging
    console.log('firstName:', params.firstName);
    console.log('lastName:', params.lastName);
    console.log('email:', params.email);
    console.log('phone:', params.phone);
    console.log('action:', params.action);
    console.log('resend:', params.resend);
    console.log('quizId:', params.quizId);
    
    // Handle quiz data submission (when verification succeeds)
    if (params.action === 'submit_lead') {
      console.log('📊 Processing quiz data submission');
      return handleQuizDataSubmission(params);
    }
    
    // Handle resend requests first
    if (params.resend === 'true') {
      console.log('🔄 Processing resend request');
      return handleResendRequest(params);
    }
    
    // Handle verification code sending request - check if we have contact info
    if (params.firstName && params.lastName && params.email && params.phone && !params.action) {
      console.log('📧 Processing verification code request');
      return handleVerificationRequest(params);
    }
    
    // If we have contact info but no specific action, assume it's verification
    if (params.firstName || params.lastName || params.email || params.phone) {
      console.log('⚠️ Received contact info but missing some fields:');
      console.log('- firstName:', params.firstName ? 'present' : 'missing');
      console.log('- lastName:', params.lastName ? 'present' : 'missing');
      console.log('- email:', params.email ? 'present' : 'missing');
      console.log('- phone:', params.phone ? 'present' : 'missing');
      
      // Try to process anyway if we have the essential fields
      if (params.firstName && params.lastName && params.email && params.phone) {
        console.log('📧 Processing verification code request (fallback)');
        return handleVerificationRequest(params);
      }
    }
    
    console.log('❌ Invalid request - no matching handler');
    console.log('❌ Available parameters:', Object.keys(params));
    return createFormResponse(false, 'Invalid request parameters');
    
  } catch (error) {
    console.error('❌ Error in doPost:', error);
    return createFormResponse(false, 'Server error occurred: ' + error.message);
  }
}

/**
 * Handle verification code request
 */
function handleVerificationRequest(params) {
  try {
    var firstName = params.firstName;
    var lastName = params.lastName;
    var email = params.email;
    var phone = params.phone;
    var verificationCode = params.verificationCode;
    var quizId = params.quizId || 'standard-quiz';
    
    // Determine quiz type
    var quizType = quizId === 'arizona-final-expense-quiz-2' ? 'Arizona Quiz' : 'Standard Quiz';
    
    // Use provided verification code, or generate one if not provided
    var code = verificationCode || Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Using verification code:', code);
    console.log('Quiz type:', quizType);
    
    // Normalize phone number
    var cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
      cleanPhone = cleanPhone.substring(1);
    }
    console.log('Normalized phone:', cleanPhone);
    
    // Check if this is a resend request
    var isResend = params.resend === 'true';
    
    // Send email to admin with text template
    var subject = 'Silver Path Network - ' + quizType + ' - ' + (isResend ? 'RESEND CODE' : 'New Lead') + ': ' + firstName + ' ' + lastName;
    var body = (isResend ? 'RESEND CODE request for existing lead:\n\n' : 'New lead verification request:\n\n');
    body += '=== TEXT MESSAGE TO SEND ===\n';
    body += 'Hi ' + firstName + ', Thank you for choosing Silver Path Network. Your code is ' + code + '\n\n';
    body += '=== LEAD INFORMATION ===\n';
    body += 'Name: ' + firstName + ' ' + lastName + '\n';
    body += 'Email: ' + email + '\n';
    body += 'Phone: ' + cleanPhone + '\n';
    body += 'Quiz Type: ' + quizType + '\n';
    body += 'Verification Code: ' + code + '\n';
    body += 'Request Type: ' + (isResend ? 'Resend Code' : 'New Lead') + '\n';
    body += 'Timestamp: ' + new Date().toLocaleString() + '\n\n';
    body += '=== INSTRUCTIONS ===\n';
    body += '1. Text the above message to the lead at their phone number\n';
    body += '2. They will enter this code on the website to verify\n';
    body += '3. Once verified, their complete information will be added to the appropriate sheet\n\n';
    body += 'Generated by Silver Path Network System';
    
    // Send email notification
    GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
    console.log('✅ Email sent to admin with verification code');
    
    // Send Telegram notification
    sendTelegramMessage('🔔 New ' + quizType + ' Lead Alert!\n\n' +
      '👤 Name: ' + firstName + ' ' + lastName + '\n' +
      '📧 Email: ' + email + '\n' +
      '📱 Phone: ' + cleanPhone + '\n' +
      '🔐 Code: ' + code + '\n' +
      '📝 Quiz: ' + quizType + '\n\n' +
      '💬 Text this to lead:\n' +
      '"Hi ' + firstName + ', Thank you for choosing Silver Path Network. Your code is ' + code + '"');
    console.log('✅ Telegram notification sent');
    
    // Store lead information temporarily for when verification completes
    var leadData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: cleanPhone,
      verificationCode: code,
      quizId: quizId,
      timestamp: new Date().toISOString(),
      verified: false
    };
    
    // Store in PropertiesService using phone as key
    PropertiesService.getScriptProperties().setProperty('lead_' + cleanPhone, JSON.stringify(leadData));
    console.log('💾 Lead data stored for phone:', cleanPhone);
    
    return createFormResponse(true, 'Verification code sent successfully');
    
  } catch (error) {
    console.error('❌ Error handling verification request:', error);
    return createFormResponse(false, 'Failed to send verification code: ' + error.message);
  }
}

/**
 * Handle resend requests
 */
function handleResendRequest(params) {
  try {
    console.log('🔄 Handling resend request');
    return handleVerificationRequest(params);
  } catch (error) {
    console.error('❌ Error handling resend request:', error);
    return createFormResponse(false, 'Failed to resend verification code: ' + error.message);
  }
}

/**
 * Handle quiz data submission after verification succeeds
 */
function handleQuizDataSubmission(params) {
  try {
    console.log('📊 === QUIZ DATA SUBMISSION ===');
    console.log('Received parameters:', params);
    
    var phone = params.phone;
    var quizAnswersJson = params.quizAnswers;
    var firstName = params.firstName;
    var lastName = params.lastName;
    var email = params.email;
    var quizId = params.quizId || 'standard-quiz';
    
    if (!phone) {
      console.log('❌ Missing phone number');
      return createFormResponse(false, 'Phone number required');
    }
    
    if (!quizAnswersJson) {
      console.log('❌ Missing quiz answers');
      return createFormResponse(false, 'Quiz answers required');
    }
    
    console.log('📞 Phone:', phone);
    console.log('📝 Quiz ID:', quizId);
    console.log('📝 Quiz answers JSON:', quizAnswersJson);
    
    // Try to get stored lead data first
    var leadJson = PropertiesService.getScriptProperties().getProperty('lead_' + phone);
    var leadData;
    
    if (leadJson) {
      console.log('✅ Found stored lead data');
      leadData = JSON.parse(leadJson);
    } else {
      console.log('⚠️ No stored lead data found, creating from submitted data');
      // Create lead data from submitted information
      leadData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        verificationCode: 'VERIFIED',
        quizId: quizId,
        timestamp: new Date().toISOString(),
        verified: false
      };
    }
    
    // Mark as verified and add quiz answers
    leadData.verified = true;
    leadData.verifiedAt = new Date().toISOString();
    
    // Parse quiz answers
    try {
      leadData.quizAnswers = JSON.parse(quizAnswersJson);
      console.log('✅ Parsed quiz answers:', leadData.quizAnswers);
    } catch (parseError) {
      console.error('❌ Error parsing quiz answers:', parseError);
      leadData.quizAnswers = {};
    }
    
    // Add to appropriate sheet based on quiz type
    var leadId;
    if (quizId === 'arizona-final-expense-quiz-2') {
      leadId = addArizonaLeadToSheet(leadData);
      console.log('✅ Arizona lead added to sheet with ID:', leadId);
    } else {
      leadId = addLeadToSheet(leadData);
      console.log('✅ Standard lead added to sheet with ID:', leadId);
    }
    
    // Clean up temporary storage
    if (leadJson) {
      PropertiesService.getScriptProperties().deleteProperty('lead_' + phone);
      console.log('🧹 Cleaned up temporary storage');
    }
    
    return createFormResponse(true, 'Lead data saved successfully to Google Sheets');
    
  } catch (error) {
    console.error('❌ Error handling quiz data submission:', error);
    return createFormResponse(false, 'Failed to save lead data: ' + error.message);
  }
}

/**
 * Add verified Arizona quiz lead to the Arizona Quiz Responses sheet (20 questions)
 */
function addArizonaLeadToSheet(leadData) {
  try {
    console.log('📊 === ADDING ARIZONA LEAD TO SHEET ===');
    console.log('Lead data:', leadData);
    
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var leadSheet = spreadsheet.getSheetByName(ARIZONA_SHEET_NAME);
    
    // Create Arizona Quiz Responses sheet if it doesn't exist
    if (!leadSheet) {
      console.log('📋 Creating new Arizona Quiz Responses sheet');
      leadSheet = spreadsheet.insertSheet(ARIZONA_SHEET_NAME);
      
      // Add headers for Arizona quiz (20 questions)
      var headers = [
        // Lead Information Section
        'Lead ID', 'Date Submitted', 'Time Submitted',
        
        // Customer Information Section  
        'First Name', 'Last Name', 'Email Address', 'Phone Number',
        
        // Verification Section
        'Verification Code', 'Verification Status', 'Verified Date/Time',
        
        // Arizona Quiz Answers Section (20 questions)
        'Q1: Age', 'Q2: Arizona Resident', 'Q3: US Citizen', 'Q4: Existing Policy', 
        'Q5: Marital Status', 'Q6: Children/Grandchildren', 'Q7: Tobacco Use', 
        'Q8: Health Conditions', 'Q9: Hospitalized', 'Q10: Medications', 
        'Q11: Overall Health', 'Q12: Funeral Costs Knowledge', 'Q13: Family Prepared', 
        'Q14: Coverage Priority', 'Q15: Burial/Cremation', 'Q16: Timeline', 
        'Q17: View Plans', 'Q18: Contact Preference', 'Q19: Best Time', 'Q20: Arizona Zip'
      ];
      
      // Add headers to sheet
      leadSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers with better styling
      var headerRange = leadSheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold')
                 .setBackground('#1B365D')
                 .setFontColor('white')
                 .setFontSize(11)
                 .setHorizontalAlignment('center');
      
      console.log('✅ Created Arizona sheet with headers');
    }
    
    // Generate unique lead ID
    var leadId = 'AZ' + Date.now();
    
    // Extract quiz answers from stored data
    var quizAnswers = leadData.quizAnswers || {};
    console.log('📝 Arizona quiz answers for sheet:', quizAnswers);
    
    // Prepare row data for Arizona quiz (20 questions)
    var submissionDate = new Date(leadData.timestamp);
    var verifiedDate = new Date(leadData.verifiedAt);
    
    var rowData = [
      // Lead Information Section
      leadId,
      Utilities.formatDate(submissionDate, 'America/New_York', 'MM/dd/yyyy'),
      Utilities.formatDate(submissionDate, 'America/New_York', 'HH:mm:ss'),
      
      // Customer Information Section
      leadData.firstName,
      leadData.lastName,
      leadData.email,
      leadData.phone,
      
      // Verification Section
      leadData.verificationCode,
      'Verified',
      Utilities.formatDate(verifiedDate, 'America/New_York', 'MM/dd/yyyy HH:mm:ss'),
      
      // Arizona Quiz Answers Section (20 questions)
      quizAnswers.q1 || 'Not answered',
      quizAnswers.q2 || 'Not answered',
      quizAnswers.q3 || 'Not answered',
      quizAnswers.q4 || 'Not answered',
      quizAnswers.q5 || 'Not answered',
      quizAnswers.q6 || 'Not answered',
      quizAnswers.q7 || 'Not answered',
      quizAnswers.q8 || 'Not answered',
      quizAnswers.q9 || 'Not answered',
      quizAnswers.q10 || 'Not answered',
      quizAnswers.q11 || 'Not answered',
      quizAnswers.q12 || 'Not answered',
      quizAnswers.q13 || 'Not answered',
      quizAnswers.q14 || 'Not answered',
      quizAnswers.q15 || 'Not answered',
      quizAnswers.q16 || 'Not answered',
      quizAnswers.q17 || 'Not answered',
      quizAnswers.q18 || 'Not answered',
      quizAnswers.q19 || 'Not answered',
      quizAnswers.q20 || 'Not answered'
    ];
    
    console.log('📊 Arizona row data to be added:', rowData);
    
    // Add row to sheet
    leadSheet.appendRow(rowData);
    
    // Auto-resize columns for better readability
    leadSheet.autoResizeColumns(1, rowData.length);
    
    console.log('✅ Arizona lead successfully added to sheet:', leadId);
    return leadId;
    
  } catch (error) {
    console.error('❌ Error adding Arizona lead to sheet:', error);
    throw error;
  }
}

/**
 * Add verified lead to the Lead Info sheet with quiz answers (original 6-question quiz)
 */
function addLeadToSheet(leadData) {
  try {
    console.log('📊 === ADDING STANDARD LEAD TO SHEET ===');
    console.log('Lead data:', leadData);
    
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var leadSheet = spreadsheet.getSheetByName(LEADS_SHEET_NAME);
    
    // Create Lead Info sheet if it doesn't exist
    if (!leadSheet) {
      console.log('📋 Creating new Lead Info sheet');
      leadSheet = spreadsheet.insertSheet(LEADS_SHEET_NAME);
      
      // Add comprehensive headers with clear sections
      var headers = [
        // Lead Information Section
        'Lead ID', 'Date Submitted', 'Time Submitted',
        
        // Customer Information Section  
        'First Name', 'Last Name', 'Email Address', 'Phone Number',
        
        // Verification Section
        'Verification Code', 'Verification Status', 'Verified Date/Time',
        
        // Quiz Answers Section (6 questions)
        'Age Range', 'Tobacco Use', 'Desired Coverage Amount', 
        'Primary Insurance Goal', 'Health Status', 'When Coverage Needed'
      ];
      
      // Add headers to sheet
      leadSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers with better styling
      var headerRange = leadSheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold')
                 .setBackground('#1B365D')
                 .setFontColor('white')
                 .setFontSize(11)
                 .setHorizontalAlignment('center');
      
      console.log('✅ Created standard sheet with headers');
    }
    
    // Generate unique lead ID
    var leadId = 'SP' + Date.now();
    
    // Extract quiz answers from stored data
    var quizAnswers = leadData.quizAnswers || {};
    console.log('📝 Quiz answers for sheet:', quizAnswers);
    
    // Prepare row data to match new header structure
    var submissionDate = new Date(leadData.timestamp);
    var verifiedDate = new Date(leadData.verifiedAt);
    
    var rowData = [
      // Lead Information Section
      leadId,
      Utilities.formatDate(submissionDate, 'America/New_York', 'MM/dd/yyyy'),
      Utilities.formatDate(submissionDate, 'America/New_York', 'HH:mm:ss'),
      
      // Customer Information Section
      leadData.firstName,
      leadData.lastName,
      leadData.email,
      leadData.phone,
      
      // Verification Section
      leadData.verificationCode,
      'Verified',
      Utilities.formatDate(verifiedDate, 'America/New_York', 'MM/dd/yyyy HH:mm:ss'),
      
      // Quiz Answers Section (6 questions)
      quizAnswers.q1 || 'Not answered', // Age Range
      quizAnswers.q2 || 'Not answered', // Tobacco Use  
      quizAnswers.q3 || 'Not answered', // Coverage Amount
      quizAnswers.q4 || 'Not answered', // Insurance Goal
      quizAnswers.q5 || 'Not answered', // Health Status
      quizAnswers.q6 || 'Not answered'  // Coverage Timing
    ];
    
    console.log('📊 Row data to be added:', rowData);
    
    // Add row to sheet
    leadSheet.appendRow(rowData);
    
    // Auto-resize columns for better readability
    leadSheet.autoResizeColumns(1, rowData.length);
    
    console.log('✅ Lead successfully added to sheet:', leadId);
    return leadId;
    
  } catch (error) {
    console.error('❌ Error adding lead to sheet:', error);
    throw error;
  }
}

/**
 * Create response for form submissions
 */
function createFormResponse(success, message) {
  var htmlContent = '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<title>Silver Path Network - Response</title>' +
    '<style>' +
    'body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }' +
    '.container { background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }' +
    '.success { color: #28a745; font-size: 18px; margin: 20px 0; }' +
    '.error { color: #dc3545; font-size: 18px; margin: 20px 0; }' +
    'h2 { color: #1B365D; margin-bottom: 20px; }' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="container">' +
    '<h2>Silver Path Network</h2>' +
    '<p class="' + (success ? 'success' : 'error') + '">' + message + '</p>' +
    '<p><small>This window can be closed.</small></p>' +
    '</div>' +
    '</body>' +
    '</html>';
  
  var html = HtmlService.createHtmlOutput(htmlContent);
  return html;
}

/**
 * Send message to Telegram bot
 */
function sendTelegramMessage(message) {
  try {
    var telegramUrl = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
    
    var payload = {
      'chat_id': TELEGRAM_CHAT_ID,
      'text': message,
      'parse_mode': 'HTML'
    };
    
    var options = {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json'
      },
      'payload': JSON.stringify(payload)
    };
    
    var response = UrlFetchApp.fetch(telegramUrl, options);
    var responseData = JSON.parse(response.getContentText());
    
    if (responseData.ok) {
      console.log('✅ Telegram message sent successfully');
      return true;
    } else {
      console.error('❌ Telegram API error:', responseData.description);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error);
    return false;
  }
}

/**
 * Cleanup function to remove old temporary lead data
 */
function cleanupOldLeadData() {
  var properties = PropertiesService.getScriptProperties().getProperties();
  var now = new Date();
  var maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  for (var key in properties) {
    if (key.startsWith('lead_')) {
      try {
        var leadData = JSON.parse(properties[key]);
        var leadTime = new Date(leadData.timestamp);
        
        if (now - leadTime > maxAge) {
          PropertiesService.getScriptProperties().deleteProperty(key);
          console.log('🧹 Cleaned up old lead data:', key);
        }
      } catch (error) {
        // Invalid data, clean it up
        PropertiesService.getScriptProperties().deleteProperty(key);
        console.log('🧹 Cleaned up invalid data:', key);
      }
    }
  }
}