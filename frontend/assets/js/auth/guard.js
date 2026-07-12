/* guard.js - Route guards and Role permissions checks */

import { isAuthenticated } from './session.js';
import { getRole } from './role.js';
import { ensureValidToken } from './token.js';

export const Guard = {
    /**
     * Confirms that access tokens exist and are valid.
     * Redirects to login.html if unauthorized.
     */
    async checkAuthentication() {
        if (!isAuthenticated()) {
            window.location.href = '/login.html';
            return false;
        }

        // Silent token check
        const isValid = await ensureValidToken();
        if (!isValid) {
            return false;
        }
        return true;
    },

    /**
     * Prevents access if user role does not match allowed dashboard permissions.
     * @param {string|string[]} allowedRoles 
     */
    checkRoleGuard(allowedRoles) {
        const userRole = getRole();
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!userRole || !roles.includes(userRole)) {
            console.warn(`Access Denied: Role "${userRole}" lacks permissions.`);
            window.location.href = '/unauthorized.html';
            return false;
        }
        return true;
    }
};

export const checkAuthentication = Guard.checkAuthentication.bind(Guard);
export const checkRoleGuard = Guard.checkRoleGuard.bind(Guard);
