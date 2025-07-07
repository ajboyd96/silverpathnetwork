// Debug script to test email and Telegram functionality
// Add this to your Google Apps Script project to test individual components

// Test email sending
function testEmailSending() {
  try {
    console.log('Testing email sending...');
    
    var subject = 'Test Email from Silver Path Network';
    var body = 'This is a test email to verify Gmail functionality.\n\n';
    body += 'If you receive this, email sending is working properly.\n';
    body += 'Timestamp: ' + new Date().toLocaleString();
    
    GmailApp.sendEmail('ajboyd96@gmail.com', subject, body);
    console.log('Test email sent successfully');
    return 'Email sent successfully';
    
  } catch (error) {
    console.error('Email test failed:', error);
    return 'Email failed: ' + error.message;
  }
}

// Test Telegram sending
function testTelegramSending() {
  try {
    console.log('Testing Telegram sending...');
    
    var TELEGRAM_BOT_TOKEN = '8037279353:AAHpV-yEVV3uWMPmfVuq_dKY3d1h_RBmUwA';
    var TELEGRAM_CHAT_ID = '7463862813';
    
    var message = 'Test message from Silver Path Network\n\n';
    message += 'This is a test to verify Telegram functionality.\n';
    message += 'Timestamp: ' + new Date().toLocaleString();
    
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
      console.log('Telegram test message sent successfully');
      return 'Telegram sent successfully';
    } else {
      console.error('Telegram API error:', responseData.description);
      return 'Telegram failed: ' + responseData.description;
    }
    
  } catch (error) {
    console.error('Telegram test failed:', error);
    return 'Telegram failed: ' + error.message;
  }
}

// Test both email and Telegram
function testBothNotifications() {
  console.log('=== TESTING NOTIFICATIONS ===');
  
  var emailResult = testEmailSending();
  console.log('Email result:', emailResult);
  
  var telegramResult = testTelegramSending();
  console.log('Telegram result:', telegramResult);
  
  return {
    email: emailResult,
    telegram: telegramResult
  };
}

// Test verification flow simulation
function testVerificationFlow() {
  try {
    console.log('=== TESTING VERIFICATION FLOW ===');
    
    var testParams = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '5551234567',
      verificationCode: '123456',
      quizId: 'test-quiz'
    };
    
    console.log('Test parameters:', testParams);
    
    var firstName = testParams.firstName;
    var lastName = testParams.lastName;
    var email = testParams.email;
    var phone = testParams.phone;
    var verificationCode = testParams.verificationCode;
    var quizId = testParams.quizId || 'standard-quiz';
    
    var quizType = quizId === 'arizona-final-expense-quiz-2' ? 'Arizona Quiz' : 'Standard Quiz';
    var code = verificationCode || Math.floor(100000 + Math.random() * 900000).toString();
    
    var cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
      cleanPhone = cleanPhone.substring(1);
    }
    
    console.log('Processing verification for:', firstName, lastName);
    console.log('Quiz type:', quizType);
    console.log('Code:', code);
    console.log('Clean phone:', cleanPhone);
    
    var subject = 'Silver Path Network - ' + quizType + ' - New Lead: ' + firstName + ' ' + lastName;
    var body = 'New lead verification request:\n\n';
    body += '=== TEXT MESSAGE TO SEND ===\n';
    body += 'Hi ' + firstName + ', Thank you for choosing Silver Path Network. Your code is ' + code + '\n\n';
    body += '=== LEAD INFORMATION ===\n';
    body += 'Name: ' + firstName + ' ' + lastName + '\n';
    body += 'Email: ' + email + '\n';
    body += 'Phone: ' + cleanPhone + '\n';
    body += 'Quiz Type: ' + quizType + '\n';
    body += 'Verification Code: ' + code + '\n';
    
    GmailApp.sendEmail('ajboyd96@gmail.com', subject, body);
    console.log('Test verification email sent');
    
    var telegramMessage = 'New ' + quizType + ' Lead Alert!\n\n' +
      'Name: ' + firstName + ' ' + lastName + '\n' +
      'Email: ' + email + '\n' +
      'Phone: ' + cleanPhone + '\n' +
      'Code: ' + code + '\n' +
      'Quiz: ' + quizType + '\n\n' +
      'Text this to lead:\n' +
      'Hi ' + firstName + ', Thank you for choosing Silver Path Network. Your code is ' + code;
    
    var TELEGRAM_BOT_TOKEN = '8037279353:AAHpV-yEVV3uWMPmfVuq_dKY3d1h_RBmUwA';
    var TELEGRAM_CHAT_ID = '7463862813';
    
    var telegramUrl = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
    
    var payload = {
      'chat_id': TELEGRAM_CHAT_ID,
      'text': telegramMessage,
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
      console.log('Test verification Telegram sent');
    } else {
      console.error('Telegram API error:', responseData.description);
    }
    
    return 'Verification flow test completed - check logs for details';
    
  } catch (error) {
    console.error('Verification flow test failed:', error);
    return 'Verification flow test failed: ' + error.message;
  }
}