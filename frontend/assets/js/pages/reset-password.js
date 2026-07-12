/* reset-password.js - Passwords Strength Meter, Match validations, and Success transitions */

import { Validator } from '../utils/validator.js';
import { Toast } from '../components/toast.js';
import { Loader } from '../components/loader.js';

export const ResetPasswordModule = {
    form: null,
    passwordInp: null,
    confirmInp: null,
    submitBtn: null,
    alertBox: null,
    alertMsg: null,
    
    // Toggles
    toggleBtn: null,
    confirmToggleBtn: null,

    // Match Label DOM Elements
    matchIndicatorLabel: null,
    matchIndicatorIcon: null,
    matchIndicatorText: null,

    // Strength Progress Bar
    progressBar: null,
    strengthLabel: null,

    // Layout contents swap
    formContainer: null,
    successContent: null,

    init() {
        this.form = document.getElementById('resetForm');
        if (!this.form) return;

        this.passwordInp = document.getElementById('passwordInput');
        this.confirmInp = document.getElementById('confirmPasswordInput');
        this.submitBtn = document.getElementById('submitBtn');
        this.alertBox = document.getElementById('resetAlert');
        this.alertMsg = document.getElementById('resetAlertMsg');

        this.toggleBtn = document.getElementById('passwordToggleBtn');
        this.confirmToggleBtn = document.getElementById('confirmPasswordToggleBtn');

        this.matchIndicatorLabel = document.getElementById('matchIndicatorLabel');
        this.matchIndicatorIcon = document.getElementById('matchIndicatorIcon');
        this.matchIndicatorText = document.getElementById('matchIndicatorText');

        this.progressBar = document.getElementById('strengthProgressBar');
        this.strengthLabel = document.getElementById('strengthLabel');

        this.formContainer = document.getElementById('resetFormContent');
        this.successContent = document.getElementById('successScreenContent');

        this.checkFlowVerificationBypass();
        this.setupEventListeners();
        this.validateFormState();
    },

    /**
     * Reassures valid flow sequence state without breaking sandbox refresh tests.
     */
    checkFlowVerificationBypass() {
        const otpVerified = sessionStorage.getItem('otp_verified_token');
        if (!otpVerified) {
            Toast.warning('Security Notice: You bypassed OTP verification steps. Displaying page for UI inspection only.');
        }
    },

    setupEventListeners() {
        // Passwords visibilities toggle buttons
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.togglePasswordVisibility(this.passwordInp, this.toggleBtn));
        }
        if (this.confirmToggleBtn) {
            this.confirmToggleBtn.addEventListener('click', () => this.togglePasswordVisibility(this.confirmInp, this.confirmToggleBtn));
        }

        // Live input validators
        const validateFields = () => {
            this.validateMatchIndicator();
            this.validateFormState();
        };

        this.confirmInp.addEventListener('input', validateFields);

        // Keyup password strength
        this.passwordInp.addEventListener('keyup', () => {
            this.evaluatePasswordStrength();
            validateFields();
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleResetSubmit();
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

    evaluatePasswordStrength() {
        const pass = this.passwordInp.value;
        if (pass.length === 0) {
            this.progressBar.style.width = '0%';
            this.strengthLabel.textContent = 'Too Short';
            this.strengthLabel.className = 'text-danger';
            return;
        }

        // Checklist checks
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

        const score = [meetsLength, meetsUpper, meetsLower, meetsDigit, meetsSpecial].filter(Boolean).length;
        
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
            labelText = 'Excellent';
            this.progressBar.classList.add('strength-very-strong');
            labelClass = 'text-success';
        }

        this.progressBar.style.width = width;
        this.strengthLabel.textContent = labelText;
        this.strengthLabel.className = labelClass;
    },

    validateMatchIndicator() {
        const pass = this.passwordInp.value;
        const confirm = this.confirmInp.value;

        if (confirm.trim() === '') {
            this.matchIndicatorLabel.classList.add('d-none');
            return;
        }

        this.matchIndicatorLabel.classList.remove('d-none');

        if (pass === confirm) {
            this.matchIndicatorIcon.className = 'bi bi-check-circle text-success text-xs';
            this.matchIndicatorText.textContent = 'Passwords Match';
            this.matchIndicatorText.className = 'text-xs fw-semibold text-success';
            this.confirmInp.classList.remove('is-invalid');
            this.confirmInp.classList.add('is-valid');
        } else {
            this.matchIndicatorIcon.className = 'bi bi-exclamation-circle text-danger text-xs';
            this.matchIndicatorText.textContent = 'Passwords Do Not Match';
            this.matchIndicatorText.className = 'text-xs fw-semibold text-danger';
            this.confirmInp.classList.remove('is-valid');
            this.confirmInp.classList.add('is-invalid');
        }
    },

    validateFormState() {
        const passVal = Validator.validatePassword(this.passwordInp.value);
        const passMatch = this.passwordInp.value === this.confirmInp.value && this.confirmInp.value !== '';
        
        this.submitBtn.disabled = !(passVal.isValid && passMatch);
    },

    async handleResetSubmit() {
        this.alertBox.classList.add('d-none');
        this.alertBox.classList.remove('animate-shake');
        Loader.setButtonLoading(this.submitBtn, true);

        const email = sessionStorage.getItem('recovery_email') || 'student@vertexlearn.ai';
        const password = this.passwordInp.value;

        try {
            // Simulated POST /api/auth/reset-password API request
            await this.mockResetAPI(email, password);

            // Clean storage elements
            sessionStorage.removeItem('otp_verified_token');
            sessionStorage.removeItem('recovery_email');
            sessionStorage.removeItem('otp_timer_end');

            Toast.success('Password updated successfully!');

            // Swap out forms inline with animation transition
            setTimeout(() => {
                this.formContainer.classList.add('d-none');
                this.successContent.classList.remove('d-none');
            }, 1000);

        } catch (err) {
            Loader.setButtonLoading(this.submitBtn, false);
            this.alertBox.classList.remove('d-none');
            // Force reflow for shake
            void this.alertBox.offsetWidth;
            this.alertBox.classList.add('animate-shake');

            this.alertMsg.textContent = err.message || 'Failed to reset password. Please try again.';
            Toast.error(this.alertMsg.textContent);
        }
    },

    mockResetAPI(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate network error mock
                if (password.includes('networkerror')) {
                    reject(new Error('Network disconnected. Please check your connection.'));
                    return;
                }

                // Simulate server error mock
                if (password.includes('servererror')) {
                    reject(new Error('Server unavailable (500). Please try later.'));
                    return;
                }

                resolve({
                    status: 'success',
                    message: 'Password reset successful'
                });
            }, 1500);
        });
    }
};

// Bootstrap Module
document.addEventListener('DOMContentLoaded', () => {
    ResetPasswordModule.init();
});
