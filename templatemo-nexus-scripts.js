/*

TemplateMo 594 nexus flow

https://templatemo.com/tm-594-nexus-flow

*/

// JavaScript Document

// Motion / performance preferences
const prefersReducedMotion =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Skip heavy canvas-like DOM effects on narrow viewports (phones); CSS also tones down blur animations. */
function isMobilePerformanceMode() {
    return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
}

// Intro preloader
function initializeSitePreloader() {
    const preloader = document.getElementById('sitePreloader');
    if (!preloader) return;
    if (prefersReducedMotion) {
        preloader.remove();
        return;
    }

    preloader.setAttribute('aria-hidden', 'false');
    let finished = false;
    let exiting = false;

    function cleanup() {
        if (finished) return;
        finished = true;
        if (preloader && preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
        }
    }

    function exitSequence() {
        if (finished || exiting) return;
        exiting = true;
        preloader.classList.add('site-preloader--flash');
        setTimeout(() => {
            preloader.classList.add('site-preloader--exiting');
        }, 95);
        setTimeout(cleanup, 1500);
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            preloader.classList.add('site-preloader--run');
        });
    });

    const autoTimer = setTimeout(exitSequence, 7000);

    let canSkip = false;
    setTimeout(() => {
        canSkip = true;
        preloader.classList.add('site-preloader--skip-ready');
    }, 1800);

    preloader.addEventListener('click', () => {
        if (!canSkip) return;
        clearTimeout(autoTimer);
        exitSequence();
    });

    document.addEventListener('keydown', function onEsc(e) {
        if (e.key !== 'Escape') return;
        document.removeEventListener('keydown', onEsc);
        clearTimeout(autoTimer);
        exitSequence();
    });

    window.addEventListener('load', () => {
        if (!finished && !exiting) {
            setTimeout(exitSequence, 2600);
        }
    }, { once: true });

    setTimeout(() => {
        if (!finished && !exiting) {
            exitSequence();
        }
    }, 11500);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSitePreloader);
} else {
    initializeSitePreloader();
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav a');
    const mobileMenuCta = document.querySelector('.mobile-menu-cta');
    const mobileMenuCtaButton = document.querySelector('.mobile-menu-cta a');
    const mobileMenuLogo = document.querySelector('.mobile-menu-logo');

    // Check if essential elements exist
    if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay || !mobileMenuClose) {
        return;
    }

    function openMobileMenu() {
        mobileMenuBtn.classList.add('active');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset and trigger animations for links
        mobileMenuLinks.forEach((link, index) => {
            if (link) {
                link.style.animation = 'none';
                link.style.opacity = '0';
                link.style.transform = 'translateX(20px)';
                
                // Apply animation with delay
                setTimeout(() => {
                    if (link) {
                        link.style.animation = `slideInLeft 0.4s ease forwards`;
                    }
                }, 250 + (index * 100));
            }
        });
        
        // Animate CTA button
        if (mobileMenuCta) {
            mobileMenuCta.style.animation = 'none';
            mobileMenuCta.style.opacity = '0';
            mobileMenuCta.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                if (mobileMenuCta) {
                    mobileMenuCta.style.animation = 'slideInUp 0.4s ease forwards';
                }
            }, 100);
        }
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close mobile menu
    mobileMenuClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
    });
    
    mobileMenuOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
    });

    // Close menu when clicking on navigation links
    mobileMenuLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        }
    });

    // Close menu when clicking on CTA button
    if (mobileMenuCtaButton) {
        mobileMenuCtaButton.addEventListener('click', (e) => {
            if (mobileMenuCtaButton.getAttribute('href') === '#') {
                e.preventDefault();
            }
            closeMobileMenu();
        });
    }

    // Close menu when clicking on logo
    if (mobileMenuLogo) {
        mobileMenuLogo.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Prevent body scroll when menu is open
    if (mobileMenu) {
        mobileMenu.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        });
    }
}

// Initialize mobile menu when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileMenu);
} else {
    initializeMobileMenu();
}

// Generate Matrix Rain Effect
function generateMatrixRain() {
    const matrixRain = document.getElementById('matrixRain');
    const characters = 'A L L O F T E C H AI ML WEB DEV UX UI N8N DATA CLOUD CODE 0 1 {} <> [] () # @';
    if (!matrixRain) return;

    // Reduce number of columns to keep animations light
    const maxColumns = 40;
    const columns = Math.min(Math.floor(window.innerWidth / 24), maxColumns);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = `${i * 20}px`;
        column.style.animationDuration = `${Math.random() * 5 + 10}s`;
        column.style.animationDelay = `${Math.random() * 5}s`;
        
        // Generate random characters for the column
        let text = '';
        const charCount = Math.floor(Math.random() * 20 + 10);
        for (let j = 0; j < charCount; j++) {
            text += characters[Math.floor(Math.random() * characters.length)] + ' ';
        }
        column.textContent = text;
        
        matrixRain.appendChild(column);
    }
}

