/* modal.js - Programmatically spawned reusable Bootstrap Modals */

import { logout } from './session.js';

export const ModalHelper = {
    confirmLogout() {
        // Check if modal already exists in DOM
        let modalNode = document.getElementById('logoutModal');
        if (!modalNode) {
            modalNode = document.createElement('div');
            modalNode.id = 'logoutModal';
            modalNode.className = 'modal fade';
            modalNode.setAttribute('tabindex', '-1');
            modalNode.setAttribute('aria-hidden', 'true');

            modalNode.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow-lg" style="border-radius: var(--radius-lg);">
                        <div class="modal-header border-bottom px-4">
                            <h5 class="modal-title fw-bold">Confirm Sign Out</h5>
                            <button type="button" class="btn-close border-0 bg-transparent fs-5" data-bs-dismiss="modal" aria-label="Close">×</button>
                        </div>
                        <div class="modal-body p-4">
                            <p class="text-secondary-custom mb-0">Are you sure you want to logout? You will need to enter your credentials to access your workspace again.</p>
                        </div>
                        <div class="modal-footer border-top px-4 py-3">
                            <button type="button" class="btn btn-secondary-custom" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger" id="logoutModalSubmitBtn">Logout</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modalNode);

            // Add action listeners
            const submitBtn = modalNode.querySelector('#logoutModalSubmitBtn');
            submitBtn.addEventListener('click', () => {
                const modalInstance = bootstrap.Modal.getInstance(modalNode);
                if (modalInstance) modalInstance.hide();
                logout();
            });
        }

        // Show modal instance
        const modal = new bootstrap.Modal(modalNode);
        modal.show();
    }
};

export const confirmLogout = ModalHelper.confirmLogout.bind(ModalHelper);
