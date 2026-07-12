/* session.js - Active User Session Management Helpers */

import { saveToStorage, getFromStorage, removeStorage } from './storage.js';

export const SessionManager = {
    saveAccessToken(token, useSession = false) {
        saveToStorage('vertexlearn_token', token, useSession);
    },

    saveRefreshToken(token, useSession = false) {
        saveToStorage('vertexlearn_refresh', token, useSession);
    },

    getAccessToken() {
        return getFromStorage('vertexlearn_token');
    },

    getRefreshToken() {
        return getFromStorage('vertexlearn_refresh');
    },

    removeTokens() {
        removeStorage('vertexlearn_token');
        removeStorage('vertexlearn_refresh');
    },

    isAuthenticated() {
        const token = this.getAccessToken();
        return !!token;
    },

    logout() {
        this.clearSession();
        window.location.href = '/login.html';
    },

    clearSession() {
        this.removeTokens();
        removeStorage('vertexlearn_user');
        removeStorage('vertexlearn_role');
    }
};

export const saveAccessToken = SessionManager.saveAccessToken.bind(SessionManager);
export const saveRefreshToken = SessionManager.saveRefreshToken.bind(SessionManager);
export const getAccessToken = SessionManager.getAccessToken.bind(SessionManager);
export const getRefreshToken = SessionManager.getRefreshToken.bind(SessionManager);
export const removeTokens = SessionManager.removeTokens.bind(SessionManager);
export const isAuthenticated = SessionManager.isAuthenticated.bind(SessionManager);
export const logout = SessionManager.logout.bind(SessionManager);
export const clearSession = SessionManager.clearSession.bind(SessionManager);
