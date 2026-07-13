/* ==========================================================================
   theme.js - Student Workspace Theme Manager
   VertexLearn AI · Design System Component
   ========================================================================== */

const THEME_KEY = 'vertexlearn_theme';

export const ThemeManager = {
    init() {
        const storedTheme = localStorage.getItem(THEME_KEY);
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
            if (!localStorage.getItem(THEME_KEY)) {
                if (e.matches) {
                    this.setDarkTheme();
                } else {
                    this.setLightTheme();
                }
            }
        });
    },

    setDarkTheme() {
        document.documentElement.classList.add('dark-theme');
        localStorage.setItem(THEME_KEY, 'dark');
        this.updateUI(true);
    },

    setLightTheme() {
        document.documentElement.classList.remove('dark-theme');
        localStorage.setItem(THEME_KEY, 'light');
        this.updateUI(false);
    },

    toggle() {
        const isDarkNow = document.documentElement.classList.contains('dark-theme');
        if (isDarkNow) {
            this.setLightTheme();
        } else {
            this.setDarkTheme();
        }
    },

    updateUI(isDark) {
        const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
        toggleBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'bi bi-sun' : 'bi bi-moon';
            }
            btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        });
    }
};
