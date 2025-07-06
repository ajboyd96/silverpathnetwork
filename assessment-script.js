// Original quiz data with images and simple text options
const assessmentData = [
    {
        question: "What's your age range?",
        image: "silverpath website photos/image1.png",
        options: [
            "50-60 years old",
            "61-70 years old", 
            "71-80 years old",
            "Over 80 years old"
        ]
    },
    {
        question: "Do you currently use tobacco products?",
        image: "silverpath website photos/image2.png",
        options: [
            "No, I don't smoke",
            "Yes, I smoke occasionally",
            "Yes, I smoke regularly",
            "I quit in the last 2 years"
        ]
    },
    {
        question: "What coverage amount interests you most?",
        image: "silverpath website photos/image3.png",
        options: [
            "$5,000 - $10,000",
            "$10,000 - $25,000",
            "$25,000 - $50,000",
            "More than $50,000"
        ]
    },
    {
        question: "What's your primary goal for this insurance?",
        image: "silverpath website photos/fatherdaughter.png",
        options: [
            "Cover funeral and burial costs",
            "Pay off existing debts",
            "Leave money for my family",
            "All of the above"
        ]
    },
    {
        question: "How would you describe your overall health?",
        image: "silverpath website photos/garden.png",
        options: [
            "Excellent health",
            "Good health with minor issues",
            "Fair health with some conditions",
            "Poor health with major conditions"
        ]
    },
    {
        question: "When would you like coverage to start?",
        image: "silverpath website photos/carwave.png",
        options: [
            "As soon as possible",
            "Within the next month",
            "Within the next 3 months",
            "Just exploring options"
        ]
    }
];

let currentQuestionIndex = 0;
let assessmentAnswers = {};

// Start the assessment function
function startAssessment() {
    // Hide intro section
    document.getElementById('introSection').style.display = 'none';
    
    // Show quiz sections
    document.getElementById('progressSection').style.display = 'block';
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('navigationSection').style.display = 'block';
    
    // Start with first question
    currentQuestionIndex = 0;
    displayQuestion();
    
    // Scroll to quiz
    document.getElementById('progressSection').scrollIntoView({ behavior: 'smooth' });
}

// Initialize the assessment
document.addEventListener('DOMContentLoaded', function() {
    // Start the assessment
    displayQuestion();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

function displayQuestion() {
    const question = assessmentData[currentQuestionIndex];
    const questionImage = document.getElementById('questionImage');
    const questionContent = document.getElementById('questionContent');
    const questionOptions = document.getElementById('questionOptions');
    const questionNumber = document.getElementById('questionNumber');
    const progressFill = document.getElementById('progressFill');
    
    // Update question number
    if (questionNumber) questionNumber.textContent = currentQuestionIndex + 1;
    
    // Update progress bar
    if (progressFill) {
        const progressPercentage = ((currentQuestionIndex + 1) / assessmentData.length) * 100;
        progressFill.style.width = progressPercentage + '%';
    }
    
    // Display question image
    if (questionImage) {
        questionImage.innerHTML = `<img src="${question.image}" alt="Question ${currentQuestionIndex + 1}">`;
    }
    
    // Display question text
    if (questionContent) {
        questionContent.innerHTML = `<h2>${question.question}</h2>`;
    }
    
    // Display options (simple text, no icons)
    if (questionOptions) {
        const optionsHTML = question.options.map((option, index) => `
            <div class="option" onclick="selectOption(${index}, \`${option.replace(/`/g, '\\`')}\`)">
                ${option}
            </div>
        `).join('');
        
        questionOptions.innerHTML = optionsHTML;
    }
    
    // Update navigation buttons
    updateNavigationButtons();
}

function updateStepIndicators() {
    // Step indicators don't exist in current HTML, so this function does nothing
    // Keeping it here in case step indicators are added later
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Show/hide previous button
    prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    
    // Update next button
    nextBtn.textContent = currentQuestionIndex === assessmentData.length - 1 ? 'Get My Quote →' : 'Next →';
    nextBtn.disabled = !assessmentAnswers[currentQuestionIndex];
    nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
}

