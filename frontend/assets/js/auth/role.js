/* role.js - Workspace Role Management Helpers */

import { saveToStorage, getFromStorage, removeStorage } from './storage.js';

export const RoleManager = {
    saveRole(role) {
        saveToStorage('vertexlearn_role', role);
    },

    getRole() {
        return getFromStorage('vertexlearn_role');
    },

    clearRole() {
        removeStorage('vertexlearn_role');
    }
};

export const saveRole = RoleManager.saveRole;
export const getRole = RoleManager.getRole;
export const clearRole = RoleManager.clearRole;
