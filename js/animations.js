// ===== ANIMATIONS JAVASCRIPT MODULE =====

class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupMouseAnimations();
        this.setupKeyboardAnimations();
    }

    // ===== INTERSECTION OBSERVER =====
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0, 0.25, 0.5, 0.75, 1],
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.handleIntersection(entry);
            });
        }, observerOptions);

        // Observe all elements with animation classes
        const animatedElements = document.querySelectorAll('[class*="animate-"]');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    handleIntersection(entry) {
        const element = entry.target;
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;

        if (isIntersecting && intersectionRatio > 0.1) {
            this.triggerAnimation(element, 'enter');
        } else if (!isIntersecting) {
            this.triggerAnimation(element, 'exit');
        }
    }

    // ===== SCROLL ANIMATIONS =====
    setupScrollAnimations() {
        let ticking = false;

        const updateScrollAnimations = () => {
            this.updateParallaxElements();
            this.updateScrollProgress();
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    updateParallaxElements() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        // Update progress bars
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const target = bar.dataset.progress || scrollPercent;
            bar.style.width = `${target}%`;
        });
    }

    // ===== MOUSE ANIMATIONS =====
    setupMouseAnimations() {
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });

        document.addEventListener('mouseenter', (e) => {
            this.handleMouseEnter(e);
        });

        document.addEventListener('mouseleave', (e) => {
            this.handleMouseLeave(e);
        });
    }

    handleMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Update elements with mouse tracking
        document.querySelectorAll('[data-mouse-track]').forEach(element => {
            const intensity = parseFloat(element.dataset.mouseTrack) || 0.1;
            const x = (mouseX - windowWidth / 2) * intensity;
            const y = (mouseY - windowHeight / 2) * intensity;
            
            element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });

        // Update cursor effects
        this.updateCursorEffects(mouseX, mouseY);
    }

    handleMouseEnter(e) {
        const element = e.target;
        if (element.classList.contains('hover-animate')) {
            this.triggerAnimation(element, 'hover-enter');
        }
    }

    handleMouseLeave(e) {
        const element = e.target;
        if (element.classList.contains('hover-animate')) {
            this.triggerAnimation(element, 'hover-exit');
        }
    }

    updateCursorEffects(mouseX, mouseY) {
        // Create cursor trail effect
        const cursor = document.querySelector('.cursor-trail');
        if (cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
    }

    // ===== KEYBOARD ANIMATIONS =====
    setupKeyboardAnimations() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardAnimation(e);
        });
    }

    handleKeyboardAnimation(e) {
        const key = e.key.toLowerCase();
        const elements = document.querySelectorAll(`[data-key="${key}"]`);

        elements.forEach(element => {
            this.triggerAnimation(element, 'key-press');
        });
    }

    // ===== ANIMATION TRIGGERS =====
    triggerAnimation(element, type) {
        const animationClass = element.dataset[`${type}-animation`];
        if (animationClass) {
            element.classList.add(animationClass);
            
            // Remove animation class after animation completes
            const duration = this.getAnimationDuration(element);
            setTimeout(() => {
                element.classList.remove(animationClass);
            }, duration);
        }
    }

    getAnimationDuration(element) {
        const computedStyle = window.getComputedStyle(element);
        const duration = computedStyle.animationDuration;
        return parseFloat(duration) * 1000 || 1000;
    }

    // ===== PARTICLE SYSTEM =====
    createParticleSystem(container, options = {}) {
        const {
            count = 50,
            colors = ['#6b46c1', '#ec4899', '#60a5fa'],
            sizes = [2, 4, 6],
            speeds = [2, 4, 6]
        } = options;

        for (let i = 0; i < count; i++) {
            this.createParticle(container, { colors, sizes, speeds });
        }
    }

    createParticle(container, options) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const color = options.colors[Math.floor(Math.random() * options.colors.length)];
        const size = options.sizes[Math.floor(Math.random() * options.sizes.length)];
        const speed = options.speeds[Math.floor(Math.random() * options.speeds.length)];

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            animation: particle-float ${speed}s linear infinite;
            animation-delay: ${Math.random() * speed}s;
        `;

        container.appendChild(particle);
        return particle;
    }

    // ===== TEXT ANIMATIONS =====
    animateText(element, text, options = {}) {
        const {
            speed = 100,
            cursor = '|',
            onComplete = null
        } = options;

        let index = 0;
        element.textContent = '';

        const typeWriter = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, speed);
            } else {
                if (onComplete) onComplete();
            }
        };

        typeWriter();
    }

    // ===== MORPHING ANIMATIONS =====
    morphElement(fromElement, toElement, duration = 1000) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();

        const morphElement = fromElement.cloneNode(true);
        morphElement.style.position = 'fixed';
        morphElement.style.top = fromRect.top + 'px';
        morphElement.style.left = fromRect.left + 'px';
        morphElement.style.width = fromRect.width + 'px';
        morphElement.style.height = fromRect.height + 'px';
        morphElement.style.zIndex = '9999';
        morphElement.style.transition = `all ${duration}ms ease-in-out`;

        document.body.appendChild(morphElement);

        // Trigger morphing
        requestAnimationFrame(() => {
            morphElement.style.top = toRect.top + 'px';
            morphElement.style.left = toRect.left + 'px';
            morphElement.style.width = toRect.width + 'px';
            morphElement.style.height = toRect.height + 'px';
        });

        // Clean up
        setTimeout(() => {
            morphElement.remove();
        }, duration);
    }

    // ===== SPRING ANIMATIONS =====
    springAnimation(element, targetValue, options = {}) {
        const {
            property = 'transform',
            spring = 0.1,
            friction = 0.8,
            precision = 0.01
        } = options;

        let currentValue = 0;
        let velocity = 0;

        const animate = () => {
            const distance = targetValue - currentValue;
            const acceleration = distance * spring;
            velocity += acceleration;
            velocity *= friction;
            currentValue += velocity;

            element.style[property] = `translateX(${currentValue}px)`;

            if (Math.abs(distance) > precision || Math.abs(velocity) > precision) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // ===== WAVE ANIMATIONS =====
    createWaveEffect(container, options = {}) {
        const {
            amplitude = 20,
            frequency = 0.02,
            speed = 0.05
        } = options;

        let time = 0;

        const animate = () => {
            const elements = container.children;
            Array.from(elements).forEach((element, index) => {
                const y = Math.sin(time + index * frequency) * amplitude;
                element.style.transform = `translateY(${y}px)`;
            });

            time += speed;
            requestAnimationFrame(animate);
        };

        animate();
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

    // ===== ANIMATION QUEUE =====
    queueAnimation(element, animations) {
        let index = 0;

        const playNext = () => {
            if (index < animations.length) {
                const animation = animations[index];
                element.classList.add(animation);
                
                setTimeout(() => {
                    element.classList.remove(animation);
                    index++;
                    playNext();
                }, this.getAnimationDuration(element));
            }
        };

        playNext();
    }

    // ===== ANIMATION CONTROLS =====
    pauseAnimation(element) {
        element.style.animationPlayState = 'paused';
    }

    resumeAnimation(element) {
        element.style.animationPlayState = 'running';
    }

    stopAnimation(element) {
        element.style.animation = 'none';
    }

    // ===== PERFORMANCE OPTIMIZATION =====
    optimizeAnimations() {
        // Use transform and opacity for better performance
        document.querySelectorAll('.animate-optimized').forEach(element => {
            element.style.willChange = 'transform, opacity';
        });

        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }
}

// ===== ANIMATION PRESETS =====
const AnimationPresets = {
    fadeIn: {
        enter: 'animate-fade-in',
        exit: 'animate-fade-out'
    },
    slideIn: {
        enter: 'animate-slide-in-left',
        exit: 'animate-slide-out-right'
    },
    scaleIn: {
        enter: 'animate-scale-in',
        exit: 'animate-scale-out'
    },
    bounce: {
        enter: 'animate-bounce-in',
        exit: 'animate-bounce-out'
    },
    flip: {
        enter: 'animate-flip-in',
        exit: 'animate-flip-out'
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
    window.animationController.optimizeAnimations();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationController, AnimationPresets };
} 