/* unauthorized.js - Unauthorized page bootstrap and analytics logging */

/**
 * Logs the unauthorized access attempt details to the console.
 * In production, this would POST to an audit logging API.
 */
function logUnauthorizedAccess() {
    const role = localStorage.getItem('vertexlearn_role') || 'unknown';
    const path = document.referrer || 'direct';
    console.warn(
        `[VertexLearn Auth] Unauthorized access attempt — Role: "${role}", From: "${path}"`
    );
}

document.addEventListener('DOMContentLoaded', () => {
    logUnauthorizedAccess();
});
