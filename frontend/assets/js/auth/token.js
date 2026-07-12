/* token.js - Token Expiry validation and silent refresh timers */

import { getAccessToken, getRefreshToken, clearSession } from './session.js';
import { refreshToken } from './auth.js';

export const TokenManager = {
    /**
     * Checks if the active access token has expired.
     * Mock logic parses timestamps appended to mock tokens.
     */
    isTokenExpired() {
        const token = getAccessToken();
        if (!token) return true;

        const parts = token.split('_');
        const timestampStr = parts[parts.length - 1];
        const timestamp = parseInt(timestampStr, 10);

        if (isNaN(timestamp)) return false; // Non-timestamp tokens are assumed valid

        // Expire mock tokens after 5 minutes (300,000 ms)
        const expiryDuration = 5 * 60 * 1000;
        return Date.now() - timestamp > expiryDuration;
    },

    /**
     * Attempts to refresh the access token silently.
     * Redirects to session-expired.html if refresh fails.
     */
    async ensureValidToken() {
        if (!getAccessToken()) {
            return false;
        }

        if (this.isTokenExpired()) {
            console.log('Access token expired. Triggering silent refresh...');
            try {
                await refreshToken();
                console.log('Token refreshed successfully.');
                return true;
            } catch (err) {
                console.warn('Token refresh failed:', err);
                clearSession();
                window.location.href = '/session-expired.html';
                return false;
            }
        }
        return true;
    }
};

export const isTokenExpired = TokenManager.isTokenExpired.bind(TokenManager);
export const ensureValidToken = TokenManager.ensureValidToken.bind(TokenManager);
