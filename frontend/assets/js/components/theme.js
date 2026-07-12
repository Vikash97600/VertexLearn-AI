/* theme.js - Light / Dark Mode Toggle Management */

import { STORAGE_KEYS } from '../config/constants.js';
import { Storage } from '../config/storage.js';

export const ThemeManager = {
    /**
     * Initializes the theme by checking LocalStorage or system preferences.
     */
    init() {
        const storedTheme = Storage.get(STORAGE_KEYS.THEME);
        
        if (storedTheme === 'dark') {
            this.setDarkTheme();
        } else if (storedTheme === 'light') {
            this.setLightTheme();
        } else {
            // Fallback to system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                this.setDarkTheme();
            } else {
                this.setLightTheme();
            }
        }

        // Watch for system color scheme changes in real-time
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!Storage.get(STORAGE_KEYS.THEME)) {
                if (e.matches) {
                    this.setDarkTheme();
                } else {
                    this.setLightTheme();
                }
            }
        });
    },

    /**
     * Apply the dark theme class globally.
     */
    setDarkTheme() {
        document.documentElement.classList.add('dark-theme');
        // Update all toggle buttons on the page
        this.updateToggleButtons(true);
    },

    /**
     * Remove the dark theme class globally.
     */
    setLightTheme() {
        document.documentElement.classList.remove('dark-theme');
        this.updateToggleButtons(false);
    },

    /**
     * Toggle between light and dark modes.
     */
    toggle() {
        const isDarkNow = document.documentElement.classList.contains('dark-theme');
        if (isDarkNow) {
            this.setLightTheme();
            Storage.set(STORAGE_KEYS.THEME, 'light');
        } else {
            this.setDarkTheme();
            Storage.set(STORAGE_KEYS.THEME, 'dark');
        }
    },

    /**
     * Update the visual states of theme toggle buttons.
     * @param {boolean} isDark 
     */
    updateToggleButtons(isDark) {
        const toggles = document.querySelectorAll('.theme-toggle-btn');
        toggles.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (isDark) {
                    icon.className = 'bi bi-sun';
                } else {
                    icon.className = 'bi bi-moon';
                }
            }
        });
    }
};
