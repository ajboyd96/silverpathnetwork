/**
 * Silver Path Network - Automated SMS Verification with Twilio
 * This Google Apps Script handles automated SMS verification, email sending, lead capture and contact forms
 * 
 * IMPORTANT: Make sure to set up your credentials in Script Properties!
 */

// Configuration - UPDATE THESE IN SCRIPT PROPERTIES
var SPREADSHEET_ID = '1MZYgrMksEKzKksiXYf7B2dNnrzu9prScwbCZ0TWmIxc';
var CODES_SHEET_NAME = 'Sheet1'; // Sheet with verification codes  
var LEADS_SHEET_NAME = 'Lead Info'; // Sheet for lead information
var CONTACT_SHEET_NAME = 'Contact Forms'; // Sheet for contact form submissions
var ADMIN_EMAIL = 'ajboyd96@gmail.com';
var INFO_EMAIL = 'info@silverpathnetwork.com'; // Contact form destination email

// Telegram Bot Configuration
var TELEGRAM_BOT_TOKEN = '8037279353:AAHpV-yEVV3uWMPmfVuq_dKY3d1h_RBmUwA';
var TELEGRAM_CHAT_ID = '7463862813';

/**
 * Get Twilio credentials from Script Properties
 * To set these up:
 * 1. Go to Extensions > Apps Script > Project Settings
 * 2. Add these Script Properties:
 *    - TWILIO_ACCOUNT_SID: Your Twilio Account SID
 *    - TWILIO_AUTH_TOKEN: Your Twilio Auth Token
 *    - TWILIO_PHONE_NUMBER: Your Twilio phone number (format: +1234567890)
 */
function getTwilioCredentials() {
  var properties = PropertiesService.getScriptProperties();
  return {
    accountSid: properties.getProperty('TWILIO_ACCOUNT_SID'),
    authToken: properties.getProperty('TWILIO_AUTH_TOKEN'),
    phoneNumber: properties.getProperty('TWILIO_PHONE_NUMBER')
  };
}

/**
 * Handle GET requests
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Silver Path Network Automated SMS Verification API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    console.log('=== RECEIVED POST REQUEST ===');
    console.log('Request parameters:', e.parameter);
    
    var params = e.parameter;
    
    // Handle contact form submission
    if (params.action === 'contact_form') {
      console.log('📞 Processing contact form submission');
      return handleContactFormSubmission(params);
    }
    
    // Handle quiz data submission (when verification succeeds)
    if (params.action === 'submit_lead') {
      console.log('📊 Processing quiz data submission');
      return handleQuizDataSubmission(params);
    }
    
    // Handle verification code sending request (now with Twilio SMS)
    if (params.firstName && params.lastName && params.email && params.phone) {
      console.log('📱 Processing SMS verification request');
      return handleSMSVerificationRequest(params);
    }
    
    // Handle resend requests (now with Twilio SMS)
    if (params.resend === 'true') {
      console.log('🔄 Processing SMS resend request');
      return handleSMSResendRequest(params);
    }
    
    console.log('❌ Invalid request - no matching handler');
    return createFormResponse(false, 'Invalid request parameters');
    
  } catch (error) {
    console.error('❌ Error in doPost:', error);
    return createFormResponse(false, 'Server error occurred: ' + error.message);
  }
}

/**
 * Send SMS using Twilio API
 */
