/* toast.js - Reusable Dynamic Toast Alert Queue */

import { createElement } from '../utils/helper.js';

export const Toast = {
    container: null,

    /**
     * Initializes toast container on demand.
     */
    initContainer() {
        if (this.container) return;
        
        this.container = createElement('div', {
            className: 'toast-container position-fixed bottom-0 end-0 p-3',
            style: 'z-index: 1100; pointer-events: none;'
        });
        
        document.body.appendChild(this.container);
        
        // Append CSS rules inline if not defined to keep the component plug-and-play
        if (!document.getElementById('toast-styles')) {
            const styles = document.createElement('style');
            styles.id = 'toast-styles';
            styles.textContent = `
                .custom-toast {
                    background-color: var(--bg-card);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    padding: var(--space-3) var(--space-4);
                    margin-top: var(--space-2);
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    min-width: 280px;
                    max-width: 380px;
                    pointer-events: auto;
                    animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    transition: opacity 0.2s ease, transform 0.2s ease;
                }
                .custom-toast.toast-closing {
                    opacity: 0;
                    transform: translateY(10px) scale(0.95);
                }
            `;
            document.head.appendChild(styles);
        }
    },

    /**
     * Spawns a new toast alert message.
     * @param {string} message 
     * @param {string} type - success, error, warning, info
     * @param {number} duration 
     */
    show(message, type = 'info', duration = 4000) {
        this.initContainer();

        let iconClass = 'bi-info-circle-fill text-primary';
        if (type === 'success') iconClass = 'bi-check-circle-fill text-success';
        if (type === 'error') iconClass = 'bi-exclamation-circle-fill text-danger';
        if (type === 'warning') iconClass = 'bi-exclamation-triangle-fill text-warning';

        const toastNode = createElement('div', { className: 'custom-toast' }, [
            createElement('i', { className: `bi ${iconClass} fs-5` }),
            createElement('div', { className: 'flex-grow-1 text-small fw-medium' }, message),
            createElement('button', {
                className: 'btn-close border-0 bg-transparent text-secondary p-1 ms-auto',
                style: 'cursor: pointer;',
                onClick: () => this.dismiss(toastNode)
            }, '×')
        ]);

        this.container.appendChild(toastNode);

        // Auto dismiss
        setTimeout(() => {
            this.dismiss(toastNode);
        }, duration);
    },

    /**
     * Triggers close animation and removes the toast node from the DOM.
     * @param {HTMLElement} node 
     */
    dismiss(node) {
        if (!node || !node.parentNode) return;
        node.classList.add('toast-closing');
        setTimeout(() => {
            if (node && node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }, 200);
    },

    success(message, duration) { this.show(message, 'success', duration); },
    error(message, duration) { this.show(message, 'error', duration); },
    warning(message, duration) { this.show(message, 'warning', duration); },
    info(message, duration) { this.show(message, 'info', duration); }
};
