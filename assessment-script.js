// Enhanced quiz data for final expense insurance assessment
const assessmentData = [
    {
        question: "What is your age?",
        type: "radio",
        options: [
            { text: "Under 50", value: "under-50", icon: "👶" },
            { text: "50-60", value: "50-60", icon: "👤" },
            { text: "61-70", value: "61-70", icon: "👨" },
            { text: "71-80", value: "71-80", icon: "👴" },
            { text: "Over 80", value: "over-80", icon: "👵" }
        ]
    },
    {
        question: "What is your gender?",
        type: "radio",
        options: [
            { text: "Male", value: "male", icon: "👨" },
            { text: "Female", value: "female", icon: "👩" }
        ]
    },
    {
        question: "Do you currently use tobacco products?",
        type: "radio",
        options: [
            { text: "Yes, I currently smoke/use tobacco", value: "current-smoker", icon: "🚬" },
            { text: "No, I don't use tobacco", value: "non-smoker", icon: "🚭" },
            { text: "I quit within the last 12 months", value: "recent-quit", icon: "🔄" }
        ]
    },
    {
        question: "What coverage amount are you looking for?",
        type: "radio",
        options: [
            { text: "$5,000 - $10,000", value: "5k-10k", icon: "💰" },
            { text: "$10,000 - $25,000", value: "10k-25k", icon: "💵" },
            { text: "$25,000 - $50,000", value: "25k-50k", icon: "💸" },
            { text: "$50,000 or more", value: "50k-plus", icon: "🏦" }
        ]
    },
    {
        question: "Have you been declined for life insurance in the past?",
        type: "radio",
        options: [
            { text: "Yes, I was declined", value: "declined", icon: "❌" },
            { text: "No, I was not declined", value: "not-declined", icon: "✅" },
            { text: "I've never applied before", value: "never-applied", icon: "❓" }
        ]
    },
    {
        question: "How would you describe your current health?",
        type: "radio",
        options: [
            { text: "Excellent - No health issues", value: "excellent", icon: "💪" },
            { text: "Good - Minor health issues", value: "good", icon: "👍" },
            { text: "Fair - Some health conditions", value: "fair", icon: "⚕️" },
            { text: "Poor - Multiple health issues", value: "poor", icon: "🏥" }
        ]
    },
    {
        question: "What is your primary goal for this insurance?",
        type: "radio",
        options: [
            { text: "Cover funeral and burial expenses", value: "funeral-costs", icon: "⚰️" },
            { text: "Pay off remaining debts", value: "debt-payoff", icon: "💳" },
            { text: "Leave money for family", value: "family-inheritance", icon: "👨‍👩‍👧‍👦" },
            { text: "All of the above", value: "all-goals", icon: "🎯" }
        ]
    },
    {
        question: "When would you like coverage to begin?",
        type: "radio",
        options: [
            { text: "As soon as possible", value: "immediate", icon: "⚡" },
            { text: "Within 30 days", value: "30-days", icon: "📅" },
            { text: "Within 60 days", value: "60-days", icon: "📆" },
            { text: "I'm just comparing options", value: "comparing", icon: "🔍" }
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
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

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
    const quizContent = document.getElementById('quizContent');
    const questionNumber = document.getElementById('questionNumber');
    const progressFill = document.getElementById('progressFill');
    
    // Update question number
    questionNumber.textContent = currentQuestionIndex + 1;
    
    // Update progress bar
    const progressPercentage = ((currentQuestionIndex + 1) / assessmentData.length) * 100;
    progressFill.style.width = progressPercentage + '%';
    
    // Update step indicators
    updateStepIndicators();
    
    // Create question HTML with icons
    const optionsHTML = question.options.map((option, index) => `
        <div class="option" onclick="selectOption(${index}, '${option.value}')">
            <span class="option-icon">${option.icon}</span>
            <span>${option.text}</span>
        </div>
    `).join('');
    
    quizContent.innerHTML = `
        <div class="question fade-in-up">
            <h3>${question.question}</h3>
            <div class="question-options">
                ${optionsHTML}
            </div>
        </div>
    `;
    
    // Update navigation buttons
    updateNavigationButtons();
}

function updateStepIndicators() {
    for (let i = 1; i <= assessmentData.length; i++) {
        const step = document.getElementById(`step${i}`);
        if (step) {
            step.classList.remove('active', 'completed');
            
            if (i < currentQuestionIndex + 1) {
                step.classList.add('completed');
            } else if (i === currentQuestionIndex + 1) {
                step.classList.add('active');
            }
        }
    }
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
    
    // Store answer
    assessmentAnswers[currentQuestionIndex] = {
        question: assessmentData[currentQuestionIndex].question,
        answer: value,
        answerText: assessmentData[currentQuestionIndex].options[index].text
    };
    
    // Update navigation buttons
    updateNavigationButtons();
}

function nextQuestion() {
    if (!assessmentAnswers[currentQuestionIndex]) {
        alert('Please select an answer before continuing.');
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
            <img src="silverpath website photos/image4.png" alt="Happy couple celebrating their coverage" style="max-width: 300px; border-radius: 15px;">
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
    
    // Add event listeners for form validation
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('input', validateContactFormButtons);
    });
    
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

// Contact form validation to enable Send Code button
function validateContactFormButtons() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    const nextBtn = document.getElementById('contactNextBtn');
    
    if (nextBtn && firstName && lastName && email && phone && email.includes('@') && phone.length >= 10) {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.background = '#1B365D';
    } else if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.style.background = '#cccccc';
    }
}