function selectOption(index, value) {
    // Remove previous selections
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked option
    const options = document.querySelectorAll('.option');
    if (options[index]) {
        options[index].classList.add('selected');
    }
    
    // Store answer (value is the text since options are simple strings)
    assessmentAnswers[currentQuestionIndex] = {
        question: assessmentData[currentQuestionIndex].question,
        answer: value,
        answerText: value
    };
    
    console.log('✅ Stored answer for question', currentQuestionIndex + 1, ':', value);
    console.log('📊 Current assessment answers:', assessmentAnswers);
    
    // Update navigation buttons
    updateNavigationButtons();
}

function nextQuestion() {
    if (!assessmentAnswers[currentQuestionIndex]) {
        showMessage('Please select an answer before continuing.', 'error');
        return;
    }
    
    if (currentQuestionIndex < assessmentData.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        // Assessment completed, calculate estimate and show lead form
        showLeadForm();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function calculatePremiumEstimate() {
    let basePremium = 35;
    
    // Age factor
    const age = assessmentAnswers[0]?.answer;
    switch(age) {
        case 'under-50': basePremium = 20; break;
        case '50-60': basePremium = 30; break;
        case '61-70': basePremium = 45; break;
        case '71-80': basePremium = 65; break;
        case 'over-80': basePremium = 95; break;
    }
    
    // Gender factor
    const gender = assessmentAnswers[1]?.answer;
    if (gender === 'male') {
        basePremium *= 1.15; // Males typically pay slightly more
    }
    
    // Tobacco factor
    const tobacco = assessmentAnswers[2]?.answer;
    if (tobacco === 'current-smoker') {
        basePremium *= 1.8;
    } else if (tobacco === 'recent-quit') {
        basePremium *= 1.3;
    }
    
    // Coverage amount factor
    const coverage = assessmentAnswers[3]?.answer;
    switch(coverage) {
        case '5k-10k': basePremium *= 0.7; break;
        case '10k-25k': basePremium *= 1.0; break;
        case '25k-50k': basePremium *= 1.8; break;
        case '50k-plus': basePremium *= 2.5; break;
    }
    
    // Health factor
    const health = assessmentAnswers[5]?.answer;
    switch(health) {
        case 'excellent': basePremium *= 0.9; break;
        case 'good': basePremium *= 1.0; break;
        case 'fair': basePremium *= 1.3; break;
        case 'poor': basePremium *= 1.7; break;
    }
    
    // Previous decline factor
    const declined = assessmentAnswers[4]?.answer;
    if (declined === 'declined') {
        basePremium *= 1.4;
    }
    
    return Math.round(basePremium);
}

function showLeadForm() {
    // Hide quiz sections
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('navigationSection').style.display = 'none';
    
    // Calculate and display premium estimate
    const estimatedPremium = calculatePremiumEstimate();
    
    // Show results container with "Get Your Quote" button
    showResults(estimatedPremium);
}

function showResults(estimatedPremium) {
    // Update results container content
    document.getElementById('resultsContainer').innerHTML = `
        <h2>🎉 Great News!</h2>
        <div class="results-image">
            <img src="silverpath website photos/happycouplewhite.png" alt="Happy couple celebrating their coverage" style="max-width: 300px; border-radius: 15px;">
        </div>
        
        <p style="font-size: 20px; color: #666; margin-bottom: 30px;">
            You qualify for final expense coverage!
        </p>
        
        <div class="premium-estimate" style="background: #f8f9fa; padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center;">
            <h3 style="color: #1B365D; margin-bottom: 15px;">Your Estimated Monthly Premium</h3>
            <div id="premiumAmount" style="font-size: 48px; font-weight: bold; color: #28a745; margin-bottom: 15px;">$${estimatedPremium}</div>
            <p style="color: #666; margin: 0;">Based on your assessment answers</p>
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
            <button onclick="showContactForm()" class="quiz-btn" style="font-size: 20px; padding: 20px 40px; background: #1B365D;">
                Get Your Personalized Quote →
            </button>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>Next Step:</strong> Complete your contact information to receive your free, personalized quote from a licensed insurance professional.
            </p>
        </div>
    `;
    
    // Show results container
    document.getElementById('resultsContainer').style.display = 'block';
    
    // Scroll to results
    document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth' });
}

function showContactForm() {
    // Hide results container and navigation
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('navigationSection').style.display = 'none';
    
    // Show contact form container
    const contactFormContainer = document.getElementById('contactFormContainer');
    contactFormContainer.style.display = 'block';
    contactFormContainer.classList.add('visible');
    
    // Add navigation buttons below the phone number
    addNavigationToContactForm();
    
    // Add event listeners for enhanced form validation
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('input', validateContactFormButtons);
        input.addEventListener('blur', validateContactFormButtons);
    });
    
    // Initialize field-specific validation
    validateEmailField();
    validatePhoneField();
    
    // Scroll to contact form
    contactFormContainer.scrollIntoView({ behavior: 'smooth' });
}

