/* ==========================================================================
   header.js - Header Search & Quick Controls Coordinator
   VertexLearn AI · Design System Component
   ========================================================================== */

export const HeaderController = {
    init() {
        this.setupSearchShortcut();
        this.setupSearchFocusAnimations();
        this.setupNotificationClick();
    },

    setupSearchShortcut() {
        const searchInput = document.getElementById('globalSearchInput');
        const sidebarSearchInput = document.getElementById('sidebarSearchInput');

        // Focus search input when pressing Ctrl+K (or Cmd+K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                
                // Prioritize global search if visible, otherwise use sidebar search
                if (searchInput && window.getComputedStyle(searchInput.closest('.vl-global-search')).display !== 'none') {
                    searchInput.focus();
                    searchInput.select();
                } else if (sidebarSearchInput) {
                    // Open sidebar if closed on mobile, or just focus search
                    const sidebar = document.getElementById('appSidebar');
                    if (sidebar && !sidebar.classList.contains('mobile-open') && window.innerWidth < 992) {
                        sidebar.classList.add('mobile-open');
                        const overlay = document.getElementById('sidebarOverlay');
                        if (overlay) overlay.classList.add('visible');
                    }
                    setTimeout(() => {
                        sidebarSearchInput.focus();
                        sidebarSearchInput.select();
                    }, 100);
                }
            }
        });
    },

    setupSearchFocusAnimations() {
        const searchContainers = document.querySelectorAll('.vl-global-search, .vl-search-box');
        
        searchContainers.forEach(container => {
            const input = container.querySelector('input');
            if (input) {
                input.addEventListener('focus', () => {
                    container.classList.add('focused');
                });
                input.addEventListener('blur', () => {
                    container.classList.remove('focused');
                });
            }
        });
    },

    setupNotificationClick() {
        const bellBtn = document.getElementById('notificationTrigger');
        if (bellBtn) {
            bellBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // To be implemented in notifications phase - show a toast or preview
                if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
                    this.showMockNotificationToast();
                } else {
                    alert('Notifications will be fully implemented in the next phase.');
                }
            });
        }
    },

    showMockNotificationToast() {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            container.style.zIndex = '3000';
            document.body.appendChild(container);
        }

        const toastEl = document.createElement('div');
        toastEl.className = 'toast border-0 shadow-lg';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        toastEl.innerHTML = `
            <div class="toast-header border-bottom-0 bg-primary py-2 px-3">
                <i class="bi bi-bell-fill text-primary me-2"></i>
                <strong class="me-auto text-primary">Notifications</strong>
                <small class="text-muted">Just now</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body bg-primary text-secondary-custom py-2 px-3">
                You have no unread alerts. Notifications will be implemented soon!
            </div>
        `;
        
        document.getElementById('toastContainer').appendChild(toastEl);
        const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
        bsToast.show();
        
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }
};
