/**
 * HAVEN - Main JavaScript
 * Core website functionality with fixed routing
 */

(function() {
    'use strict';

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================

    const header = document.getElementById('header');

    function handleHeaderScroll() {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // ========================================
    // MOBILE MENU
    // ========================================

    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
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
                
                // Close all items
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
            
            if (href === '#' || href.length <= 1) {
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
                
                closeMobileMenu();
            }
        });
    });

    // ========================================
    // ACTIVE NAV LINK
    // ========================================

    function updateActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(function(link) {
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref.split('/').pop();
            
            link.classList.remove('active');
            
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage === 'index.html' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    updateActiveNavLink();


    // ========================================
    // HAVEN CREATIVE MICRO-INTERACTIONS
    // ========================================

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Typewriter hero message
    const typewriter = document.querySelector('[data-typewriter]');
    if (typewriter) {
        const output = typewriter.querySelector('.typewriter-output');
        const cursor = typewriter.querySelector('.typewriter-cursor');
        const text = "Welcome to HAVEN. We build premium websites and digital experiences made for modern brands.";
        let index = 0;
        const startDelay = 650;
        const speed = 32;

        function finishTypewriter() {
            if (output) output.textContent = text;
            if (cursor) cursor.classList.add('is-hidden');
        }

        if (reduceMotion) {
            finishTypewriter();
        } else {
            window.setTimeout(function() {
                const timer = window.setInterval(function() {
                    if (!output) {
                        window.clearInterval(timer);
                        return;
                    }
                    output.textContent = text.slice(0, index + 1);
                    index += 1;
                    if (index >= text.length) {
                        window.clearInterval(timer);
                        if (cursor) cursor.classList.add('is-hidden');
                    }
                }, speed);
            }, startDelay);
        }
    }

    // Magnetic CTA — desktop pointer devices only
    const magneticButtons = document.querySelectorAll('.magnetic-cta');
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    if (!reduceMotion && finePointer) {
        magneticButtons.forEach(function(button) {
            button.addEventListener('pointermove', function(e) {
                const rect = button.getBoundingClientRect();
                const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
                const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;

                button.style.setProperty('--magnetic-x', `${Math.max(-8, Math.min(8, x * 10))}px`);
                button.style.setProperty('--magnetic-y', `${Math.max(-6, Math.min(6, y * 8))}px`);
            });

            button.addEventListener('pointerleave', function() {
                button.style.setProperty('--magnetic-x', '0px');
                button.style.setProperty('--magnetic-y', '0px');
            });
        });
    }

    // Playful runaway CTA — only on desktop, never for important actions
    const runawayButton = document.querySelector('.runaway-cta');
    if (!reduceMotion && finePointer && runawayButton) {
        runawayButton.addEventListener('pointerenter', function(e) {
            const rect = runawayButton.getBoundingClientRect();
            const distanceX = e.clientX - (rect.left + rect.width / 2);
            const distanceY = e.clientY - (rect.top + rect.height / 2);
            const directionX = distanceX >= 0 ? -1 : 1;
            const directionY = distanceY >= 0 ? -1 : 1;

            const moveX = directionX * (18 + Math.random() * 22);
            const moveY = directionY * (8 + Math.random() * 14);

            runawayButton.classList.add('is-escaping');
            runawayButton.style.transform = `translate(${moveX}px, ${moveY}px)`;
            window.setTimeout(function() {
                runawayButton.classList.remove('is-escaping');
                runawayButton.style.transform = '';
            }, 420);
        });
    }

    // Copy HAVEN contact email
    document.querySelectorAll('.copy-email-cta').forEach(function(button) {
        button.addEventListener('click', async function() {
            const email = button.getAttribute('data-copy-email');
            if (!email) return;

            try {
                await navigator.clipboard.writeText(email);
                const original = button.innerHTML;
                button.classList.add('copied');
                const label = button.querySelector('span');
                if (label) label.textContent = 'Copied!';
                window.setTimeout(function() {
                    button.classList.remove('copied');
                    button.innerHTML = original;
                }, 1400);
            } catch (error) {
                window.location.href = `mailto:${email}`;
            }
        });
    });

    // AVP cursor awareness
    const avpCharacter = document.getElementById('avpCharacter');
    if (!reduceMotion && finePointer && avpCharacter) {
        window.addEventListener('pointermove', function(e) {
            const rect = avpCharacter.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = Math.max(-1, Math.min(1, (e.clientX - centerX) / 280));
            const dy = Math.max(-1, Math.min(1, (e.clientY - centerY) / 260));

            avpCharacter.style.setProperty('--avp-look-x', `${dx * 7}px`);
            avpCharacter.style.setProperty('--avp-look-y', `${dy * 4}px`);
        }, { passive: true });
    }

    // ========================================
    // FORM HELPERS
    // ========================================

    window.validateEmail = function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    window.showFieldError = function(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        const formGroup = field.closest('.form-group');
        const errorSpan = document.getElementById(fieldId + 'Error');
        
        if (formGroup) formGroup.classList.add('error');
        if (errorSpan) errorSpan.textContent = message;
    };

    window.clearFieldError = function(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        const formGroup = field.closest('.form-group');
        const errorSpan = document.getElementById(fieldId + 'Error');
        
        if (formGroup) formGroup.classList.remove('error');
        if (errorSpan) errorSpan.textContent = '';
    };

    window.clearAllErrors = function() {
        document.querySelectorAll('.form-group').forEach(function(group) {
            group.classList.remove('error');
        });
        
        document.querySelectorAll('.form-error').forEach(function(span) {
            span.textContent = '';
        });
    };

    // ========================================
    // PREVENT ORPHANED WORDS
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preventOrphans);
    } else {
        preventOrphans();
    }

    // ========================================
    // ACCESSIBILITY
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
    // REDUCED MOTION
    // ========================================

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-base', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    }

    // ========================================
    // SAFARI VIEWPORT FIX
    // ========================================

    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', function() {
        setVH();
    });

    // ========================================
    // CONSOLE
    // ========================================

    console.log(
        '%c HAVEN ',
        'background: linear-gradient(135deg, #8B5CFF, #A66CFF); color: white; padding: 8px 16px; font-size: 16px; font-weight: bold; border-radius: 4px;'
    );
    console.log(
        '%c Your Vision. Our Creation. ',
        'color: #B7B0C8; font-size: 12px; margin-top: 8px;'
    );

    console.log('✓ HAVEN initialized');

})();
