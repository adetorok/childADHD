// Language Management
let currentLanguage = 'en';
let currentStep = 1;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Show language selection modal on first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        showLanguageModal();
    } else {
        // Load saved language preference
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
            currentLanguage = savedLang;
            updateLanguage(savedLang);
        }
        hideLanguageModal();
    }
    
    // Initialize form handling
    initializeForm();
    
    // Add fade-in animations
    addFadeInAnimations();
    
    // Initialize FAQ functionality
    initializeFAQ();
});

// Language Selection Functions
function showLanguageModal() {
    const modal = document.getElementById('languageModal');
    modal.style.display = 'flex';
}

function hideLanguageModal() {
    const modal = document.getElementById('languageModal');
    modal.style.display = 'none';
}

function selectLanguage(lang) {
    currentLanguage = lang;
    updateLanguage(lang);
    hideLanguageModal();
    
    // Save preferences
    localStorage.setItem('preferredLanguage', lang);
    localStorage.setItem('hasVisited', 'true');
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
    updateLanguage(currentLanguage);
    localStorage.setItem('preferredLanguage', currentLanguage);
}

function updateLanguage(lang) {
    // Update all elements with data attributes
    const elements = document.querySelectorAll('[data-en][data-es]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update current language indicator
    const currentLangSpan = document.getElementById('currentLang');
    if (currentLangSpan) {
        currentLangSpan.textContent = lang.toUpperCase();
    }
    
    // Update form placeholders and options
    updateFormLanguage(lang);
}

function updateFormLanguage(lang) {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Update form labels and placeholders
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const label = group.querySelector('label');
        const input = group.querySelector('input, select, textarea');
        
        if (label && input) {
            const labelText = label.getAttribute(`data-${lang}`);
            if (labelText) {
                label.textContent = labelText;
            }
            
            // Update placeholder for inputs
            if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                const placeholder = input.getAttribute(`data-${lang}-placeholder`);
                if (placeholder) {
                    input.placeholder = placeholder;
                }
            }
        }
    });
    
    // Update select options
    const selectOptions = form.querySelectorAll('option[data-en][data-es]');
    selectOptions.forEach(option => {
        const text = option.getAttribute(`data-${lang}`);
        if (text) {
            option.textContent = text;
        }
    });
}

// Stepper Form Functions
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 3) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function showStep(step) {
    // Hide all steps
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update step indicators
    updateStepIndicators();
}

function updateStepIndicators() {
    const stepNumbers = document.querySelectorAll('.step-number');
    stepNumbers.forEach((number, index) => {
        const stepNum = index + 1;
        if (stepNum <= currentStep) {
            number.style.background = '#0ea5e9';
        } else {
            number.style.background = '#e2e8f0';
        }
    });
}

function validateCurrentStep() {
    const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Form Handling
function initializeForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Add form validation
    form.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Initialize first step
    showStep(1);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all steps
    if (!validateAllSteps()) {
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = currentLanguage === 'en' 
        ? '<i class="fas fa-spinner fa-spin"></i> Submitting...' 
        : '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        e.target.reset();
        currentStep = 1;
        showStep(1);
        
        // Show success message
        showNotification(
            currentLanguage === 'en' 
                ? 'Thank you! We will contact you within 24 hours.' 
                : '¡Gracias! Te contactaremos dentro de 24 horas.',
            'success'
        );
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Clear any error states
        clearAllErrors();
        
    }, 2000);
}

function validateAllSteps() {
    let isValid = true;
    
    for (let step = 1; step <= 3; step++) {
        const stepEl = document.querySelector(`[data-step="${step}"]`);
        const requiredFields = stepEl.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous errors
    clearFieldError(e);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, getErrorMessage('required', fieldName));
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, getErrorMessage('email', fieldName));
            return false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, getErrorMessage('phone', fieldName));
            return false;
        }
    }
    
    // Age validation
    if (fieldName === 'childAge' && value) {
        const age = parseInt(value);
        if (isNaN(age) || age < 4 || age > 5) {
            showFieldError(field, getErrorMessage('age', fieldName));
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // Remove existing error
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc2626;
        font-size: 0.8rem;
        margin-top: 5px;
        font-weight: 500;
    `;
    
    formGroup.appendChild(errorDiv);
    
    // Add error styling
    field.style.borderColor = '#dc2626';
    field.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
}

function clearFieldError(e) {
    const field = e.target;
    const formGroup = field.closest('.form-group');
    
    if (formGroup) {
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Remove error styling
    field.style.borderColor = '';
    field.style.boxShadow = '';
}

function clearAllErrors() {
    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    });
}

function getErrorMessage(type, fieldName) {
    const messages = {
        en: {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid phone number',
            age: 'Please select a valid age (4-5 years)'
        },
        es: {
            required: 'Este campo es obligatorio',
            email: 'Por favor ingresa una dirección de correo válida',
            phone: 'Por favor ingresa un número de teléfono válido',
            age: 'Por favor selecciona una edad válida (4-5 años)'
        }
    };
    
    return messages[currentLanguage][type] || messages.en[type];
}

// FAQ Functions
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => toggleFAQ(question));
    });
}

function toggleFAQ(question) {
    const faqItem = question.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Scroll Functions
function scrollToForm() {
    const form = document.querySelector('.form-container');
    if (form) {
        form.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function scrollToBenefits() {
    const benefits = document.getElementById('benefits');
    if (benefits) {
        benefits.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Animation Functions
function addFadeInAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#dc2626' : '#0ea5e9'};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
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
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close language modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.getElementById('languageModal');
        if (modal && modal.style.display === 'flex') {
            hideLanguageModal();
        }
    }
    
    // Toggle language with Ctrl+L
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        toggleLanguage();
    }
});

// Add touch support for mobile devices
function addTouchSupport() {
    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Initialize touch support
document.addEventListener('DOMContentLoaded', addTouchSupport);