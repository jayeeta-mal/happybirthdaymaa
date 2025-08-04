// ===== INTERACTIONS JAVASCRIPT MODULE =====

class InteractionController {
    constructor() {
        this.activeInteractions = new Map();
        this.touchStartTime = 0;
        this.touchStartPosition = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.setupClickInteractions();
        this.setupHoverInteractions();
        this.setupTouchInteractions();
        this.setupKeyboardInteractions();
        this.setupFormInteractions();
        this.setupScrollInteractions();
        this.setupDragInteractions();
    }

    // ===== CLICK INTERACTIONS =====
    setupClickInteractions() {
        // Ripple effect on buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                this.createRippleEffect(e.target, e);
            }
        });

        // Gallery item interactions
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleGalleryItemClick(e);
            });
        });

        // Card interactions
        document.querySelectorAll('.about-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleCardClick(e);
            });
        });
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: button-ripple 0.6s ease-out;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    handleGalleryItemClick(event) {
        const item = event.currentTarget;
        const category = item.dataset.category;
        
        // Add click animation
        item.classList.add('animate-button-press');
        
        // Show category-specific content
        this.showCategoryContent(category);
        
        setTimeout(() => {
            item.classList.remove('animate-button-press');
        }, 200);
    }

    handleCardClick(event) {
        const card = event.currentTarget;
        
        // Add flip animation
        card.classList.add('animate-flip');
        
        setTimeout(() => {
            card.classList.remove('animate-flip');
        }, 600);
    }

    showCategoryContent(category) {
        const messages = {
            birthday: '🎉 Celebrating your special day with cosmic energy!',
            achievements: '🏆 Your milestones shine like stars in the universe!',
            future: '🚀 Your future is as bright as the cosmos!'
        };

        if (window.cosmicApp) {
            window.cosmicApp.showToast(messages[category] || '✨ Cosmic moment captured!', 'success');
        }
    }

    // ===== HOVER INTERACTIONS =====
    setupHoverInteractions() {
        // Hover effects for interactive elements
        document.querySelectorAll('.hover-animate').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.handleHoverEnter(e);
            });

            element.addEventListener('mouseleave', (e) => {
                this.handleHoverLeave(e);
            });
        });

        // Parallax hover effect
        document.querySelectorAll('[data-hover-parallax]').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.handleParallaxHover(e);
            });
        });
    }

    handleHoverEnter(event) {
        const element = event.currentTarget;
        element.classList.add('hover-active');
        
        // Add floating animation
        if (element.classList.contains('floating-hover')) {
            element.classList.add('animate-cosmic-float');
        }
    }

    handleHoverLeave(event) {
        const element = event.currentTarget;
        element.classList.remove('hover-active');
        element.classList.remove('animate-cosmic-float');
    }

    handleParallaxHover(event) {
        const element = event.currentTarget;
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) * 0.1;
        const moveY = (y - centerY) * 0.1;
        
        element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    }

    // ===== TOUCH INTERACTIONS =====
    setupTouchInteractions() {
        document.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        }, { passive: true });
    }

    handleTouchStart(event) {
        this.touchStartTime = Date.now();
        this.touchStartPosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }

    handleTouchEnd(event) {
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - this.touchStartTime;
        const touchEndPosition = {
            x: event.changedTouches[0].clientX,
            y: event.changedTouches[0].clientY
        };

        const distance = Math.sqrt(
            Math.pow(touchEndPosition.x - this.touchStartPosition.x, 2) +
            Math.pow(touchEndPosition.y - this.touchStartPosition.y, 2)
        );

        // Handle tap
        if (touchDuration < 300 && distance < 10) {
            this.handleTap(event);
        }

        // Handle swipe
        if (distance > 50) {
            this.handleSwipe(event, touchEndPosition);
        }
    }

    handleTouchMove(event) {
        // Prevent default for custom touch handling
        if (event.target.closest('.touch-sensitive')) {
            event.preventDefault();
        }
    }

    handleTap(event) {
        const element = event.target.closest('.tap-animate');
        if (element) {
            element.classList.add('animate-tap');
            setTimeout(() => {
                element.classList.remove('animate-tap');
            }, 300);
        }
    }

    handleSwipe(event, endPosition) {
        const deltaX = endPosition.x - this.touchStartPosition.x;
        const deltaY = endPosition.y - this.touchStartPosition.y;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                this.handleSwipeRight();
            } else {
                this.handleSwipeLeft();
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                this.handleSwipeDown();
            } else {
                this.handleSwipeUp();
            }
        }
    }

    handleSwipeRight() {
        // Navigate to previous section
        this.navigateSection('prev');
    }

    handleSwipeLeft() {
        // Navigate to next section
        this.navigateSection('next');
    }

    handleSwipeUp() {
        // Scroll up
        window.scrollBy({ top: -100, behavior: 'smooth' });
    }

    handleSwipeDown() {
        // Scroll down
        window.scrollBy({ top: 100, behavior: 'smooth' });
    }

    navigateSection(direction) {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentSection = this.getCurrentSection();
        const currentIndex = sections.findIndex(section => section.id === currentSection);
        
        let targetIndex;
        if (direction === 'next') {
            targetIndex = Math.min(currentIndex + 1, sections.length - 1);
        } else {
            targetIndex = Math.max(currentIndex - 1, 0);
        }
        
        sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
    }

    getCurrentSection() {
        const scrollPos = window.scrollY + 100;
        const sections = document.querySelectorAll('section[id]');
        
        for (const section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                return section.id;
            }
        }
        
        return 'hero';
    }

    // ===== KEYBOARD INTERACTIONS =====
    setupKeyboardInteractions() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardEvent(e);
        });

        // Focus management
        document.addEventListener('focusin', (e) => {
            this.handleFocusIn(e);
        });

        document.addEventListener('focusout', (e) => {
            this.handleFocusOut(e);
        });
    }

    handleKeyboardEvent(event) {
        // Space bar to scroll down
        if (event.code === 'Space' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        }

        // Arrow keys for navigation
        if (event.code === 'ArrowDown') {
            event.preventDefault();
            window.scrollBy({ top: 100, behavior: 'smooth' });
        }

        if (event.code === 'ArrowUp') {
            event.preventDefault();
            window.scrollBy({ top: -100, behavior: 'smooth' });
        }

        // Enter key for buttons
        if (event.code === 'Enter' && event.target.classList.contains('btn')) {
            event.target.click();
        }

        // Escape key to close modals
        if (event.code === 'Escape') {
            this.closeAllModals();
        }
    }

    handleFocusIn(event) {
        const element = event.target;
        element.classList.add('focus-visible');
        
        // Add focus animation
        if (element.classList.contains('focus-animate')) {
            element.classList.add('animate-focus-in');
        }
    }

    handleFocusOut(event) {
        const element = event.target;
        element.classList.remove('focus-visible');
        element.classList.remove('animate-focus-in');
    }

    closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            if (window.cosmicApp) {
                window.cosmicApp.closeModal(modal);
            }
        });
    }

    // ===== FORM INTERACTIONS =====
    setupFormInteractions() {
        // Form field animations
        document.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('focus', (e) => {
                this.handleFieldFocus(e);
            });

            field.addEventListener('blur', (e) => {
                this.handleFieldBlur(e);
            });

            field.addEventListener('input', (e) => {
                this.handleFieldInput(e);
            });
        });

        // Form validation
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        });
    }

    handleFieldFocus(event) {
        const field = event.target;
        const label = field.previousElementSibling;
        
        if (label && label.tagName === 'LABEL') {
            label.classList.add('label-active');
        }
        
        field.classList.add('field-focused');
    }

    handleFieldBlur(event) {
        const field = event.target;
        const label = field.previousElementSibling;
        
        if (label && label.tagName === 'LABEL') {
            if (!field.value) {
                label.classList.remove('label-active');
            }
        }
        
        field.classList.remove('field-focused');
    }

    handleFieldInput(event) {
        const field = event.target;
        
        // Add character count
        if (field.hasAttribute('maxlength')) {
            const currentLength = field.value.length;
            const maxLength = field.getAttribute('maxlength');
            const counter = field.parentNode.querySelector('.char-counter');
            
            if (counter) {
                counter.textContent = `${currentLength}/${maxLength}`;
                counter.classList.toggle('counter-warning', currentLength > maxLength * 0.9);
            }
        }
    }

    handleFormSubmit(event) {
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;
            
            // Simulate form processing
            setTimeout(() => {
                submitBtn.classList.remove('btn-loading');
                submitBtn.disabled = false;
            }, 2000);
        }
    }

    // ===== SCROLL INTERACTIONS =====
    setupScrollInteractions() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            this.handleScroll();
            
            // Clear existing timeout
            clearTimeout(scrollTimeout);
            
            // Set new timeout for scroll end
            scrollTimeout = setTimeout(() => {
                this.handleScrollEnd();
            }, 150);
        }, { passive: true });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Update scroll progress
        const scrollProgress = (scrollTop / (documentHeight - windowHeight)) * 100;
        document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
        
        // Add scroll class to body
        document.body.classList.toggle('scrolling', scrollTop > 0);
    }

    handleScrollEnd() {
        document.body.classList.remove('scrolling');
    }

    // ===== DRAG INTERACTIONS =====
    setupDragInteractions() {
        document.querySelectorAll('.draggable').forEach(element => {
            element.addEventListener('mousedown', (e) => {
                this.startDrag(e);
            });
        });
    }

    startDrag(event) {
        const element = event.target;
        const startX = event.clientX - element.offsetLeft;
        const startY = event.clientY - element.offsetTop;
        
        const dragMove = (e) => {
            element.style.left = e.clientX - startX + 'px';
            element.style.top = e.clientY - startY + 'px';
        };
        
        const dragEnd = () => {
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
        };
        
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
    }

    // ===== UTILITY METHODS =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== ACCESSIBILITY HELPERS =====
    setupAccessibility() {
        // Skip to main content
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // ARIA live regions
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.interactionController = new InteractionController();
    window.interactionController.setupAccessibility();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionController;
} 