// Complete Google Apps Script for Silver Path Network Quiz System
// Handles both Quiz 1 (6 questions) and Quiz 2 (Arizona - 20 questions)
// Includes SMS verification, email notifications, and separate Google Sheets

function doPost(e) {
  try {
    const data = e.parameter;
    console.log('Received data:', data);
    
    // Handle quiz lead submission (after verification)
    if (data.action === 'submit_lead') {
      handleQuizSubmission(data);
      return ContentService.createTextOutput(JSON.stringify({success: true, message: 'Lead submitted successfully'}));
    }
    
    // Handle SMS verification code sending
    if (data.verificationCode && data.firstName && data.lastName && data.email && data.phone) {
      sendVerificationNotifications(data);
      return ContentService.createTextOutput(JSON.stringify({success: true, message: 'Verification code sent'}));
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: false, message: 'Invalid request'}));
    
  } catch (error) {
    console.log('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}));
  }
}

function sendVerificationNotifications(data) {
  try {
    const quizType = data.quizId === 'arizona-final-expense-quiz-2' ? 'Arizona Quiz' : 'Standard Quiz';
    
    // Send Email with verification code
    const emailSubject = `${quizType} Verification Code - ${data.verificationCode}`;
    const emailBody = `
Hello ${data.firstName} ${data.lastName},

Your verification code for the Silver Path Network ${quizType} is: ${data.verificationCode}

Please enter this code on the website to complete your assessment.

Contact Information:
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Phone: ${data.phone}
- Quiz Type: ${quizType}

Best regards,
Silver Path Network Team
Phone: (833) 738-2671
    `;
    
    // Send email to admin
    MailApp.sendEmail({
      to: 'info@silverpathnetwork.com',
      subject: emailSubject,
      body: emailBody
    });
    
    // Send Telegram notification
    sendTelegramNotification(data, quizType);
    
    console.log('Verification notifications sent for:', data.firstName, data.lastName);
    
  } catch (error) {
    console.log('Error sending verification notifications:', error);
    throw error;
  }
}

function sendTelegramNotification(data, quizType) {
  try {
    // Replace with your actual Telegram bot token and chat ID
    const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
    const TELEGRAM_CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID';
    
    const message = `🔍 New ${quizType} Verification Request

👤 Name: ${data.firstName} ${data.lastName}
📧 Email: ${data.email}
📞 Phone: ${data.phone}
🔢 Code: ${data.verificationCode}
📝 Quiz: ${quizType}

⏰ ${new Date().toLocaleString()}`;
    
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(telegramUrl, options);
    console.log('Telegram response:', response.getContentText());
    
  } catch (error) {
    console.log('Error sending Telegram notification:', error);
    // Don't throw error - email is more important than Telegram
  }
}

function handleQuizSubmission(data) {
  try {
    const quizId = data.quizId || 'default';
    console.log('Processing quiz submission for:', quizId);
    
    // Determine which sheet to use
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
    } catch (e) {
      console.log('Error parsing quiz answers:', e);
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
        'Yes', // Verified (completed SMS verification)
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
    console.log('Data added to sheet:', sheetName);
    
    // Send completion notification
    sendCompletionNotification(data, quizId);
    
  } catch (error) {
    console.log('Error handling quiz submission:', error);
    throw error;
  }
}

function getOrCreateSheet(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      console.log('Creating new sheet:', sheetName);
      sheet = spreadsheet.insertSheet(sheetName);
      
      // Add headers based on sheet type
      if (sheetName === "Arizona Quiz Responses") {
        const headers = [
          "Timestamp", "First Name", "Last Name", "Email", "Phone", "Verified",
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
        headerRange.setBackground('#1B365D');
        headerRange.setFontColor('white');
        headerRange.setFontWeight('bold');
        
      } else {
        // Original quiz headers
        const headers = [
          "Timestamp", "First Name", "Last Name", "Email", "Phone", "Verified",
          "Q1: Age Range", "Q2: Tobacco Use", "Q3: Coverage Amount", 
          "Q4: Primary Goal", "Q5: Health Status", "Q6: Coverage Start"
        ];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        
        // Format headers
        const headerRange = sheet.getRange(1, 1, 1, headers.length);
        headerRange.setBackground('#1B365D');
        headerRange.setFontColor('white');
        headerRange.setFontWeight('bold');
      }
      
      // Auto-resize columns
      sheet.autoResizeColumns(1, sheet.getLastColumn());
    }
    
    return sheet;
    
  } catch (error) {
    console.log('Error creating/getting sheet:', error);
    throw error;
  }
}

function sendCompletionNotification(data, quizId) {
  try {
    const quizType = quizId === 'arizona-final-expense-quiz-2' ? 'Arizona Quiz' : 'Standard Quiz';
    
    const emailSubject = `✅ ${quizType} Completed - ${data.firstName} ${data.lastName}`;
    const emailBody = `
QUIZ COMPLETED SUCCESSFULLY!

Customer Information:
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Phone: ${data.phone}
- Quiz Type: ${quizType}
- Verification: Completed
- Timestamp: ${new Date().toLocaleString()}

Next Steps:
1. Contact customer within 24 hours
2. Provide personalized quote
3. Answer any questions about coverage

Customer phone: ${data.phone}
Call now: (833) 738-2671

Silver Path Network Team
    `;
    
    // Send email notification
    MailApp.sendEmail({
      to: 'info@silverpathnetwork.com',
      subject: emailSubject,
      body: emailBody
    });
    
    console.log('Completion notification sent for:', data.firstName, data.lastName);
    
  } catch (error) {
    console.log('Error sending completion notification:', error);
    // Don't throw - this is non-critical
  }
}

// Test function to verify script is working
function testScript() {
  console.log('Google Apps Script is working correctly!');
  console.log('Timestamp:', new Date().toLocaleString());
  
  // Test sheet creation
  try {
    const testSheet = getOrCreateSheet('Test Sheet');
    console.log('Test sheet created/accessed successfully');
    return 'Script test passed!';
  } catch (error) {
    console.log('Test failed:', error);
    return 'Script test failed: ' + error.toString();
  }
}

// Function to get current script URL (for debugging)
function getScriptUrl() {
  const scriptId = ScriptApp.getScriptId();
  const url = `https://script.google.com/macros/s/${scriptId}/exec`;
  console.log('Script URL:', url);
  return url;
}