function sendTwilioSMS(phoneNumber, message) {
  try {
    var credentials = getTwilioCredentials();
    
    if (!credentials.accountSid || !credentials.authToken || !credentials.phoneNumber) {
      throw new Error('Twilio credentials not configured. Please set up TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in Script Properties.');
    }
    
    console.log('📱 Sending SMS to:', phoneNumber);
    console.log('📱 Message:', message);
    
    var url = 'https://api.twilio.com/2010-04-01/Accounts/' + credentials.accountSid + '/Messages.json';
    
    var payload = {
      'From': credentials.phoneNumber,
      'To': phoneNumber,
      'Body': message
    };
    
    var options = {
      'method': 'POST',
      'headers': {
        'Authorization': 'Basic ' + Utilities.base64Encode(credentials.accountSid + ':' + credentials.authToken)
      },
      'payload': payload
    };
    
    var response = UrlFetchApp.fetch(url, options);
    var responseData = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() === 201) {
      console.log('✅ SMS sent successfully. Message SID:', responseData.sid);
      return {
        success: true,
        messageSid: responseData.sid,
        status: responseData.status
      };
    } else {
      console.error('❌ Twilio API error:', responseData);
      throw new Error('Failed to send SMS: ' + (responseData.message || 'Unknown error'));
    }
    
  } catch (error) {
    console.error('❌ Error sending SMS:', error);
    throw error;
  }
}

/**
 * Handle SMS verification request (replaces manual email notification)
 */
function handleSMSVerificationRequest(params) {
  try {
    var firstName = params.firstName;
    var lastName = params.lastName;
    var email = params.email;
    var phone = params.phone;
    var verificationCode = params.verificationCode;
    
    // Use provided verification code, or generate one if not provided
    var code = verificationCode || Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated verification code:', code);
    
    // Normalize phone number for SMS (ensure +1 format)
    var cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '+1' + cleanPhone;
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
      cleanPhone = '+' + cleanPhone;
    } else {
      cleanPhone = phone; // Use as provided if not standard US format
    }
    console.log('Normalized phone for SMS:', cleanPhone);
    
    // Check if this is a resend request
    var isResend = params.resend === 'true';
    
    // Prepare SMS message
    var smsMessage = 'Hi ' + firstName + ', Thank you for choosing Silver Path Network. Your verification code is ' + code + '. Enter this code to complete your application.';
    
    // Send SMS via Twilio
    try {
      var smsResult = sendTwilioSMS(cleanPhone, smsMessage);
      console.log('✅ SMS sent successfully via Twilio');
      
      // Send success notification to admin and Telegram
      var subject = 'Silver Path Network - ' + (isResend ? 'RESEND CODE' : 'SMS Sent') + ': ' + firstName + ' ' + lastName;
      var body = (isResend ? 'RESEND CODE - SMS sent successfully:\n\n' : 'SMS verification sent automatically:\n\n');
      body += '=== AUTOMATED SMS SENT ===\n';
      body += 'Message: ' + smsMessage + '\n\n';
      body += '=== LEAD INFORMATION ===\n';
      body += 'Name: ' + firstName + ' ' + lastName + '\n';
      body += 'Email: ' + email + '\n';
      body += 'Phone: ' + cleanPhone + '\n';
      body += 'Verification Code: ' + code + '\n';
      body += 'Request Type: ' + (isResend ? 'Resend Code' : 'New Lead') + '\n';
      body += 'SMS Status: ' + smsResult.status + '\n';
      body += 'Message SID: ' + smsResult.messageSid + '\n';
      body += 'Timestamp: ' + new Date().toLocaleString() + '\n\n';
      body += '=== STATUS ===\n';
      body += '✅ SMS sent automatically via Twilio\n';
      body += '⏳ Waiting for user to enter verification code\n';
      body += '📊 Once verified, complete information will be added to Lead Info sheet\n\n';
      body += 'Generated by Silver Path Network Automated System';
      
      // Send email notification to admin
      GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
      console.log('✅ Admin notification email sent');
      
      // Send Telegram notification
      sendTelegramMessage('📱 SMS Verification Sent!\n\n' +
        '👤 Name: ' + firstName + ' ' + lastName + '\n' +
        '📧 Email: ' + email + '\n' +
        '📞 Phone: ' + cleanPhone + '\n' +
        '🔐 Code: ' + code + '\n' +
        '✅ SMS Status: ' + smsResult.status + '\n\n' +
        '📲 SMS Message Sent:\n"' + smsMessage + '"');
      console.log('✅ Telegram notification sent');
      
    } catch (smsError) {
      console.error('❌ Failed to send SMS, falling back to manual notification:', smsError);
      
      // Fallback to manual email notification if SMS fails
      var subject = 'Silver Path Network - SMS FAILED, Manual Action Required: ' + firstName + ' ' + lastName;
      var body = '⚠️ AUTOMATED SMS FAILED - MANUAL ACTION REQUIRED\n\n';
      body += 'SMS Error: ' + smsError.message + '\n\n';
      body += '=== MANUAL TEXT MESSAGE TO SEND ===\n';
      body += 'Send this message to: ' + cleanPhone + '\n';
      body += 'Message: ' + smsMessage + '\n\n';
      body += '=== LEAD INFORMATION ===\n';
      body += 'Name: ' + firstName + ' ' + lastName + '\n';
      body += 'Email: ' + email + '\n';
      body += 'Phone: ' + cleanPhone + '\n';
      body += 'Verification Code: ' + code + '\n';
      body += 'Request Type: ' + (isResend ? 'Resend Code' : 'New Lead') + '\n';
      body += 'Timestamp: ' + new Date().toLocaleString() + '\n\n';
      body += '=== INSTRUCTIONS ===\n';
      body += '1. Text the above message to the lead at their phone number\n';
      body += '2. They will enter this code on the website to verify\n';
      body += '3. Once verified, their complete information will be added to the Lead Info sheet\n\n';
      body += 'Generated by Silver Path Network System (SMS Failed)';
      
      GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
      
      // Send Telegram alert about SMS failure
      sendTelegramMessage('⚠️ SMS FAILED - Manual Action Required!\n\n' +
        '👤 Name: ' + firstName + ' ' + lastName + '\n' +
        '📧 Email: ' + email + '\n' +
        '📞 Phone: ' + cleanPhone + '\n' +
        '🔐 Code: ' + code + '\n\n' +
        '❌ SMS Error: ' + smsError.message + '\n\n' +
        '📲 Please manually text:\n"' + smsMessage + '"');
      
      // Still continue with storing lead data for when they verify
    }
    
    // Store lead information temporarily for when verification completes
    var leadData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: cleanPhone.replace(/\D/g, ''), // Store without formatting
      verificationCode: code,
      timestamp: new Date().toISOString(),
      verified: false,
      smsAttempted: true,
      smsStatus: smsResult ? smsResult.status : 'failed'
    };
    
    // Store in PropertiesService using phone as key
    PropertiesService.getScriptProperties().setProperty('lead_' + leadData.phone, JSON.stringify(leadData));
    console.log('💾 Lead data stored for phone:', leadData.phone);
    
    return createFormResponse(true, 'Verification code sent successfully');
    
  } catch (error) {
    console.error('❌ Error handling SMS verification request:', error);
    return createFormResponse(false, 'Failed to send verification code: ' + error.message);
  }
}

