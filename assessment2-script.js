// Arizona Final Expense Eligibility Quiz - 20 Questions
const assessmentData = [
    {
        question: "How old are you?",
        image: "silverpath website photos/image1.png",
        options: [
            "Under 45",
            "45–54",
            "55–64",
            "65–74",
            "75+"
        ]
    },
    {
        question: "Do you currently live in Arizona?",
        image: "silverpath website photos/image2.png",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        question: "Are you a U.S. citizen or permanent resident?",
        image: "silverpath website photos/image3.png",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        question: "Do you already have a life insurance policy?",
        image: "silverpath website photos/fatherdaughter.png",
        options: [
            "Yes – large policy",
            "Yes – small policy",
            "No"
        ]
    },
    {
        question: "Are you currently married or single?",
        image: "silverpath website photos/garden.png",
        options: [
            "Married",
            "Single",
            "Widowed",
            "Divorced"
        ]
    },
    {
        question: "Do you have children or grandchildren who may be financially affected by your passing?",
        image: "silverpath website photos/carwave.png",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        question: "Do you smoke or use tobacco products?",
        image: "silverpath website photos/image1.png",
        options: [
            "Yes",
            "No",
            "Occasionally"
        ]
    },
    {
        question: "Have you been diagnosed with any major health conditions in the last 2 years?",
        image: "silverpath website photos/image2.png",
        options: [
            "Yes",
            "No",
            "Not sure"
        ]
    },
    {
        question: "Have you been hospitalized in the past 12 months?",
        image: "silverpath website photos/image3.png",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        question: "Do you take prescription medications regularly?",
        image: "silverpath website photos/fatherdaughter.png",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        question: "How would you describe your overall health?",
        image: "silverpath website photos/garden.png",
        options: [
            "Excellent",
            "Good",
            "Fair",
            "Poor"
        ]
    },
    {
        question: "Do you know how much funerals cost today?",
        image: "silverpath website photos/carwave.png",
        options: [
            "Less than $5,000",
            "Around $10,000",
            "More than $10,000",
            "I'm not sure"
        ]
    },
    {
        question: "If something happened tomorrow, would your family be financially prepared?",
        image: "silverpath website photos/image1.png",
        options: [
            "Yes",
            "Somewhat",
            "No"
        ]
    },
    {
        question: "What's most important to you when choosing final expense coverage?",
        image: "silverpath website photos/image2.png",
        options: [
            "Lowest cost",
            "Easy approval",
            "No health exams",
            "Leaving a legacy"
        ]
    },
    {
        question: "Are you interested in burial, cremation, or not sure yet?",
        image: "silverpath website photos/image3.png",
        options: [
            "Burial",
            "Cremation",
            "Not sure"
        ]
    },
    {
        question: "How soon are you looking to get coverage in place?",
        image: "silverpath website photos/fatherdaughter.png",
        options: [
            "Immediately",
            "Within a week",
            "In the next 30 days",
            "Just looking for now"
        ]
    },
    {
        question: "Would you like to see what plans you qualify for today?",
        image: "silverpath website photos/garden.png",
        options: [
            "Yes",
            "Maybe",
            "Not sure"
        ]
    },
    {
        question: "Do you prefer speaking to someone by phone or viewing quotes online?",
        image: "silverpath website photos/carwave.png",
        options: [
            "Phone",
            "Online",
            "Text"
        ]
    },
    {
        question: "When is the best time for a licensed agent to reach you?",
        image: "silverpath website photos/image1.png",
        options: [
            "Morning",
            "Afternoon",
            "Evening"
        ]
    },
    {
        question: "What's your zip code in Arizona?",
        image: "silverpath website photos/image2.png",
        isTextInput: true,
        placeholder: "Enter your Arizona zip code (e.g., 85001)"
    }
];

