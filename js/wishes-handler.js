import { birthdayWishes } from './wishes-data.js';

class WishesHandler {
    constructor() {
        this.wishesContainer = document.querySelector('.wishes-grid');
        this.mediaViewer = document.getElementById('media-viewer');
        this.mediaContent = this.mediaViewer?.querySelector('.media-content');
        this.closeButton = this.mediaViewer?.querySelector('.media-viewer-close');
        this.prevButton = this.mediaViewer?.querySelector('.carousel-prev');
        this.nextButton = this.mediaViewer?.querySelector('.carousel-next');
        this.dotsContainer = this.mediaViewer?.querySelector('.carousel-dots');
        this.activeWish = null;
        this.currentMediaIndex = 0;
        this.mediaItems = [];
        this.videoPlayer = null;
        this.init();
    }

    init() {
        console.log('Initializing WishesHandler...');
        if (this.wishesContainer) {
            console.log('Found wishes container, rendering wishes...');
            console.log('Available wishes:', birthdayWishes.messages);
            this.renderWishes();
            this.setupEventListeners();
        } else {
            console.error('Wishes container not found!');
        }
    }

    renderWishes() {
        if (!this.wishesContainer) return;
        
        this.wishesContainer.innerHTML = '';
        
        birthdayWishes.messages.forEach((wish, index) => {
            const wishCard = this.createWishCard(wish);
            this.wishesContainer.appendChild(wishCard);
            
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                setTimeout(() => {
                    wishCard.classList.add('show');
                }, index * 200);
            });
        });
    }

    createWishCard(wish) {
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.setAttribute('data-wish-id', wish.id);
        
        card.innerHTML = `
            <div class="wish-content">
                <div class="wish-header">
                    <span class="wish-sender">${wish.sender}</span>
                    <div class="wish-icon">🎁</div>
                </div>
                <p class="wish-message">${wish.message}</p>
                ${wish.image ? `
                <div class="wish-media-gallery">
                    <div class="media-thumbnail" data-media-type="all" data-wish-id="${wish.id}">
                        <img src="${wish.image}" alt="Birthday Wish from ${wish.sender}" loading="lazy">
                        ${wish.video ? '<div class="video-indicator">▶</div>' : ''}
                    </div>
                </div>` : ''}
            </div>
        `;

        return card;
    }

    createVideoControls() {
        return ''; // Remove video controls
    }

    getMediaItemsForWish(wishId) {
        const wish = birthdayWishes.messages.find(w => w.id === wishId);
        if (!wish) return [];

        const items = [];
        if (wish.image) {
            items.push({ type: 'image', url: wish.image });
        }
        if (wish.video) {
            items.push({ type: 'video', url: wish.video });
        }
        return items;
    }

    updateCarouselDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';
        this.mediaItems.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `carousel-dot${index === this.currentMediaIndex ? ' active' : ''}`;
            dot.addEventListener('click', () => this.showMediaAtIndex(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    showMediaAtIndex(index) {
        if (!this.mediaItems.length) return;

        // Stop current video if playing
        if (this.videoPlayer) {
            this.videoPlayer.pause();
            this.videoPlayer = null;
        }

        this.currentMediaIndex = index;
        const media = this.mediaItems[index];
        
        if (!this.mediaContent) return;

        // Clear existing content
        this.mediaContent.innerHTML = '';
        
        // Create wrapper for video and controls
        const wrapper = document.createElement('div');
        wrapper.className = 'video-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        
        const element = media.type === 'video' 
            ? document.createElement('video')
            : document.createElement('img');

        if (media.type === 'video') {
            element.autoplay = true;
            element.playsInline = true;
            element.loop = true;
            element.controls = true;
            element.style.maxWidth = '100%';
            element.style.maxHeight = '90vh';
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.3s ease-out';
            
            const source = document.createElement('source');
            source.src = media.url;
            source.type = 'video/mp4';
            element.appendChild(source);
            
            wrapper.appendChild(element);
            this.mediaContent.appendChild(wrapper);
            
            // Store video reference
            this.videoPlayer = element;
            
            // Play video
            element.play().catch(err => console.log('Autoplay prevented:', err));
            
            // Fade in
            requestAnimationFrame(() => {
                element.style.opacity = '1';
            });
        } else {
            element.src = media.url;
            element.alt = 'Enlarged view';
            element.style.maxWidth = '100%';
            element.style.maxHeight = '90vh';
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.3s ease-out';
            
            wrapper.appendChild(element);
            this.mediaContent.appendChild(wrapper);
            
            requestAnimationFrame(() => {
                element.style.opacity = '1';
            });
        }

        this.updateCarouselDots();
        this.updateCarouselButtons();
    }
    
    updateCarouselButtons() {
        if (this.prevButton) {
            this.prevButton.style.display = this.currentMediaIndex > 0 ? 'flex' : 'none';
        }
        if (this.nextButton) {
            this.nextButton.style.display = this.currentMediaIndex < this.mediaItems.length - 1 ? 'flex' : 'none';
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    setupEventListeners() {
        if (!this.wishesContainer || !this.mediaViewer) return;

        this.wishesContainer.addEventListener('click', (e) => {
            const thumbnail = e.target.closest('.media-thumbnail');
            if (thumbnail) {
                const wishId = parseInt(thumbnail.dataset.wishId);
                this.mediaItems = this.getMediaItemsForWish(wishId);
                this.currentMediaIndex = 0;
                this.openMediaViewer();
                e.stopPropagation();
            }
        });

        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.closeMediaViewer());
        }

        this.mediaViewer.addEventListener('click', (e) => {
            if (e.target === this.mediaViewer) {
                this.closeMediaViewer();
            }
        });

        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                if (this.currentMediaIndex > 0) {
                    this.showMediaAtIndex(this.currentMediaIndex - 1);
                }
            });
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                if (this.currentMediaIndex < this.mediaItems.length - 1) {
                    this.showMediaAtIndex(this.currentMediaIndex + 1);
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (!this.mediaViewer.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeMediaViewer();
                    break;
                case 'ArrowLeft':
                    if (this.currentMediaIndex > 0) {
                        this.showMediaAtIndex(this.currentMediaIndex - 1);
                    }
                    break;
                case 'ArrowRight':
                    if (this.currentMediaIndex < this.mediaItems.length - 1) {
                        this.showMediaAtIndex(this.currentMediaIndex + 1);
                    }
                    break;
            }
        });
    }

    openMediaViewer() {
        if (!this.mediaViewer || !this.mediaContent) return;
        
        this.mediaViewer.classList.add('active');
        this.showMediaAtIndex(this.currentMediaIndex);
    }

    closeMediaViewer() {
        if (!this.mediaViewer) return;
        
        if (this.videoPlayer) {
            this.videoPlayer.pause();
            this.videoPlayer = null;
        }
        
        this.mediaViewer.classList.remove('active');
        this.currentMediaIndex = 0;
        this.mediaItems = [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating WishesHandler...');
    new WishesHandler();
});