// Generate Floating Particles
function generateParticles() {
    const particlesContainer = document.getElementById('particlesContainer');
    if (!particlesContainer) return;

    let particleCount = 40;
    if (window.innerWidth < 1200) particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 20}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Generate Data Streams
function generateDataStreams() {
    const dataStreams = document.getElementById('dataStreams');
    if (!dataStreams) return;

    // Slightly reduce number of streams
    const streamCount = 6;
    
    for (let i = 0; i < streamCount; i++) {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.style.top = `${Math.random() * 100}%`;
        stream.style.left = `-300px`;
        stream.style.animationDelay = `${Math.random() * 5}s`;
        stream.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
        
        dataStreams.appendChild(stream);
    }
}

// Initialize background effects (skip reduced motion + skip on phone-width — matrix/particles/streams hammer the GPU)
if (!prefersReducedMotion && !isMobilePerformanceMode()) {
    generateMatrixRain();
    generateParticles();
    generateDataStreams();
}

// Regenerate matrix rain on window resize (throttled)
let resizeTimer;
window.addEventListener(
    'resize',
    () => {
        if (prefersReducedMotion) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const matrixRain = document.getElementById('matrixRain');
            if (!matrixRain) return;
            matrixRain.innerHTML = '';
            if (!isMobilePerformanceMode()) {
                generateMatrixRain();
            }
        }, 250);
    },
    { passive: true }
);

// Interactive mouse glow effect (throttled for performance)
if (!prefersReducedMotion) {
    let mouseTimer;
    document.addEventListener('mousemove', (e) => {
        if (!mouseTimer) {
            mouseTimer = setTimeout(() => {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                // Move orbs slightly based on mouse position
                const orbs = document.querySelectorAll('.orb');
                orbs.forEach((orb, index) => {
                    const speed = (index + 1) * 0.02;
                    const x = (mouseX - window.innerWidth / 2) * speed;
                    const y = (mouseY - window.innerHeight / 2) * speed;
                    orb.style.transform = `translate(${x}px, ${y}px)`;
                });
                
                mouseTimer = null;
            }, 16); // ~60fps
        }
    });
}

// Add a glow that follows the cursor (desktop only, and only if motion allowed)
if (window.innerWidth > 768 && !prefersReducedMotion) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default and scroll if href is more than just '#'
        if (href && href.length > 1) {
            e.preventDefault();
            if (href === '#top') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    });
});

// Navbar scroll effect (throttled with requestAnimationFrame)
const nav = document.querySelector('nav');
if (nav) {
    let lastScrollY = window.scrollY;
    let navScrollScheduled = false;

    window.addEventListener(
        'scroll',
        () => {
            lastScrollY = window.scrollY;
            if (navScrollScheduled) return;
            navScrollScheduled = true;
            requestAnimationFrame(() => {
                navScrollScheduled = false;
                nav.classList.toggle('nav-scrolled', lastScrollY > 100);
            });
        },
        { passive: true }
    );
    nav.classList.toggle('nav-scrolled', window.scrollY > 100);
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});

// Button effects
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// Stats counter animation
const animateStats = (section) => {
    const stats = section.querySelectorAll('.stat-number, .about-future-stat-number');
    stats.forEach(stat => {
        // Check if already animated
        if (stat.classList.contains('animated')) {
            return;
        }
        stat.classList.add('animated');
        
        const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        let count = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                clearInterval(timer);
                count = target;
            }
            const suffix = stat.textContent.replace(/[\d]/g, '');
            stat.textContent = Math.floor(count) + suffix;
        }, 20);
    });
};

// Trigger stats animation when section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

const statsSections = document.querySelectorAll('.stats');
statsSections.forEach(section => {
    if (section) {
        statsObserver.observe(section);
        // If section is already in view on load, trigger immediately.
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
            animateStats(section);
            statsObserver.unobserve(section);
        }
    }
});

// Glitch effect on hover for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch1 0.3s ease-in-out';
        setTimeout(() => {
            this.style.animation = '';
        }, 300);
    });
});

// FAQ accordion
function initializeFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!trigger || !answer) return;

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            // Single-open behavior
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('is-open');
                const otherBtn = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                if (otherAnswer) otherAnswer.hidden = true;
            });

            if (!isOpen) {
                item.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
                answer.hidden = false;
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFaqAccordion);
} else {
    initializeFaqAccordion();
}

