/* helper.js - Debounce, Throttle, and DOM builders */

/**
 * Debounce a callback to limit execution frequency.
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Throttle a callback to enforce regular interval execution.
 * @param {Function} func 
 * @param {number} limit 
 * @returns {Function}
 */
export function throttle(func, limit = 300) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Generates an escaping string to prevent XSS.
 * @param {string} string 
 * @returns {string}
 */
export function escapeHTML(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return string.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Custom Element creator utility.
 * @param {string} tag 
 * @param {object} attrs 
 * @param {Array|string} children 
 * @returns {HTMLElement}
 */
export function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    
    for (const [key, val] of Object.entries(attrs)) {
        if (key === 'className') {
            el.className = val;
        } else if (key === 'dataset') {
            for (const [dKey, dVal] of Object.entries(val)) {
                el.dataset[dKey] = dVal;
            }
        } else if (key.startsWith('on') && typeof val === 'function') {
            el.addEventListener(key.substring(2).toLowerCase(), val);
        } else {
            el.setAttribute(key, val);
        }
    }

    if (typeof children === 'string') {
        el.textContent = children;
    } else if (Array.isArray(children)) {
        children.forEach(child => {
            if (child instanceof HTMLElement) {
                el.appendChild(child);
            } else if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            }
        });
    }

    return el;
}
