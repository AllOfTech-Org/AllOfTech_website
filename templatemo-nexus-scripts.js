/*

TemplateMo 594 nexus flow

https://templatemo.com/tm-594-nexus-flow

*/

// JavaScript Document
(function () {
    'use strict';

    // ---------------------------------------------------------------------
    // Shared environment helpers (motion, viewport, body-scroll lock)
    // ---------------------------------------------------------------------
    const reducedMotionMq =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerMq =
        window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)');
    const mobileMq = window.matchMedia && window.matchMedia('(max-width: 768px)');
    const desktopMq = window.matchMedia && window.matchMedia('(min-width: 1025px)');

    let prefersReducedMotion = reducedMotionMq ? reducedMotionMq.matches : false;
    let isCoarsePointer = coarsePointerMq ? coarsePointerMq.matches : false;
    let isMobile = mobileMq ? mobileMq.matches : false;
    let isDesktop = desktopMq ? desktopMq.matches : true;

    function bindMediaListener(mq, handler) {
        if (!mq) return;
        if (typeof mq.addEventListener === 'function') {
            mq.addEventListener('change', handler);
        } else if (typeof mq.addListener === 'function') {
            mq.addListener(handler);
        }
    }

    // Coordinated body-scroll lock — prevents the mobile menu, service modals
    // and lightboxes from clobbering each other's body.style.overflow value.
    let bodyLockCount = 0;
    function lockBodyScroll() {
        bodyLockCount += 1;
        if (bodyLockCount === 1) {
            document.body.style.overflow = 'hidden';
        }
    }
    function unlockBodyScroll() {
        if (bodyLockCount === 0) return;
        bodyLockCount -= 1;
        if (bodyLockCount === 0) {
            document.body.style.overflow = '';
        }
    }
    // Expose so other scripts (chatbot, lightbox) can reuse the same counter.
    window.AllOfTechScroll = {
        lock: lockBodyScroll,
        unlock: unlockBodyScroll,
    };

    function isMobilePerformanceMode() {
        return isMobile;
    }

    // ---------------------------------------------------------------------
    // Intro preloader
    // ---------------------------------------------------------------------
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
        let autoTimer = 0;
        let safetyTimer = 0;
        let skipTimer = 0;

        function cleanup() {
            if (finished) return;
            finished = true;
            preloader.removeEventListener('click', onSkip);
            document.removeEventListener('keydown', onEsc);
            clearTimeout(autoTimer);
            clearTimeout(safetyTimer);
            clearTimeout(skipTimer);
            if (preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }

        function exitSequence() {
            if (finished || exiting) return;
            exiting = true;
            document.body.classList.add('is-site-ready');
            preloader.classList.add('site-preloader--exiting');
            setTimeout(cleanup, 520);
        }

        let canSkip = false;
        function onSkip() {
            if (!canSkip) return;
            clearTimeout(autoTimer);
            exitSequence();
        }
        function onEsc(e) {
            if (e.key !== 'Escape') return;
            clearTimeout(autoTimer);
            exitSequence();
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                preloader.classList.add('site-preloader--run');
            });
        });

        autoTimer = setTimeout(exitSequence, 7000);
        skipTimer = setTimeout(() => {
            canSkip = true;
            preloader.classList.add('site-preloader--skip-ready');
        }, 1800);

        preloader.addEventListener('click', onSkip);
        document.addEventListener('keydown', onEsc);

        window.addEventListener('load', () => {
            if (!finished && !exiting) {
                setTimeout(exitSequence, 2600);
            }
        }, { once: true });

        safetyTimer = setTimeout(() => {
            if (!finished && !exiting) {
                exitSequence();
            }
        }, 11500);
    }

    onReady(initializeSitePreloader);

    // ---------------------------------------------------------------------
    // Mobile menu
    // ---------------------------------------------------------------------
    function initializeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay || !mobileMenuClose) {
            return;
        }

        const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu-nav a');
        const mobileMenuCta = mobileMenu.querySelector('.mobile-menu-cta');
        const mobileMenuCtaButton = mobileMenu.querySelector('.mobile-menu-cta a');
        const mobileMenuLogo = mobileMenu.querySelector('.mobile-menu-logo');
        let isOpen = false;

        function openMobileMenu() {
            if (isOpen) return;
            isOpen = true;
            mobileMenuBtn.classList.add('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            lockBodyScroll();

            mobileMenuLinks.forEach((link, index) => {
                if (!link) return;
                link.style.animation = 'none';
                link.style.opacity = '0';
                link.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    link.style.animation = 'slideInLeft 0.4s ease forwards';
                }, 250 + index * 100);
            });

            if (mobileMenuCta) {
                mobileMenuCta.style.animation = 'none';
                mobileMenuCta.style.opacity = '0';
                mobileMenuCta.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    mobileMenuCta.style.animation = 'slideInUp 0.4s ease forwards';
                }, 100);
            }
        }

        function closeMobileMenu() {
            if (!isOpen) return;
            isOpen = false;
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            unlockBodyScroll();
        }

        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isOpen) closeMobileMenu();
            else openMobileMenu();
        });

        mobileMenuClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });

        mobileMenuOverlay.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMobileMenu();
        });

        mobileMenuLinks.forEach((link) => {
            if (!link) return;
            link.addEventListener('click', closeMobileMenu);
        });

        if (mobileMenuCtaButton) {
            mobileMenuCtaButton.addEventListener('click', (e) => {
                if (mobileMenuCtaButton.getAttribute('href') === '#') {
                    e.preventDefault();
                }
                closeMobileMenu();
            });
        }

        if (mobileMenuLogo) {
            mobileMenuLogo.addEventListener('click', closeMobileMenu);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) closeMobileMenu();
        });

        // Auto-close when switching from mobile to desktop layout
        bindMediaListener(mobileMq, (ev) => {
            isMobile = ev.matches;
            if (!ev.matches && isOpen) closeMobileMenu();
        });

        // Don't bubble scroll-stealing touchmove events from the menu to the body.
        mobileMenu.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
    }

    onReady(initializeMobileMenu);

    // ---------------------------------------------------------------------
    // Background effects (matrix rain / particles / data streams)
    // ---------------------------------------------------------------------
    const MATRIX_CHARS = 'A L L O F T E C H AI ML WEB DEV UX UI N8N DATA CLOUD CODE 0 1 {} <> [] () # @';

    function generateMatrixRain() {
        const matrixRain = document.getElementById('matrixRain');
        if (!matrixRain) return;
        const maxColumns = 40;
        const columns = Math.min(Math.floor(window.innerWidth / 24), maxColumns);
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = `${i * 20}px`;
            column.style.animationDuration = `${Math.random() * 5 + 10}s`;
            column.style.animationDelay = `${Math.random() * 5}s`;
            let text = '';
            const charCount = Math.floor(Math.random() * 20 + 10);
            for (let j = 0; j < charCount; j++) {
                text += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] + ' ';
            }
            column.textContent = text;
            fragment.appendChild(column);
        }
        matrixRain.appendChild(fragment);
    }

    function generateParticles() {
        const particlesContainer = document.getElementById('particlesContainer');
        if (!particlesContainer) return;
        const particleCount = window.innerWidth < 1200 ? 30 : 40;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 20}s`;
            fragment.appendChild(particle);
        }
        particlesContainer.appendChild(fragment);
    }

    function generateDataStreams() {
        const dataStreams = document.getElementById('dataStreams');
        if (!dataStreams) return;
        const streamCount = 6;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < streamCount; i++) {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            stream.style.top = `${Math.random() * 100}%`;
            stream.style.left = '-300px';
            stream.style.animationDelay = `${Math.random() * 5}s`;
            stream.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
            fragment.appendChild(stream);
        }
        dataStreams.appendChild(fragment);
    }

    function setupBackgroundEffects() {
        if (prefersReducedMotion || isMobilePerformanceMode()) return;
        generateMatrixRain();
        generateParticles();
        generateDataStreams();
    }

    onReady(setupBackgroundEffects);

    // Regenerate background pieces when the viewport changes, but throttle and
    // skip on phones (CSS already hides them there).
    let resizeRafId = 0;
    let resizeTimer = 0;
    window.addEventListener(
        'resize',
        () => {
            if (prefersReducedMotion) return;
            if (resizeRafId) cancelAnimationFrame(resizeRafId);
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeRafId = requestAnimationFrame(() => {
                    resizeRafId = 0;
                    const matrixRain = document.getElementById('matrixRain');
                    if (!matrixRain) return;
                    matrixRain.textContent = '';
                    if (!isMobilePerformanceMode()) generateMatrixRain();
                });
            }, 250);
        },
        { passive: true }
    );

    // ---------------------------------------------------------------------
    // Unified pointer effects: orb parallax + cursor glow
    // (single mousemove listener, throttled with rAF, off on touch/reduced motion)
    // ---------------------------------------------------------------------
    let cursorGlow = null;
    let orbs = null;
    let pointerX = 0;
    let pointerY = 0;
    let pointerHasMoved = false;
    let pointerFrame = 0;

    function pointerEffectsEnabled() {
        return !prefersReducedMotion && !isCoarsePointer && isDesktop;
    }

    function ensureCursorGlow() {
        if (cursorGlow || !pointerEffectsEnabled()) return;
        cursorGlow = document.createElement('div');
        cursorGlow.className = 'aot-cursor-glow';
        cursorGlow.style.cssText = [
            'position:fixed',
            'width:400px',
            'height:400px',
            'border-radius:50%',
            'background:radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
            'pointer-events:none',
            'z-index:9999',
            'transform:translate3d(-50%, -50%, 0)',
            'transition:opacity 0.3s ease',
            'opacity:0',
            'left:0',
            'top:0',
            'will-change:transform, opacity',
        ].join(';');
        document.body.appendChild(cursorGlow);
    }

    function destroyCursorGlow() {
        if (!cursorGlow) return;
        cursorGlow.remove();
        cursorGlow = null;
    }

    function applyPointerEffects() {
        pointerFrame = 0;
        if (!pointerHasMoved) return;
        if (!pointerEffectsEnabled()) return;

        if (!orbs) orbs = document.querySelectorAll('.orb');
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.02;
            const x = (pointerX - halfW) * speed;
            const y = (pointerY - halfH) * speed;
            orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });

        if (cursorGlow) {
            cursorGlow.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
            cursorGlow.style.opacity = '1';
        }
    }

    function onPointerMove(e) {
        pointerX = e.clientX;
        pointerY = e.clientY;
        pointerHasMoved = true;
        if (pointerFrame) return;
        pointerFrame = requestAnimationFrame(applyPointerEffects);
    }

    function onPointerLeave() {
        if (cursorGlow) cursorGlow.style.opacity = '0';
    }

    function attachPointerEffects() {
        if (!pointerEffectsEnabled()) return;
        ensureCursorGlow();
        document.addEventListener('mousemove', onPointerMove, { passive: true });
        document.addEventListener('mouseleave', onPointerLeave, { passive: true });
    }

    function detachPointerEffects() {
        document.removeEventListener('mousemove', onPointerMove);
        document.removeEventListener('mouseleave', onPointerLeave);
        if (pointerFrame) {
            cancelAnimationFrame(pointerFrame);
            pointerFrame = 0;
        }
        destroyCursorGlow();
    }

    onReady(attachPointerEffects);

    bindMediaListener(reducedMotionMq, (ev) => {
        prefersReducedMotion = ev.matches;
        if (prefersReducedMotion) detachPointerEffects();
        else attachPointerEffects();
    });
    bindMediaListener(coarsePointerMq, (ev) => {
        isCoarsePointer = ev.matches;
        if (isCoarsePointer) detachPointerEffects();
        else attachPointerEffects();
    });
    bindMediaListener(desktopMq, (ev) => {
        isDesktop = ev.matches;
        if (!isDesktop) detachPointerEffects();
        else attachPointerEffects();
    });

    // ---------------------------------------------------------------------
    // Smooth scrolling for in-page anchors
    // ---------------------------------------------------------------------
    onReady(() => {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href.length <= 1) return;
                if (href === '#top') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                    return;
                }
                let target = null;
                try {
                    target = document.querySelector(href);
                } catch (_) {
                    // Invalid selector — bail and let the browser handle it.
                    return;
                }
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: prefersReducedMotion ? 'auto' : 'smooth',
                        block: 'start',
                    });
                }
            });
        });
    });

    // ---------------------------------------------------------------------
    // Navbar scroll state (rAF throttled, passive)
    // ---------------------------------------------------------------------
    onReady(() => {
        const nav = document.querySelector('nav');
        if (!nav) return;
        let scrollScheduled = false;
        let lastY = window.scrollY;

        function update() {
            scrollScheduled = false;
            nav.classList.toggle('nav-scrolled', lastY > 100);
        }

        window.addEventListener(
            'scroll',
            () => {
                lastY = window.scrollY;
                if (scrollScheduled) return;
                scrollScheduled = true;
                requestAnimationFrame(update);
            },
            { passive: true }
        );
        nav.classList.toggle('nav-scrolled', window.scrollY > 100);
    });

    // ---------------------------------------------------------------------
    // Fade-up reveal observer
    // ---------------------------------------------------------------------
    onReady(() => {
        const fadeEls = document.querySelectorAll('.fade-up');
        if (!fadeEls.length || !('IntersectionObserver' in window)) {
            fadeEls.forEach((el) => el.classList.add('visible'));
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );
        fadeEls.forEach((el) => observer.observe(el));
    });

    // ---------------------------------------------------------------------
    // Stats counter (rAF-driven, ~1s smooth animation, run-once per section)
    // ---------------------------------------------------------------------
    function animateStats(section) {
        const stats = section.querySelectorAll('.stat-number, .about-future-stat-number');
        stats.forEach((stat) => {
            if (stat.dataset.animated === '1') return;
            const original = stat.textContent.trim();
            const target = parseInt(original.replace(/[^\d]/g, ''), 10);
            if (!Number.isFinite(target) || target <= 0) {
                stat.dataset.animated = '1';
                return;
            }
            stat.dataset.animated = '1';
            const suffix = original.replace(/[\d]/g, '');
            const duration = prefersReducedMotion ? 0 : Math.min(1400, 600 + target * 6);
            const start = performance.now();

            function step(now) {
                const elapsed = now - start;
                const progress = duration === 0 ? 1 : Math.min(1, elapsed / duration);
                const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                const value = Math.floor(target * eased);
                stat.textContent = value + suffix;
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    stat.textContent = target + suffix;
                }
            }
            requestAnimationFrame(step);
        });
    }

    onReady(() => {
        const statsSections = document.querySelectorAll('.stats');
        if (!statsSections.length) return;
        if (!('IntersectionObserver' in window)) {
            statsSections.forEach(animateStats);
            return;
        }
        const statsObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateStats(entry.target);
                        statsObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
        );
        statsSections.forEach((section) => {
            if (!section) return;
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
                animateStats(section);
            } else {
                statsObserver.observe(section);
            }
        });
    });

    // ---------------------------------------------------------------------
    // FAQ accordion
    // ---------------------------------------------------------------------
    function initializeFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;
        faqItems.forEach((item) => {
            const trigger = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!trigger || !answer) return;
            trigger.addEventListener('click', () => {
                const wasOpen = item.classList.contains('is-open');
                faqItems.forEach((other) => {
                    other.classList.remove('is-open');
                    const otherBtn = other.querySelector('.faq-question');
                    const otherAnswer = other.querySelector('.faq-answer');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    if (otherAnswer) otherAnswer.hidden = true;
                });
                if (!wasOpen) {
                    item.classList.add('is-open');
                    trigger.setAttribute('aria-expanded', 'true');
                    answer.hidden = false;
                }
            });
        });
    }

    onReady(initializeFaqAccordion);

    // ---------------------------------------------------------------------
    // Decorative "cyber text" overlay — desktop only, pauses when hidden
    // ---------------------------------------------------------------------
    const CYBER_TEXTS = [
        'STARTING UP...',
        'TURNING TECHNOLOGY INTO GROWTH',
        'BUILD SMART. GROW FAST',
        'Application Live',
    ];

    let cyberTextInterval = 0;

    function ensureFadeOutKeyframes() {
        if (document.getElementById('aot-cyber-fade-style')) return;
        const style = document.createElement('style');
        style.id = 'aot-cyber-fade-style';
        style.textContent = `
