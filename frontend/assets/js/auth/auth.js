/* auth.js - Simulated authentication API requests placeholders */

import { saveAccessToken, saveRefreshToken, clearSession, getRefreshToken } from './session.js';
import { saveToStorage, getFromStorage } from './storage.js';

export const AuthAPI = {
    async login(email, password, useSession = false) {
        // Simulated API call payload POST /api/auth/login
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'notfound@example.com') {
                    reject(new Error('Email address not registered.'));
                    return;
                }
                const mockUser = {
                    id: 'usr_mock_123',
                    full_name: email.split('@')[0],
                    email: email,
                    role: 'student',
                    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'
                };
                
                // Save token
                saveAccessToken('mock_access_token_' + Date.now(), useSession);
                saveRefreshToken('mock_refresh_token_' + Date.now(), useSession);
                saveToStorage('vertexlearn_user', mockUser, useSession);
                saveToStorage('vertexlearn_role', mockUser.role, useSession);

                resolve(mockUser);
            }, 1000);
        });
    },

    async logout() {
        return new Promise((resolve) => {
            setTimeout(() => {
                clearSession();
                resolve({ success: true });
            }, 500);
        });
    },

    async refreshToken() {
        const refresh = getRefreshToken();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!refresh) {
                    reject(new Error('No refresh token available.'));
                    return;
                }
                const newAccess = 'mock_access_token_' + Date.now();
                saveAccessToken(newAccess);
                resolve({ access_token: newAccess });
            }, 800);
        });
    },

    getCurrentUser() {
        return getFromStorage('vertexlearn_user');
    }
};

export const login = AuthAPI.login;
export const logout = AuthAPI.logout;
export const refreshToken = AuthAPI.refreshToken;
export const getCurrentUser = AuthAPI.getCurrentUser;