function addNavigationToContactForm() {
    // Check if navigation already exists
    if (document.getElementById('contactNextBtn')) return;
    
    // Find the form
    const form = document.getElementById('contactForm');
    
    // Create navigation container
    const navContainer = document.createElement('div');
    navContainer.className = 'contact-form-nav';
    navContainer.innerHTML = `
        <div class="question-nav" style="display: flex; justify-content: space-between; align-items: center; margin-top: 30px;">
            <button type="button" id="contactPrevBtn" class="quiz-btn secondary" onclick="goBackToResults()" style="font-size: 16px; padding: 12px 24px;">
                ← Previous
            </button>
            <button type="button" id="contactNextBtn" class="quiz-btn" onclick="sendVerificationCode()" disabled style="font-size: 16px; padding: 12px 24px;">
                Send Verification Code →
            </button>
        </div>
    `;
    
    // Append to form
    form.appendChild(navContainer);
}

function goBackToResults() {
    // Hide contact form
    document.getElementById('contactFormContainer').style.display = 'none';
    document.getElementById('contactFormContainer').classList.remove('visible');
    
    // Show results
    document.getElementById('resultsContainer').style.display = 'block';
    document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth' });
}

// Verification flow variables
let currentVerificationData = null;
let currentVerificationCode = null; // Store code locally for simple verification

// Phone number normalization function
function normalizePhoneNumber(phone) {
    // Remove all non-digits
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Handle 11-digit numbers (remove leading 1 if present)
    if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
        cleanPhone = cleanPhone.substring(1);
    }
    
    return cleanPhone;
}

// Enhanced contact form validation with detailed feedback
function validateContactFormButtons() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    const nextBtn = document.getElementById('contactNextBtn');
    
    // Clear previous validation messages
    clearValidationErrors();
    
    let isValid = true;
    const errors = [];
    
    // Validate first name
    if (!firstName) {
        showFieldError('firstName', 'First name is required');
        errors.push('First name required');
        isValid = false;
    } else if (firstName.length < 2) {
        showFieldError('firstName', 'First name must be at least 2 characters');
        errors.push('First name too short');
        isValid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(firstName)) {
        showFieldError('firstName', 'First name contains invalid characters');
        errors.push('Invalid first name format');
        isValid = false;
    }
    
    // Validate last name
    if (!lastName) {
        showFieldError('lastName', 'Last name is required');
        errors.push('Last name required');
        isValid = false;
    } else if (lastName.length < 2) {
        showFieldError('lastName', 'Last name must be at least 2 characters');
        errors.push('Last name too short');
        isValid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(lastName)) {
        showFieldError('lastName', 'Last name contains invalid characters');
        errors.push('Invalid last name format');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showFieldError('email', 'Email address is required');
        errors.push('Email required');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        errors.push('Invalid email format');
        isValid = false;
    }
    
    // Validate phone number
    if (!phone) {
        showFieldError('phone', 'Phone number is required');
        errors.push('Phone required');
        isValid = false;
    } else {
        const normalizedPhone = normalizePhoneNumber(phone);
        if (normalizedPhone.length !== 10) {
            showFieldError('phone', 'Please enter a valid 10-digit phone number');
            errors.push('Invalid phone format');
            isValid = false;
        } else if (!/^[2-9]\d{9}$/.test(normalizedPhone)) {
            showFieldError('phone', 'Phone number format is invalid');
            errors.push('Invalid phone number');
            isValid = false;
        }
    }
    
    // Update button state
    if (nextBtn) {
        if (isValid) {
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
            nextBtn.style.background = '#1B365D';
            nextBtn.title = 'Send verification code';
        } else {
            nextBtn.disabled = true;
            nextBtn.style.opacity = '0.5';
            nextBtn.style.background = '#cccccc';
            nextBtn.title = 'Please fix validation errors: ' + errors.join(', ');
        }
    }
    
    return isValid;
}

