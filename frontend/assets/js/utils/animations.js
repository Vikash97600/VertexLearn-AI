/* animations.js - Animation Initialization and Triggers */

export const AnimationHelper = {
    /**
     * Safe wrapper to initialize the AOS library if loaded globally.
     */
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                easing: 'ease-out-quad',
                once: true,
                disable: 'mobile'
            });
        }
    },

    /**
     * Triggers a subtle page transition fade-in effect on the target element.
     * @param {HTMLElement} element 
     */
    triggerPageTransition(element) {
        if (!element) return;
        element.classList.remove('page-transition');
        void element.offsetWidth; // Force reflow to reset transition animation trigger
        element.classList.add('page-transition');
    },

    /**
     * Animate list item entrance sequentially (Stagger effect)
     * @param {NodeList|Array} items 
     * @param {number} staggerMs 
     */
    staggerEntrance(items, staggerMs = 50) {
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(8px)';
            item.style.transition = `opacity 0.4s ease, transform 0.4s ease`;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * staggerMs);
        });
    }
};
