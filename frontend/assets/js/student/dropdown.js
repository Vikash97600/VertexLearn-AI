/* ==========================================================================
   dropdown.js - Premium Profile & Action Dropdown Manager
   VertexLearn AI · Design System Component
   ========================================================================== */

export const DropdownManager = {
    init() {
        this.setupProfileDropdown();
        this.setupClickOutside();
    },

    setupProfileDropdown() {
        const trigger = document.getElementById('profileTrigger');
        const dropdown = document.getElementById('profileDropdown');

        if (!trigger || !dropdown) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains('open');
            
            // Close all other active dropdowns first if any
            this.closeAllDropdowns();

            if (!isOpen) {
                dropdown.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
            } else {
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    },

    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.vl-profile-dropdown, .dropdown-menu');
        dropdowns.forEach(d => {
            d.classList.remove('open');
            d.classList.remove('show');
        });

        const triggers = document.querySelectorAll('[aria-expanded="true"]');
        triggers.forEach(t => {
            t.setAttribute('aria-expanded', 'false');
        });
    },

    setupClickOutside() {
        document.addEventListener('click', (e) => {
            const dropdowns = document.querySelectorAll('.vl-profile-dropdown.open');
            dropdowns.forEach(dropdown => {
                const parent = dropdown.closest('.vl-dropdown-wrap');
                if (parent && !parent.contains(e.target)) {
                    dropdown.classList.remove('open');
                    const trigger = parent.querySelector('[aria-expanded="true"]');
                    if (trigger) {
                        trigger.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });

        // Handle Escape key to close dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });
    }
};
