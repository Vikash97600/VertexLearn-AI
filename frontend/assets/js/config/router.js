/* router.js - Lightweight Client-Side Route Protection and Parameter Utilities */

import { ROUTES, STORAGE_KEYS, ROLES } from './constants.js';
import { Storage } from './storage.js';

export const Router = {
    /**
     * Navigate to target path
     * @param {string} path 
     */
    go(path) {
        window.location.href = path;
    },

    /**
     * Extracts query parameters from current window location.
     * @returns {object} params
     */
    getQueryParams() {
        const params = {};
        const search = window.location.search;
        if (!search) return params;
        
        const urlParams = new URLSearchParams(search);
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        return params;
    },

    /**
     * Protect dashboard routes and redirect based on role-based authentication.
     */
    guardRoute() {
        const currentPath = window.location.pathname;
        const accessToken = Storage.get(STORAGE_KEYS.ACCESS_TOKEN);
        const userInfo = Storage.get(STORAGE_KEYS.USER_INFO);

        // Define which routes are protected
        const isAuthPage = currentPath.includes('/login.html') || currentPath.includes('/register.html');
        const isStudentPage = currentPath.includes('/student.html');
        const isInstructorPage = currentPath.includes('/instructor.html');
        const isAdminPage = currentPath.includes('/admin.html');
        const isPlayerPage = currentPath.includes('/player.html');
        
        const isDashboardPage = isStudentPage || isInstructorPage || isAdminPage || isPlayerPage;

        // 1. If trying to access dashboard page without authentication token
        if (isDashboardPage && !accessToken) {
            this.go(ROUTES.LOGIN);
            return;
        }

        // 2. If authenticated, prevent landing back on login/register
        if (isAuthPage && accessToken && userInfo) {
            this.redirectToRoleDashboard(userInfo.role);
            return;
        }

        // 3. Prevent cross-role access to dashboard sections
        if (accessToken && userInfo) {
            const role = userInfo.role;
            if (isStudentPage && role !== ROLES.STUDENT) {
                this.redirectToRoleDashboard(role);
            } else if (isInstructorPage && role !== ROLES.INSTRUCTOR) {
                this.redirectToRoleDashboard(role);
            } else if (isAdminPage && role !== ROLES.ADMIN) {
                this.redirectToRoleDashboard(role);
            }
        }
    },

    /**
     * Redirects to the appropriate dashboard based on user role.
     * @param {string} role 
     */
    redirectToRoleDashboard(role) {
        switch (role) {
            case ROLES.STUDENT:
                this.go(ROUTES.STUDENT_DASHBOARD);
                break;
            case ROLES.INSTRUCTOR:
                this.go(ROUTES.INSTRUCTOR_DASHBOARD);
                break;
            case ROLES.ADMIN:
                this.go(ROUTES.ADMIN_DASHBOARD);
                break;
            default:
                this.go(ROUTES.PUBLIC_HOME);
        }
    }
};
