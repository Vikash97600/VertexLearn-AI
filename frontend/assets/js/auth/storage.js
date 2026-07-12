/* storage.js - Auth Local Storage and Session Storage wrappers */

export const StorageHelper = {
    saveToStorage(key, value, useSession = false) {
        const strVal = typeof value === 'object' ? JSON.stringify(value) : value;
        try {
            if (useSession) {
                sessionStorage.setItem(key, strVal);
            } else {
                localStorage.setItem(key, strVal);
            }
        } catch (e) {
            console.error('Error writing storage:', e);
        }
    },

    getFromStorage(key) {
        let val = localStorage.getItem(key);
        if (val === null) {
            val = sessionStorage.getItem(key);
        }
        if (val === null) return null;
        try {
            return JSON.parse(val);
        } catch (e) {
            return val;
        }
    },

    removeStorage(key) {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    }
};

export const saveToStorage = StorageHelper.saveToStorage;
export const getFromStorage = StorageHelper.getFromStorage;
export const removeStorage = StorageHelper.removeStorage;
