/* register.js - Modular Registration, Live Password Strength, and Modal Coordinator */

import { Validator } from '../utils/validator.js';
import { Toast } from '../components/toast.js';
import { Loader } from '../components/loader.js';

export const RegisterModule = {
    form: null,
    nameInp: null,
    emailInp: null,
    phoneInp: null,
    passwordInp: null,
    confirmInp: null,
    termsCheck: null,
    submitBtn: null,
    alertBox: null,
    toggleBtn: null,
    confirmToggleBtn: null,
    
    // Strength meter DOM nodes
    progressBar: null,
    strengthLabel: null,
    
    init() {
        this.form = document.getElementById('registerForm');
        if (!this.form) return;

        this.nameInp = document.getElementById('nameInput');
        this.emailInp = document.getElementById('emailInput');
        this.phoneInp = document.getElementById('phoneInput');
        this.passwordInp = document.getElementById('passwordInput');
        this.confirmInp = document.getElementById('confirmPasswordInput');
        this.termsCheck = document.getElementById('termsInput');
        this.submitBtn = document.getElementById('submitBtn');
        this.alertBox = document.getElementById('registerAlert');
        
        this.toggleBtn = document.getElementById('passwordToggleBtn');
        this.confirmToggleBtn = document.getElementById('confirmPasswordToggleBtn');
        
        this.progressBar = document.getElementById('strengthProgressBar');
        this.strengthLabel = document.getElementById('strengthLabel');

        this.setupEventListeners();
        this.validateFormState();
    },

    setupEventListeners() {
        // Visibilities
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.togglePasswordVisibility(this.passwordInp, this.toggleBtn));
        }
        if (this.confirmToggleBtn) {
            this.confirmToggleBtn.addEventListener('click', () => this.togglePasswordVisibility(this.confirmInp, this.confirmToggleBtn));
        }

        // Live input validators
        const validateFields = () => {
            this.validateField(this.nameInp, Validator.validateRequired(this.nameInp.value, 'Full name'));
            this.validateField(this.emailInp, Validator.validateEmail(this.emailInp.value));
            this.validateField(this.phoneInp, Validator.validatePhone(this.phoneInp.value));
            
            // Confirm password matching
            const passMatch = this.passwordInp.value === this.confirmInp.value;
            this.validateField(this.confirmInp, {
                isValid: passMatch && this.confirmInp.value !== '',
                errorMsg: 'Passwords do not match.'
            });

            this.validateField(this.termsCheck, {
                isValid: this.termsCheck.checked,
                errorMsg: 'You must agree to the terms.'
            });

            this.validateFormState();
        };

        this.nameInp.addEventListener('input', validateFields);
        this.emailInp.addEventListener('input', validateFields);
        this.phoneInp.addEventListener('input', validateFields);
        this.confirmInp.addEventListener('input', validateFields);
        this.termsCheck.addEventListener('change', validateFields);

        // Live Password Strength Meter evaluator
        this.passwordInp.addEventListener('keyup', () => {
            this.evaluatePasswordStrength();
            validateFields();
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegisterSubmit();
        });
    },

    togglePasswordVisibility(inputNode, buttonNode) {
        const type = inputNode.getAttribute('type') === 'password' ? 'text' : 'password';
        inputNode.setAttribute('type', type);
        
        const icon = buttonNode.querySelector('i');
        if (icon) {
            icon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
        }
    },

    validateField(inputNode, validationResult) {
        // Ignore empty initial checks to avoid annoying invalid outlines on load
        if (inputNode.type === 'checkbox') {
            if (!inputNode.checked) {
                inputNode.classList.remove('is-valid');
                return;
            }
        } else if (inputNode.value.trim() === '') {
            inputNode.classList.remove('is-invalid', 'is-valid');
            return;
        }

        if (validationResult.isValid) {
            inputNode.classList.remove('is-invalid');
            inputNode.classList.add('is-valid');
        } else {
            inputNode.classList.remove('is-valid');
            inputNode.classList.add('is-invalid');
            
            const errorText = inputNode.parentNode.querySelector('.invalid-feedback');
            if (errorText) {
                errorText.textContent = validationResult.errorMsg;
            }
        }
    },

    /**
     * Evaluates strength requirements and checks indicators dynamically.
     */
    evaluatePasswordStrength() {
        const pass = this.passwordInp.value;
        if (pass.length === 0) {
            this.progressBar.style.width = '0%';
            this.strengthLabel.textContent = 'Too Short';
            this.strengthLabel.className = 'text-danger';
            return;
        }

        // Requirements list checks
        const meetsLength = pass.length >= 8;
        const meetsUpper = /[A-Z]/.test(pass);
        const meetsLower = /[a-z]/.test(pass);
        const meetsDigit = /[0-9]/.test(pass);
        const meetsSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

        const toggleReq = (nodeId, met) => {
            const el = document.getElementById(nodeId);
            if (el) {
                if (met) {
                    el.classList.add('req-met');
                } else {
                    el.classList.remove('req-met');
                }
            }
        };

        toggleReq('reqLength', meetsLength);
        toggleReq('reqUpper', meetsUpper);
        toggleReq('reqLower', meetsLower);
        toggleReq('reqDigit', meetsDigit);
        toggleReq('reqSpecial', meetsSpecial);

        // Count met requirements
        const score = [meetsLength, meetsUpper, meetsLower, meetsDigit, meetsSpecial].filter(Boolean).length;
        
        // Reset classes
        this.progressBar.className = 'progress-bar';
        
        let width = '0%';
        let labelText = 'Too Short';
        let labelClass = 'text-danger';

        if (score === 1) {
            width = '20%';
            labelText = 'Weak';
            this.progressBar.classList.add('strength-weak');
            labelClass = 'text-danger';
        } else if (score === 2) {
            width = '40%';
            labelText = 'Fair';
            this.progressBar.classList.add('strength-fair');
            labelClass = 'text-warning';
        } else if (score === 3) {
            width = '60%';
            labelText = 'Good';
            this.progressBar.classList.add('strength-good');
            labelClass = 'text-warning';
        } else if (score === 4) {
            width = '80%';
            labelText = 'Strong';
            this.progressBar.classList.add('strength-strong');
            labelClass = 'text-primary';
        } else if (score === 5) {
            width = '100%';
            labelText = 'Very Strong';
            this.progressBar.classList.add('strength-very-strong');
            labelClass = 'text-success';
        }

        this.progressBar.style.width = width;
        this.strengthLabel.textContent = labelText;
        this.strengthLabel.className = labelClass;
    },

    /**
     * Controls disabled state of button based on fields status.
     */
    validateFormState() {
        const nameVal = Validator.validateRequired(this.nameInp.value, 'Full name');
        const emailVal = Validator.validateEmail(this.emailInp.value);
        const phoneVal = Validator.validatePhone(this.phoneInp.value);
        const passVal = Validator.validatePassword(this.passwordInp.value);
        const passMatch = this.passwordInp.value === this.confirmInp.value && this.confirmInp.value !== '';
        const termsVal = this.termsCheck.checked;

        const isFormValid = nameVal.isValid && emailVal.isValid && phoneVal.isValid && passVal.isValid && passMatch && termsVal;
        this.submitBtn.disabled = !isFormValid;
    },

    /**
     * Action to submit registration variables to mock endpoint.
     */
    async handleRegisterSubmit() {
        this.alertBox.classList.add('d-none');
        Loader.setButtonLoading(this.submitBtn, true);

        const payload = {
            full_name: this.nameInp.value,
            email: this.emailInp.value,
            phone: this.phoneInp.value,
            password: this.passwordInp.value
        };

        try {
            await this.mockRegisterAPI(payload);
            Toast.success('Account created successfully!');
            
            // Launch Bootstrap Modal Dialog on success
            if (typeof bootstrap !== 'undefined') {
                const modalNode = document.getElementById('registerSuccessModal');
                const modal = new bootstrap.Modal(modalNode);
                modal.show();
            } else {
                // Fallback redirect if bootstrap is somehow missing
                window.location.href = 'login.html';
            }

        } catch (err) {
            Loader.setButtonLoading(this.submitBtn, false);
            this.alertBox.classList.remove('d-none');
            
            const errorMsg = err.message || 'Registration failed. Please try again.';
            document.getElementById('registerAlertMsg').textContent = errorMsg;
            Toast.error(errorMsg);
        }
    },

    mockRegisterAPI(payload) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate network error mock
                if (payload.email.includes('networkerror')) {
                    reject(new Error('Network error: connection lost. Please check your router.'));
                    return;
                }

                // Simulate server error mock
                if (payload.email.includes('servererror')) {
                    reject(new Error('Server error (500): Internal server failure.'));
                    return;
                }

                resolve({
                    status: 'success',
                    message: 'User registered successfully'
                });

            }, 1500);
        });
    }
};

// Bootstrap module
document.addEventListener('DOMContentLoaded', () => {
    RegisterModule.init();
});