/**
 * Handle SMS resend requests
 */
function handleSMSResendRequest(params) {
  try {
    console.log('🔄 Handling SMS resend request');
    params.resend = 'true';
    return handleSMSVerificationRequest(params);
  } catch (error) {
    console.error('❌ Error handling SMS resend request:', error);
    return createFormResponse(false, 'Failed to resend verification code: ' + error.message);
  }
}

/**
 * Handle contact form submission (unchanged)
 */
function handleContactFormSubmission(params) {
  try {
    console.log('📞 === CONTACT FORM SUBMISSION ===');
    console.log('Contact form parameters:', params);
    
    var firstName = params.firstName || '';
    var lastName = params.lastName || '';
    var email = params.email || '';
    var phone = params.phone || '';
    var age = params.age || 'Not specified';
    var coverage = params.coverage || 'Not specified';
    var subject = params.subject || 'General Inquiry';
    var message = params.message || 'No message provided';
    var smsConsent = params.smsConsent || 'No';
    var timestamp = params.timestamp || new Date().toISOString();
    var source = params.source || 'Contact Form';
    
    // Normalize phone number
    var cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
      cleanPhone = cleanPhone.substring(1);
    }
    
    // Create email to info@silverpathnetwork.com
    var emailSubject = 'Contact Form Submission: ' + subject + ' - ' + firstName + ' ' + lastName;
    var emailBody = 'New contact form submission received:\n\n';
    emailBody += '=== CONTACT INFORMATION ===\n';
    emailBody += 'Name: ' + firstName + ' ' + lastName + '\n';
    emailBody += 'Email: ' + email + '\n';
    emailBody += 'Phone: ' + phone + '\n';
    emailBody += 'Age Range: ' + age + '\n';
    emailBody += 'Desired Coverage: ' + coverage + '\n';
    emailBody += 'Subject: ' + subject + '\n';
    emailBody += 'SMS Consent: ' + smsConsent + '\n\n';
    emailBody += '=== MESSAGE ===\n';
    emailBody += message + '\n\n';
    emailBody += '=== SUBMISSION DETAILS ===\n';
    emailBody += 'Submitted: ' + new Date(timestamp).toLocaleString() + '\n';
    emailBody += 'Source: ' + source + '\n';
    emailBody += 'User Agent: ' + (params.userAgent || 'Not provided') + '\n';
    emailBody += 'Referrer: ' + (params.referrer || 'Direct') + '\n\n';
    emailBody += '---\n';
    emailBody += 'This inquiry was submitted through the Silver Path Network contact form.\n';
    emailBody += 'Please respond within 24 hours for optimal customer service.';
    
    // Send email to info@silverpathnetwork.com
    GmailApp.sendEmail(INFO_EMAIL, emailSubject, emailBody);
    console.log('✅ Contact form email sent to:', INFO_EMAIL);
    
    // Also send copy to admin
    GmailApp.sendEmail(ADMIN_EMAIL, '[COPY] ' + emailSubject, emailBody);
    console.log('✅ Copy sent to admin:', ADMIN_EMAIL);
    
    // Send Telegram notification
    var telegramMessage = '📞 Contact Form Submission!\n\n';
    telegramMessage += '👤 ' + firstName + ' ' + lastName + '\n';
    telegramMessage += '📧 ' + email + '\n';
    telegramMessage += '📱 ' + phone + '\n';
    telegramMessage += '🎂 Age: ' + age + '\n';
    telegramMessage += '💰 Coverage: ' + coverage + '\n';
    telegramMessage += '📝 Subject: ' + subject + '\n';
    telegramMessage += '📲 SMS Consent: ' + smsConsent + '\n\n';
    telegramMessage += '💬 Message: ' + (message.length > 100 ? message.substring(0, 100) + '...' : message);
    
    sendTelegramMessage(telegramMessage);
    console.log('✅ Telegram notification sent for contact form');
    
    // Store in Google Sheets
    try {
      var sheet = getOrCreateContactSheet();
      var rowData = [
        new Date(timestamp), // Timestamp
        firstName,
        lastName, 
        email,
        cleanPhone,
        age,
        coverage,
        subject,
        message,
        smsConsent,
        source,
        params.userAgent || '',
        params.referrer || ''
      ];
      
      sheet.appendRow(rowData);
      console.log('✅ Contact form data saved to Google Sheets');
      
    } catch (sheetError) {
      console.error('⚠️ Failed to save to sheets:', sheetError);
      // Continue execution - email is more important than sheet storage
    }
    
    return createFormResponse(true, 'Contact form submitted successfully');
    
  } catch (error) {
    console.error('❌ Error handling contact form:', error);
    return createFormResponse(false, 'Failed to submit contact form: ' + error.message);
  }
}

