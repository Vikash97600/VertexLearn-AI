/* session-expired.js - Auto-redirect countdown and session cleanup */

/**
 * Clears all auth tokens and user session data from storage.
 * Called when session expires to prevent stale state re-use.
 */
function clearExpiredSession() {
    const keysToRemove = [
        'vertexlearn_token',
        'vertexlearn_refresh',
        'vertexlearn_user',
        'vertexlearn_role'
    ];
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });
}

/**
 * Starts a countdown timer and redirects the user to login
 * when it reaches zero.
 */
function startCountdownRedirect() {
    const countdownEl = document.getElementById('countdownNum');
    if (!countdownEl) return;

    let timeLeft = 10;

    const interval = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(interval);
            window.location.href = 'login.html';
        }
    }, 1000);

    // Allow user to click Login button to cancel countdown and redirect immediately
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            clearInterval(interval);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    clearExpiredSession();
    startCountdownRedirect();
});
