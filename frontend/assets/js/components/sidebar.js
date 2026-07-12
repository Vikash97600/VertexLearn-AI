/* sidebar.js - Collapsible Dashboard Sidebar Drawer */

import { STORAGE_KEYS } from '../config/constants.js';
import { Storage } from '../config/storage.js';

export const Sidebar = {
    /**
     * Initializes sidebar behaviors, collapse overrides, and active route markers.
     */
    init() {
        const sidebar = document.getElementById('appSidebar');
        const mainContent = document.getElementById('mainContent');
        const toggler = document.getElementById('sidebarToggler');
        const mobileToggler = document.getElementById('mobileSidebarToggler');
        
        if (!sidebar) return;

        // Restore collapse state
        const isCollapsed = Storage.get(STORAGE_KEYS.SIDEBAR_COLLAPSED, false);
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            if (mainContent) mainContent.classList.add('sidebar-collapsed');
        }

        // Toggle action (Desktop)
        if (toggler) {
            toggler.addEventListener('click', () => {
                const collapsed = sidebar.classList.toggle('collapsed');
                if (mainContent) mainContent.classList.toggle('sidebar-collapsed');
                Storage.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed);
            });
        }

        // Toggle action (Mobile Drawer)
        if (mobileToggler) {
            mobileToggler.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.toggle('mobile-open');
            });
        }

        // Close sidebar drawer if clicking main area on mobile
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        });

        this.highlightActiveLink();
    },

    /**
     * Highlight sidebar links matching current path location.
     */
    highlightActiveLink() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.sidebar-link');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            // Check if matching exact file or path suffix
            if (href && (currentPath.endsWith(href) || currentPath.includes(href))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
};
