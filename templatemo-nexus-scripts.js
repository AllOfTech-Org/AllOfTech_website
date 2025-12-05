/*

TemplateMo 594 nexus flow

https://templatemo.com/tm-594-nexus-flow

*/

// JavaScript Document

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
    const columns = Math.floor(window.innerWidth / 20);
    
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
    const particleCount = 50;
    
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
    const streamCount = 10;
    
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

// Initialize background effects
generateMatrixRain();
generateParticles();
generateDataStreams();

// Regenerate matrix rain on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const matrixRain = document.getElementById('matrixRain');
        matrixRain.innerHTML = '';
        generateMatrixRain();
    }, 250);
});

// Interactive mouse glow effect (throttled for performance)
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
            
            // Make nearby particles glow brighter (desktop only)
            if (window.innerWidth > 768) {
                const particles = document.querySelectorAll('.particle');
                particles.forEach(particle => {
                    const rect = particle.getBoundingClientRect();
                    const particleX = rect.left + rect.width / 2;
                    const particleY = rect.top + rect.height / 2;
                    const distance = Math.sqrt(Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2));
                    
                    if (distance < 150) {
                        const brightness = 1 - (distance / 150);
                        particle.style.boxShadow = `0 0 ${20 + brightness * 30}px rgba(0, 255, 255, ${0.5 + brightness * 0.5})`;
                        particle.style.transform = `scale(${1 + brightness * 0.5})`;
                    } else {
                        particle.style.boxShadow = '';
                        particle.style.transform = '';
                    }
                });
            }
            
            mouseTimer = null;
        }, 16); // ~60fps
    }
});

// Add a glow that follows the cursor (desktop only)
if (window.innerWidth > 768) {
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(15, 15, 35, 0.95)';
        nav.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.2)';
    } else {
        nav.style.background = 'rgba(15, 15, 35, 0.9)';
        nav.style.boxShadow = 'none';
    }
});

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
    const stats = section.querySelectorAll('.stat-number');
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
}, { threshold: 0.5 });

const statsSections = document.querySelectorAll('.stats');
statsSections.forEach(section => {
    if (section) {
        statsObserver.observe(section);
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

// Random cyber text effects
const cyberTexts = ['STARTING UP...', 'TURNING TECHNOLOGY INTO GROWTH', 'BUILD SMART. GROW FAST', 'Application Live'];

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
function initializeContactForm() {
    // Wait for EmailJS to be loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded. Make sure the EmailJS script is included before this script.');
        return;
    }

    // Initialize EmailJS with your User ID
    emailjs.init('kgXIjzhce1SbUpve9');

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
        emailjs.sendForm('service_lkha1el', 'template_hat5kie', this)
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

// Initialize contact form when DOM is ready and EmailJS is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit for EmailJS to load if it's loaded asynchronously
        setTimeout(initializeContactForm, 100);
    });
} else {
    // DOM is already ready, but wait for EmailJS
    setTimeout(initializeContactForm, 100);
}

