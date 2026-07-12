/* modal.js - Dynamic Reusable Dialog Modals */

import { createElement } from '../utils/helper.js';

export const Modal = {
    /**
     * Spawns a custom confirmation dialog programmatically.
     * @param {object} params
     * @param {string} params.title 
     * @param {string} params.message 
     * @param {string} params.confirmText 
     * @param {string} params.cancelText 
     * @param {string} params.confirmClass - Bootstrap button color class
     * @param {Function} params.onConfirm 
     * @param {Function} params.onCancel 
     */
    confirm({
        title = 'Are you sure?',
        message = 'This action cannot be undone.',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        confirmClass = 'btn-primary',
        onConfirm = () => {},
        onCancel = () => {}
    } = {}) {
        
        // Remove existing dialog container if present
        const oldModal = document.getElementById('confirmationModal');
        if (oldModal) {
            oldModal.parentNode.removeChild(oldModal);
        }

        const modalNode = createElement('div', {
            id: 'confirmationModal',
            className: 'modal fade',
            tabIndex: '-1',
            role: 'dialog',
            'aria-hidden': 'true'
        }, [
            createElement('div', { className: 'modal-dialog modal-dialog-centered' }, [
                createElement('div', { className: 'modal-content border-0 shadow-lg', style: 'border-radius: var(--radius-lg);' }, [
                    // Header
                    createElement('div', { className: 'modal-header border-bottom-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center' }, [
                        createElement('h5', { className: 'modal-title fw-bold fs-5' }, title),
                        createElement('button', {
                            className: 'btn-close border-0 bg-transparent fs-4 text-secondary',
                            'data-bs-dismiss': 'modal',
                            'aria-label': 'Close'
                        }, '×')
                    ]),
                    // Body
                    createElement('div', { className: 'modal-body text-secondary-custom py-3 px-4 text-body' }, message),
                    // Footer
                    createElement('div', { className: 'modal-footer border-top-0 pt-0 pb-4 px-4 d-flex gap-2 justify-content-end' }, [
                        createElement('button', {
                            className: 'btn btn-secondary-custom',
                            'data-bs-dismiss': 'modal',
                            onClick: onCancel
                        }, cancelText),
                        createElement('button', {
                            className: `btn ${confirmClass}`,
                            onClick: () => {
                                onConfirm();
                                // Close the modal using Bootstrap API instance
                                const bootstrapModal = bootstrap.Modal.getInstance(modalNode);
                                if (bootstrapModal) bootstrapModal.hide();
                            }
                        }, confirmText)
                    ])
                ])
            ])
        ]);

        document.body.appendChild(modalNode);

        // Initialize and trigger Bootstrap Modal
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const modalInstance = new bootstrap.Modal(modalNode, {
                backdrop: 'static',
                keyboard: true
            });
            modalInstance.show();
        } else {
            console.error('Bootstrap 5 Modal API is not loaded. Cannot display dialog.');
        }
    }
};
