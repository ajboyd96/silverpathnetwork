// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Form validation
    function validateForm(formData) {
        const required = ['firstName', 'lastName', 'email', 'phone'];
        const errors = [];
        
        required.forEach(field => {
            if (!formData.get(field) || formData.get(field).trim() === '') {
                errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
            }
        });
        
        // Email validation
        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }
        
        // Phone validation (basic)
        const phone = formData.get('phone');
        const phoneRegex = /^[\d\s\-\(\)\+\.]{10,}$/;
        if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
            errors.push('Please enter a valid phone number');
        }
        
        return errors;
    }
    
    // Format phone number
    function formatPhoneNumber(phone) {
        // Remove all non-digits
        const cleaned = phone.replace(/\D/g, '');
        
        // Add +1 if it's a 10-digit US number
        if (cleaned.length === 10) {
            return `+1${cleaned}`;
        } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
            return `+${cleaned}`;
        }
        return phone; // Return original if can't format
    }
    
    // Show message
    function showMessage(type, message) {
        hideMessages();
        
        if (type === 'success') {
            successMessage.textContent = message || 'Thank you! Your message has been sent successfully. We\'ll contact you within 24 hours.';
            successMessage.style.display = 'block';
            contactForm.reset();
        } else {
            errorMessage.textContent = message || 'There was an error sending your message. Please try again or call us directly at (833) 738-2671.';
            errorMessage.style.display = 'block';
        }
        
        // Scroll to top of form
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function hideMessages() {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    }
    
    // Submit button loading state
    function setLoadingState(loading) {
        const submitBtn = contactForm.querySelector('.submit-btn');
        if (loading) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
        } else {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    }
    
    // Form submission handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideMessages();
        
        const formData = new FormData(contactForm);
        
        // Validate form
        const errors = validateForm(formData);
        if (errors.length > 0) {
            showMessage('error', 'Please fix the following errors:\n• ' + errors.join('\n• '));
            return;
        }
        
        setLoadingState(true);
        
        // Format phone number
        const formattedPhone = formatPhoneNumber(formData.get('phone'));
        
        // Prepare data for submission
        const contactData = {
            action: 'contact_form',
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formattedPhone,
            age: formData.get('age') || 'Not specified',
            coverage: formData.get('coverage') || 'Not specified',
            subject: formData.get('subject') || 'General Inquiry',
            message: formData.get('message') || 'No message provided',
            smsConsent: formData.get('smsConsent') === 'yes' ? 'Yes' : 'No',
            timestamp: new Date().toISOString(),
            source: 'Contact Form',
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct'
        };
        
        try {
            // Submit to your existing Google Apps Script endpoint
            const response = await fetch('https://script.google.com/macros/s/AKfycbzJUlMw6PG5iLFy6aTBaZd7WrVnWKfEhQ8FiOZwEcD2wcIM2v_hHrNJyjWEapAPbUD5/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData)
            });
            
            // Since we're using no-cors, we can't read the response
            // But if we get here without error, submission likely succeeded
            console.log('Contact form submitted successfully');
            
            // Track with Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'Contact',
                    event_label: 'Contact Form Submission'
                });
            }
            
            // Track with Facebook Pixel if available
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Contact', {
                    content_name: 'Contact Form',
                    content_category: 'Contact'
                });
            }
            
            showMessage('success');
            
        } catch (error) {
            console.error('Contact form submission error:', error);
            
            // Fallback: try to open email client
            const emailSubject = encodeURIComponent(`Contact Form: ${contactData.subject}`);
            const emailBody = encodeURIComponent(`
Name: ${contactData.firstName} ${contactData.lastName}
Email: ${contactData.email}
Phone: ${contactData.phone}
Age: ${contactData.age}
Coverage: ${contactData.coverage}
SMS Consent: ${contactData.smsConsent}

Message:
${contactData.message}

---
Submitted: ${new Date().toLocaleString()}
Source: Contact Form
            `);
            
            const mailtoLink = `mailto:info@silverpathnetwork.com?subject=${emailSubject}&body=${emailBody}`;
            
            showMessage('error', 'There was an issue with the automatic submission. We\'ve prepared an email for you - please click OK and send it, or call us directly at (833) 738-2671.');
            
            // Small delay then open email client
            setTimeout(() => {
                window.location.href = mailtoLink;
            }, 2000);
        }
        
        setLoadingState(false);
    });
    
    // Phone number formatting on input
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        
        e.target.value = value;
    });
    
    // Form field enhancements
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value.trim() !== '') {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });
        
        // Initial state check
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('filled');
        }
    });
    
    console.log('Contact form initialized successfully');
});