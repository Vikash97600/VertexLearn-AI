/* ==========================================================================
   sidebar.js - Collapsible Sidebar Controller
   VertexLearn AI · Design System Component
   ========================================================================== */

const STORAGE_COLLAPSED_KEY = 'vertexlearn_sidebar_collapsed';

export const SidebarController = {
    init() {
        const sidebar = document.getElementById('appSidebar');
        const mainContent = document.getElementById('mainContent');
        const collapseBtn = document.getElementById('sidebarCollapseBtn');
        const hamburgerBtn = document.getElementById('sidebarHamburgerBtn');
        const overlay = document.getElementById('sidebarOverlay');

        if (!sidebar) return;

        // 1. Restore collapse state on desktop
        const isCollapsed = localStorage.getItem(STORAGE_COLLAPSED_KEY) === 'true';
        if (isCollapsed && window.innerWidth >= 992) {
            sidebar.classList.add('collapsed');
            if (mainContent) mainContent.classList.add('sidebar-collapsed');
        }

        // 2. Desktop Collapse Action
        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => {
                const nowCollapsed = sidebar.classList.toggle('collapsed');
                if (mainContent) mainContent.classList.toggle('sidebar-collapsed');
                localStorage.setItem(STORAGE_COLLAPSED_KEY, nowCollapsed);
                
                // Toggle tooltips based on state
                this.updateTooltips(nowCollapsed);
            });
        }

        // 3. Mobile Hamburger & Overlay Action
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.add('mobile-open');
                if (overlay) overlay.classList.add('visible');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('visible');
            });
        }

        // 4. Highlight current navigation path link
        this.highlightActiveLink();

        // 5. Initialize Bootstrap Tooltips for nav links if collapsed
        this.initTooltips(isCollapsed);

        // Handle window resize behaviors
        window.addEventListener('resize', () => {
            if (window.innerWidth < 992) {
                sidebar.classList.remove('collapsed');
                if (mainContent) mainContent.classList.remove('sidebar-collapsed');
                this.destroyTooltips();
            } else {
                const collapsed = localStorage.getItem(STORAGE_COLLAPSED_KEY) === 'true';
                if (collapsed) {
                    sidebar.classList.add('collapsed');
                    if (mainContent) mainContent.classList.add('sidebar-collapsed');
                    this.initTooltips(true);
                }
            }
        });
    },

    highlightActiveLink() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.vl-nav-link');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (currentPath.endsWith(href) || currentPath.includes(href))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    tooltipsList: [],

    initTooltips(shouldInit) {
        this.destroyTooltips();
        if (!shouldInit || window.innerWidth < 992) return;

        const tooltipTriggerList = document.querySelectorAll('.vl-sidebar.collapsed .vl-nav-link, .vl-sidebar.collapsed .vl-sidebar-profile');
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            this.tooltipsList = Array.from(tooltipTriggerList).map(tooltipTriggerEl => {
                // Ensure a title is present
                const textEl = tooltipTriggerEl.querySelector('.vl-nav-link-text, .vl-profile-name');
                const titleText = tooltipTriggerEl.getAttribute('data-bs-original-title') || 
                                  tooltipTriggerEl.getAttribute('title') || 
                                  (textEl ? textEl.textContent.trim() : '');
                
                tooltipTriggerEl.setAttribute('data-bs-toggle', 'tooltip');
                tooltipTriggerEl.setAttribute('data-bs-placement', 'right');
                tooltipTriggerEl.setAttribute('data-bs-title', titleText);
                
                return new bootstrap.Tooltip(tooltipTriggerEl, {
                    trigger: 'hover',
                    boundary: 'viewport'
                });
            });
        }
    },

    destroyTooltips() {
        this.tooltipsList.forEach(t => {
            try { t.dispose(); } catch (e) {}
        });
        this.tooltipsList = [];
    },

    updateTooltips(collapsed) {
        if (collapsed) {
            this.initTooltips(true);
        } else {
            this.destroyTooltips();
        }
    }
};
