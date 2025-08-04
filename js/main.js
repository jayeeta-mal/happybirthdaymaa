// ===== MAIN JAVASCRIPT MODULE =====

// Main application class
class DivineBirthdayApp {
    constructor() {
        this.isInitialized = false;
        this.currentSection = 'hero';
        this.particles = [];
        this.divineElements = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeLoading();
        this.createDivineParticleSystem();
        this.setupScrollAnimations();
        this.setupNavigation();
        this.setupModals();
        this.setupFormHandling();
        this.setupDivineAnimations();
        this.isInitialized = true;
        console.log('🕉️ Divine Birthday Celebration initialized!');
    }

    // ===== LOADING SCREEN =====
    initializeLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 2000);
        }
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            
            if (navMenu && navToggle && !e.target.closest('.nav-container')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        // Close menu when clicking a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                if (navMenu && navToggle) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        });

        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            this.handleParallax();
            this.updateActiveNavigation();
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    // ===== DIVINE PARTICLE SYSTEM =====
    createDivineParticleSystem() {
        const particleContainer = document.querySelector('.divine-background');
        if (!particleContainer) return;

        // Create floating divine particles
        for (let i = 0; i < 30; i++) {
            this.createDivineParticle(particleContainer);
        }

        // Animate particles
        this.animateDivineParticles();
    }

    createDivineParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'divine-particle';
        
        const divineSymbols = ['🕉️', '🌸', '🦚', '👶', '🎭', '👑', '🧘', '🙏'];
        const randomSymbol = divineSymbols[Math.floor(Math.random() * divineSymbols.length)];
        
        particle.innerHTML = randomSymbol;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particle.style.fontSize = (Math.random() * 20 + 15) + 'px';
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        
        container.appendChild(particle);
        this.particles.push(particle);
    }

    animateDivineParticles() {
        this.particles.forEach(particle => {
            particle.addEventListener('animationend', () => {
                particle.remove();
                this.createDivineParticle(document.querySelector('.divine-background'));
            });
        });
    }

    // ===== DIVINE ANIMATIONS =====
    setupDivineAnimations() {
        // Add divine animations to elements
        this.addDivineAnimations();
        
        // Setup divine element interactions
        this.setupDivineElementInteractions();
    }

    addDivineAnimations() {
        // Add floating animation to divine elements
        document.querySelectorAll('.divine-element').forEach((element, index) => {
            element.style.animationDelay = (index * 0.5) + 's';
            element.classList.add('animate-divine-float');
        });

        // Add pulse animation to cards
        document.querySelectorAll('.about-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('animate-divine-pulse');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('animate-divine-pulse');
            });
        });

        // Add glow animation to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.classList.add('animate-divine-glow');
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('animate-divine-glow');
            });
        });
    }

    setupDivineElementInteractions() {
        document.querySelectorAll('.divine-element').forEach(element => {
            element.addEventListener('click', () => {
                this.triggerDivineBlessing(element);
            });
        });
    }

    triggerDivineBlessing(element) {
        const blessings = [
            '🕉️ Jai Shree Krishna!',
            '🌸 May Radha\'s love bless you!',
            '👶 Gopal\'s innocence be with you!',
            '🎭 Kanha\'s playfulness bring joy!',
            '👑 Ram-Sita\'s dharma guide you!',
            '🧘 Mahadev\'s meditation protect you!'
        ];
        
        const randomBlessing = blessings[Math.floor(Math.random() * blessings.length)];
        this.showDivineToast(randomBlessing, 'blessing');
        
        // Add click animation
        element.classList.add('animate-button-press');
        setTimeout(() => {
            element.classList.remove('animate-button-press');
        }, 200);
    }

    // ===== PARALLAX EFFECTS =====
    handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // ===== SCROLL ANIMATIONS =====
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== NAVIGATION =====
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        const updateActiveNav = () => {
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', updateActiveNav);
    }

    updateActiveNavigation() {
        // This method is called on scroll to update active nav state
        const scrollPos = window.scrollY + 100;
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===== MODAL HANDLING =====
    setupModals() {
        const wishBtn = document.getElementById('wish-btn');
        const wishModal = document.getElementById('wish-modal');
        const modalClose = document.querySelector('.modal-close');

        if (wishBtn && wishModal) {
            wishBtn.addEventListener('click', () => {
                this.openModal(wishModal);
            });
        }

        if (modalClose && wishModal) {
            modalClose.addEventListener('click', () => {
                this.closeModal(wishModal);
            });
        }

        // Close modal on outside click
        if (wishModal) {
            wishModal.addEventListener('click', (e) => {
                if (e.target === wishModal) {
                    this.closeModal(wishModal);
                }
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(wishModal);
            }
        });
    }

    openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            modal.classList.add('animate-modal-fade-in');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            modal.classList.remove('animate-modal-fade-in');
            document.body.style.overflow = '';
        }
    }

    // ===== FORM HANDLING =====
    setupFormHandling() {
        const contactForm = document.querySelector('.contact-form');
        const wishForm = document.querySelector('.wish-form');

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e.target, 'contact');
            });
        }

        if (wishForm) {
            wishForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e.target, 'wish');
            });
        }
    }

    handleFormSubmission(form, type) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simulate form submission
        this.showDivineToast('🙏 Divine blessing sent successfully!', 'success');
        
        // Reset form
        form.reset();
        
        // Close modal if it's a wish form
        if (type === 'wish') {
            this.closeModal(document.getElementById('wish-modal'));
        }
    }

    // ===== DIVINE TOAST NOTIFICATIONS =====
    showDivineToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type} divine-toast`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${type === 'blessing' ? '🕉️' : '🙏'}</span>
                <span class="toast-message">${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    // ===== KEYBOARD NAVIGATION =====
    handleKeyboardNavigation(e) {
        // Navigation with arrow keys
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const sections = Array.from(document.querySelectorAll('section[id]'));
            const currentIndex = sections.findIndex(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom >= 100;
            });

            if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Home key to go to top
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // End key to go to bottom
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    }

    // ===== RESIZE HANDLING =====
    handleResize() {
        // Recalculate particle positions on resize
        this.particles.forEach(particle => {
            if (!particle.isConnected) {
                particle.remove();
            }
        });
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
}

// ===== UTILITY FUNCTIONS =====

// Generate random number between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function smoothScrollTo(element, duration = 1000) {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// ===== INITIALIZATION =====

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    window.divineApp = new DivineBirthdayApp();
    
    // Add some divine effects
    addDivineEffects();
});

// Add additional divine effects
function addDivineEffects() {
    // Add floating divine elements
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        for (let i = 0; i < 3; i++) {
            const floatingElement = document.createElement('div');
            floatingElement.className = 'floating-divine-element';
            floatingElement.style.left = random(10, 90) + '%';
            floatingElement.style.top = random(10, 90) + '%';
            floatingElement.style.animationDelay = random(0, 6) + 's';
            heroSection.appendChild(floatingElement);
        }
    }

    // Add divine glow effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.classList.add('animate-divine-glow');
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.classList.remove('animate-divine-glow');
        });
    });

    // Add divine pulse to visual elements
    document.querySelectorAll('.krishna-flute, .lotus-flower, .peacock-feather').forEach(element => {
        element.classList.add('animate-divine-pulse');
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DivineBirthdayApp;
}