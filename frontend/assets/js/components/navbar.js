/* navbar.js - Navigation Dropdowns, Profile Lists, and Notification Toggles */

import { escapeHTML } from '../utils/helper.js';

export const Navbar = {
    /**
     * Initializes header listeners.
     */
    init() {
        this.setupNotificationDropdown();
        this.setupProfileDropdown();
        this.setupGlobalSearchShortcut();
    },

    /**
     * Toggles visibility of notifications panel drawer.
     */
    setupNotificationDropdown() {
        const trigger = document.getElementById('notificationTrigger');
        const dropdown = document.getElementById('notificationDropdown');
        
        if (!trigger || !dropdown) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
            // Hide profile dropdown if open
            const profileMenu = document.getElementById('profileDropdown');
            if (profileMenu) profileMenu.classList.remove('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });

        dropdown.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing when clicking inside
        });
    },

    /**
     * Toggles visibility of user settings profile list.
     */
    setupProfileDropdown() {
        const trigger = document.getElementById('profileTrigger');
        const dropdown = document.getElementById('profileDropdown');
        
        if (!trigger || !dropdown) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
            // Hide notification dropdown if open
            const notifMenu = document.getElementById('notificationDropdown');
            if (notifMenu) notifMenu.classList.remove('show');
        });

        document.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });

        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    },

    /**
     * Adds key bindings for Ctrl+K global search bar activation.
     */
    setupGlobalSearchShortcut() {
        const searchInput = document.getElementById('globalSearchInput');
        if (!searchInput) return;

        // Focus search when pressing Ctrl+K (or Cmd+K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        });
    },

    /**
     * Dynamic populates notification array to DOM node.
     * @param {Array<object>} notificationsList 
     * @param {HTMLElement} listContainerNode 
     */
    renderNotifications(notificationsList, listContainerNode) {
        if (!listContainerNode) return;
        
        if (!notificationsList || notificationsList.length === 0) {
            listContainerNode.innerHTML = `
                <div class="text-center py-4 text-muted-custom">
                    <i class="bi bi-bell-slash fs-2 mb-2 d-block"></i>
                    <p class="text-xs mb-0">No new notifications</p>
                </div>
            `;
            return;
        }

        listContainerNode.innerHTML = notificationsList.map(item => `
            <div class="notification-item p-3 border-bottom hover-bg ${item.is_read ? 'opacity-75' : ''}" style="cursor: pointer;">
                <div class="d-flex justify-content-between align-items-start">
                    <h6 class="text-xs fw-semibold mb-1">${escapeHTML(item.title)}</h6>
                    ${!item.is_read ? '<span class="status-indicator status-online"></span>' : ''}
                </div>
                <p class="text-xs text-secondary-custom mb-1">${escapeHTML(item.body)}</p>
                <small class="text-xs text-muted-custom" style="font-size: 10px;">${item.created_at_formatted || 'Just now'}</small>
            </div>
        `).join('');
    }
};