let currentQuestionIndex = 0;
let assessmentAnswers = {};
const quizId = 'arizona-final-expense-quiz-2';

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
    
    // Display options or text input
    if (questionOptions) {
        if (question.isTextInput) {
            // Text input for zip code
            const savedAnswer = assessmentAnswers[currentQuestionIndex]?.answer || '';
            questionOptions.innerHTML = `
                <input type="text" 
                       class="text-input" 
                       id="textAnswer" 
                       placeholder="${question.placeholder}"
                       value="${savedAnswer}"
                       maxlength="10"
                       onInput="handleTextInput(this.value)"
                       style="max-width: 400px; margin: 0 auto;">
            `;
            
            // Focus on input
            setTimeout(() => {
                const input = document.getElementById('textAnswer');
                if (input) input.focus();
            }, 100);
        } else {
            // Multiple choice options
            const optionsHTML = question.options.map((option, index) => {
                const isSelected = assessmentAnswers[currentQuestionIndex]?.answer === option;
                return `
                    <div class="option ${isSelected ? 'selected' : ''}" onclick="selectOption(${index}, \`${option.replace(/`/g, '\\`')}\`)">
                        ${option}
                    </div>
                `;
            }).join('');
            
            questionOptions.innerHTML = optionsHTML;
        }
    }
    
    // Update navigation buttons
    updateNavigationButtons();
}

