/* formatter.js - UI Formatting Helpers */

export const Formatter = {
    /**
     * Format currency value
     * @param {number} amount 
     * @param {string} currencyCode 
     * @param {string} locale 
     * @returns {string}
     */
    formatCurrency(amount, currencyCode = 'USD', locale = 'en-US') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode
        }).format(amount);
    },

    /**
     * Format video duration (watched seconds) into MM:SS or HH:MM:SS format
     * @param {number} seconds 
     * @returns {string}
     */
    formatDuration(seconds) {
        if (isNaN(seconds) || seconds < 0) return '00:00';
        
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        const pad = (num) => String(num).padStart(2, '0');

        if (hrs > 0) {
            return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
        }
        return `${pad(mins)}:${pad(secs)}`;
    },

    /**
     * Format timestamp relative to current date (e.g., "3 hours ago")
     * @param {string|Date} dateVal 
     * @returns {string}
     */
    formatRelativeTime(dateVal) {
        const date = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays}d ago`;

        // Default to short date string
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    /**
     * Format number (e.g., 1500 to 1.5K)
     * @param {number} num 
     * @returns {string}
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return String(num);
    }
};
