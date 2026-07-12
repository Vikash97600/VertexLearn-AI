/* forgot-password.js - Forgot Password Logic and Validation */

import { STORAGE_KEYS } from '../config/constants.js';
import { Storage } from '../config/storage.js';
import { Validator } from '../utils/validator.js';
import { Toast } from '../components/toast.js';
import { Loader } from '../components/loader.js';

export const ForgotPasswordModule = {
    form: null,
    emailInp: null,
    submitBtn: null,
    alertBox: null,
    alertMsg: null,

    init() {
        this.form = document.getElementById('forgotForm');
        if (!this.form) return;

        this.emailInp = document.getElementById('emailInput');
        this.submitBtn = document.getElementById('submitBtn');
        this.alertBox = document.getElementById('forgotAlert');
        this.alertMsg = document.getElementById('forgotAlertMsg');

        this.setupEventListeners();
        this.validateFormState();
    },

    setupEventListeners() {
        const validateFields = () => {
            const emailVal = Validator.validateEmail(this.emailInp.value);
            this.validateField(this.emailInp, emailVal);
            this.validateFormState();
        };

        this.emailInp.addEventListener('input', validateFields);

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    },

    validateField(inputNode, validationResult) {
        if (inputNode.value.trim() === '') {
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

    validateFormState() {
        const emailVal = Validator.validateEmail(this.emailInp.value);
        this.submitBtn.disabled = !emailVal.isValid;
    },

    async handleSubmit() {
        this.alertBox.classList.add('d-none');
        this.alertBox.classList.remove('animate-shake');
        Loader.setButtonLoading(this.submitBtn, true);

        const email = this.emailInp.value.trim();

        try {
            // Simulated POST /api/auth/forgot-password API call
            const response = await this.mockForgotPasswordAPI(email);

            // Store recovery email temporarily for OTP page verification
            sessionStorage.setItem('recovery_email', email);

            Toast.success('OTP sent successfully! Redirecting...');
            
            // Redirect to OTP verification page
            setTimeout(() => {
                window.location.href = 'otp-verification.html';
            }, 1200);

        } catch (err) {
            Loader.setButtonLoading(this.submitBtn, false);
            this.alertBox.classList.remove('d-none');
            // Force reflow for shake animation
            void this.alertBox.offsetWidth;
            this.alertBox.classList.add('animate-shake');

            const errorMsg = err.message || 'Email not found. Please try again.';
            this.alertMsg.textContent = errorMsg;
            Toast.error(errorMsg);
        }
    },

    mockForgotPasswordAPI(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate network error mock
                if (email.includes('networkerror')) {
                    reject(new Error('Network disconnected. Please check your connection.'));
                    return;
                }

                // Simulate server error mock
                if (email.includes('servererror')) {
                    reject(new Error('Server unavailable (500). Please try later.'));
                    return;
                }

                // Simulate incorrect/not found email mock
                if (email === 'notfound@example.com') {
                    reject(new Error('Email address not registered. Please register first.'));
                    return;
                }

                resolve({
                    status: 'success',
                    message: 'OTP verification code sent'
                });
            }, 1200);
        });
    }
};

// Bootstrap Module
document.addEventListener('DOMContentLoaded', () => {
    ForgotPasswordModule.init();
});
