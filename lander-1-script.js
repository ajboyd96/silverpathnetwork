function startAssessment() {
    // Redirect to the existing assessment quiz
    window.location.href = 'assessment.html';
}

// Optional: Add some basic analytics tracking
document.addEventListener('DOMContentLoaded', function() {
    // Track page load
    console.log('Lander-1 page loaded');
    
    // Add click tracking to all CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('CTA button clicked:', this.textContent);
        });
    });
});