// Show field-specific validation error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Add error styling to field
    field.style.borderColor = '#dc3545';
    field.style.backgroundColor = '#fff5f5';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    
    // Remove error styling when user starts typing
    field.addEventListener('input', function clearError() {
        field.style.borderColor = '#e1e1e1';
        field.style.backgroundColor = '#fff';
        const errorMsg = field.parentNode.querySelector('.field-error');
        if (errorMsg) {
            errorMsg.remove();
        }
        field.removeEventListener('input', clearError);
    }, { once: true });
}

// Clear all validation errors
function clearValidationErrors() {
    const errorMessages = document.querySelectorAll('.field-error');
    errorMessages.forEach(error => error.remove());
    
    // Reset field styling
    ['firstName', 'lastName', 'email', 'phone'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '#e1e1e1';
            field.style.backgroundColor = '#fff';
        }
    });
}

// Enhanced phone number validation
function isValidPhoneNumber(phone) {
    const normalizedPhone = normalizePhoneNumber(phone);
    
    // Check length
    if (normalizedPhone.length !== 10) {
        return false;
    }
    
    // Check format (first digit can't be 0 or 1)
    if (!/^[2-9]\d{9}$/.test(normalizedPhone)) {
        return false;
    }
    
    // Check for obvious invalid patterns
    const invalidPatterns = [
        /^0{10}$/, // All zeros
        /^1{10}$/, // All ones
        /^(\d)\1{9}$/, // Same digit repeated
        /^1234567890$/, // Sequential
        /^5555555555$/ // Common test number
    ];
    
    return !invalidPatterns.some(pattern => pattern.test(normalizedPhone));
}

// Real-time email validation feedback
function validateEmailField() {
    const emailField = document.getElementById('email');
    if (!emailField) return;
    
    emailField.addEventListener('blur', function() {
        const email = emailField.value.trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFieldError('email', 'Please enter a valid email address');
        }
    });
}

// Real-time phone validation feedback
function validatePhoneField() {
    const phoneField = document.getElementById('phone');
    if (!phoneField) return;
    
    phoneField.addEventListener('input', function() {
        const phone = phoneField.value.trim();
        if (phone) {
            const normalizedPhone = normalizePhoneNumber(phone);
            if (normalizedPhone.length > 10) {
                phoneField.value = phone.substring(0, phone.length - 1);
            }
        }
    });
    
    phoneField.addEventListener('blur', function() {
        const phone = phoneField.value.trim();
        if (phone && !isValidPhoneNumber(phone)) {
            showFieldError('phone', 'Please enter a valid 10-digit phone number');
        }
    });
}

