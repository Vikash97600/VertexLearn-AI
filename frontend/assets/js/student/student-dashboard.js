/* ==========================================================================
   student-dashboard.js - Student Workspace Orchestrator
   VertexLearn AI · Core Page Script
   ========================================================================== */

import { ThemeManager } from './theme.js';
import { SidebarController } from './sidebar.js';
import { HeaderController } from './header.js';
import { DropdownManager } from './dropdown.js';

// Setup profile information from localStorage
function updateProfileUI() {
    const defaultUser = {
        full_name: "Ananya Sharma",
        email: "ananya@example.com"
    };

    let user = defaultUser;
    try {
        const storedUser = localStorage.getItem('vertexlearn_user');
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        console.error("Failed to parse user details from storage:", e);
    }

    // Update Initials & Profile texts
    const initials = user.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    // Get DOM elements
    const sidebarName = document.getElementById('sidebarProfileName');
    const sidebarEmail = document.getElementById('sidebarProfileEmail');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const dropdownName = document.getElementById('dropdownProfileName');
    const dropdownEmail = document.getElementById('dropdownProfileEmail');
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    const headerAvatar = document.getElementById('profileTrigger');
    const welcomeStudentName = document.getElementById('welcomeStudentName');

    if (sidebarName) sidebarName.textContent = user.full_name;
    if (sidebarEmail) sidebarEmail.textContent = user.email;
    if (sidebarAvatar) sidebarAvatar.textContent = initials;
    
    if (dropdownName) dropdownName.textContent = user.full_name;
    if (dropdownEmail) dropdownEmail.textContent = user.email;
    if (dropdownAvatar) dropdownAvatar.textContent = initials;
    if (headerAvatar) headerAvatar.textContent = initials;

    if (welcomeStudentName) {
        // Just extract the first name for friendly greeting
        const firstName = user.full_name.split(' ')[0];
        welcomeStudentName.textContent = firstName;
    }
}

// Reusable loader for HTML template parts to implement component-based loading
async function loadComponents() {
    const sidebarContainer = document.getElementById('sidebarContainer');
    const headerContainer = document.getElementById('headerContainer');

    // Dynamically check folder depth for asset loading
    const isInSubdir = window.location.pathname.includes('/student/');
    const basePath = isInSubdir ? '../' : './';

    // 1. Fetch and inject Sidebar
    if (sidebarContainer) {
        try {
            const response = await fetch(`${basePath}sidebar.html`);
            if (response.ok) {
                sidebarContainer.innerHTML = await response.text();
            } else {
                console.warn('Failed to load external sidebar.html, falling back.');
            }
        } catch (e) {
            console.error('Error fetching sidebar.html:', e);
        }
    }

    // 2. Fetch and inject Header
    if (headerContainer) {
        try {
            const response = await fetch(`${basePath}header.html`);
            if (response.ok) {
                headerContainer.innerHTML = await response.text();
            } else {
                console.warn('Failed to load external header.html, falling back.');
            }
        } catch (e) {
            console.error('Error fetching header.html:', e);
        }
    }
}

// Handle Sign Out action
function setupLogoutAction() {
    // Dynamically check folder depth for asset loading
    const isInSubdir = window.location.pathname.includes('/student/');
    const basePath = isInSubdir ? '../' : './';

    const performLogout = () => {
        // Clear auth tokens
        localStorage.removeItem('vertexlearn_token');
        localStorage.removeItem('vertexlearn_role');
        
        // Show success notification if Toast is available
        if (window.showToast) {
            window.showToast('Signed out successfully. Redirecting...', 'info');
        } else {
            alert('Signed out successfully.');
        }

        setTimeout(() => {
            window.location.href = `${basePath}login.html`;
        }, 800);
    };

    // Bind to sidebar logout trigger
    const sidebarLogout = document.getElementById('sidebarLogoutTrigger');
    if (sidebarLogout) {
        sidebarLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to sign out?')) {
                performLogout();
            }
        });
    }

    // Bind to dropdown logout trigger
    const dropdownLogout = document.getElementById('dropdownLogoutBtn');
    if (dropdownLogout) {
        dropdownLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to sign out?')) {
                performLogout();
            }
        });
    }
}

// Setup simple click handlers for non-functional mock navigation and CTA buttons
function setupMockInteractions() {
    const navLinks = document.querySelectorAll('.vl-nav-link:not([href="student-dashboard.html"]):not(.danger)');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.querySelector('.vl-nav-link-text')?.textContent.trim() || 'this section';
            alert(`"${pageName}" will be fully functional when course and assignment databases are connected.`);
        });
    });

    const ctas = document.querySelectorAll('.vl-btn-secondary, .vl-ai-btn, #profileDropdown .vl-dropdown-item:not(#dropdownLogoutBtn)');
    ctas.forEach(cta => {
        cta.addEventListener('click', (e) => {
            // Only alert if it's a mock hash link
            const href = cta.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                alert('This button is part of the layout framework and will be integrated with the live services soon.');
            }
        });
    });
}

// Master Initialization
async function initializeDashboard() {
    // 1. Load sidebar and header dynamic markup partials
    await loadComponents();

    // 2. Initialize design managers
    ThemeManager.init();
    SidebarController.init();
    HeaderController.init();
    DropdownManager.init();

    // 3. Bind UI profiles
    updateProfileUI();

    // 4. Hook up actions
    setupLogoutAction();
    setupMockInteractions();

    // 5. Connect Theme Toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            ThemeManager.toggle();
        });
    }
}

// Boot on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    initializeDashboard();
}
