/* profile-dropdown.js - Profile drop-down actions and info rendering */

import { getCurrentUser } from './auth.js';
import { confirmLogout } from './modal.js';

export const ProfileDropdown = {
    init() {
        const user = getCurrentUser();
        if (!user) return;

        // Render user details inside matching container classes on layout loads
        const nameContainers = document.querySelectorAll('.user-display-name');
        const roleContainers = document.querySelectorAll('.user-display-role');
        const avatarContainers = document.querySelectorAll('.user-display-avatar');

        nameContainers.forEach(el => el.textContent = user.full_name);
        roleContainers.forEach(el => el.textContent = this.formatRoleLabel(user.role));
        
        if (user.avatar_url) {
            avatarContainers.forEach(el => {
                if (el.tagName === 'IMG') {
                    el.src = user.avatar_url;
                } else {
                    el.style.backgroundImage = `url('${user.avatar_url}')`;
                }
            });
        }

        // Setup logout button bindings
        const logoutButtons = document.querySelectorAll('.logout-trigger-btn');
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                confirmLogout();
            });
        });
    },

    formatRoleLabel(role) {
        if (role === 'student') return 'Student Workspace';
        if (role === 'instructor') return 'Instructor Workspace';
        if (role === 'admin') return 'Platform Admin';
        return role;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ProfileDropdown.init();
});