// Send verification code via form submission
function sendVerificationCode() {
    // Run detailed validation first
    if (!validateContactFormButtons()) {
        showMessage('Please fix all form errors before sending verification code.', 'error');
        return;
    }
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // Double-check required fields
    if (!firstName || !lastName || !email || !phone) {
        showMessage('Please fill in all required fields before sending verification code.', 'error');
        return;
    }
    
    // Validate phone number format one more time
    if (!isValidPhoneNumber(phone)) {
        showMessage('Please enter a valid phone number before sending verification code.', 'error');
        return;
    }
    
    // Generate verification code FIRST before everything else
    currentVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('=== CODE GENERATION DEBUG ===');
    console.log('Generated verification code:', currentVerificationCode);
    console.log('This code will be sent to Google Apps Script and used for verification');
    
    // Show loading state
    const nextBtn = document.getElementById('contactNextBtn');
    const originalText = nextBtn.textContent;
    nextBtn.innerHTML = '<span>Sending...</span> <div style="display: inline-block; width: 12px; height: 12px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-left: 8px;"></div>';
    nextBtn.disabled = true;
    
    // Create hidden iframe for form submission
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden-verification';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Create form for submission
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbyC--K0GGrFllxhVnmouMiaKjiMuxS0ATsxKiPiZsonv-ca_BX7QZXcYOs8oS5w-_ms/exec';
    form.target = 'hidden-verification';
    form.style.display = 'none';
    
    // Clean and normalize phone number - handle any format
    const cleanPhone = normalizePhoneNumber(phone);
    
    // Validate phone number length
    if (cleanPhone.length !== 10) {
        showMessage('Please enter a valid 10-digit phone number.', 'error');
        return;
    }
    
    console.log('Original phone:', phone);
    console.log('Normalized phone for storage:', cleanPhone);
    
    // Add form fields including the generated code
    const fields = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: cleanPhone,
        verificationCode: currentVerificationCode // Send our code to be emailed
    };
    
    console.log('Form fields being sent:', fields);
    
    Object.keys(fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
    });
    
    document.body.appendChild(form);
    
    // Store verification data with clean phone number
    currentVerificationData = { firstName, lastName, email, phone: cleanPhone };
    
    // Submit form
    form.submit();
    
    // Add debugging - listen for iframe load to detect if script ran
    iframe.onload = function() {
        console.log('Google Apps Script response received');
    };
    
    // Go directly to verification page after short delay (allows email to be sent)
    setTimeout(() => {
        // Reset button
        nextBtn.textContent = originalText;
        nextBtn.disabled = false;
        
        // Go to verification page
        showVerificationPage();
        
        // Clean up form and iframe
        if (document.body.contains(form)) {
            document.body.removeChild(form);
        }
        if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
        }
    }, 3000); // Increased to 3 seconds to ensure script has time to run
}

function showVerificationPage() {
    console.log('=== SHOWING VERIFICATION PAGE ===');
    console.log('Current verification code:', currentVerificationCode);
    
    // Hide contact form
    document.getElementById('contactFormContainer').style.display = 'none';
    document.getElementById('contactFormContainer').classList.remove('visible');
    
    // Show verification section
    document.getElementById('verificationSection').style.display = 'block';
    document.getElementById('smsCode').focus();
    document.getElementById('verificationSection').scrollIntoView({ behavior: 'smooth' });
    
    // Code generation completed
}

// Simple verification - just compare with locally stored code
function verifyCode() {
    const enteredCode = document.getElementById('smsCode').value.trim();
    
    if (!enteredCode || enteredCode.length !== 6) {
        showMessage('Please enter a valid 6-digit code.', 'error');
        return;
    }
    
    if (!currentVerificationData) {
        showMessage('Verification session expired. Please send a new code.', 'error');
        return;
    }
    
    if (!currentVerificationCode) {
        showMessage('No verification code found. Please send a new code.', 'error');
        return;
    }
    
    // Show loading state
    const verifyBtn = document.getElementById('verifyCodeBtn');
    const originalText = verifyBtn.textContent;
    verifyBtn.textContent = 'Verifying...';
    verifyBtn.disabled = true;
    
    console.log('=== SIMPLE VERIFICATION DEBUG ===');
    console.log('Entered code:', enteredCode);
    console.log('Entered code type:', typeof enteredCode);
    console.log('Expected code:', currentVerificationCode);
    console.log('Expected code type:', typeof currentVerificationCode);
    console.log('Codes match:', enteredCode === currentVerificationCode);
    console.log('Codes match (loose):', enteredCode == currentVerificationCode);
    
    // Simple comparison - no server needed!
    setTimeout(() => {
        if (enteredCode === currentVerificationCode) {
            console.log('✅ VERIFICATION SUCCESSFUL - Codes match!');
            showMessage('Code verified successfully! Click "Continue to Results" to proceed.', 'success');
            
            // Change button to continue button
            const verifyBtn = document.getElementById('verifyCodeBtn');
            verifyBtn.textContent = 'Continue to Results →';
            verifyBtn.onclick = function() {
                console.log('Manual redirect to thank-you.html');
                window.location.href = 'thank-you.html';
            };
            verifyBtn.disabled = false;
            verifyBtn.style.background = '#28a745';
            verifyBtn.style.fontSize = '18px';
            
            // Log successful verification 
            logVerificationSuccess();
        } else {
            console.log('❌ VERIFICATION FAILED - Codes do not match');
            showMessage('Invalid verification code. Please try again.', 'error');
            document.getElementById('smsCode').value = '';
            document.getElementById('smsCode').focus();
            
            // Only reset button text if verification failed
            const verifyBtn = document.getElementById('verifyCodeBtn');
            verifyBtn.textContent = originalText;
            verifyBtn.disabled = false;
        }
    }, 1000); // Short delay to show loading state
}