/**
 * Handle quiz data submission after verification succeeds (unchanged)
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
    var verificationCode = params.verificationCode;
    
    if (!phone) {
      console.log('❌ Missing phone number');
      return createFormResponse(false, 'Phone number required');
    }
    
    if (!quizAnswersJson) {
      console.log('❌ Missing quiz answers');
      return createFormResponse(false, 'Quiz answers required');
    }
    
    console.log('📞 Phone:', phone);
    console.log('📝 Quiz answers JSON:', quizAnswersJson);
    console.log('🔐 Verification code:', verificationCode);
    
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
        verificationCode: verificationCode || 'VERIFIED',
        timestamp: new Date().toISOString(),
        verified: true
      };
    }
    
    // Parse quiz answers
    var quizAnswers;
    try {
      quizAnswers = JSON.parse(quizAnswersJson);
      console.log('✅ Quiz answers parsed successfully');
    } catch (parseError) {
      console.error('❌ Failed to parse quiz answers:', parseError);
      return createFormResponse(false, 'Invalid quiz data format');
    }
    
    // Determine quiz type and sheet strategy
    var quizId = params.quizId || 'default';
    var targetSheet;
    var emailSubject;
    
    if (quizId === 'arizona-quiz' || (quizAnswers && quizAnswers.length === 20)) {
      targetSheet = 'Arizona Quiz Responses';
      emailSubject = 'Arizona Quiz Completed';
      console.log('📍 Detected Arizona quiz (20 questions)');
    } else {
      targetSheet = 'Silver Path Quiz Responses';
      emailSubject = 'Silver Path Quiz Completed';
      console.log('📍 Detected Silver Path quiz (default)');
    }
    
    // Save to Google Sheets
    try {
      var sheet = getOrCreateSheet(targetSheet);
      var timestamp = new Date();
      
      // Prepare row data
      var rowData = [
        timestamp,
        leadData.firstName,
        leadData.lastName,
        leadData.email,
        leadData.phone,
        leadData.verificationCode || verificationCode || 'VERIFIED'
      ];
      
      // Add quiz answers
      if (quizAnswers && Array.isArray(quizAnswers)) {
        for (var i = 0; i < quizAnswers.length; i++) {
          rowData.push(quizAnswers[i] || '');
        }
      }
      
      sheet.appendRow(rowData);
      console.log('✅ Data saved to sheet:', targetSheet);
      
    } catch (sheetError) {
      console.error('❌ Failed to save to Google Sheets:', sheetError);
      return createFormResponse(false, 'Failed to save quiz data: ' + sheetError.message);
    }
    
    // Send email notification to admin
    try {
      var subject = emailSubject + ' - ' + leadData.firstName + ' ' + leadData.lastName;
      var body = 'A new quiz has been completed!\n\n';
      body += '=== LEAD INFORMATION ===\n';
      body += 'Name: ' + leadData.firstName + ' ' + leadData.lastName + '\n';
      body += 'Email: ' + leadData.email + '\n';
      body += 'Phone: ' + leadData.phone + '\n';
      body += 'Verification Code: ' + (leadData.verificationCode || verificationCode || 'VERIFIED') + '\n';
      body += 'Quiz Type: ' + (quizId === 'arizona-quiz' ? 'Arizona Quiz (20 questions)' : 'Silver Path Quiz') + '\n';
      body += 'SMS Status: ' + (leadData.smsStatus || 'manual') + '\n';
      body += 'Completed: ' + new Date().toLocaleString() + '\n\n';
      body += '=== QUIZ ANSWERS ===\n';
      
      if (quizAnswers && Array.isArray(quizAnswers)) {
        for (var i = 0; i < quizAnswers.length; i++) {
          body += 'Question ' + (i + 1) + ': ' + (quizAnswers[i] || 'No answer') + '\n';
        }
      }
      
      body += '\n=== NEXT STEPS ===\n';
      body += '1. Review the quiz responses\n';
      body += '2. Contact the lead within 24 hours\n';
      body += '3. Provide personalized insurance recommendations\n\n';
      body += 'Data has been saved to: ' + targetSheet + '\n';
      body += 'Generated by Silver Path Network Automated System';
      
      GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
      console.log('✅ Email notification sent to admin');
      
    } catch (emailError) {
      console.error('⚠️ Failed to send email notification:', emailError);
      // Continue execution - sheet storage is more important
    }
    
    // Send Telegram notification
    try {
      var telegramMsg = '🎯 Quiz Completed!\n\n';
      telegramMsg += '👤 ' + leadData.firstName + ' ' + leadData.lastName + '\n';
      telegramMsg += '📧 ' + leadData.email + '\n';
      telegramMsg += '📱 ' + leadData.phone + '\n';
      telegramMsg += '📝 Quiz: ' + (quizId === 'arizona-quiz' ? 'Arizona (20Q)' : 'Silver Path') + '\n';
      telegramMsg += '🔐 Code: ' + (leadData.verificationCode || verificationCode || 'VERIFIED') + '\n';
      telegramMsg += '📲 SMS: ' + (leadData.smsStatus || 'manual') + '\n\n';
      telegramMsg += '💾 Saved to: ' + targetSheet;
      
      sendTelegramMessage(telegramMsg);
      console.log('✅ Telegram notification sent');
      
    } catch (telegramError) {
      console.error('⚠️ Failed to send Telegram notification:', telegramError);
      // Continue execution
    }
    
    // Clean up stored lead data
    try {
      PropertiesService.getScriptProperties().deleteProperty('lead_' + phone);
      console.log('🧹 Cleaned up stored lead data for:', phone);
    } catch (cleanupError) {
      console.error('⚠️ Failed to cleanup stored data:', cleanupError);
      // Not critical
    }
    
    return createFormResponse(true, 'Quiz data submitted successfully');
    
  } catch (error) {
    console.error('❌ Error in handleQuizDataSubmission:', error);
    return createFormResponse(false, 'Failed to submit quiz data: ' + error.message);
  }
}

/**
 * Get or create the contact forms sheet
 */
