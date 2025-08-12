/**
 * Debug Test Script for Silver Path Network
 * Use this to test the Google Apps Script functionality
 */

function testSystemConnectivity() {
  console.log('=== TESTING SYSTEM CONNECTIVITY ===');
  
  // Test 1: Basic function execution
  console.log('✅ Script is running');
  
  // Test 2: Spreadsheet access
  try {
    var spreadsheet = SpreadsheetApp.openById('1MZYgrMksEKzKksiXYf7B2dNnrzu9prScwbCZ0TWmIxc');
    console.log('✅ Spreadsheet access successful');
    console.log('Spreadsheet name:', spreadsheet.getName());
  } catch (error) {
    console.error('❌ Spreadsheet access failed:', error);
  }
  
  // Test 3: Email sending capability
  try {
    GmailApp.sendEmail('ajboyd96@gmail.com', 'Test Email from Apps Script', 'This is a test email to verify Gmail integration is working.');
    console.log('✅ Email sending successful');
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
  
  // Test 4: Telegram sending capability
  try {
    sendTelegramMessage('🧪 Test message from Silver Path Network Apps Script');
    console.log('✅ Telegram test sent');
  } catch (error) {
    console.error('❌ Telegram sending failed:', error);
  }
  
  // Test 5: Properties access
  try {
    var properties = PropertiesService.getScriptProperties();
    var twilioSid = properties.getProperty('TWILIO_ACCOUNT_SID');
    var twilioToken = properties.getProperty('TWILIO_AUTH_TOKEN');
    var twilioPhone = properties.getProperty('TWILIO_PHONE_NUMBER');
    
    console.log('Twilio SID found:', twilioSid ? 'YES' : 'NO');
    console.log('Twilio Token found:', twilioToken ? 'YES' : 'NO');
    console.log('Twilio Phone found:', twilioPhone ? 'YES' : 'NO');
    
    if (twilioSid && twilioToken && twilioPhone) {
      console.log('✅ All Twilio credentials are configured');
    } else {
      console.log('⚠️ Some Twilio credentials are missing');
    }
  } catch (error) {
    console.error('❌ Properties access failed:', error);
  }
  
  console.log('=== TEST COMPLETE ===');
}

function testFormSubmission() {
  console.log('=== TESTING FORM SUBMISSION SIMULATION ===');
  
  var testParams = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '9288462608'
  };
  
  try {
    var result = handleSMSVerificationRequest(testParams);
    console.log('Form submission result:', result);
  } catch (error) {
    console.error('❌ Form submission test failed:', error);
  }
}

function sendTelegramMessage(message) {
  try {
    var TELEGRAM_BOT_TOKEN = '8037279353:AAHpV-yEVV3uWMPmfVuq_dKY3d1h_RBmUwA';
    var TELEGRAM_CHAT_ID = '7463862813';
    
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
    throw error;
  }
}