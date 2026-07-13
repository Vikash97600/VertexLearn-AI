/* ==========================================================================
   student-dashboard.js - Student Workspace Orchestrator (Root Shortcut)
   VertexLearn AI · Core Page Script
   ========================================================================== */

import { ThemeManager } from './assets/js/student/theme.js';
import { SidebarController } from './assets/js/student/sidebar.js';
import { HeaderController } from './assets/js/student/header.js';
import { DropdownManager } from './assets/js/student/dropdown.js';

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

    const initials = user.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

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
        const firstName = user.full_name.split(' ')[0];
        welcomeStudentName.textContent = firstName;
    }
}

// Reusable loader for HTML template parts to implement component-based loading
async function loadComponents() {
    const sidebarContainer = document.getElementById('sidebarContainer');
    const headerContainer = document.getElementById('headerContainer');

    const isInSubdir = window.location.pathname.includes('/student/');
    const basePath = isInSubdir ? '../' : './';

    if (sidebarContainer) {
        try {
            const response = await fetch(`${basePath}sidebar.html`);
            if (response.ok) {
                sidebarContainer.innerHTML = await response.text();
            }
        } catch (e) {
            console.error('Error fetching sidebar.html:', e);
        }
    }

    if (headerContainer) {
        try {
            const response = await fetch(`${basePath}header.html`);
            if (response.ok) {
                headerContainer.innerHTML = await response.text();
            }
        } catch (e) {
            console.error('Error fetching header.html:', e);
        }
    }
}

function setupLogoutAction() {
    const isInSubdir = window.location.pathname.includes('/student/');
    const basePath = isInSubdir ? '../' : './';

    const performLogout = () => {
        localStorage.removeItem('vertexlearn_token');
        localStorage.removeItem('vertexlearn_role');
        
        if (window.showToast) {
            window.showToast('Signed out successfully. Redirecting...', 'info');
        } else {
            alert('Signed out successfully.');
        }

        setTimeout(() => {
            window.location.href = `${basePath}login.html`;
        }, 800);
    };

    const sidebarLogout = document.getElementById('sidebarLogoutTrigger');
    if (sidebarLogout) {
        sidebarLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to sign out?')) {
                performLogout();
            }
        });
    }

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
            const href = cta.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                alert('This button is part of the layout framework and will be integrated with the live services soon.');
            }
        });
    });
}

async function initializeDashboard() {
    await loadComponents();

    ThemeManager.init();
    SidebarController.init();
    HeaderController.init();
    DropdownManager.init();

    updateProfileUI();

    setupLogoutAction();
    setupMockInteractions();

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            ThemeManager.toggle();
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    initializeDashboard();
}
