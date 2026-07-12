/* otp-verification.js - OTP Box Navigation, Countdown Timers, and Verify Actions */

import { Toast } from '../components/toast.js';
import { Loader } from '../components/loader.js';

export const OtpModule = {
    form: null,
    otpBoxes: [],
    submitBtn: null,
    resendBtn: null,
    timerDisplay: null,
    alertBox: null,
    alertMsg: null,
    maskedEmailText: null,

    countdownInterval: null,
    resendAttempts: 0,
    maxResendAttempts: 3,

    init() {
        this.form = document.getElementById('otpForm');
        if (!this.form) return;

        this.otpBoxes = Array.from(document.querySelectorAll('.otp-box'));
        this.submitBtn = document.getElementById('submitBtn');
        this.resendBtn = document.getElementById('resendOtpBtn');
        this.timerDisplay = document.getElementById('countdownTimer');
        this.alertBox = document.getElementById('otpAlert');
        this.alertMsg = document.getElementById('otpAlertMsg');
        this.maskedEmailText = document.getElementById('maskedEmailText');

        this.setupMaskedEmail();
        this.setupOtpBoxNavigation();
        this.setupTimer();
        this.setupEventListeners();
        this.validateFormState();
    },

    setupMaskedEmail() {
        const email = sessionStorage.getItem('recovery_email') || 'student@vertexlearn.ai';
        const parts = email.split('@');
        if (parts.length === 2) {
            const name = parts[0];
            const domain = parts[1];
            const maskedName = name.length > 3 ? name.substring(0, 3) + '***' : name + '***';
            this.maskedEmailText.textContent = `${maskedName}@${domain}`;
        } else {
            this.maskedEmailText.textContent = email;
        }
    },

    setupOtpBoxNavigation() {
        this.otpBoxes.forEach((box, idx) => {
            // Auto focus first field on mount
            if (idx === 0) box.focus();

            // Intercept keyboard events
            box.addEventListener('keydown', (e) => {
                const key = e.key;

                // Move backward on backspace
                if (key === 'Backspace') {
                    if (box.value === '' && idx > 0) {
                        this.otpBoxes[idx - 1].focus();
                        this.otpBoxes[idx - 1].value = '';
                    } else {
                        box.value = '';
                    }
                    this.validateFormState();
                    e.preventDefault();
                    return;
                }

                // Allow digits only
                if (!/[0-9]/.test(key) && key !== 'Tab' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
                    e.preventDefault();
                }
            });

            // Auto-advance cursor
            box.addEventListener('input', (e) => {
                const val = box.value;
                if (val.length === 1 && idx < this.otpBoxes.length - 1) {
                    this.otpBoxes[idx + 1].focus();
                }
                this.validateFormState();
            });

            // Arrow key navigation
            box.addEventListener('keyup', (e) => {
                if (e.key === 'ArrowLeft' && idx > 0) {
                    this.otpBoxes[idx - 1].focus();
                } else if (e.key === 'ArrowRight' && idx < this.otpBoxes.length - 1) {
                    this.otpBoxes[idx + 1].focus();
                }
            });

            // Paste listener on the first boxes
            box.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = (e.clipboardData || window.clipboardData).getData('text');
                const cleanDigits = pasteData.replace(/[^0-9]/g, '').substring(0, 6);

                if (cleanDigits.length > 0) {
                    for (let i = 0; i < cleanDigits.length; i++) {
                        if (this.otpBoxes[i]) {
                            this.otpBoxes[i].value = cleanDigits[i];
                        }
                    }
                    // Focus the appropriate box after paste
                    const nextFocusIndex = Math.min(cleanDigits.length, this.otpBoxes.length - 1);
                    this.otpBoxes[nextFocusIndex].focus();
                    this.validateFormState();
                }
            });
        });
    },

    setupTimer() {
        // Clear any old intervals
        if (this.countdownInterval) clearInterval(this.countdownInterval);

        // Get or set stored timer offset
        let timerEnd = sessionStorage.getItem('otp_timer_end');
        let now = Date.now();

        if (!timerEnd || parseInt(timerEnd, 10) < now) {
            // Set 120 seconds countdown timer from now
            timerEnd = now + 120 * 1000;
            sessionStorage.setItem('otp_timer_end', timerEnd.toString());
        }

        const updateCountdown = () => {
            const timeRemaining = Math.max(0, Math.floor((parseInt(timerEnd, 10) - Date.now()) / 1000));
            
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeRemaining === 0) {
                clearInterval(this.countdownInterval);
                this.resendBtn.removeAttribute('disabled');
                document.getElementById('timerLabel').classList.add('text-muted');
                sessionStorage.removeItem('otp_timer_end');
            } else {
                this.resendBtn.setAttribute('disabled', 'true');
            }
        };

        this.countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    },

    validateFormState() {
        const isComplete = this.otpBoxes.every(box => box.value !== '');
        this.submitBtn.disabled = !isComplete;
    },

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleVerifySubmit();
        });

        this.resendBtn.addEventListener('click', () => {
            this.handleResendOtp();
        });
    },

    async handleVerifySubmit() {
        this.alertBox.classList.add('d-none');
        this.alertBox.classList.remove('animate-shake');
        Loader.setButtonLoading(this.submitBtn, true);

        const email = sessionStorage.getItem('recovery_email') || 'student@vertexlearn.ai';
        const otp = this.otpBoxes.map(box => box.value).join('');

        try {
            // Simulated POST /api/auth/verify-otp API call
            await this.mockVerifyOtpAPI(email, otp);

            // Store verification state so the password reset page doesn't bypass flow
            sessionStorage.setItem('otp_verified_token', 'otp_mock_verified');

            Toast.success('Identity verified! Choose new password...');

            setTimeout(() => {
                window.location.href = 'reset-password.html';
            }, 1200);

        } catch (err) {
            Loader.setButtonLoading(this.submitBtn, false);
            this.alertBox.classList.remove('d-none');
            // Force reflow for shake animation
            void this.alertBox.offsetWidth;
            this.alertBox.classList.add('animate-shake');

            this.alertMsg.textContent = err.message || 'Verification failed. Please try again.';
            Toast.error(this.alertMsg.textContent);
        }
    },

    async handleResendOtp() {
        if (this.resendAttempts >= this.maxResendAttempts) {
            Toast.error('Maximum resend attempts reached. Please contact support.');
            return;
        }

        Loader.setButtonLoading(this.resendBtn, true);
        const email = sessionStorage.getItem('recovery_email') || 'student@vertexlearn.ai';

        try {
            // Simulated POST /api/auth/forgot-password API call
            await this.mockResendAPI(email);

            this.resendAttempts++;
            
            // Show attempts warnings and label
            const attemptLabel = document.getElementById('resendAttemptLabel');
            const remainingCount = document.getElementById('attemptsRemainingCount');
            if (attemptLabel && remainingCount) {
                attemptLabel.classList.remove('d-none');
                remainingCount.textContent = (this.maxResendAttempts - this.resendAttempts).toString();
            }

            // Reset countdown timer
            sessionStorage.removeItem('otp_timer_end');
            this.setupTimer();
            
            Toast.success('Verification code resent successfully.');
            Loader.setButtonLoading(this.resendBtn, false);
            
            // Clear boxes
            this.otpBoxes.forEach(box => box.value = '');
            this.otpBoxes[0].focus();
            this.validateFormState();

            // Lock resend button if maxed out
            if (this.resendAttempts >= this.maxResendAttempts) {
                this.resendBtn.setAttribute('disabled', 'true');
                this.resendBtn.textContent = 'Blocked';
                Toast.warning('Resend limit reached. Please wait or verify the code sent.');
            }

        } catch (err) {
            Loader.setButtonLoading(this.resendBtn, false);
            Toast.error(err.message || 'Failed to resend code.');
        }
    },

    mockVerifyOtpAPI(email, otp) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate network error mock
                if (otp === '000000') {
                    reject(new Error('Network disconnected. Please check your connection.'));
                    return;
                }

                // Simulate expired code mock
                if (otp === '999999') {
                    reject(new Error('Verification code has expired. Please request a new one.'));
                    return;
                }

                // Default correct mock code is 123456
                if (otp !== '123456') {
                    reject(new Error('Invalid verification code. Please try again.'));
                    return;
                }

                resolve({
                    status: 'success',
                    message: 'OTP verified successfully'
                });
            }, 1200);
        });
    },

    mockResendAPI(email) {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }
};

// Bootstrap Module
document.addEventListener('DOMContentLoaded', () => {
    OtpModule.init();
});
