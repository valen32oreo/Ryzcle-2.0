// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

// Initialize all portfolio functionality
function initializePortfolio() {
    setupSmoothScrolling();
    setupMobileMenu();
    setupScrollEffects();
    setupAnimations();
    setupFormHandling();
    setupInteractiveElements();
    setupTypingAnimation();
}

// Smooth Scrolling for Navigation Links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// Scroll Effects
function setupScrollEffects() {
    // Header background change on scroll
    window.addEventListener('scroll', throttle(() => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 25px rgba(59, 130, 246, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(59, 130, 246, 0.1)';
            }
        }
    }, 10));

    // Parallax effect for hero section
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroHeight = hero.offsetHeight;
            if (scrolled < heroHeight) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }
    }, 16));
}

// Animation Setup
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Stats counter animation
    setupStatsAnimation();
}

// Statistics Counter Animation
function setupStatsAnimation() {
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, 20);
    }

    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.stat-number');
                numbers.forEach(num => {
                    const target = parseInt(num.textContent);
                    animateCounter(num, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('.about-stats').forEach(stats => {
        statsObserver.observe(stats);
    });
}

// Form Handling
function setupFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }
}

function handleFormSubmission(form) {
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    // Validate form
    if (!validateForm(form)) {
        showFormMessage('Mohon lengkapi semua field yang diperlukan.', 'error');
        return;
    }
    
    // Show loading state
    button.innerHTML = '<span class="loading-dots">Mengirim</span>';
    button.disabled = true;
    button.style.opacity = '0.7';
    
    // Simulate form submission
    setTimeout(() => {
        button.textContent = 'Terkirim! ✓';
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        button.style.opacity = '1';
        
        // Show success message
        showFormMessage('✓ Pesan berhasil dikirim! Saya akan merespon dalam 1x24 jam.', 'success');
        
        // Reset form and button after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
            form.reset();
            removeFormMessage();
        }, 3000);
        
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            field.style.borderColor = 'rgba(59, 130, 246, 0.2)';
        }
    });
    
    return isValid;
}

function showFormMessage(message, type) {
    removeFormMessage(); // Remove any existing message
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    messageDiv.innerHTML = message;
    
    const styles = type === 'success' ? {
        color: '#059669',
        background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
        borderColor: '#10b981'
    } : {
        color: '#dc2626',
        background: 'linear-gradient(135deg, #fef2f2, #fecaca)',
        borderColor: '#ef4444'
    };
    
    messageDiv.style.cssText = `
        color: ${styles.color};
        background: ${styles.background};
        padding: 1rem;
        border-radius: 10px;
        margin-top: 1rem;
        border: 1px solid ${styles.borderColor};
        font-weight: 600;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    
    document.querySelector('.contact-form').appendChild(messageDiv);
}

function removeFormMessage() {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Interactive Elements Setup
function setupInteractiveElements() {
    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-10px) scale(1)';
        });
    });

    // Add ripple effect to buttons
    setupRippleEffect();

    // Logo glitch effect
    setupLogoEffect();
}

// Ripple Effect for Buttons
function setupRippleEffect() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });

    // Add CSS for ripple animation if not exists
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Logo Glitch Effect
function setupLogoEffect() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.textShadow = '2px 0 #3b82f6, -2px 0 #1d4ed8';
            setTimeout(() => {
                logo.style.textShadow = 'none';
            }, 200);
        });
    }
}

// Typing Animation for Hero Title
function setupTypingAnimation() {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;
    
    const titleText = heroTitle.textContent;
    
    // Wait for page load before starting animation
    window.addEventListener('load', () => {
        setTimeout(() => {
            heroTitle.textContent = '';
            heroTitle.style.opacity = '1';
            
            let i = 0;
            const typeWriter = () => {
                if (i < titleText.length) {
                    heroTitle.textContent += titleText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            typeWriter();
        }, 500);
    });
}

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

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

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button (optional)
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    `;
    
    scrollBtn.addEventListener('click', scrollToTop);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    }, 100));
    
    document.body.appendChild(scrollBtn);
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', () => {
    addScrollToTopButton();
});

// Performance optimization: Lazy load images if any
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Dark mode toggle (optional feature)
function setupDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: white;
        border: 2px solid #3b82f6;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
    `;
    
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
    
    // Uncomment to add dark mode toggle
    // document.body.appendChild(darkModeToggle);
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
});

// Initialize lazy loading and other optional features
document.addEventListener('DOMContentLoaded', () => {
    setupLazyLoading();
    // setupDarkMode(); // Uncomment to enable dark mode
});