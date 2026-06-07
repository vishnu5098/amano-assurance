
// ========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');

    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';

        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300); // small smooth delay
    }
});

// ========================================
// NAVBAR SCROLL EFFECT & MOBILE MENU
// ========================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');

// Navbar scroll effect
window.addEventListener('scroll', () => {

    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Scroll to top button visibility
    if (scrollTopBtn) {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    updateActiveNavLink();
});

// Mobile menu toggle
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {

        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent body scrolling when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking links
navLinks.forEach(link => {
    link.addEventListener('click', () => {

        if (hamburger) {
            hamburger.classList.remove('active');
        }

        if (navMenu) {
            navMenu.classList.remove('active');
        }

        // Re-enable scrolling
        document.body.style.overflow = '';
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {

        e.preventDefault();

        const target = document.querySelector(
            this.getAttribute('href')
        );

        if (target) {
            const offsetTop = target.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active nav link
function updateActiveNavLink() {

    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {

        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (
            scrollY > sectionTop &&
            scrollY <= sectionTop + sectionHeight
        ) {
            document.querySelectorAll('.nav-link').forEach(link => {

                link.classList.remove('active');

                if (
                    link.getAttribute('href') === `#${sectionId}`
                ) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Scroll to top button
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    });
}

// ========================================
// FADE-IN SCROLL ANIMATIONS
// ========================================
const fadeElements = document.querySelectorAll('.service-card, .advantage-card, .testimonial-card, .faq-item, .about-content, .contact-content');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(element => {
    element.classList.add('fade-in');
    fadeObserver.observe(element);
});

// ========================================
// TESTIMONIALS SLIDER
// ========================================
const testimonialsTrack = document.getElementById('testimonialsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderDots = document.getElementById('sliderDots');

let currentSlide = 0;
let totalSlides = 0;
let autoPlayInterval;

if (testimonialsTrack && sliderDots) {

    function initializeSlider() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        totalSlides = testimonialCards.length;

        if (totalSlides === 0) return;

        createDots();
        startAutoPlay();
    }

    function createDots() {
        sliderDots.innerHTML = '';

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');

            if (i === 0) {
                dot.classList.add('active');
            }

            dot.addEventListener('click', () => goToSlide(i));
            sliderDots.appendChild(dot);
        }
    }

    function updateSlider() {
        const cardWidth = testimonialsTrack.offsetWidth;

        testimonialsTrack.style.transform =
            `translateX(-${currentSlide * cardWidth}px)`;

        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
        resetAutoPlay();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    // Pause on hover
    testimonialsTrack.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    testimonialsTrack.addEventListener('mouseleave', () => {
        startAutoPlay();
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialsTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;

        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }

            resetAutoPlay();
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        updateSlider();
    });

    initializeSlider();
}

// ========================================
// FAQ ACCORDION
// ========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active', !isActive);
    });
});

// ========================================
// ANIMATED COUNTERS
// ========================================
const counters = document.querySelectorAll('.counter-number');
const counterSection = document.querySelector('.counters');
let countersAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersAnimated) {
        animateCounters();
        countersAnimated = true;
    }
}, { threshold: 0.5 });

if (counterSection) {
    counterObserver.observe(counterSection);
}

function animateCounters() {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
}

// ========================================
// CONTACT FORM SUBMISSION
// ========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.phone || !data.plan) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Phone validation (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(data.phone)) {
            showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }
        
        // Prepare WhatsApp message
        const planNames = {
            'health': 'Health Insurance',
            'term': 'Term Insurance',
            'personal': 'Personal Accident Insurance',
            'child': 'Child Education Plan',
            'pension': 'Pension Plan',
            'ulip': 'Unit Linked Insurance (ULIP)',
            
           
        };
        
        const selectedPlan = planNames[data.plan] || data.plan;
        const message = data.message || 'Not provided';
        
        // Format WhatsApp message
        const whatsappMessage = `
 *NEW INSURANCE QUOTE REQUEST*
━━━━━━━━━━━━━━━━━━━━━━━━━

 *Customer Details:*
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone}

*Insurance Details:*
• Selected Plan: ${selectedPlan}

*Message:*
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━
 *Date:* ${new Date().toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})}

_This inquiry was submitted through Amano Assurance website_`;
        
        //Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage.trim());
        
        // Replace with your WhatsApp number (with country code, no + sign)
        const adminPhoneNumber = '918129585735'; // ← Your WhatsApp number
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Show success message
        showNotification('Opening WhatsApp... Please send the message!', 'success');
        
        // Optional: Reset form after a delay
        setTimeout(() => {
            contactForm.reset();
        }, 2000);
    });
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease forwards',
        maxWidth: 'calc(100% - 40px)'
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// PARALLAX EFFECT FOR HERO SECTION
// ========================================
const heroBgOverlay = document.querySelector('.hero-bg-overlay');

if (heroBgOverlay) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero');
        
        if (heroSection && scrolled < heroSection.offsetHeight) {
            heroBgOverlay.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// ========================================
// SMOOTH REVEAL ON SCROLL
// ========================================
const revealElements = document.querySelectorAll('.section');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease';
    revealObserver.observe(element);
});

// ========================================
// STICKY NAVBAR SMOOTH TRANSITION
// ========================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = 'var(--shadow-md)';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// LAZY LOADING FOR IMAGES
// ========================================
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll event listener
const optimizedScrollHandler = throttle(() => {
    // Navbar scroll effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
    
    updateActiveNavLink();
}, 100);

// Replace the original scroll listener with throttled version
window.removeEventListener('scroll', updateActiveNavLink);
window.addEventListener('scroll', optimizedScrollHandler);

// ========================================
// MOBILE MENU ENHANCEMENTS
// ========================================

// Prevent body scroll when mobile menu is open
hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Keyboard navigation for FAQ
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
        }
    });
});

// Keyboard navigation for slider
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoPlay();
    }
});

// ========================================
// FORM VALIDATION ENHANCEMENTS
// ========================================

// Real-time email validation
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value && !emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = '#ef4444';
        } else {
            emailInput.style.borderColor = '';
        }
    });
}

// Real-time phone validation
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
        const phoneRegex = /^[0-9]{10}$/;
        if (phoneInput.value && !phoneRegex.test(phoneInput.value)) {
            phoneInput.style.borderColor = '#ef4444';
        } else {
            phoneInput.style.borderColor = '';
        }
    });
}

// ========================================
// CONSOLE WELCOME MESSAGE
// ========================================
console.log('%c🛡️ Amano Assurance 🛡️', 'font-size: 20px; font-weight: bold; color: #1e40af;');
console.log('%cWelcome to our website! Built with ❤️ for securing your future.', 'font-size: 12px; color: #64748b;');

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // All initialization code runs here
    console.log('✅ Amano Assurance website loaded successfully!');
    
    // Set initial nav link active state
    updateActiveNavLink();
});

