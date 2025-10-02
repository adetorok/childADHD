// Language Management
let currentLanguage = 'en';

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
    
    // Add smooth scrolling for anchor links
    initializeSmoothScrolling();
    
    // Add fade-in animations
    addFadeInAnimations();
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

// Smooth Scrolling Functions
function initializeSmoothScrolling() {
    // Handle smooth scrolling for buttons
    const scrollButtons = document.querySelectorAll('[onclick*="scrollTo"]');
    scrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
}

function scrollToStudies() {
    const studiesSection = document.getElementById('studies');
    if (studiesSection) {
        studiesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
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
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = currentLanguage === 'en' ? 'Sending...' : 'Enviando...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        e.target.reset();
        
        // Show success message
        showNotification(
            currentLanguage === 'en' 
                ? 'Thank you! We will contact you soon.' 
                : '¡Gracias! Te contactaremos pronto.',
            'success'
        );
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear any error states
        clearAllErrors();
        
    }, 2000);
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
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
        if (isNaN(age) || age < 4 || age > 6) {
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
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '5px';
    
    formGroup.appendChild(errorDiv);
    
    // Add error styling
    field.style.borderColor = '#ff6b6b';
    field.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
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
            age: 'Please enter an age between 4 and 6 years'
        },
        es: {
            required: 'Este campo es obligatorio',
            email: 'Por favor ingresa una dirección de correo válida',
            phone: 'Por favor ingresa un número de teléfono válido',
            age: 'Por favor ingresa una edad entre 4 y 6 años'
        }
    };
    
    return messages[currentLanguage][type] || messages.en[type];
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
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4ecdc4' : type === 'error' ? '#ff6b6b' : '#667eea'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
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

// Utility Functions
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

// Add some interactive elements for children
function addInteractiveElements() {
    // Add click animations to child emojis
    const children = document.querySelectorAll('.child');
    children.forEach(child => {
        child.addEventListener('click', function() {
            this.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Add hover effects to toys
    const toys = document.querySelectorAll('.toy');
    toys.forEach(toy => {
        toy.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.3)';
        });
        toy.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Initialize interactive elements when DOM is loaded
document.addEventListener('DOMContentLoaded', addInteractiveElements);

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
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Initialize touch support
document.addEventListener('DOMContentLoaded', addTouchSupport);
