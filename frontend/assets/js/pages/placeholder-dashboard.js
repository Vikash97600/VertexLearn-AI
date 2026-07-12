/* placeholder-dashboard.js - Shared guard and user init for placeholder dashboards */

/**
 * Verifies that the user has a valid token before showing
 * the placeholder dashboard. Redirects if not authenticated.
 */
function checkPlaceholderAuth() {
    const token = localStorage.getItem('vertexlearn_token');
    if (!token) {
        window.location.href = '../login.html';
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    checkPlaceholderAuth();
});
