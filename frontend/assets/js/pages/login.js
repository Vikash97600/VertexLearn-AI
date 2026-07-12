/* login.js - Modular Login Operations and Validations */

import { STORAGE_KEYS, ROUTES } from '../config/constants.js';
import { Storage } from '../config/storage.js';
import { Validator } from '../utils/validator.js';
import { Toast } from '../components/toast.js';
import { Loader } from '../components/loader.js';

export const LoginModule = {
    form: null,
    emailInp: null,
    passwordInp: null,
    rememberCheck: null,
    submitBtn: null,
    roleSelect: null,
    toggleBtn: null,
    alertBox: null,

    init() {
        this.form = document.getElementById('loginForm');
        if (!this.form) return;

        this.emailInp = document.getElementById('emailInput');
        this.passwordInp = document.getElementById('passwordInput');
        this.rememberCheck = document.getElementById('rememberMeInput');
        this.submitBtn = document.getElementById('submitBtn');
        this.roleSelect = document.getElementById('demoRoleSelect');
        this.toggleBtn = document.getElementById('passwordToggleBtn');
        this.alertBox = document.getElementById('loginAlert');

        this.setupEventListeners();
        this.checkRememberedEmail();
        this.validateFormState();
    },

    setupEventListeners() {
        // Toggle visibility of password input
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Validate fields live on input change
        const validateFields = () => {
            this.validateField(this.emailInp, Validator.validateEmail(this.emailInp.value));
            this.validateField(this.passwordInp, Validator.validateRequired(this.passwordInp.value, 'Password'));
            this.validateFormState();
        };

        this.emailInp.addEventListener('input', validateFields);
        this.passwordInp.addEventListener('input', validateFields);

        // Submit listener
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLoginSubmit();
        });
    },

    /**
     * Toggles type attribute of password input.
     */
    togglePasswordVisibility() {
        const type = this.passwordInp.getAttribute('type') === 'password' ? 'text' : 'password';
        this.passwordInp.setAttribute('type', type);
        
        const icon = this.toggleBtn.querySelector('i');
        if (icon) {
            icon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
        }
    },

    /**
     * Validates a single input node and toggles validation styles.
     * @param {HTMLInputElement} inputNode 
     * @param {object} validationResult 
     */
    validateField(inputNode, validationResult) {
        // Only show validation errors if the user has typed something
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
            
            // Update error text node next to input
            const errorText = inputNode.parentNode.querySelector('.invalid-feedback');
            if (errorText) {
                errorText.textContent = validationResult.errorMsg;
            }
        }
    },

    /**
     * Toggles disabled state of submit button based on form validity.
     */
    validateFormState() {
        const emailVal = Validator.validateEmail(this.emailInp.value);
        const passVal = Validator.validateRequired(this.passwordInp.value, 'Password');

        const isFormValid = emailVal.isValid && passVal.isValid;
        this.submitBtn.disabled = !isFormValid;
    },

    /**
     * Restores saved email from storage if "Remember Me" was enabled.
     */
    checkRememberedEmail() {
        const remembered = Storage.get(STORAGE_KEYS.REMEMBER_ME);
        if (remembered) {
            this.emailInp.value = remembered;
            this.rememberCheck.checked = true;
            this.emailInp.classList.add('is-valid');
        }
    },

    /**
     * Submits form payload to simulated API endpoint.
     */
    async handleLoginSubmit() {
        this.alertBox.classList.add('d-none');
        Loader.setButtonLoading(this.submitBtn, true);

        const email = this.emailInp.value;
        const password = this.passwordInp.value;
        const role = this.roleSelect.value;
        
        // Sync Remember Me preference
        if (this.rememberCheck.checked) {
            Storage.set(STORAGE_KEYS.REMEMBER_ME, email);
        } else {
            Storage.remove(STORAGE_KEYS.REMEMBER_ME);
        }

        try {
            // Simulated POST /api/auth/login API Request
            const response = await this.mockLoginAPI(email, password, role);

            // Save tokens to storage
            Storage.set(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
            Storage.set(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);
            Storage.set(STORAGE_KEYS.USER_INFO, response.user);

            Toast.success(`Welcome back, ${response.user.full_name}! Redirecting to workspace...`);

            // Redirect to appropriate dashboard after delay
            setTimeout(() => {
                if (role === 'student') window.location.href = ROUTES.STUDENT_DASHBOARD;
                if (role === 'instructor') window.location.href = ROUTES.INSTRUCTOR_DASHBOARD;
                if (role === 'admin') window.location.href = ROUTES.ADMIN_DASHBOARD;
            }, 1000);

        } catch (err) {
            Loader.setButtonLoading(this.submitBtn, false);
            this.alertBox.classList.remove('d-none');
            
            const errorMsg = err.message || 'Login failed. Please check your credentials.';
            document.getElementById('loginAlertMsg').textContent = errorMsg;
            Toast.error(errorMsg);
        }
    },

    /**
     * Mocks fetch request with success and failure outcomes.
     */
    mockLoginAPI(email, password, role) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate network error mock
                if (email.includes('networkerror')) {
                    reject(new Error('Network error: connection lost. Please check your router.'));
                    return;
                }

                // Simulate server error mock
                if (email.includes('servererror')) {
                    reject(new Error('Server error (500): Internal server failure.'));
                    return;
                }

                // Default simulated success login
                let name = 'Ananya Sharma';
                if (role === 'instructor') name = 'Rohit Sen';
                if (role === 'admin') name = 'Meera Nair';

                resolve({
                    access_token: `mock_jwt_access_token_${role}`,
                    refresh_token: `mock_jwt_refresh_token_${role}`,
                    user: {
                        id: 'mock-user-uuid',
                        full_name: name,
                        email: email,
                        role: role
                    }
                });

            }, 1200);
        });
    }
};

// Bootstrap module
document.addEventListener('DOMContentLoaded', () => {
    LoginModule.init();
});
