/**
 * Universal Mobile Menu Handler
 * Ensures mobile menu works on all pages
 */

function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('🍔 Initializing mobile menu...');
    console.log('Hamburger found:', !!hamburger);
    console.log('Nav menu found:', !!navMenu);
    
    if (hamburger && navMenu) {
        // Remove any existing listeners
        hamburger.replaceWith(hamburger.cloneNode(true));
        const newHamburger = document.querySelector('.hamburger');
        
        // Add click handler for hamburger
        newHamburger.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🍔 Hamburger clicked');
            
            newHamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            console.log('Menu active state:', navMenu.classList.contains('active'));
        });
        
        // Close menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                console.log('🔗 Nav link clicked, closing menu');
                newHamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!newHamburger.contains(e.target) && !navMenu.contains(e.target)) {
                newHamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
        
        console.log('✅ Mobile menu initialized successfully');
    } else {
        console.error('❌ Mobile menu elements not found');
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializeMobileMenu);

// Re-initialize if called manually
window.initializeMobileMenu = initializeMobileMenu;