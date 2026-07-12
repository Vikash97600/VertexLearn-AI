/* storage.js - Local Storage Management Wrappers */

/**
 * Checks if localStorage is available and functional.
 * @returns {boolean}
 */
const isStorageAvailable = () => {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
};

const hasLocalStorage = isStorageAvailable();

// Memory fallback object if localStorage is blocked by privacy settings
const memoryStorage = {};

export const Storage = {
    /**
     * Set value in storage
     * @param {string} key 
     * @param {*} value 
     */
    set(key, value) {
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
        if (hasLocalStorage) {
            try {
                localStorage.setItem(key, stringValue);
            } catch (e) {
                console.error('Error writing to localStorage:', e);
            }
        } else {
            memoryStorage[key] = stringValue;
        }
    },

    /**
     * Get value from storage
     * @param {string} key 
     * @param {*} defaultValue 
     * @returns {*}
     */
    get(key, defaultValue = null) {
        let value = hasLocalStorage ? localStorage.getItem(key) : memoryStorage[key];
        
        if (value === null || value === undefined) {
            return defaultValue;
        }

        try {
            // Attempt to parse if it is valid JSON
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    },

    /**
     * Remove key from storage
     * @param {string} key 
     */
    remove(key) {
        if (hasLocalStorage) {
            localStorage.removeItem(key);
        } else {
            delete memoryStorage[key];
        }
    },

    /**
     * Clear all storage values
     */
    clear() {
        if (hasLocalStorage) {
            localStorage.clear();
        } else {
            Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
        }
    }
};
