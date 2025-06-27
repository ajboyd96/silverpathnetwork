function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    
    if (action === 'send_verification') {
      return sendVerificationCode(data);
    } else if (action === 'verify_code') {
      return verifyCode(data);
    } else if (action === 'submit_lead') {
      return submitLead(data);
    } else {
      return createResponse(false, 'Invalid action');
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return createResponse(false, 'Server error occurred');
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Silver Path Network SMS Verification API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

function sendVerificationCode(data) {
  try {
    var SPREADSHEET_ID = '1MZYgrMksEKzKksiXYf7B2dNnrzu9prScwbCZ0TWmIxc';
    var ADMIN_EMAIL = 'ajboyd96@gmail.com';
    
    var firstName = data.firstName;
    var lastName = data.lastName;
    var email = data.email;
    var phone = data.phone;
    
    if (!firstName || !lastName || !email || !phone) {
      return createResponse(false, 'All fields are required');
    }
    
    var verificationCode = getVerificationCodeForLead(phone);
    if (!verificationCode) {
      return createResponse(false, 'No verification codes available');
    }
    
    var sessionId = Utilities.getUuid();
    var verificationData = {
      code: verificationCode,
      firstName: firstName,
      lastName: lastName, 
      email: email,
      phone: phone,
      timestamp: new Date(),
      attempts: 0,
      maxAttempts: 3,
      expires: new Date(Date.now() + 5 * 60 * 1000)
    };
    
    PropertiesService.getScriptProperties().setProperty(
      sessionId, 
      JSON.stringify(verificationData)
    );
    
    var subject = 'Silver Path Network - New Lead: ' + firstName + ' ' + lastName;
    var body = 'New lead verification request:\n\n';
    body += 'Name: ' + firstName + ' ' + lastName + '\n';
    body += 'Email: ' + email + '\n';
    body += 'Phone: ' + phone + '\n';
    body += 'Verification Code: ' + verificationCode + '\n';
    body += 'Code expires in 5 minutes\n\n';
    body += 'The lead needs to enter this code to complete verification.';
    
    GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
    
    return createResponse(true, 'Verification code sent successfully', { sessionId: sessionId });
    
  } catch (error) {
    console.error('Error sending verification code:', error);
    return createResponse(false, 'Failed to send verification code');
  }
}

function verifyCode(data) {
  try {
    var sessionId = data.sessionId;
    var code = data.code;
    
    if (!sessionId || !code) {
      return createResponse(false, 'Session ID and code are required');
    }
    
    var verificationJson = PropertiesService.getScriptProperties().getProperty(sessionId);
    if (!verificationJson) {
      return createResponse(false, 'Invalid or expired verification session');
    }
    
    var verificationData = JSON.parse(verificationJson);
    
    if (new Date() > new Date(verificationData.expires)) {
      PropertiesService.getScriptProperties().deleteProperty(sessionId);
      return createResponse(false, 'Verification code has expired');
    }
    
    if (verificationData.attempts >= verificationData.maxAttempts) {
      PropertiesService.getScriptProperties().deleteProperty(sessionId);
      return createResponse(false, 'Too many verification attempts');
    }
    
    if (code.toString() !== verificationData.code.toString()) {
      verificationData.attempts++;
      PropertiesService.getScriptProperties().setProperty(
        sessionId, 
        JSON.stringify(verificationData)
      );
      
      var remainingAttempts = verificationData.maxAttempts - verificationData.attempts;
      return createResponse(false, 'Invalid code. ' + remainingAttempts + ' attempts remaining');
    }
    
    verificationData.verified = true;
    PropertiesService.getScriptProperties().setProperty(
      sessionId, 
      JSON.stringify(verificationData)
    );
    
    return createResponse(true, 'Code verified successfully', { 
      sessionId: sessionId,
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

function submitLead(data) {
  try {
    var sessionId = data.sessionId;
    var assessmentData = data.assessmentData;
    
    if (!sessionId) {
      return createResponse(false, 'Session ID is required');
    }
    
    var verificationJson = PropertiesService.getScriptProperties().getProperty(sessionId);
    if (!verificationJson) {
      return createResponse(false, 'Invalid verification session');
    }
    
    var verificationData = JSON.parse(verificationJson);
    
    if (!verificationData.verified) {
      return createResponse(false, 'Phone number not verified');
    }
    
    var leadId = addLeadToSheet(verificationData, assessmentData);
    
    PropertiesService.getScriptProperties().deleteProperty(sessionId);
    
    return createResponse(true, 'Lead submitted successfully', { leadId: leadId });
    
  } catch (error) {
    console.error('Error submitting lead:', error);
    return createResponse(false, 'Failed to submit lead');
  }
}

function getVerificationCodeForLead(phone) {
  try {
    var SPREADSHEET_ID = '1MZYgrMksEKzKksiXYf7B2dNnrzu9prScwbCZ0TWmIxc';
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Sheet1');
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      var assignedPhone = data[i][3];
      if (assignedPhone === phone) {
        var code = data[i][1];
        return code.toString();
      }
    }
    
    var availableCodes = [];
    for (var i = 1; i < data.length; i++) {
      var code = data[i][1];
      var assignedPhone = data[i][3];
      
      if (code && !assignedPhone) {
        availableCodes.push({
          code: code,
          rowIndex: i + 1
        });
      }
    }
    
    if (availableCodes.length === 0) {
      for (var i = 1; i < data.length; i++) {
        sheet.getRange(i + 1, 4).setValue('');
        sheet.getRange(i + 1, 5).setValue('');
      }
      
      for (var i = 1; i < data.length; i++) {
        var code = data[i][1];
        if (code) {
          availableCodes.push({
            code: code,
            rowIndex: i + 1
          });
        }
      }
    }
    
    if (availableCodes.length === 0) {
      return null;
    }
    
    var randomIndex = Math.floor(Math.random() * availableCodes.length);
    var selectedCode = availableCodes[randomIndex];
    
    sheet.getRange(selectedCode.rowIndex, 4).setValue(phone);
    sheet.getRange(selectedCode.rowIndex, 5).setValue(new Date());
    
    return selectedCode.code.toString();
    
  } catch (error) {
    console.error('Error getting verification code:', error);
    return null;
  }
}

function addLeadToSheet(verificationData, assessmentData) {
  try {
    var SPREADSHEET_ID = '1MZYgrMksEKzKksiXYf7B2dNnrzu9prScwbCZ0TWmIxc';
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var leadSheet = spreadsheet.getSheetByName('Lead Info');
    
    if (!leadSheet) {
      leadSheet = spreadsheet.insertSheet('Lead Info');
      var headers = [
        'Lead ID', 'Timestamp', 'First Name', 'Last Name', 'Email', 'Phone',
        'Verification Code Used', 'Status'
      ];
      leadSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    var leadId = 'SP' + Date.now();
    var rowData = [
      leadId,
      new Date(),
      verificationData.firstName,
      verificationData.lastName,
      verificationData.email,
      verificationData.phone,
      verificationData.code,
      'New Lead'
    ];
    
    leadSheet.appendRow(rowData);
    
    return leadId;
    
  } catch (error) {
    console.error('Error adding lead to sheet:', error);
    throw error;
  }
}

function createResponse(success, message, data) {
  var response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    for (var key in data) {
      response[key] = data[key];
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}