function handleTextInput(value) {
    // Store text input answer
    assessmentAnswers[currentQuestionIndex] = {
        question: assessmentData[currentQuestionIndex].question,
        answer: value.trim(),
        answerText: value.trim()
    };
    
    console.log('✅ Stored text answer for question', currentQuestionIndex + 1, ':', value.trim());
    console.log('📊 Current assessment answers:', assessmentAnswers);
    
    // Update navigation buttons
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Show/hide previous button
    prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    
    // Update next button text and state
    const hasAnswer = assessmentAnswers[currentQuestionIndex] && 
                     assessmentAnswers[currentQuestionIndex].answer && 
                     assessmentAnswers[currentQuestionIndex].answer.trim() !== '';
    
    nextBtn.textContent = currentQuestionIndex === assessmentData.length - 1 ? 'Get My Arizona Quote →' : 'Next →';
    nextBtn.disabled = !hasAnswer;
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
    
    // Store answer
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
    if (!assessmentAnswers[currentQuestionIndex] || 
        !assessmentAnswers[currentQuestionIndex].answer || 
        assessmentAnswers[currentQuestionIndex].answer.trim() === '') {
        showMessage('Please answer the question before continuing.', 'error');
        return;
    }
    
    if (currentQuestionIndex < assessmentData.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        // Assessment completed, show lead form
        showLeadForm();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function calculateArizonaPremiumEstimate() {
    let basePremium = 40; // Base premium for Arizona
    
    // Age factor (Question 1)
    const age = assessmentAnswers[0]?.answer;
    switch(age) {
        case 'Under 45': basePremium = 25; break;
        case '45–54': basePremium = 35; break;
        case '55–64': basePremium = 50; break;
        case '65–74': basePremium = 70; break;
        case '75+': basePremium = 95; break;
    }
    
    // Tobacco factor (Question 7)
    const tobacco = assessmentAnswers[6]?.answer;
    if (tobacco === 'Yes') {
        basePremium *= 1.8;
    } else if (tobacco === 'Occasionally') {
        basePremium *= 1.3;
    }
    
    // Health factor (Question 11)
    const health = assessmentAnswers[10]?.answer;
    switch(health) {
        case 'Excellent': basePremium *= 0.9; break;
        case 'Good': basePremium *= 1.0; break;
        case 'Fair': basePremium *= 1.3; break;
        case 'Poor': basePremium *= 1.7; break;
    }
    
    // Major health conditions (Question 8)
    const healthConditions = assessmentAnswers[7]?.answer;
    if (healthConditions === 'Yes') {
        basePremium *= 1.4;
    }
    
    // Hospitalization (Question 9)
    const hospitalized = assessmentAnswers[8]?.answer;
    if (hospitalized === 'Yes') {
        basePremium *= 1.2;
    }
    
    // Prescription medications (Question 10)
    const medications = assessmentAnswers[9]?.answer;
    if (medications === 'Yes') {
        basePremium *= 1.1;
    }
    
    return Math.round(basePremium);
}

function showLeadForm() {
    // Hide quiz sections
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('navigationSection').style.display = 'none';
    
    // Calculate and display premium estimate
    const estimatedPremium = calculateArizonaPremiumEstimate();
    
    // Show results container with "Get Your Quote" button
    showResults(estimatedPremium);
}

function showResults(estimatedPremium) {
    // Update results container content
    document.getElementById('resultsContainer').innerHTML = `
        <h2>🎉 Great News!</h2>
        <div class="results-image">
            <img src="silverpath website photos/happycouplewhite.png" alt="Happy couple celebrating their Arizona coverage" style="max-width: 300px; border-radius: 15px;">
        </div>
        
        <p style="font-size: 20px; color: #666; margin-bottom: 30px;">
            You qualify for Arizona final expense coverage!
        </p>
        
        <div class="premium-estimate" style="background: #f8f9fa; padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center;">
            <h3 style="color: #1B365D; margin-bottom: 15px;">Your Estimated Monthly Premium</h3>
            <div id="premiumAmount" style="font-size: 48px; font-weight: bold; color: #28a745; margin-bottom: 15px;">$${estimatedPremium}</div>
            <p style="color: #666; margin: 0;">Based on your Arizona assessment</p>
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
            <button onclick="showContactForm()" class="quiz-btn" style="font-size: 20px; padding: 20px 40px; background: #1B365D;">
                Get Your Arizona Quote →
            </button>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>Next Step:</strong> Complete your contact information to receive your personalized Arizona quote from a licensed insurance professional.
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
let currentVerificationCode = null;

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

// Send verification code via form submission - No new window
function sendVerificationCode() {
    console.log('🚀 sendVerificationCode() function called - ARIZONA QUIZ');
    
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
    console.log('=== ARIZONA CODE GENERATION DEBUG ===');
    console.log('Generated verification code:', currentVerificationCode);
    console.log('This code will be sent to Google Apps Script and used for verification');
    
    // Show loading state
    const nextBtn = document.getElementById('contactNextBtn');
    const originalText = nextBtn.textContent;
    nextBtn.innerHTML = '<span>Sending...</span> <div style="display: inline-block; width: 12px; height: 12px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-left: 8px;"></div>';
    nextBtn.disabled = true;
    
    // Clean and normalize phone number
    const cleanPhone = normalizePhoneNumber(phone);
    
    // Validate phone number length
    if (cleanPhone.length !== 10) {
        showMessage('Please enter a valid 10-digit phone number.', 'error');
        return;
    }
    
    console.log('Original phone:', phone);
    console.log('Normalized phone for storage:', cleanPhone);
    
    // Store verification data with clean phone number
    currentVerificationData = { firstName, lastName, email, phone: cleanPhone };
    
    // Build URL for GET request (same as working manual test)
    const params = new URLSearchParams({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: cleanPhone,
        verificationCode: currentVerificationCode,
        quizId: 'arizona-final-expense-quiz-2'
    });
    
    const url = `https://script.google.com/macros/s/AKfycbzJUlMw6PG5iLFy6aTBaZd7WrVnWKfEhQ8FiOZwEcD2wcIM2v_hHrNJyjWEapAPbUD5/exec?${params.toString()}`;
    
    console.log('Calling URL:', url);
    
    // Use fetch with cors mode to read the response
    fetch(url, {
        method: 'GET',
        mode: 'cors'
    })
    .then(response => {
        console.log('✅ Arizona Quiz Response received:', response.status);
        return response.text();
    })
    .then(responseText => {
        console.log('📄 Arizona Quiz Response content:', responseText);
        
        // Check if response indicates success
        if (responseText.includes('Verification code sent successfully') || 
            responseText.includes('Silver Path Network')) {
            console.log('✅ Arizona Quiz notification system confirmed success');
            showMessage('Verification code sent! Notifications sent via Google Sheets, Telegram, and Email.', 'success');
        } else {
            console.log('⚠️ Arizona Quiz unexpected response format');
            showMessage('Request sent successfully!', 'success');
        }
        
        // Reset button
        nextBtn.textContent = originalText;
        nextBtn.disabled = false;
        
        // Go to verification page
        showVerificationPage();
    })
    .catch(error => {
        console.log('⚠️ Arizona Quiz fetch error (trying no-cors fallback):', error);
        
        // Fallback to no-cors mode
        return fetch(url, {
            method: 'GET',
            mode: 'no-cors'
        }).then(() => {
            console.log('✅ Arizona Quiz fallback request sent');
            showMessage('Verification code sent!', 'success');
            
            // Reset button
            nextBtn.textContent = originalText;
            nextBtn.disabled = false;
            
            // Go to verification page
            showVerificationPage();
        });
    });
}

function showVerificationPage() {
    console.log('=== SHOWING ARIZONA VERIFICATION PAGE ===');
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
    
    console.log('=== ARIZONA VERIFICATION DEBUG ===');
    console.log('Entered code:', enteredCode);
    console.log('Entered code type:', typeof enteredCode);
    console.log('Expected code:', currentVerificationCode);
    console.log('Expected code type:', typeof currentVerificationCode);
    console.log('Codes match:', enteredCode === currentVerificationCode);
    console.log('Codes match (loose):', enteredCode == currentVerificationCode);
    
    // Simple comparison - no server needed!
    setTimeout(() => {
        if (enteredCode === currentVerificationCode) {
            console.log('✅ ARIZONA VERIFICATION SUCCESSFUL - Codes match!');
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
            logArizonaVerificationSuccess();
        } else {
            console.log('❌ ARIZONA VERIFICATION FAILED - Codes do not match');
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
    
    // Build URL for resend
    const params = new URLSearchParams({
        firstName: currentVerificationData.firstName,
        lastName: currentVerificationData.lastName,
        email: currentVerificationData.email,
        phone: currentVerificationData.phone,
        verificationCode: currentVerificationCode,
        resend: 'true',
        quizId: 'arizona-final-expense-quiz-2'
    });
    
    const url = `https://script.google.com/macros/s/AKfycbzJUlMw6PG5iLFy6aTBaZd7WrVnWKfEhQ8FiOZwEcD2wcIM2v_hHrNJyjWEapAPbUD5/exec?${params.toString()}`;
    
    // Use fetch with cors mode to read the response
    fetch(url, {
        method: 'GET',
        mode: 'cors'
    })
    .then(response => response.text())
    .then(responseText => {
        console.log('📄 Arizona Quiz resend response:', responseText);
        showMessage('New verification code sent! Notifications sent via Google Sheets, Telegram, and Email.', 'success');
        document.getElementById('smsCode').value = '';
        document.getElementById('smsCode').focus();
    })
    .catch(error => {
        console.log('⚠️ Arizona Quiz resend error (using fallback):', error);
        showMessage('New verification code sent! Please check your notifications.', 'success');
        document.getElementById('smsCode').value = '';
        document.getElementById('smsCode').focus();
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

// Log successful verification and send Arizona quiz data to Google Sheets
function logArizonaVerificationSuccess() {
    if (!currentVerificationData) {
        console.error('❌ No current verification data available');
        return;
    }
    
    console.log('📊 Logging Arizona verification success and quiz data to Google Sheets');
    console.log('👤 Current verification data:', currentVerificationData);
    
    // Check if we have any quiz answers
    if (!assessmentAnswers || Object.keys(assessmentAnswers).length === 0) {
        console.warn('⚠️ No assessment answers found! User may have skipped quiz.');
        console.log('📝 Assessment answers object:', assessmentAnswers);
    }
    
    // Prepare Arizona quiz answers in a structured format (20 questions)
    console.log('📝 Raw Arizona assessment answers:', assessmentAnswers);
    
    const arizonaQuizData = {};
    for (let i = 0; i < 20; i++) {
        arizonaQuizData[`q${i + 1}`] = (assessmentAnswers[i] && assessmentAnswers[i].answer) ? assessmentAnswers[i].answer : 'No answer';
    }
    
    console.log('Arizona quiz answers being sent:', arizonaQuizData);
    
    // Create form to send Arizona quiz data to Google Apps Script
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden-arizona-quiz-submit';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbzJUlMw6PG5iLFy6aTBaZd7WrVnWKfEhQ8FiOZwEcD2wcIM2v_hHrNJyjWEapAPbUD5/exec';
    form.target = 'hidden-arizona-quiz-submit';
    form.style.display = 'none';
    
    // Add form fields
    const fields = {
        action: 'submit_lead',
        phone: currentVerificationData.phone,
        quizAnswers: JSON.stringify(arizonaQuizData),
        firstName: currentVerificationData.firstName,
        lastName: currentVerificationData.lastName,
        email: currentVerificationData.email,
        quizId: quizId // Include quiz identifier
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
    
    console.log('✅ Arizona quiz data submitted to Google Sheets');
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