/* toast.js - Reusable Dynamic Toast Alert launcher wrapper */

import { Toast as BaseToast } from '../components/toast.js';

export const ToastHelper = {
    showToast(message, type = 'info') {
        BaseToast.show(message, type);
    }
};

export const showToast = ToastHelper.showToast;
export { BaseToast as Toast };
