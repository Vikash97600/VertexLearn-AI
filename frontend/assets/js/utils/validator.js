/* validator.js - Front-End Form Validation Utilities */

/**
 * Reusable validation return structure
 * @typedef {object} ValidationResult
 * @property {boolean} isValid
 * @property {string} errorMsg
 */

export const Validator = {
    /**
     * Validate email format
     * @param {string} email 
     * @returns {ValidationResult}
     */
    validateEmail(email) {
        if (!email || email.trim() === '') {
            return { isValid: false, errorMsg: 'Email address is required.' };
        }
        
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            return { isValid: false, errorMsg: 'Please enter a valid email address.' };
        }
        
        return { isValid: true, errorMsg: '' };
    },

    /**
     * Validate password strength (Enterprise style)
     * - Minimum 8 characters
     * - At least one uppercase letter
     * - At least one lowercase letter
     * - At least one number
     * - At least one special character
     * @param {string} password 
     * @returns {ValidationResult}
     */
    validatePassword(password) {
        if (!password) {
            return { isValid: false, errorMsg: 'Password is required.' };
        }

        if (password.length < 8) {
            return { isValid: false, errorMsg: 'Password must be at least 8 characters long.' };
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
            return { 
                isValid: false, 
                errorMsg: 'Password must contain uppercase, lowercase, a number, and a special character.' 
            };
        }

        return { isValid: true, errorMsg: '' };
    },

    /**
     * Validate phone number format (E.164 standard)
     * @param {string} phone 
     * @returns {ValidationResult}
     */
    validatePhone(phone) {
        if (!phone || phone.trim() === '') {
            return { isValid: true, errorMsg: '' }; // Phone is optional in standard flows
        }

        const regex = /^\+?[1-9]\d{1,14}$/;
        if (!regex.test(phone.replace(/[\s()-]/g, ''))) {
            return { isValid: false, errorMsg: 'Please enter a valid phone number (e.g., +1234567890).' };
        }

        return { isValid: true, errorMsg: '' };
    },

    /**
     * Validate required field
     * @param {string|number} value 
     * @param {string} fieldName 
     * @returns {ValidationResult}
     */
    validateRequired(value, fieldName = 'Field') {
        if (value === undefined || value === null || String(value).trim() === '') {
            return { isValid: false, errorMsg: `${fieldName} is required.` };
        }
        return { isValid: true, errorMsg: '' };
    }
};
