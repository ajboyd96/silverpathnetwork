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
    // Hide quiz section
    document.querySelector('.quiz-section').style.display = 'none';
    
    // Calculate and display premium estimate
    const estimatedPremium = calculatePremiumEstimate();
    document.getElementById('premiumAmount').textContent = `$${estimatedPremium}`;
    
    // Show lead form section
    document.getElementById('leadFormSection').style.display = 'block';
    
    // Scroll to lead form
    document.getElementById('leadFormSection').scrollIntoView({ behavior: 'smooth' });
}

function submitLead(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const estimatedPremium = document.getElementById('premiumAmount').textContent;
    
    // Add assessment answers to hidden fields
    document.getElementById('quizAnswersField').value = JSON.stringify(assessmentAnswers);
    document.getElementById('estimatedPremiumField').value = estimatedPremium;
    
    const leadData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        zip: formData.get('zip'),
        bestTime: formData.get('bestTime'),
        estimatedPremium: estimatedPremium,
        assessmentAnswers: assessmentAnswers,
        timestamp: new Date().toISOString(),
        source: 'assessment-page'
    };
    
    // Log for demo purposes
    console.log('Lead Data:', leadData);
    
    // Show success message
    alert(`Thank you ${leadData.firstName}! Your assessment is complete. 

Estimated Monthly Premium: ${estimatedPremium}

A licensed insurance professional will contact you within 24 hours to discuss your personalized quote and coverage options.

Keep an eye on your phone - they'll be calling from the number you provided!`);
    
    // Redirect to thank you page if it exists, otherwise reset
    const thankYouPage = 'thank-you.html';
    
    // Check if thank you page exists by trying to navigate
    fetch(thankYouPage, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                window.location.href = thankYouPage;
            } else {
                // Reset assessment for demo
                resetAssessment();
            }
        })
        .catch(() => {
            // Reset assessment for demo
            resetAssessment();
        });
}

function resetAssessment() {
    currentQuestionIndex = 0;
    assessmentAnswers = {};
    
    // Show quiz section
    document.querySelector('.quiz-section').style.display = 'block';
    
    // Hide lead form section
    document.getElementById('leadFormSection').style.display = 'none';
    
    // Reset to first question
    displayQuestion();
    
    // Scroll back to assessment
    document.getElementById('assessment').scrollIntoView({ behavior: 'smooth' });
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