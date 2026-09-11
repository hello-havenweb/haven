/**
 * HAVEN Contact Form
 * Handles template/package auto-fill and form submission
 */

(function() {
    'use strict';

    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    if (!contactForm) return;

    // Auto-fill from URL parameters
    function autoFillFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Template selection
        const template = urlParams.get('template');
        if (template) {
            const templateSelect = document.getElementById('template');
            if (templateSelect) {
                templateSelect.value = template;
                highlightField(templateSelect);
            }
        }
        
        // Package selection
        const packageParam = urlParams.get('package');
        if (packageParam) {
            const packageSelect = document.getElementById('package');
            if (packageSelect) {
                packageSelect.value = packageParam;
                highlightField(packageSelect);
            }
        }
    }

    // Highlight pre-filled field
    function highlightField(field) {
        field.style.border = '2px solid #8B5CFF';
        field.style.background = 'rgba(139, 92, 255, 0.05)';
        setTimeout(() => {
            field.style.border = '';
            field.style.background = '';
        }, 2000);
    }

    // Auto-detect country
    async function autoDetectCountry() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const countrySelect = document.getElementById('country');
            
            if (countrySelect && data.country_code) {
                const countryOption = countrySelect.querySelector(`option[value="${data.country_code}"]`);
                if (countryOption) {
                    countrySelect.value = data.country_code;
                }
            }
        } catch (error) {
            console.log('Country detection unavailable');
        }
    }

    // Form validation
    function validateField(field, errorId, validationFn, errorMessage) {
        const value = field.value.trim();
        const errorSpan = document.getElementById(errorId);
        
        if (!validationFn(value)) {
            field.closest('.form-group').classList.add('error');
            if (errorSpan) errorSpan.textContent = errorMessage;
            return false;
        } else {
            field.closest('.form-group').classList.remove('error');
            if (errorSpan) errorSpan.textContent = '';
            return true;
        }
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateForm() {
        let isValid = true;

        // Name validation
        if (!validateField(
            document.getElementById('name'),
            'nameError',
            (val) => val.length >= 2,
            'Please enter your full name'
        )) isValid = false;

        // Email validation
        if (!validateField(
            document.getElementById('email'),
            'emailError',
            validateEmail,
            'Please enter a valid email address'
        )) isValid = false;

        // Business name validation
        if (!validateField(
            document.getElementById('businessName'),
            'businessNameError',
            (val) => val.length >= 2,
            'Please enter your business name'
        )) isValid = false;

        // Business type validation
        const businessType = document.getElementById('businessType');
        if (!businessType.value) {
            businessType.closest('.form-group').classList.add('error');
            document.getElementById('businessTypeError').textContent = 'Please select your business type';
            isValid = false;
        } else {
            businessType.closest('.form-group').classList.remove('error');
            document.getElementById('businessTypeError').textContent = '';
        }

        // Pages validation
        if (!validateField(
            document.getElementById('pages'),
            'pagesError',
            (val) => val.length >= 3,
            'Please list the pages you need'
        )) isValid = false;

        // Message validation
        if (!validateField(
            document.getElementById('message'),
            'messageError',
            (val) => val.length >= 20,
            'Please provide more details about your project (minimum 20 characters)'
        )) isValid = false;

        return isValid;
    }

    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Collect form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            country: document.getElementById('country').value,
            businessName: document.getElementById('businessName').value.trim(),
            businessType: document.getElementById('businessType').value,
            template: document.getElementById('template').value,
            package: document.getElementById('package').value,
            pages: document.getElementById('pages').value.trim(),
            features: document.getElementById('features').value.trim(),
            domainStatus: document.getElementById('domainStatus').value,
            hostingStatus: document.getElementById('hostingStatus').value,
            message: document.getElementById('message').value.trim(),
            timeline: document.getElementById('timeline').value,
            budget: document.getElementById('budget').value,
            timestamp: new Date().toISOString(),
            source: 'haven_website'
        };

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            // Here you would normally send to your backend/Firebase
            // For now, we'll simulate submission
            await simulateSubmission(formData);

            // Success
            contactForm.style.display = 'none';
            formSuccess.classList.add('show');
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Track success (if analytics)
            if (window.gtag) {
                window.gtag('event', 'form_submission', {
                    event_category: 'Contact',
                    event_label: 'Project Inquiry'
                });
            }

        } catch (error) {
            console.error('Submission error:', error);
            formError.classList.add('show');
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });

    // Simulate submission (replace with actual Firebase/backend integration)
    function simulateSubmission(data) {
        return new Promise((resolve, reject) => {
            console.log('Form Data:', data);
            
            // Simulate network delay
            setTimeout(() => {
                // Simulate success
                resolve();
                
                // To simulate error, use:
                // reject(new Error('Network error'));
            }, 1500);
        });
    }

    // Real-time validation
    const fields = [
        { id: 'name', errorId: 'nameError', validator: (val) => val.length >= 2, msg: 'Please enter your full name' },
        { id: 'email', errorId: 'emailError', validator: validateEmail, msg: 'Please enter a valid email' },
        { id: 'businessName', errorId: 'businessNameError', validator: (val) => val.length >= 2, msg: 'Please enter business name' },
        { id: 'pages', errorId: 'pagesError', validator: (val) => val.length >= 3, msg: 'Please list required pages' },
        { id: 'message', errorId: 'messageError', validator: (val) => val.length >= 20, msg: 'Please provide more details' }
    ];

    fields.forEach(({ id, errorId, validator, msg }) => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener('blur', () => {
                if (field.value.trim()) {
                    validateField(field, errorId, validator, msg);
                }
            });
            
            field.addEventListener('input', () => {
                if (field.closest('.form-group').classList.contains('error')) {
                    validateField(field, errorId, validator, msg);
                }
            });
        }
    });

    // Initialize
    autoFillFromURL();
    autoDetectCountry();

    console.log('✓ Contact form initialized');

})();
