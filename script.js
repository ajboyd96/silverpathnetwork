// Quiz data for final expense insurance
const quizData = [
    {
        question: "What is your age?",
        type: "select",
        options: [
            "Under 50",
            "50-60",
            "61-70", 
            "71-80",
            "Over 80"
        ]
    },
    {
        question: "What is your gender?",
        type: "radio",
        options: [
            "Male",
            "Female"
        ]
    },
    {
        question: "Do you currently smoke tobacco?",
        type: "radio",
        options: [
            "Yes",
            "No",
            "I quit within the last 12 months"
        ]
    },
    {
        question: "What coverage amount are you looking for?",
        type: "radio",
        options: [
            "$5,000 - $10,000",
            "$10,000 - $25,000",
            "$25,000 - $50,000",
            "$50,000+"
        ]
    },
    {
        question: "Have you been declined for life insurance in the past?",
        type: "radio",
        options: [
            "Yes",
            "No",
            "I've never applied"
        ]
    },
    {
        question: "Do you have any serious health conditions?",
        type: "radio",
        options: [
            "Yes, multiple conditions",
            "Yes, one condition",
            "Minor health issues",
            "No major health issues"
        ]
    },
    {
        question: "What is your primary goal for this insurance?",
        type: "radio",
        options: [
            "Cover funeral expenses",
            "Pay off debts",
            "Leave money to family",
            "All of the above"
        ]
    },
    {
        question: "When would you like coverage to begin?",
        type: "radio",
        options: [
            "Immediately",
            "Within 30 days",
            "Within 60 days",
            "Just comparing options"
        ]
    }
];

let currentQuestionIndex = 0;
let quizAnswers = {};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize quiz if quiz elements exist
    if (document.getElementById('quizContent')) {
        displayQuestion();
    }
    
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

// Quiz functionality
function startQuiz() {
    currentQuestionIndex = 0;
    quizAnswers = {};
    
    const leadForm = document.getElementById('leadForm');
    const quizContainer = document.querySelector('.quiz-container');
    
    if (leadForm) leadForm.style.display = 'none';
    if (quizContainer) quizContainer.style.display = 'block';
    
    displayQuestion();
    scrollToSection('quiz');
}

function displayQuestion() {
    const question = quizData[currentQuestionIndex];
    const quizContent = document.getElementById('quizContent');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const progressFill = document.getElementById('progressFill');
    
    if (!quizContent) return;
    
    // Update progress
    if (currentQuestionSpan) {
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
    }
    
    if (progressFill) {
        const progressPercentage = ((currentQuestionIndex + 1) / quizData.length) * 100;
        progressFill.style.width = progressPercentage + '%';
    }
    
    // Create question HTML
    let optionsHTML = '';
    
    if (question.type === 'radio') {
        optionsHTML = question.options.map((option, index) => `
            <div class="option" onclick="selectOption(${index}, '${option}')">
                ${option}
            </div>
        `).join('');
    } else if (question.type === 'select') {
        optionsHTML = `
            <select id="questionSelect" onchange="selectFromDropdown()">
                <option value="">Please select...</option>
                ${question.options.map((option, index) => `
                    <option value="${option}">${option}</option>
                `).join('')}
            </select>
        `;
    }
    
    quizContent.innerHTML = `
        <div class="question fade-in-up">
            <h3>${question.question}</h3>
            <div class="question-options">
                ${optionsHTML}
            </div>
        </div>
    `;
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    }
    
    if (nextBtn) {
        nextBtn.textContent = currentQuestionIndex === quizData.length - 1 ? 'Get Quote' : 'Next';
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
    }
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
    quizAnswers[currentQuestionIndex] = value;
    
    // Enable next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
    }
}

function selectFromDropdown() {
    const select = document.getElementById('questionSelect');
    const value = select.value;
    
    if (value) {
        quizAnswers[currentQuestionIndex] = value;
        
        // Enable next button
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
        }
    }
}

function nextQuestion() {
    if (!quizAnswers[currentQuestionIndex]) {
        alert('Please select an answer before continuing.');
        return;
    }
    
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        // Quiz completed, show lead form
        showLeadForm();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function showLeadForm() {
    const quizContainer = document.querySelector('.quiz-container');
    const leadForm = document.getElementById('leadForm');
    
    if (quizContainer) quizContainer.style.display = 'none';
    if (leadForm) {
        leadForm.style.display = 'block';
        // Scroll to lead form
        leadForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form submissions
function submitLead(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const leadData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        zip: formData.get('zip'),
        bestTime: formData.get('bestTime'),
        quizAnswers: quizAnswers,
        timestamp: new Date().toISOString(),
        source: 'silverpathnetwork.com'
    };
    
    // Add quiz answers to hidden field for Netlify forms
    const quizAnswersField = document.getElementById('quizAnswersField');
    if (quizAnswersField) {
        quizAnswersField.value = JSON.stringify(quizAnswers);
    }
    
    // Here you would typically send the data to your server
    console.log('Lead Data:', leadData);
    
    // For demo purposes, show success message
    alert('Thank you! Your information has been submitted. A licensed agent will contact you within 24 hours.');
    
    // Reset quiz for demo
    resetQuiz();
}

function submitContact(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        timestamp: new Date().toISOString(),
        source: 'contact-form'
    };
    
    // Here you would typically send the data to your server
    console.log('Contact Data:', contactData);
    
    // Show success message
    alert('Thank you for your message! We will get back to you within 24 hours.');
    
    // Reset form
    event.target.reset();
}

function resetQuiz() {
    currentQuestionIndex = 0;
    quizAnswers = {};
    
    const leadForm = document.getElementById('leadForm');
    const quizContainer = document.querySelector('.quiz-container');
    
    if (leadForm) leadForm.style.display = 'none';
    if (quizContainer) quizContainer.style.display = 'block';
    
    displayQuestion();
}

// Utility functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
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
    const elementsToObserve = document.querySelectorAll('.feature-card, .stat');
    elementsToObserve.forEach(el => observer.observe(el));
});