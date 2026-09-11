/**
 * HAVEN - Main JavaScript
 * Handles core website functionality
 */

(function() {
    'use strict';

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================

    const header = document.getElementById('header');
    let lastScrollTop = 0;

    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================

    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileToggle.classList.add('active');
        body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        body.style.overflow = '';
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // Close menu when clicking a link
    mobileNavLinks.forEach(function(link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================

    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(function(element) {
        observer.observe(element);
    });

    // ========================================
    // FAQ ACCORDION
    // ========================================

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(function(faq) {
                    faq.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================

    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });

    // ========================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ========================================

    function updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(function(link) {
            const linkPath = new URL(link.href).pathname;
            
            link.classList.remove('active');
            
            if (linkPath === currentPath || (currentPath === '/' && linkPath === '/index.html')) {
                link.classList.add('active');
            }
        });
    }

    updateActiveNavLink();

    // ========================================
    // CONTACT FORM - URL PARAMETERS
    // ========================================

    function populateFormFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Template selection
        const template = urlParams.get('template');
        if (template) {
            const messageField = document.getElementById('message');
            if (messageField && !messageField.value) {
                messageField.value = `I'm interested in the ${template} template.`;
            }
        }
        
        // Pricing plan selection
        const plan = urlParams.get('plan');
        if (plan) {
            const messageField = document.getElementById('message');
            const budgetField = document.getElementById('budget');
            
            if (messageField && !messageField.value) {
                const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
                messageField.value = `I'm interested in the ${planName} plan.`;
            }
            
            if (budgetField && plan === 'starter') {
                budgetField.value = '300-600';
            } else if (budgetField && plan === 'growth') {
                budgetField.value = '600-1000';
            } else if (budgetField && plan === 'premium') {
                budgetField.value = '1000-plus';
            }
        }
    }

    // Run on contact page
    if (window.location.pathname.includes('contact')) {
        populateFormFromURL();
    }

    // ========================================
    // LAZY LOADING IMAGES (if needed)
    // ========================================

    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(function(img) {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ========================================
    // PREVENT ORPHANED WORDS IN HEADINGS
    // ========================================

    function preventOrphans() {
        const headings = document.querySelectorAll('h1, h2, h3, .hero-headline, .page-title, .section-title');
        
        headings.forEach(function(heading) {
            const text = heading.innerHTML.trim();
            const words = text.split(' ');
            
            if (words.length > 2) {
                const lastTwoWords = words.slice(-2).join('&nbsp;');
                const remainingWords = words.slice(0, -2).join(' ');
                heading.innerHTML = remainingWords + ' ' + lastTwoWords;
            }
        });
    }

    // Run after DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preventOrphans);
    } else {
        preventOrphans();
    }

    // ========================================
    // FORM VALIDATION HELPER
    // ========================================

    window.validateEmail = function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    window.showFieldError = function(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const errorSpan = document.getElementById(fieldId + 'Error');
        
        formGroup.classList.add('error');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    };

    window.clearFieldError = function(fieldId) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const errorSpan = document.getElementById(fieldId + 'Error');
        
        formGroup.classList.remove('error');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    };

    window.clearAllErrors = function() {
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(function(group) {
            group.classList.remove('error');
        });
        
        const errorSpans = document.querySelectorAll('.form-error');
        errorSpans.forEach(function(span) {
            span.textContent = '';
        });
    };

    // ========================================
    // PERFORMANCE: REDUCE SCROLL EVENTS
    // ========================================

    let scrollTimeout;
    let isScrolling = false;

    function optimizedScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                handleHeaderScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }

    window.addEventListener('scroll', optimizedScroll, { passive: true });

    // ========================================
    // ACCESSIBILITY: FOCUS VISIBLE
    // ========================================

    function handleFirstTab(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
            window.removeEventListener('keydown', handleFirstTab);
            window.addEventListener('mousedown', handleMouseDownOnce);
        }
    }

    function handleMouseDownOnce() {
        document.body.classList.remove('user-is-tabbing');
        window.removeEventListener('mousedown', handleMouseDownOnce);
        window.addEventListener('keydown', handleFirstTab);
    }

    window.addEventListener('keydown', handleFirstTab);

    // ========================================
    // CONSOLE MESSAGE
    // ========================================

    console.log(
        '%c HAVEN ',
        'background: linear-gradient(135deg, #8B5CFF, #A66CFF); color: white; padding: 8px 16px; font-size: 16px; font-weight: bold; border-radius: 4px;'
    );
    console.log(
        '%c Built with care by HAVEN • https://havenweb.design ',
        'color: #B7B0C8; font-size: 12px; margin-top: 8px;'
    );

    // ========================================
    // INITIALIZATION COMPLETE
    // ========================================

    console.log('✓ HAVEN scripts initialized');

})();

// ========================================
// UTILITY: DEBOUNCE FUNCTION
// ========================================

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

// ========================================
// UTILITY: THROTTLE FUNCTION
// ========================================

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

// ========================================
// PREFERS REDUCED MOTION
// ========================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-fast', '0.01ms');
    document.documentElement.style.setProperty('--transition-base', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
}

// ========================================
// SAFARI VIEWPORT HEIGHT FIX
// ========================================

function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', debounce(setVH, 250));