// Send verification code via form submission
function sendVerificationCode() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!firstName || !lastName || !email || !phone) {
        alert('Please fill in all required fields before sending verification code.');
        return;
    }
    
    // Show loading state
    const nextBtn = document.getElementById('contactNextBtn');
    const originalText = nextBtn.textContent;
    nextBtn.textContent = 'Sending...';
    nextBtn.disabled = true;
    
    // Create form for submission
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbyr3D8cG-GG6df5zCIO3q78VJRRcNI9vPgd9dTXsoj3JBXnsG4yVBPQ93kXEh3pnOKr/exec';
    form.target = '_blank';
    form.style.display = 'none';
    
    // Add form fields
    const fields = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone
    };
    
    Object.keys(fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
    });
    
    document.body.appendChild(form);
    
    // Store verification data
    currentVerificationData = { firstName, lastName, email, phone };
    
    // Listen for popup communication
    window.addEventListener('message', function(event) {
        if (event.data && event.data.success) {
            // Reset button
            nextBtn.textContent = originalText;
            nextBtn.disabled = false;
            
            // Go directly to verification page
            showVerificationPage();
        }
    });
    
    // Submit form
    form.submit();
    
    // Clean up form after short delay
    setTimeout(() => {
        document.body.removeChild(form);
    }, 1000);
}

function showVerificationPage() {
    // Hide contact form
    document.getElementById('contactFormContainer').style.display = 'none';
    document.getElementById('contactFormContainer').classList.remove('visible');
    
    // Show verification section
    document.getElementById('verificationSection').style.display = 'block';
    document.getElementById('smsCode').focus();
    document.getElementById('verificationSection').scrollIntoView({ behavior: 'smooth' });
}

// Verify entered code
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
    
    // Show loading state
    const verifyBtn = document.getElementById('verifyCodeBtn');
    const originalText = verifyBtn.textContent;
    verifyBtn.textContent = 'Verifying...';
    verifyBtn.disabled = true;
    
    // Verify code via GET request
    const verifyUrl = `https://script.google.com/macros/s/AKfycbyr3D8cG-GG6df5zCIO3q78VJRRcNI9vPgd9dTXsoj3JBXnsG4yVBPQ93kXEh3pnOKr/exec?action=verify&phone=${encodeURIComponent(currentVerificationData.phone)}&code=${encodeURIComponent(enteredCode)}`;
    
    fetch(verifyUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Success - proceed to thank you
                showMessage('Code verified successfully! Redirecting...', 'success');
                
                // Log successful verification to sheets
                logVerificationSuccess();
                
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = 'thank-you.html';
                }, 2000);
            } else {
                showMessage(data.message || 'Invalid verification code. Please try again.', 'error');
                document.getElementById('smsCode').value = '';
                document.getElementById('smsCode').focus();
            }
        })
        .catch(error => {
            console.error('Verification error:', error);
            showMessage('Verification failed. Please try again or request a new code.', 'error');
        })
        .finally(() => {
            // Reset button
            verifyBtn.textContent = originalText;
            verifyBtn.disabled = false;
        });
}

// Resend verification code
function resendVerificationCode() {
    if (!currentVerificationData) {
        showMessage('Please fill in your information and send a verification code first.', 'error');
        return;
    }
    
    // Create form for resend
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbyr3D8cG-GG6df5zCIO3q78VJRRcNI9vPgd9dTXsoj3JBXnsG4yVBPQ93kXEh3pnOKr/exec';
    form.target = '_blank';
    form.style.display = 'none';
    
    // Add form fields with resend flag
    const fields = {
        firstName: currentVerificationData.firstName,
        lastName: currentVerificationData.lastName,
        email: currentVerificationData.email,
        phone: currentVerificationData.phone,
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
    
    // Listen for popup communication
    window.addEventListener('message', function(event) {
        if (event.data && event.data.success) {
            showMessage('New verification code sent! Please check your text messages.', 'success');
            document.getElementById('smsCode').value = '';
            document.getElementById('smsCode').focus();
        }
    });
    
    // Submit form
    form.submit();
    
    // Clean up form
    setTimeout(() => {
        document.body.removeChild(form);
    }, 1000);
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

// Log successful verification to Google Sheets
function logVerificationSuccess() {
    if (!currentVerificationData) return;
    
    const estimatedPremium = document.getElementById('premiumAmount').textContent;
    const zip = document.getElementById('zip').value.trim();
    const bestTime = document.getElementById('bestTime').value;
    
    const leadData = {
        firstName: currentVerificationData.firstName,
        lastName: currentVerificationData.lastName,
        email: currentVerificationData.email,
        phone: currentVerificationData.phone,
        zip: zip,
        bestTime: bestTime,
        estimatedPremium: estimatedPremium,
        assessmentAnswers: assessmentAnswers,
        timestamp: new Date().toISOString(),
        source: 'assessment-page',
        verified: true
    };
    
    // Log lead data (this would typically go to your CRM/database)
    console.log('Verified Lead Data:', leadData);
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