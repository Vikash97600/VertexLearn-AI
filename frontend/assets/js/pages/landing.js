/* landing.js - Interactive Landing Page Actions and Simulators */

import { Formatter } from '../utils/formatter.js';

export const LandingController = {
    init() {
        this.setupNavbarScroll();
        this.setupPricingToggle();
        this.setupCountUpStatistics();
        this.setupAIChatSimulator();
        this.setupTestimonialSlider();
    },

    /**
     * Shifts navbar from transparent to white with border on scroll.
     */
    setupNavbarScroll() {
        const nav = document.getElementById('landingNavbar');
        if (!nav) return;

        const checkScroll = () => {
            if (window.scrollY > 20) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', checkScroll);
        checkScroll(); // Trigger initially in case of reload offset
    },

    /**
     * Toggles starter, pro, and enterprise pricing cards between Monthly and Yearly.
     */
    setupPricingToggle() {
        const btnMonthly = document.getElementById('toggleMonthly');
        const btnYearly = document.getElementById('toggleYearly');
        
        if (!btnMonthly || !btnYearly) return;

        const valStarter = document.getElementById('starterPriceVal');
        const valPro = document.getElementById('proPriceVal');
        const valStarterPeriod = document.getElementById('starterPeriodText');
        const valProPeriod = document.getElementById('proPeriodText');
        const proBillingNote = document.getElementById('proBillingNote');

        const switchBilling = (isYearly) => {
            if (isYearly) {
                btnYearly.classList.add('active');
                btnMonthly.classList.remove('active');

                // Yearly values (Starter $19 -> $15/mo, Pro $49 -> $39/mo)
                if (valStarter) valStarter.textContent = '$15';
                if (valPro) valPro.textContent = '$39';
                if (valStarterPeriod) valStarterPeriod.textContent = '/ month, billed yearly';
                if (valProPeriod) valProPeriod.textContent = '/ month, billed yearly';
                if (proBillingNote) proBillingNote.textContent = 'Save $120 per year';
            } else {
                btnMonthly.classList.add('active');
                btnYearly.classList.remove('active');

                // Monthly values
                if (valStarter) valStarter.textContent = '$19';
                if (valPro) valPro.textContent = '$49';
                if (valStarterPeriod) valStarterPeriod.textContent = '/ month';
                if (valProPeriod) valProPeriod.textContent = '/ month';
                if (proBillingNote) proBillingNote.textContent = 'Billed monthly';
            }
        };

        btnMonthly.addEventListener('click', () => switchBilling(false));
        btnYearly.addEventListener('click', () => switchBilling(true));
    },

    /**
     * Triggers animated CountUp stats once the section enters the viewport.
     */
    setupCountUpStatistics() {
        const statsSection = document.getElementById('statisticsSection');
        if (!statsSection) return;

        const counters = statsSection.querySelectorAll('.stat-counter');
        let animated = false;

        const startCountUp = () => {
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target, 10);
                const format = counter.dataset.format || 'number'; // 'number' | 'percent' | 'currency' | 'k'
                
                let start = 0;
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out cubic
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const currentVal = Math.floor(easeProgress * target);

                    // Formats values
                    if (format === 'percent') {
                        counter.textContent = `${currentVal}%`;
                    } else if (format === 'k') {
                        counter.textContent = `${(currentVal / 1000).toFixed(1)}K+`;
                    } else if (format === 'formatter_k') {
                        counter.textContent = Formatter.formatNumber(currentVal) + '+';
                    } else {
                        counter.textContent = currentVal.toLocaleString();
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        // Ensure exact final target
                        if (format === 'percent') {
                            counter.textContent = `${target}%`;
                        } else if (format === 'k') {
                            counter.textContent = `${(target / 1000).toFixed(0)}K+`;
                        } else if (format === 'formatter_k') {
                            counter.textContent = Formatter.formatNumber(target) + '+';
                        } else {
                            counter.textContent = target.toLocaleString() + '+';
                        }
                    }
                };

                requestAnimationFrame(updateCount);
            });
        };

        // Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    startCountUp();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    },

    /**
     * Loops a mock student-AI chat dialogue showing citations and summaries sequentially.
     */
    setupAIChatSimulator() {
        const chatBody = document.getElementById('aiShowcaseChatBody');
        if (!chatBody) return;

        const dialogues = [
            { sender: 'user', text: 'Why does quicksort degrade to O(n^2)?' },
            { 
                sender: 'ai', 
                text: 'Quicksort degrades to O(n^2) when the pivot choice partition yields empty sub-arrays repeatedly (e.g. choosing the first element on an already sorted list).',
                citation: 'Module 3: Sorting Algorithms - Video L5',
                flashcard: { q: 'What is Quicksort worst-case?', a: 'O(n^2)' }
            },
            { sender: 'user', text: 'Can we fix this?' },
            { 
                sender: 'ai', 
                text: 'Yes! Implementing a randomized pivot choice or Median-of-Three selection reduces the probability of O(n^2) degradation to near zero.',
                citation: 'Module 3: Randomized Algorithms - Slide 14' 
            }
        ];

        let index = 0;

        const appendBubble = () => {
            if (index >= dialogues.length) {
                // Restart loop after delay
                setTimeout(() => {
                    chatBody.innerHTML = '';
                    index = 0;
                    appendBubble();
                }, 8000);
                return;
            }

            const item = dialogues[index];
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble-mock ${item.sender}`;
            
            if (item.sender === 'user') {
                bubble.textContent = item.text;
                chatBody.appendChild(bubble);
                index++;
                chatBody.scrollTop = chatBody.scrollHeight;
                setTimeout(appendBubble, 2000);
            } else {
                // Show typing indicator
                const typingNode = document.createElement('div');
                typingNode.className = 'chat-bubble-mock ai text-muted';
                typingNode.innerHTML = '<span class="spinner-grow spinner-grow-sm me-1"></span> AI Tutor is thinking...';
                chatBody.appendChild(typingNode);
                chatBody.scrollTop = chatBody.scrollHeight;

                setTimeout(() => {
                    chatBody.removeChild(typingNode);
                    
                    let inner = `<div>${item.text}</div>`;
                    if (item.citation) {
                        inner += `
                            <div class="chat-citations">
                                <a href="#" class="cite-badge"><i class="bi bi-link-45deg"></i> Source: ${item.citation}</a>
                            </div>
                        `;
                    }
                    if (item.flashcard) {
                        inner += `
                            <div class="card p-2 mt-3 bg-primary-light border-0 shadow-sm" style="max-width: 250px;">
                                <div class="text-xs fw-bold text-primary mb-1"><i class="bi bi-magic"></i> AI Generated Flashcard</div>
                                <div class="text-xs fw-semibold text-dark">Q: ${item.flashcard.q}</div>
                                <div class="text-xs text-secondary-custom">A: ${item.flashcard.a}</div>
                            </div>
                        `;
                    }

                    bubble.innerHTML = inner;
                    chatBody.appendChild(bubble);
                    index++;
                    chatBody.scrollTop = chatBody.scrollHeight;
                    setTimeout(appendBubble, 4500);
                }, 1500);
            }
        };

        appendBubble();
    },

    /**
     * Initializes smooth slide reviews transition.
     */
    setupTestimonialSlider() {
        const container = document.getElementById('testimonialsSlider');
        if (!container) return;

        // Custom slide controls
        const slides = container.querySelectorAll('.testimonial-slide-col');
        const btnPrev = document.getElementById('testiPrev');
        const btnNext = document.getElementById('testiNext');
        
        if (slides.length <= 1) return;

        let activeSlideIndex = 0;

        const updateSlides = () => {
            slides.forEach((slide, idx) => {
                if (idx === activeSlideIndex) {
                    slide.classList.remove('d-none');
                    slide.classList.add('fade-in');
                } else {
                    slide.classList.add('d-none');
                    slide.classList.remove('fade-in');
                }
            });
        };

        if (btnPrev && btnNext) {
            btnPrev.addEventListener('click', () => {
                activeSlideIndex = activeSlideIndex === 0 ? slides.length - 1 : activeSlideIndex - 1;
                updateSlides();
            });
            btnNext.addEventListener('click', () => {
                activeSlideIndex = activeSlideIndex === slides.length - 1 ? 0 : activeSlideIndex + 1;
                updateSlides();
            });
        }

        updateSlides();
    }
};