// Random cyber text effects (desktop only, optional for motion-sensitive users)
const cyberTexts = ['STARTING UP...', 'TURNING TECHNOLOGY INTO GROWTH', 'BUILD SMART. GROW FAST', 'Application Live'];

if (!prefersReducedMotion && window.innerWidth > 1024) {
    setInterval(() => {
        const randomText = cyberTexts[Math.floor(Math.random() * cyberTexts.length)];
        const tempElement = document.createElement('div');
        tempElement.textContent = randomText;
        tempElement.style.cssText = `
            position: fixed;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
            color: var(--primary-cyan);
            font-size: 0.8rem;
            font-weight: 700;
            z-index: 1000;
            opacity: 0.7;
            pointer-events: none;
            animation: fadeOut 3s ease-out forwards;
            text-shadow: 0 0 10px var(--primary-cyan);
        `;
        document.body.appendChild(tempElement);
        
        setTimeout(() => {
            document.body.removeChild(tempElement);
        }, 3000);
    }, 5000);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 0.7; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-50px); }
    }
`;
document.head.appendChild(style);

// Service Modal Functionality
function initializeServiceModals() {
    const serviceCards = document.querySelectorAll('.clickable-service');
    const modalOverlay = document.getElementById('serviceModalOverlay');
    const modals = document.querySelectorAll('.service-modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    const relatedServiceCards = document.querySelectorAll('.related-service-card');

    // Open modal when clicking on a service card
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            openModal(serviceType);
            generateModalBackground(serviceType);
        });
    });

    // Open modal when clicking on a related service card
    relatedServiceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            const serviceType = this.getAttribute('data-service');
            openModal(serviceType);
            generateModalBackground(serviceType);
        });
    });

    // Close modal when clicking close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            closeModal();
        });
    });

    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(serviceType) {
    const modalOverlay = document.getElementById('serviceModalOverlay');
    const modals = document.querySelectorAll('.service-modal');
    
    // Hide all modals
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    
    // Show the selected modal
    const targetModal = document.getElementById(`modal-${serviceType}`);
    if (targetModal) {
        targetModal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modalOverlay = document.getElementById('serviceModalOverlay');
    const modals = document.querySelectorAll('.service-modal');
    
    modalOverlay.classList.remove('active');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

function generateModalBackground(serviceType) {
    const modal = document.getElementById(`modal-${serviceType}`);
    if (!modal) return;
    
    const matrixRain = modal.querySelector('.modal-matrix-rain');
    const particles = modal.querySelector('.modal-particles');
    
    if (matrixRain && matrixRain.children.length === 0) {
        // Generate modal matrix rain
        const characters = 'A L L O F T E C H AI ML WEB DEV UX UI N8N DATA CLOUD CODE 0 1 {} <> [] () # @';
        const columns = Math.floor(modal.offsetWidth / 20);
        
        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = `${i * 20}px`;
            column.style.animationDuration = `${Math.random() * 5 + 10}s`;
            column.style.animationDelay = `${Math.random() * 5}s`;
            
            let text = '';
            const charCount = Math.floor(Math.random() * 15 + 8);
            for (let j = 0; j < charCount; j++) {
                text += characters[Math.floor(Math.random() * characters.length)] + ' ';
            }
            column.textContent = text;
            
            matrixRain.appendChild(column);
        }
    }
    
    if (particles && particles.children.length === 0) {
        // Generate modal particles
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 20}s`;
            
            particles.appendChild(particle);
        }
    }
}

// Initialize service modals when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeServiceModals);
} else {
    initializeServiceModals();
}

// Contact form submission with EmailJS
const EMAILJS_PUBLIC_KEY = 'kgXIjzhce1SbUpve9';
const CONTACT_EMAILJS_SERVICE_ID = 'service_lkha1el';
const CONTACT_EMAILJS_TEMPLATE_ID = 'template_hat5kie';
const REVIEW_EMAILJS_SERVICE_ID = 'service_17hkvzg';
const REVIEW_EMAILJS_TEMPLATE_ID = 'template_1wgepzk';

function ensureEmailJsReady() {
    if (typeof emailjs === 'undefined') {
        return false;
    }

    if (!window.__emailJsInitialized) {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY
        });
        window.__emailJsInitialized = true;
    }

    return true;
}