// Resend verification code
function resendVerificationCode() {
    if (!currentVerificationData) {
        showMessage('Please fill in your information and send a verification code first.', 'error');
        return;
    }
    
    // Create hidden iframe for resend
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden-resend';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Create form for resend
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbyC--K0GGrFllxhVnmouMiaKjiMuxS0ATsxKiPiZsonv-ca_BX7QZXcYOs8oS5w-_ms/exec';
    form.target = 'hidden-resend';
    form.style.display = 'none';
    
    // Add form fields with resend flag (phone should already be clean from initial send)
    const fields = {
        firstName: currentVerificationData.firstName,
        lastName: currentVerificationData.lastName,
        email: currentVerificationData.email,
        phone: currentVerificationData.phone, // Already cleaned when stored
        verificationCode: currentVerificationCode, // Use same code for resend
        resend: 'true'
    };
    
    Object.keys(fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
    });
    
    document.body.appendChild(form);
    
    // Submit form
    form.submit();
    
    // Show success message after short delay and clean up
    setTimeout(() => {
        showMessage('New verification code sent! Please check your text messages.', 'success');
        document.getElementById('smsCode').value = '';
        document.getElementById('smsCode').focus();
        
        // Clean up form and iframe
        document.body.removeChild(form);
        document.body.removeChild(iframe);
    }, 2000);
}

// Test function to check if Google Apps Script is working (for debugging)
function testGoogleScript() {
    console.log('Testing Google Apps Script...');
    
    const testForm = document.createElement('form');
    testForm.method = 'POST';
    testForm.action = 'https://script.google.com/macros/s/AKfycbyC--K0GGrFllxhVnmouMiaKjiMuxS0ATsxKiPiZsonv-ca_BX7QZXcYOs8oS5w-_ms/exec';
    testForm.target = '_blank';
    
    const fields = {
        firstName: 'Test',
        lastName: 'User', 
        email: 'test@example.com',
        phone: '5551234567'
    };
    
    Object.keys(fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        testForm.appendChild(input);
    });
    
    document.body.appendChild(testForm);
    testForm.submit();
    document.body.removeChild(testForm);
}

// Test verification endpoint directly 
function testVerificationEndpoint() {
    console.log('Testing verification endpoint...');
    
    const testUrl = 'https://script.google.com/macros/s/AKfycbyC--K0GGrFllxhVnmouMiaKjiMuxS0ATsxKiPiZsonv-ca_BX7QZXcYOs8oS5w-_ms/exec?action=verify&phone=5551234567&code=123456';
    
    fetch(testUrl)
        .then(response => {
            console.log('Test verification response status:', response.status);
            return response.text();
        })
        .then(text => {
            console.log('Test verification response:', text);
            try {
                const data = JSON.parse(text);
                console.log('Test verification parsed:', data);
            } catch (e) {
                console.log('Test verification - not JSON:', text);
            }
        })
        .catch(error => {
            console.error('Test verification error:', error);
        });
}