@keyframes fadeOut {
    0% { opacity: 0.7; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-50px); }
}`;
        document.head.appendChild(style);
    }

    function spawnCyberText() {
        if (document.hidden) return;
        const text = CYBER_TEXTS[Math.floor(Math.random() * CYBER_TEXTS.length)];
        const node = document.createElement('div');
        node.textContent = text;
        node.style.cssText = `
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
        document.body.appendChild(node);
        const cleanupHandler = () => {
            if (node.parentNode) node.parentNode.removeChild(node);
        };
        node.addEventListener('animationend', cleanupHandler, { once: true });
        // Fallback in case the animationend event is missed (tab switch etc.)
        setTimeout(cleanupHandler, 3500);
    }

    function startCyberTextLoop() {
        if (cyberTextInterval) return;
        if (prefersReducedMotion || !isDesktop) return;
        ensureFadeOutKeyframes();
        cyberTextInterval = setInterval(spawnCyberText, 5000);
    }

    function stopCyberTextLoop() {
        if (!cyberTextInterval) return;
        clearInterval(cyberTextInterval);
        cyberTextInterval = 0;
    }

    onReady(startCyberTextLoop);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopCyberTextLoop();
        else startCyberTextLoop();
    });
    bindMediaListener(reducedMotionMq, () => {
        if (prefersReducedMotion) stopCyberTextLoop();
        else startCyberTextLoop();
    });
    bindMediaListener(desktopMq, () => {
        if (!isDesktop) stopCyberTextLoop();
        else startCyberTextLoop();
    });

    // ---------------------------------------------------------------------
    // Service modals
    // ---------------------------------------------------------------------
    function initializeServiceModals() {
        const modalOverlay = document.getElementById('serviceModalOverlay');
        if (!modalOverlay) return;
        const serviceCards = document.querySelectorAll('.clickable-service');
        const modals = modalOverlay.querySelectorAll('.service-modal');
        const closeButtons = modalOverlay.querySelectorAll('.modal-close');
        const relatedServiceCards = modalOverlay.querySelectorAll('.related-service-card');
        let openModalEl = null;

        function openModal(serviceType) {
            const target = document.getElementById(`modal-${serviceType}`);
            if (!target) return;
            modals.forEach((modal) => modal.classList.remove('active'));
            target.classList.add('active');
            if (!modalOverlay.classList.contains('active')) {
                modalOverlay.classList.add('active');
                lockBodyScroll();
            }
            openModalEl = target;
            generateModalBackground(serviceType);
        }

        function closeModal() {
            if (!modalOverlay.classList.contains('active')) return;
            modalOverlay.classList.remove('active');
            modals.forEach((modal) => modal.classList.remove('active'));
            openModalEl = null;
            unlockBodyScroll();
        }

        serviceCards.forEach((card) => {
            card.addEventListener('click', function () {
                const serviceType = this.getAttribute('data-service');
                if (serviceType) openModal(serviceType);
            });
        });

        relatedServiceCards.forEach((card) => {
            card.addEventListener('click', function (e) {
                e.stopPropagation();
                const serviceType = this.getAttribute('data-service');
                if (serviceType) openModal(serviceType);
            });
        });

        closeButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                closeModal();
            });
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && openModalEl) closeModal();
        });
    }

    function generateModalBackground(serviceType) {
        // Skip the heavy in-modal effects on phone-class hardware.
        if (isMobilePerformanceMode()) return;
        const modal = document.getElementById(`modal-${serviceType}`);
        if (!modal || modal.dataset.bgReady === '1') return;
        modal.dataset.bgReady = '1';

        const matrixRain = modal.querySelector('.modal-matrix-rain');
        const particles = modal.querySelector('.modal-particles');

        if (matrixRain && matrixRain.children.length === 0) {
            const columns = Math.max(0, Math.floor(modal.offsetWidth / 20));
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < columns; i++) {
                const column = document.createElement('div');
                column.className = 'matrix-column';
                column.style.left = `${i * 20}px`;
                column.style.animationDuration = `${Math.random() * 5 + 10}s`;
                column.style.animationDelay = `${Math.random() * 5}s`;
                let text = '';
                const charCount = Math.floor(Math.random() * 15 + 8);
                for (let j = 0; j < charCount; j++) {
                    text += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] + ' ';
                }
                column.textContent = text;
                fragment.appendChild(column);
            }
            matrixRain.appendChild(fragment);
        }

        if (particles && particles.children.length === 0) {
            const particleCount = 20;
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 20}s`;
                particle.style.animationDuration = `${Math.random() * 10 + 20}s`;
                fragment.appendChild(particle);
            }
            particles.appendChild(fragment);
        }
    }

    onReady(initializeServiceModals);

    // ---------------------------------------------------------------------
    // EmailJS (contact + review forms)
    // ---------------------------------------------------------------------
    const EMAILJS_PUBLIC_KEY = 'kgXIjzhce1SbUpve9';
    const CONTACT_EMAILJS_SERVICE_ID = 'service_lkha1el';
    const CONTACT_EMAILJS_TEMPLATE_ID = 'template_hat5kie';
    const REVIEW_EMAILJS_SERVICE_ID = 'service_17hkvzg';
    const REVIEW_EMAILJS_TEMPLATE_ID = 'template_1wgepzk';

    function ensureEmailJsReady() {
        if (typeof emailjs === 'undefined') return false;
        if (!window.__emailJsInitialized) {
            try {
                emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
                window.__emailJsInitialized = true;
            } catch (err) {
                console.error('EmailJS init failed:', err);
                return false;
            }
        }
        return true;
    }

    function initializeContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const message = document.getElementById('message')?.value.trim();

            if (!name || !email || !message) {
                alert('Please fill out all required fields.');
                return;
            }

            if (!ensureEmailJsReady()) {
                alert('Email service is not available right now. Please try again later or contact us directly at contact.alloftech@gmail.com.');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton?.textContent || 'Send Message';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            emailjs
                .sendForm(CONTACT_EMAILJS_SERVICE_ID, CONTACT_EMAILJS_TEMPLATE_ID, this)
                .then(() => {
                    alert('Message sent successfully!');
                    this.reset();
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);
                    alert('Failed to send message. Please try again later or contact us directly at contact.alloftech@gmail.com');
                })
                .finally(() => {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                    }
                });
        });
    }

    // ---------------------------------------------------------------------
    // Reviews marquee: rAF auto-scroll, pauses when off-screen or hidden
    // ---------------------------------------------------------------------
    function initializeReviewsMarquee() {
        const root = document.querySelector('[data-reviews-marquee]');
        const viewport = document.getElementById('reviews-marquee-viewport');
        const track = root && root.querySelector('.reviews-marquee-track');
        if (!root || !viewport || !track) return;
        if (viewport.dataset.marqueeReady === '1') return;
        viewport.dataset.marqueeReady = '1';

        const originals = Array.from(track.querySelectorAll('.review-card'));
        if (!originals.length) return;

        const cloneFragment = document.createDocumentFragment();
        originals.forEach((card) => cloneFragment.appendChild(card.cloneNode(true)));
        track.appendChild(cloneFragment);

        const AUTO_PX_PER_SEC = 100;
        const RESUME_MS = 2200;

        let position = 0;
        let loopWidth = 0;
        let cardStep = 0;
        let autoplayActive = !prefersReducedMotion;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartPos = 0;
        let resumeTimer = 0;
        let lastTs = 0;
        let visible = true;
        let pageVisible = !document.hidden;
        let rafId = 0;

        function visibleCountForWidth(width) {
            if (width < 640) return 1;
            if (width < 1024) return 2;
            return 4;
        }

        function readGapPx() {
            const gapCss = getComputedStyle(track).gap;
            const parsed = parseFloat(gapCss);
            return Number.isFinite(parsed) ? parsed : 20;
        }

        function applyTransform() {
            track.style.transform = `translate3d(${position}px, 0, 0)`;
        }

        function wrapPosition() {
            if (!loopWidth) return;
            while (position <= -loopWidth) position += loopWidth;
            while (position > 0) position -= loopWidth;
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

        function scheduleResumeAutoplay() {
            if (prefersReducedMotion) {
                autoplayActive = false;
                return;
            }
            clearTimeout(resumeTimer);
            autoplayActive = false;
            resumeTimer = setTimeout(() => {
                autoplayActive = true;
                resumeTimer = 0;
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
            resumeTimer = 0;
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
            resumeTimer = 0;
            autoplayActive = false;
            const dir = e.key === 'ArrowLeft' ? -1 : 1;
            position += dir * cardStep;
            wrapPosition();
            applyTransform();
            scheduleResumeAutoplay();
        });

        function tick(ts) {
            rafId = requestAnimationFrame(tick);
            if (!loopWidth || !visible || !pageVisible) {
                lastTs = 0;
                return;
            }
            if (!lastTs) lastTs = ts;
            const dt = Math.min(64, ts - lastTs) / 1000;
            lastTs = ts;

            if (autoplayActive && !isDragging && !prefersReducedMotion) {
                position -= AUTO_PX_PER_SEC * dt;
                wrapPosition();
                applyTransform();
            }
        }

        const ro = ('ResizeObserver' in window)
            ? new ResizeObserver(() => updateMetrics())
            : null;
        if (ro) ro.observe(viewport);
        else window.addEventListener('resize', updateMetrics, { passive: true });
        updateMetrics();
        rafId = requestAnimationFrame(tick);

        if (document.readyState !== 'complete') {
            window.addEventListener('load', updateMetrics, { once: true });
        }
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(updateMetrics).catch(() => {});
        }

        // Pause when off-screen
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        visible = entry.isIntersecting;
                        if (!visible) lastTs = 0;
                    });
                },
                { threshold: 0 }
            );
            io.observe(viewport);
        }

        // Pause when tab hidden
        document.addEventListener('visibilitychange', () => {
            pageVisible = !document.hidden;
            if (!pageVisible) lastTs = 0;
        });

        bindMediaListener(reducedMotionMq, (ev) => {
            if (ev.matches) {
                autoplayActive = false;
                clearTimeout(resumeTimer);
                resumeTimer = 0;
            } else {
                autoplayActive = true;
            }
        });
    }

    // ---------------------------------------------------------------------
    // Reviews submission form
    // ---------------------------------------------------------------------
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
            if (!reviewRatingInput || !Number.isFinite(numericRating)) return;
            reviewRatingInput.value = String(numericRating);
            ratingButtons.forEach((button) => {
                const buttonRating = Number(button.getAttribute('data-rating'));
                button.classList.toggle('active', buttonRating <= numericRating);
            });
            if (ratingHelperText) {
                ratingHelperText.textContent = `${numericRating} star${numericRating > 1 ? 's' : ''} selected`;
            }
        }

        ratingButtons.forEach((button) => {
            button.addEventListener('click', () => {
                setStarRating(button.getAttribute('data-rating'));
            });
        });

        reviewToggleBtn.addEventListener('click', () => {
            const wasOpen = reviewToggleBtn.getAttribute('aria-expanded') === 'true';
            reviewToggleBtn.setAttribute('aria-expanded', String(!wasOpen));
            reviewFormPanel.hidden = wasOpen;
        });

        reviewForm.addEventListener('submit', function (event) {
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
                submitted_at: new Date().toLocaleString(),
            };

            emailjs
                .send(REVIEW_EMAILJS_SERVICE_ID, REVIEW_EMAILJS_TEMPLATE_ID, templateParams)
                .then(() => {
                    alert('Thank you! Your review has been submitted successfully.');
                    reviewForm.reset();
                    reviewFormPanel.hidden = true;
                    reviewToggleBtn.setAttribute('aria-expanded', 'false');
                    ratingButtons.forEach((button) => button.classList.remove('active'));
                    if (ratingHelperText) {
                        ratingHelperText.textContent = 'Click a star to set rating';
                    }
                })
                .catch((error) => {
                    console.error('Review EmailJS Error:', error);
                    const errorStatus = error?.status ? `Status: ${error.status}. ` : '';
                    const errorReason =
                        error?.text || error?.message || JSON.stringify(error) || 'Unknown EmailJS error';
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

    // EmailJS is loaded async — initialize forms after DOM is ready,
    // but only invoke the EmailJS-dependent bits when emailjs is present.
    onReady(() => {
        // Defer until after first paint so we don't fight the preloader for the
        // main thread.
        requestAnimationFrame(() => {
            initializeContactForm();
            initializeReviewsMarquee();
            initializeReviewSection();
        });
    });

    // ---------------------------------------------------------------------
    // Utility: run on DOM ready (handles late-loaded scripts as well)
    // ---------------------------------------------------------------------
    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
            fn();
        }
    }
})();