function initializeContactForm() {
    // Wait for EmailJS to be loaded
    if (!ensureEmailJsReady()) {
        console.error('EmailJS is not loaded. Make sure the EmailJS script is included before this script.');
        return;
    }

    // Get the contact form
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) {
        console.error('Contact form not found. Make sure the form has id="contact-form"');
        return;
    }

    // Handle form submission
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data for validation
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        // Basic validation
        if (!name || !email || !message) {
            alert('Please fill out all required fields.');
            return;
        }

        // Disable submit button during submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton?.textContent || 'Send Message';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        // Send the form using EmailJS
        emailjs.sendForm(CONTACT_EMAILJS_SERVICE_ID, CONTACT_EMAILJS_TEMPLATE_ID, this)
            .then(() => {
                alert('Message sent successfully!');
                this.reset(); // Reset form fields
                
                // Re-enable submit button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            })
            .catch(error => {
                console.error('EmailJS Error:', error);
                alert('Failed to send message. Please try again later or contact us directly at contact.alloftech@gmail.com');
                
                // Re-enable submit button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            });
    });
}

// Reviews marquee: auto-scroll loop, pause on drag/touch, responsive card width
function initializeReviewsMarquee() {
    const root = document.querySelector('[data-reviews-marquee]');
    const viewport = document.getElementById('reviews-marquee-viewport');
    const track = root?.querySelector('.reviews-marquee-track');
    if (!root || !viewport || !track || viewport.dataset.marqueeReady === '1') return;
    viewport.dataset.marqueeReady = '1';

    const originals = track.querySelectorAll('.review-card');
    if (!originals.length) return;

    originals.forEach((card) => {
        track.appendChild(card.cloneNode(true));
    });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AUTO_PX_PER_SEC = 40;
    const RESUME_MS = 2200;

    let position = 0;
    let loopWidth = 0;
    let cardStep = 0;
    let autoplayActive = !reducedMotion;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartPos = 0;
    let resumeTimer = null;
    let lastTs = 0;

    function visibleCountForWidth(width) {
        if (width < 640) return 1;
        if (width < 1024) return 2;
        return 3;
    }

    function readGapPx() {
        const gapCss = getComputedStyle(track).gap;
        const parsed = parseFloat(gapCss);
        return Number.isFinite(parsed) ? parsed : 20;
    }

    function updateMetrics() {
        const w = viewport.clientWidth;
        const n = visibleCountForWidth(w);
        const gap = readGapPx();
        const basis = Math.max(200, (w - (n - 1) * gap) / n);
        viewport.style.setProperty('--review-card-basis', `${basis}px`);

        loopWidth = track.scrollWidth / 2;
        cardStep = basis + gap;

        wrapPosition();
        applyTransform();
    }

    function applyTransform() {
        track.style.transform = `translate3d(${position}px, 0, 0)`;
    }

    function wrapPosition() {
        if (!loopWidth) return;
        while (position <= -loopWidth) position += loopWidth;
        while (position > 0) position -= loopWidth;
    }

    function scheduleResumeAutoplay() {
        if (reducedMotion) {
            autoplayActive = false;
            return;
        }
        clearTimeout(resumeTimer);
        autoplayActive = false;
        resumeTimer = setTimeout(() => {
            autoplayActive = true;
            resumeTimer = null;
        }, RESUME_MS);
    }

    function finishDrag() {
        if (!isDragging) return;
        isDragging = false;
        viewport.classList.remove('is-dragging');
        track.classList.remove('is-dragging');
        wrapPosition();
        applyTransform();
        scheduleResumeAutoplay();
    }

    function onPointerDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        isDragging = true;
        viewport.classList.add('is-dragging');
        track.classList.add('is-dragging');
        dragStartX = e.clientX;
        dragStartPos = position;
        clearTimeout(resumeTimer);
        resumeTimer = null;
        autoplayActive = false;
        try {
            viewport.setPointerCapture(e.pointerId);
        } catch (_) {}
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        position = dragStartPos + (e.clientX - dragStartX);
        wrapPosition();
        applyTransform();
    }

    function onPointerUp(e) {
        if (!isDragging) return;
        try {
            viewport.releasePointerCapture(e.pointerId);
        } catch (_) {}
        finishDrag();
    }

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);
    viewport.addEventListener('lostpointercapture', () => {
        if (isDragging) finishDrag();
    });

    viewport.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        clearTimeout(resumeTimer);
        autoplayActive = false;
        const dir = e.key === 'ArrowLeft' ? -1 : 1;
        position += dir * cardStep;
        wrapPosition();
        applyTransform();
        scheduleResumeAutoplay();
    });

    function tick(ts) {
        requestAnimationFrame(tick);
        if (!loopWidth) return;
        if (!lastTs) lastTs = ts;
        const dt = Math.min(64, ts - lastTs) / 1000;
        lastTs = ts;

        if (autoplayActive && !isDragging && !reducedMotion) {
            position -= AUTO_PX_PER_SEC * dt;
            wrapPosition();
            applyTransform();
        }
    }

    const ro = new ResizeObserver(() => updateMetrics());
    ro.observe(viewport);
    updateMetrics();
    requestAnimationFrame(tick);

    if (document.readyState !== 'complete') {
        window.addEventListener('load', () => updateMetrics(), { once: true });
    }
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => updateMetrics());
    }

    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    function onReducedMotionChange(ev) {
        if (ev.matches) {
            autoplayActive = false;
            clearTimeout(resumeTimer);
        } else {
            autoplayActive = true;
        }
    }
    if (typeof motionMq.addEventListener === 'function') {
        motionMq.addEventListener('change', onReducedMotionChange);
    } else if (typeof motionMq.addListener === 'function') {
        motionMq.addListener(onReducedMotionChange);
    }
}

