/* loader.js - Reusable Loading UI Elements and Skeleton Creators */

import { createElement } from '../utils/helper.js';

export const Loader = {
    progressBar: null,

    /**
     * Shows a top-screen slim progress bar simulating request loading.
     */
    showProgress() {
        if (!this.progressBar) {
            this.progressBar = createElement('div', {
                style: `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 0%;
                    height: 3px;
                    background-color: var(--brand-primary);
                    z-index: 2000;
                    transition: width 0.4s cubic-bezier(0.1, 0.8, 0.3, 1);
                    box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
                `
            });
            document.body.appendChild(this.progressBar);
        }

        // Reset and trigger initial growth
        this.progressBar.style.opacity = '1';
        this.progressBar.style.width = '0%';
        void this.progressBar.offsetWidth; // Force layout recalculation
        this.progressBar.style.width = '70%'; // Growth chunk
    },

    /**
     * Completes and hides the top-screen slim progress bar.
     */
    hideProgress() {
        if (!this.progressBar) return;
        
        this.progressBar.style.width = '100%';
        setTimeout(() => {
            this.progressBar.style.opacity = '0';
            setTimeout(() => {
                this.progressBar.style.width = '0%';
            }, 300);
        }, 200);
    },

    /**
     * Toggles loading state spinner on a trigger button node.
     * @param {HTMLButtonElement} buttonNode 
     * @param {boolean} isLoading 
     * @param {string} originalHtmlText 
     */
    setButtonLoading(buttonNode, isLoading, originalHtmlText = '') {
        if (!buttonNode) return;

        if (isLoading) {
            buttonNode.dataset.originalContent = buttonNode.innerHTML;
            buttonNode.classList.add('btn-loading');
            buttonNode.disabled = true;
        } else {
            const content = originalHtmlText || buttonNode.dataset.originalContent || 'Submit';
            buttonNode.innerHTML = content;
            buttonNode.classList.remove('btn-loading');
            buttonNode.disabled = false;
        }
    },

    /**
     * Returns a customized Skeleton Loader DOM node based on structural needs.
     * @param {string} shape - 'card' | 'table' | 'text' | 'media'
     * @returns {HTMLElement} skeletonNode
     */
    createSkeleton(shape = 'card') {
        let content = '';

        if (shape === 'card') {
            content = `
                <div class="card border-0 shadow-sm w-100" style="min-height: 260px; pointer-events: none;">
                    <div class="shimmer" style="height: 140px; width: 100%;"></div>
                    <div class="p-3">
                        <div class="shimmer" style="height: 20px; width: 80%; border-radius: 4px; margin-bottom: 12px;"></div>
                        <div class="shimmer" style="height: 14px; width: 60%; border-radius: 4px; margin-bottom: 8px;"></div>
                        <div class="shimmer" style="height: 14px; width: 45%; border-radius: 4px;"></div>
                    </div>
                </div>
            `;
        } else if (shape === 'table') {
            content = `
                <div class="table-responsive w-100" style="pointer-events: none;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th style="width: 25%;"><div class="shimmer" style="height: 12px; border-radius: 4px;"></div></th>
                                <th style="width: 50%;"><div class="shimmer" style="height: 12px; border-radius: 4px;"></div></th>
                                <th style="width: 25%;"><div class="shimmer" style="height: 12px; border-radius: 4px;"></div></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Array(4).fill(0).map(() => `
                                <tr>
                                    <td><div class="shimmer" style="height: 16px; border-radius: 4px;"></div></td>
                                    <td><div class="shimmer" style="height: 16px; border-radius: 4px;"></div></td>
                                    <td><div class="shimmer" style="height: 16px; border-radius: 4px;"></div></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            // Text list skeleton
            content = `
                <div class="w-100" style="pointer-events: none;">
                    <div class="shimmer" style="height: 20px; width: 90%; border-radius: 4px; margin-bottom: 12px;"></div>
                    <div class="shimmer" style="height: 16px; width: 75%; border-radius: 4px; margin-bottom: 8px;"></div>
                    <div class="shimmer" style="height: 16px; width: 50%; border-radius: 4px;"></div>
                </div>
            `;
        }

        // Inline stylesheet if shimmer helper is not included in document yet
        if (!document.getElementById('skeleton-styles')) {
            const styles = document.createElement('style');
            styles.id = 'skeleton-styles';
            styles.textContent = `
                .shimmer {
                    background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-color) 50%, var(--bg-secondary) 75%);
                    background-size: 200% 100%;
                    animation: shimmer-effect 1.5s infinite linear;
                }
                @keyframes shimmer-effect {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `;
            document.head.appendChild(styles);
        }

        const div = document.createElement('div');
        div.innerHTML = content.trim();
        return div.firstChild;
    }
};
