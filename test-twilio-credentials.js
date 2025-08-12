/**
 * Test function to check Twilio credentials in Google Apps Script
 * Copy this function to your Google Apps Script and run it
 */

function testTwilioCredentials() {
  console.log('=== TESTING TWILIO CREDENTIALS ===');
  
  try {
    var properties = PropertiesService.getScriptProperties();
    var accountSid = properties.getProperty('TWILIO_ACCOUNT_SID');
    var authToken = properties.getProperty('TWILIO_AUTH_TOKEN');
    var phoneNumber = properties.getProperty('TWILIO_PHONE_NUMBER');
    
    console.log('TWILIO_ACCOUNT_SID found:', accountSid ? 'YES' : 'NO');
    console.log('TWILIO_AUTH_TOKEN found:', authToken ? 'YES' : 'NO');
    console.log('TWILIO_PHONE_NUMBER found:', phoneNumber ? 'YES' : 'NO');
    
    if (accountSid) {
      console.log('Account SID:', accountSid);
    }
    if (authToken) {
      console.log('Auth Token:', authToken.substring(0, 8) + '...');
    }
    if (phoneNumber) {
      console.log('Phone Number:', phoneNumber);
    }
    
    if (accountSid && authToken && phoneNumber) {
      console.log('✅ All Twilio credentials are configured correctly!');
      
      // Test SMS sending
      console.log('Testing SMS send to 9288462608...');
      var testResult = sendTwilioSMS('+19288462608', 'Test SMS from Silver Path Network - Credentials are working!');
      console.log('SMS test result:', testResult);
      
    } else {
      console.log('❌ Some Twilio credentials are missing');
    }
    
  } catch (error) {
    console.error('❌ Error testing credentials:', error);
  }
}

function sendTwilioSMS(phoneNumber, message) {
  try {
    var properties = PropertiesService.getScriptProperties();
    var accountSid = properties.getProperty('TWILIO_ACCOUNT_SID');
    var authToken = properties.getProperty('TWILIO_AUTH_TOKEN');
    var fromPhone = properties.getProperty('TWILIO_PHONE_NUMBER');
    
    if (!accountSid || !authToken || !fromPhone) {
      throw new Error('Twilio credentials not configured');
    }
    
    var url = 'https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json';
    
    var payload = {
      'From': fromPhone,
      'To': phoneNumber,
      'Body': message
    };
    
    var options = {
      'method': 'POST',
      'headers': {
        'Authorization': 'Basic ' + Utilities.base64Encode(accountSid + ':' + authToken)
      },
      'payload': payload
    };
    
    var response = UrlFetchApp.fetch(url, options);
    var responseData = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() === 201) {
      return { success: true, sid: responseData.sid };
    } else {
      throw new Error('Twilio API error: ' + responseData.message);
    }
    
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, error: error.message };
  }
}