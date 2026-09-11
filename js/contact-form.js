/**
 * HAVEN - Contact Form Handler
 * Handles form validation, submission to Firebase, and UI states
 */

import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

(function() {
    'use strict';

    // Get form elements
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    if (!contactForm) {
        return; // Exit if not on contact page
    }

    // Form fields
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const businessField = document.getElementById('business');
    const projectTypeField = document.getElementById('projectType');
    const budgetField = document.getElementById('budget');
    const timelineField = document.getElementById('timeline');
    const messageField = document.getElementById('message');

    // ========================================
    // VALIDATION FUNCTIONS
    // ========================================

    function validateName(name) {
        return name.trim().length >= 2;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validateProjectType(type) {
        return type.trim().length > 0;
    }

    function validateMessage(message) {
        return message.trim().length >= 10;
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const errorSpan = document.getElementById(fieldId + 'Error');
        
        formGroup.classList.add('error');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
        
        field.setAttribute('aria-invalid', 'true');
    }

    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const errorSpan = document.getElementById(fieldId + 'Error');
        
        formGroup.classList.remove('error');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
        
        field.setAttribute('aria-invalid', 'false');
    }

    function clearAllErrors() {
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(function(group) {
            group.classList.remove('error');
        });
        
        const errorSpans = document.querySelectorAll('.form-error');
        errorSpans.forEach(function(span) {
            span.textContent = '';
        });

        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(function(input) {
            input.setAttribute('aria-invalid', 'false');
        });
    }

    // ========================================
    // REAL-TIME VALIDATION
    // ========================================

    if (nameField) {
        nameField.addEventListener('blur', function() {
            if (!validateName(this.value)) {
                showFieldError('name', 'Please enter your full name');
            } else {
                clearFieldError('name');
            }
        });

        nameField.addEventListener('input', function() {
            if (this.value.length > 0) {
                clearFieldError('name');
            }
        });
    }

    if (emailField) {
        emailField.addEventListener('blur', function() {
            if (!validateEmail(this.value)) {
                showFieldError('email', 'Please enter a valid email address');
            } else {
                clearFieldError('email');
            }
        });

        emailField.addEventListener('input', function() {
            if (this.value.length > 0) {
                clearFieldError('email');
            }
        });
    }

    if (projectTypeField) {
        projectTypeField.addEventListener('change', function() {
            if (!validateProjectType(this.value)) {
                showFieldError('projectType', 'Please select a project type');
            } else {
                clearFieldError('projectType');
            }
        });
    }

    if (messageField) {
        messageField.addEventListener('blur', function() {
            if (!validateMessage(this.value)) {
                showFieldError('message', 'Please provide more details about your project (at least 10 characters)');
            } else {
                clearFieldError('message');
            }
        });

        messageField.addEventListener('input', function() {
            if (this.value.length > 0) {
                clearFieldError('message');
            }
        });
    }

    // ========================================
    // FORM SUBMISSION
    // ========================================

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearAllErrors();

        // Validate all fields
        let isValid = true;

        if (!validateName(nameField.value)) {
            showFieldError('name', 'Please enter your full name');
            isValid = false;
        }

        if (!validateEmail(emailField.value)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!validateProjectType(projectTypeField.value)) {
            showFieldError('projectType', 'Please select a project type');
            isValid = false;
        }

        if (!validateMessage(messageField.value)) {
            showFieldError('message', 'Please provide more details about your project (at least 10 characters)');
            isValid = false;
        }

        if (!isValid) {
            // Focus on first error field
            const firstError = contactForm.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        // Prepare form data
        const formData = {
            name: nameField.value.trim(),
            email: emailField.value.trim(),
            business: businessField.value.trim(),
            projectType: projectTypeField.value,
            budget: budgetField.value,
            timeline: timelineField.value,
            message: messageField.value.trim(),
            createdAt: serverTimestamp(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct'
        };

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            // Submit to Firebase Firestore
            await addDoc(collection(db, 'contactSubmissions'), formData);

            // Success - hide form and show success message
            contactForm.classList.add('hidden');
            formSuccess.classList.add('show');
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Track submission (if analytics is set up)
            if (window.gtag) {
                window.gtag('event', 'form_submission', {
                    event_category: 'Contact',
                    event_label: 'Contact Form'
                });
            }

            console.log('✓ Form submitted successfully');

        } catch (error) {
            console.error('✗ Form submission error:', error);

            // Show error message
            formError.classList.add('show');
            
            // Scroll to error message
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');

            // Track error (if analytics is set up)
            if (window.gtag) {
                window.gtag('event', 'exception', {
                    description: 'Form submission failed',
                    fatal: false
                });
            }
        }
    });

    // ========================================
    // FORM RESET (if needed)
    // ========================================

    window.resetContactForm = function() {
        contactForm.reset();
        contactForm.classList.remove('hidden');
        formSuccess.classList.remove('show');
        formError.classList.remove('show');
        clearAllErrors();
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    };

    // ========================================
    // ACCESSIBILITY: KEYBOARD NAVIGATION
    // ========================================

    contactForm.addEventListener('keydown', function(e) {
        // Allow Enter to submit when not in textarea
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            contactForm.dispatchEvent(new Event('submit'));
        }
    });

    // ========================================
    // AUTO-SAVE TO LOCAL STORAGE (OPTIONAL)
    // ========================================

    const STORAGE_KEY = 'haven_contact_form_draft';

    function saveDraft() {
        const draft = {
            name: nameField.value,
            email: emailField.value,
            business: businessField.value,
            projectType: projectTypeField.value,
            budget: budgetField.value,
            timeline: timelineField.value,
            message: messageField.value,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        } catch (error) {
            console.warn('Could not save draft:', error);
        }
    }

    function loadDraft() {
        try {
            const draft = localStorage.getItem(STORAGE_KEY);
            if (draft) {
                const data = JSON.parse(draft);
                
                // Only load if draft is less than 24 hours old
                const ageHours = (Date.now() - data.timestamp) / (1000 * 60 * 60);
                if (ageHours < 24) {
                    if (nameField.value === '') nameField.value = data.name || '';
                    if (emailField.value === '') emailField.value = data.email || '';
                    if (businessField.value === '') businessField.value = data.business || '';
                    if (projectTypeField.value === '') projectTypeField.value = data.projectType || '';
                    if (budgetField.value === '') budgetField.value = data.budget || '';
                    if (timelineField.value === '') timelineField.value = data.timeline || '';
                    if (messageField.value === '') messageField.value = data.message || '';
                    
                    console.log('✓ Draft loaded from local storage');
                } else {
                    // Remove old draft
                    localStorage.removeItem(STORAGE_KEY);
                }
            }
        } catch (error) {
            console.warn('Could not load draft:', error);
        }
    }

    function clearDraft() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.warn('Could not clear draft:', error);
        }
    }

    // Load draft on page load
    loadDraft();

    // Save draft on input (debounced)
    let draftTimeout;
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            clearTimeout(draftTimeout);
            draftTimeout = setTimeout(saveDraft, 1000);
        });
    });

    // Clear draft on successful submission
    contactForm.addEventListener('submit', function() {
        clearDraft();
    });

    // ========================================
    // SPAM PREVENTION: HONEYPOT (OPTIONAL)
    // ========================================

    // Add hidden honeypot field
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.position = 'absolute';
    honeypot.style.left = '-9999px';
    honeypot.style.width = '1px';
    honeypot.style.height = '1px';
    honeypot.setAttribute('tabindex', '-1');
    honeypot.setAttribute('autocomplete', 'off');
    contactForm.appendChild(honeypot);

    // Check honeypot on submit
    contactForm.addEventListener('submit', function(e) {
        if (honeypot.value !== '') {
            e.preventDefault();
            console.warn('Honeypot triggered - possible spam');
            return false;
        }
    });

    // ========================================
    // CHARACTER COUNT FOR TEXTAREA (OPTIONAL)
    // ========================================

    const maxChars = 1000;
    
    if (messageField) {
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        charCounter.style.fontSize = '0.875rem';
        charCounter.style.color = 'var(--color-text-muted)';
        charCounter.style.marginTop = '0.5rem';
        charCounter.style.textAlign = 'right';
        
        messageField.parentElement.appendChild(charCounter);
        
        function updateCharCount() {
            const remaining = maxChars - messageField.value.length;
            charCounter.textContent = `${messageField.value.length} / ${maxChars} characters`;
            
            if (remaining < 100) {
                charCounter.style.color = 'var(--color-violet-bright)';
            } else {
                charCounter.style.color = 'var(--color-text-muted)';
            }
        }
        
        messageField.setAttribute('maxlength', maxChars);
        messageField.addEventListener('input', updateCharCount);
        updateCharCount();
    }

    console.log('✓ Contact form initialized');

})();