// Show message to user
function showMessage(message, type) {
    // Use the existing error div in verification section
    const errorDiv = document.getElementById('smsError');
    
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.style.color = type === 'success' ? '#155724' : '#dc3545';
        errorDiv.style.background = type === 'success' ? '#d4edda' : '#f8d7da';
        errorDiv.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
        errorDiv.style.padding = '10px';
        errorDiv.style.borderRadius = '5px';
        
        // Auto-remove error messages after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Log successful verification and send quiz data to Google Sheets
function logVerificationSuccess() {
    if (!currentVerificationData) {
        console.error('❌ No current verification data available');
        return;
    }
    
    console.log('📊 Logging verification success and quiz data to Google Sheets');
    console.log('👤 Current verification data:', currentVerificationData);
    
    // Check if we have any quiz answers
    if (!assessmentAnswers || Object.keys(assessmentAnswers).length === 0) {
        console.warn('⚠️ No assessment answers found! User may have skipped quiz.');
        console.log('📝 Assessment answers object:', assessmentAnswers);
    }
    
    // Prepare quiz answers in a structured format
    console.log('📝 Raw assessment answers:', assessmentAnswers);
    
    const quizData = {
        q1: (assessmentAnswers[0] && assessmentAnswers[0].answer) ? assessmentAnswers[0].answer : 'No answer',
        q2: (assessmentAnswers[1] && assessmentAnswers[1].answer) ? assessmentAnswers[1].answer : 'No answer', 
        q3: (assessmentAnswers[2] && assessmentAnswers[2].answer) ? assessmentAnswers[2].answer : 'No answer',
        q4: (assessmentAnswers[3] && assessmentAnswers[3].answer) ? assessmentAnswers[3].answer : 'No answer',
        q5: (assessmentAnswers[4] && assessmentAnswers[4].answer) ? assessmentAnswers[4].answer : 'No answer',
        q6: (assessmentAnswers[5] && assessmentAnswers[5].answer) ? assessmentAnswers[5].answer : 'No answer'
    };
    
    console.log('Quiz answers being sent:', quizData);
    
    // Create form to send quiz data to Google Apps Script
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden-quiz-submit';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbyC--K0GGrFllxhVnmouMiaKjiMuxS0ATsxKiPiZsonv-ca_BX7QZXcYOs8oS5w-_ms/exec';
    form.target = 'hidden-quiz-submit';
    form.style.display = 'none';
    
    // Add form fields
    const fields = {
        action: 'submit_lead',
        phone: currentVerificationData.phone,
        quizAnswers: JSON.stringify(quizData),
        firstName: currentVerificationData.firstName,
        lastName: currentVerificationData.lastName,
        email: currentVerificationData.email
    };
    
    Object.keys(fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
    
    // Clean up after short delay
    setTimeout(() => {
        if (document.body.contains(form)) {
            document.body.removeChild(form);
        }
        if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
        }
    }, 3000);
    
    console.log('✅ Quiz data submitted to Google Sheets');
}

function submitLead(event) {
    // This function is now handled by the verification flow
    // Redirect to verification process instead
    event.preventDefault();
    showMessage('Please complete phone verification to proceed.', 'error');
}

function resetAssessment() {
    currentQuestionIndex = 0;
    assessmentAnswers = {};
    currentVerificationData = null;
    
    // Show quiz sections
    document.getElementById('progressSection').style.display = 'block';
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('navigationSection').style.display = 'block';
    
    // Hide other sections
    const contactFormContainer = document.getElementById('contactFormContainer');
    contactFormContainer.style.display = 'none';
    contactFormContainer.classList.remove('visible');
    
    // Remove contact form navigation if it exists
    const existingNav = document.querySelector('.contact-form-nav');
    if (existingNav) {
        existingNav.remove();
    }
    
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('verificationSection').style.display = 'none';
    
    // Reset to first question
    displayQuestion();
    
    // Scroll back to assessment
    document.getElementById('progressSection').scrollIntoView({ behavior: 'smooth' });
}

// Scroll effects
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#fff';
            navbar.style.backdropFilter = 'none';
        }
    }
});

// Add fade-in animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const elementsToObserve = document.querySelectorAll('.quiz-container, .lead-form-container');
    elementsToObserve.forEach(el => observer.observe(el));
});