function getOrCreateContactSheet() {
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName(CONTACT_SHEET_NAME);
    
    if (!sheet) {
      console.log('📄 Creating new contact forms sheet');
      sheet = spreadsheet.insertSheet(CONTACT_SHEET_NAME);
      
      // Add headers
      var headers = [
        'Timestamp',
        'First Name', 
        'Last Name',
        'Email',
        'Phone',
        'Age Range',
        'Coverage Amount',
        'Subject',
        'Message',
        'SMS Consent',
        'Source',
        'User Agent',
        'Referrer'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
      
      console.log('✅ Contact forms sheet created with headers');
    }
    
    return sheet;
    
  } catch (error) {
    console.error('❌ Error getting/creating contact sheet:', error);
    throw error;
  }
}

/**
 * Get or create a sheet with the specified name
 */
function getOrCreateSheet(sheetName) {
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      console.log('📄 Creating new sheet:', sheetName);
      sheet = spreadsheet.insertSheet(sheetName);
      
      // Add headers based on sheet type
      var headers;
      if (sheetName === 'Arizona Quiz Responses') {
        headers = ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Verification Code'];
        // Add 20 question headers for Arizona quiz
        for (var i = 1; i <= 20; i++) {
          headers.push('Question ' + i);
        }
      } else {
        headers = ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Verification Code'];
        // Add 15 question headers for Silver Path quiz
        for (var i = 1; i <= 15; i++) {
          headers.push('Question ' + i);
        }
      }
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
      
      console.log('✅ Sheet created with headers:', sheetName);
    }
    
    return sheet;
    
  } catch (error) {
    console.error('❌ Error getting/creating sheet:', error);
    throw error;
  }
}

/**
 * Send Telegram message
 */
function sendTelegramMessage(message) {
  try {
    var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
    var payload = {
      'chat_id': TELEGRAM_CHAT_ID,
      'text': message,
      'parse_mode': 'HTML'
    };
    
    var options = {
      'method': 'POST',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload)
    };
    
    var response = UrlFetchApp.fetch(url, options);
    console.log('📱 Telegram API response:', response.getContentText());
    
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error);
    // Don't throw - Telegram failures shouldn't break the main flow
  }
}

/**
 * Create standardized form response
 */
function createFormResponse(success, message) {
  var response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}