/* api.js - Standardized Fetch Client with JWT Interceptors and Refresh Queue */

import { API_BASE_URL, STORAGE_KEYS, ROUTES } from './constants.js';
import { Storage } from './storage.js';
import { Toast } from '../components/toast.js';
import { Loader } from '../components/loader.js';

let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Pushes unresolved requests into a queue to resolve after refresh token resolves.
 * @param {Function} callback 
 */
const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

/**
 * Fires all pending callbacks in the queue once the token refreshes.
 * @param {string} token - New access token
 */
const onRefreshed = (token) => {
    refreshSubscribers.map((callback) => callback(token));
    refreshSubscribers = [];
};

/**
 * Refresh access token API call.
 * @returns {Promise<string|null>}
 */
async function refreshAccessToken() {
    const refreshToken = Storage.get(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        if (!response.ok) {
            throw new Error('Refresh token invalid');
        }

        const data = await response.json();
        Storage.set(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
        if (data.refresh_token) {
            Storage.set(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
        }
        return data.access_token;
    } catch (err) {
        console.error('Session expired. Redirecting to login.', err);
        Storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
        Storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        Storage.remove(STORAGE_KEYS.USER_INFO);
        window.location.href = ROUTES.LOGIN;
        return null;
    }
}

/**
 * Global HTTP Fetch Wrapper
 * @param {string} url - Target URL path or endpoint
 * @param {object} options - Fetch configurations
 * @param {boolean} showLoading - Toggle loader display
 * @returns {Promise<any>}
 */
export async function apiFetch(url, options = {}, showLoading = true) {
    const targetUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    // Setup standard headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Attach JWT Authorization token if present
    const token = Storage.get(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    if (showLoading) {
        Loader.showProgress();
    }

    try {
        let response = await fetch(targetUrl, config);

        // Intercept 401 Unauthorized to trigger silent token refresh
        if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
            if (!isRefreshing) {
                isRefreshing = true;
                refreshAccessToken().then((newToken) => {
                    isRefreshing = false;
                    if (newToken) {
                        onRefreshed(newToken);
                    }
                }).catch(() => {
                    isRefreshing = false;
                });
            }

            // Queue requests while token is refreshing
            const retryOriginalRequest = new Promise((resolve) => {
                subscribeTokenRefresh((newToken) => {
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                    resolve(fetch(targetUrl, config));
                });
            });

            response = await retryOriginalRequest;
        }

        if (showLoading) {
            Loader.hideProgress();
        }

        // Parse response content
        const contentType = response.headers.get('content-type');
        let responseData = null;
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        if (!response.ok) {
            // Normalize standard error responses matching PRD specs
            const errorPayload = responseData?.error || {
                code: 'HTTP_ERROR',
                message: responseData?.message || `Request failed with status ${response.status}`
            };
            
            // Trigger UI toast error notification automatically
            Toast.error(errorPayload.message);
            throw errorPayload;
        }

        return responseData;

    } catch (error) {
        if (showLoading) {
            Loader.hideProgress();
        }
        
        // Handle network connection drops
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            const networkError = {
                code: 'NO_INTERNET',
                message: 'No internet connection detected. Please check your network and retry.'
            };
            Toast.error(networkError.message);
            throw networkError;
        }

        throw error;
    }
}

// HTTP Verb shortcuts
export const API = {
    get: (url, options = {}, showLoading) => apiFetch(url, { ...options, method: 'GET' }, showLoading),
    post: (url, body, options = {}, showLoading) => apiFetch(url, { ...options, method: 'POST', body: JSON.stringify(body) }, showLoading),
    put: (url, body, options = {}, showLoading) => apiFetch(url, { ...options, method: 'PUT', body: JSON.stringify(body) }, showLoading),
    patch: (url, body, options = {}, showLoading) => apiFetch(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }, showLoading),
    delete: (url, options = {}, showLoading) => apiFetch(url, { ...options, method: 'DELETE' }, showLoading)
};
