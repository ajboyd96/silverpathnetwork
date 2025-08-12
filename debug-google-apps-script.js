/**
 * DEBUG VERSION - Copy this doGet function to your Google Apps Script 
 * This will help us see exactly what parameters are being received
 */

function doGet(e) {
  try {
    console.log('=== DEBUG - RECEIVED GET REQUEST ===');
    console.log('Full event object:', JSON.stringify(e, null, 2));
    console.log('Request parameters:', e.parameter);
    
    var params = e.parameter;
    
    // Debug each parameter individually
    console.log('firstName:', params.firstName, 'Type:', typeof params.firstName, 'Truthy:', !!params.firstName);
    console.log('lastName:', params.lastName, 'Type:', typeof params.lastName, 'Truthy:', !!params.lastName);
    console.log('email:', params.email, 'Type:', typeof params.email, 'Truthy:', !!params.email);
    console.log('phone:', params.phone, 'Type:', typeof params.phone, 'Truthy:', !!params.phone);
    console.log('verificationCode:', params.verificationCode);
    console.log('quizId:', params.quizId);
    console.log('resend:', params.resend);
    
    // Debug the condition
    var condition = params.firstName && params.lastName && params.email && params.phone;
    console.log('Condition result (firstName && lastName && email && phone):', condition);
    
    // Handle verification code sending request via GET (from assessment forms)
    if (params.firstName && params.lastName && params.email && params.phone) {
      console.log('✅ CONDITION MET - Processing SMS verification request');
      
      // For now, just return a success message so we know the condition works
      return ContentService
        .createTextOutput('DEBUG: Verification request received and condition met! Parameters: ' + JSON.stringify(params))
        .setMimeType(ContentService.MimeType.TEXT);
        
    } else {
      console.log('❌ CONDITION NOT MET - Returning default message');
      console.log('Missing parameters:');
      if (!params.firstName) console.log('- firstName is missing or falsy');
      if (!params.lastName) console.log('- lastName is missing or falsy');  
      if (!params.email) console.log('- email is missing or falsy');
      if (!params.phone) console.log('- phone is missing or falsy');
    }
    
    // Handle resend requests via GET
    if (params.resend === 'true') {
      console.log('🔄 RESEND REQUEST DETECTED');
      return ContentService
        .createTextOutput('DEBUG: Resend request received!')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    // Default response for simple API checks
    return ContentService
      .createTextOutput('DEBUG: Silver Path Network API running - No conditions met. Params received: ' + JSON.stringify(params))
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    console.error('❌ Error in doGet:', error);
    return ContentService
      .createTextOutput('DEBUG ERROR: ' + error.message + ' - Stack: ' + error.stack)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}