// Reviews toggle + submission form
function initializeReviewSection() {
    const reviewToggleBtn = document.getElementById('reviewToggleBtn');
    const reviewFormPanel = document.getElementById('reviewFormPanel');
    const reviewForm = document.getElementById('review-form');
    const reviewRatingInput = document.getElementById('review_rating');
    const ratingButtons = document.querySelectorAll('.rating-star-btn');
    const ratingHelperText = document.getElementById('ratingHelperText');

    if (!reviewToggleBtn || !reviewFormPanel || !reviewForm) return;

    function setStarRating(ratingValue) {
        const numericRating = Number(ratingValue);
        if (!reviewRatingInput || Number.isNaN(numericRating)) return;

        reviewRatingInput.value = String(numericRating);
        ratingButtons.forEach(button => {
            const buttonRating = Number(button.getAttribute('data-rating'));
            button.classList.toggle('active', buttonRating <= numericRating);
        });
        if (ratingHelperText) {
            ratingHelperText.textContent = `${numericRating} star${numericRating > 1 ? 's' : ''} selected`;
        }
    }

    ratingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const ratingValue = button.getAttribute('data-rating');
            setStarRating(ratingValue);
        });
    });

    reviewToggleBtn.addEventListener('click', () => {
        const isOpen = reviewToggleBtn.getAttribute('aria-expanded') === 'true';
        reviewToggleBtn.setAttribute('aria-expanded', String(!isOpen));
        reviewFormPanel.hidden = isOpen;
    });

    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const reviewName = document.getElementById('review_name')?.value.trim();
        const reviewOccupation = document.getElementById('review_occupation')?.value.trim() || 'Not provided';
        const reviewRating = document.getElementById('review_rating')?.value.trim();
        const reviewMessage = document.getElementById('review_message')?.value.trim();

        if (!reviewName || !reviewRating || !reviewMessage) {
            alert('Please fill out your name, star rating, and main review.');
            return;
        }

        const submitButton = reviewForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton?.textContent || 'Submit Review';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
        }

        if (!ensureEmailJsReady()) {
            alert('Email service is not available right now. Please try again later.');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
            return;
        }

        const ratingAsStars = '★'.repeat(Number(reviewRating));
        const templateParams = {
            review_name: reviewName,
            review_occupation: reviewOccupation,
            review_rating: reviewRating,
            review_rating_stars: ratingAsStars,
            review_message: reviewMessage,
            submitted_at: new Date().toLocaleString()
        };

        emailjs.send(REVIEW_EMAILJS_SERVICE_ID, REVIEW_EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                alert('Thank you! Your review has been submitted successfully.');
                reviewForm.reset();
                reviewFormPanel.hidden = true;
                reviewToggleBtn.setAttribute('aria-expanded', 'false');
                ratingButtons.forEach(button => button.classList.remove('active'));
                if (ratingHelperText) {
                    ratingHelperText.textContent = 'Click a star to set rating';
                }
            })
            .catch(error => {
                console.error('Review EmailJS Error:', error);
                const errorStatus = error?.status ? `Status: ${error.status}. ` : '';
                const errorReason = error?.text || error?.message || JSON.stringify(error) || 'Unknown EmailJS error';
                alert(`Failed to submit review. ${errorStatus}${errorReason}`);
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            });
    });
}

// Initialize contact form when DOM is ready and EmailJS is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit for EmailJS to load if it's loaded asynchronously
        setTimeout(() => {
            initializeContactForm();
            initializeReviewsMarquee();
            initializeReviewSection();
        }, 100);
    });
} else {
    // DOM is already ready, but wait for EmailJS
    setTimeout(() => {
        initializeContactForm();
        initializeReviewsMarquee();
        initializeReviewSection();
    }, 100);
}

