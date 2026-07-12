/* role-selection.js - Workspace Role Selection Logic and Redirect Flow */

import { Storage } from '../config/storage.js';
import { Toast } from '../components/toast.js';
import { Loader } from '../components/loader.js';
import { confirmLogout } from '../auth/modal.js';

const ROLE_ROUTES = {
    student: '/student/dashboard.html',
    instructor: '/instructor/dashboard.html',
    admin: '/admin/dashboard.html'
};

const RoleSelectionModule = {
    selectedRole: null,
    cards: [],
    alertBox: null,
    logoutBtn: null,
    topLoaderBar: null,

    init() {
        this.cards = Array.from(document.querySelectorAll('.role-card'));
        this.alertBox = document.getElementById('selectionAlert');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.topLoaderBar = document.getElementById('topLoaderBar');

        // Check if user is already authenticated, skip selection if role saved
        this.checkExistingSession();

        this.setupCardListeners();
        this.setupLogoutListener();
    },

    /**
     * If user already has a persisted role, redirect directly to their workspace.
     */
    checkExistingSession() {
        const savedRole = localStorage.getItem('vertexlearn_role');
        const token = localStorage.getItem('vertexlearn_token');

        // Only auto-redirect if BOTH token and role are persisted
        if (savedRole && token && ROLE_ROUTES[savedRole]) {
            Toast.info(`Resuming your ${savedRole} workspace...`);
            setTimeout(() => {
                window.location.href = ROLE_ROUTES[savedRole];
            }, 800);
        }
    },

    setupCardListeners() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                const role = card.dataset.role;
                this.selectCard(card, role);
            });

            // Allow keyboard navigation
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-pressed', 'false');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });

            // Wire the "Continue as X" button click to the card's click handler
            const btn = card.querySelector('.role-select-btn');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const role = card.dataset.role;
                    this.selectCard(card, role);
                });
            }
        });
    },

    selectCard(cardEl, role) {
        // Deselect all cards first
        this.cards.forEach(c => {
            c.classList.remove('selected');
            c.setAttribute('aria-pressed', 'false');
            const btn = c.querySelector('.role-select-btn');
            if (btn) {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary-custom');
            }
        });

        // Mark active selection
        cardEl.classList.add('selected');
        cardEl.setAttribute('aria-pressed', 'true');
        const selectedBtn = cardEl.querySelector('.role-select-btn');
        if (selectedBtn) {
            selectedBtn.classList.remove('btn-secondary-custom');
            selectedBtn.classList.add('btn-primary');
        }

        this.selectedRole = role;
        this.alertBox?.classList.add('d-none');

        // Small delay for selection animation to settle, then redirect
        setTimeout(() => {
            this.proceedToWorkspace(role);
        }, 400);
    },

    proceedToWorkspace(role) {
        // Show progress bar loading feedback
        if (this.topLoaderBar) {
            this.topLoaderBar.classList.remove('d-none');
        }

        // Persist role selection
        localStorage.setItem('vertexlearn_role', role);

        // Mock a token for demonstration purposes if none exists
        if (!localStorage.getItem('vertexlearn_token')) {
            localStorage.setItem('vertexlearn_token', 'mock_access_token_' + Date.now());
        }

        const roleLabels = { student: 'Student', instructor: 'Instructor', admin: 'Admin' };
        Toast.success(`${roleLabels[role]} workspace selected. Loading your dashboard...`);

        const destination = ROLE_ROUTES[role];
        if (destination) {
            setTimeout(() => {
                window.location.href = destination;
            }, 1200);
        } else {
            Toast.error('Unknown role selected. Please try again.');
            if (this.topLoaderBar) {
                this.topLoaderBar.classList.add('d-none');
            }
        }
    },

    setupLogoutListener() {
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => {
                confirmLogout();
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    RoleSelectionModule.init();
});
