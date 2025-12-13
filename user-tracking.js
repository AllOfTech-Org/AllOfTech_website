// user-tracking.js - Free Google Sheets Tracking System
// This script tracks visitors and sends data to Google Sheets

(function() {
    'use strict';

    // ⚠️ YOUR GOOGLE APPS SCRIPT WEB APP URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_7iVFOZh41iT2ycjp_wiDphTwnt39NpcB2mEocvSd80VGJAhX1HweKG_gXaU6TLo8/exec';
    
    // Configuration
    const TRACKING_CONFIG = {
        USER_ID_KEY: 'alloftech_user_id',
        USER_DATA_KEY: 'alloftech_user_data',
        SESSION_ID_KEY: 'alloftech_session_id',
        COOKIE_EXPIRY_DAYS: 365,
        TRACKING_ENABLED: true,
        SEND_TO_GOOGLE_SHEETS: true
    };

    // Generate unique user ID
    function generateUserId() {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const randomStr2 = Math.random().toString(36).substring(2, 15);
        return `user_${timestamp}_${randomStr}${randomStr2}`;
    }

    // Generate session ID
    function generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }

    // Set cookie
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    // Get cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Get or create user ID
    function getUserId() {
        let userId = localStorage.getItem(TRACKING_CONFIG.USER_ID_KEY);
        
        if (!userId) {
            userId = getCookie(TRACKING_CONFIG.USER_ID_KEY);
        }
        
        if (!userId) {
            userId = generateUserId();
            localStorage.setItem(TRACKING_CONFIG.USER_ID_KEY, userId);
            setCookie(TRACKING_CONFIG.USER_ID_KEY, userId, TRACKING_CONFIG.COOKIE_EXPIRY_DAYS);
        }
        
        return userId;
    }

    // Get or create session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem(TRACKING_CONFIG.SESSION_ID_KEY);
        
        if (!sessionId) {
            sessionId = generateSessionId();
            sessionStorage.setItem(TRACKING_CONFIG.SESSION_ID_KEY, sessionId);
        }
        
        return sessionId;
    }

    // Get user data from localStorage
    function getUserData() {
        const dataStr = localStorage.getItem(TRACKING_CONFIG.USER_DATA_KEY);
        if (dataStr) {
            try {
                return JSON.parse(dataStr);
            } catch (e) {
                console.error('Error parsing user data:', e);
                return null;
            }
        }
        return null;
    }

    // Save user data to localStorage
    function saveUserData(userData) {
        try {
            localStorage.setItem(TRACKING_CONFIG.USER_DATA_KEY, JSON.stringify(userData));
        } catch (e) {
            console.error('Error saving user data:', e);
        }
    }

    // Get browser information
    function getBrowserInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookieEnabled: navigator.cookieEnabled,
            online: navigator.onLine
        };
    }

    // Send data to Google Sheets
    async function sendToGoogleSheets(action, data) {
        if (!TRACKING_CONFIG.SEND_TO_GOOGLE_SHEETS || !GOOGLE_SCRIPT_URL) {
            console.warn('Google Sheets tracking is disabled');
            return { success: false, error: 'Not configured' };
        }

        try {
            const payload = {
                action: action,
                ...data
            };

            // Use fetch with no-cors mode for Google Apps Script
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important: Google Apps Script requires this
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            // Note: With no-cors mode, we can't read the response
            // But the data is still sent to Google Sheets successfully
            return { success: true };
        } catch (error) {
            console.error('Error sending to Google Sheets:', error);
            return { success: false, error: error.message };
        }
    }

    // Track page view
    function trackPageView() {
        if (!TRACKING_CONFIG.TRACKING_ENABLED) return;

        const userId = getUserId();
        const sessionId = getSessionId();
        const userData = getUserData() || {
            userId: userId,
            firstVisit: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            visitCount: 0,
            pageViews: [],
            browserInfo: getBrowserInfo()
        };

        // Check if returning user
        const isReturningUser = userData.visitCount > 0;
        
        // Update visit information
        userData.lastVisit = new Date().toISOString();
        userData.visitCount = (userData.visitCount || 0) + 1;
        userData.isReturningUser = isReturningUser;
        userData.browserInfo = getBrowserInfo();

        // Track current page view
        const pageView = {
            url: window.location.href,
            path: window.location.pathname,
            title: document.title,
            timestamp: new Date().toISOString(),
            sessionId: sessionId,
            referrer: document.referrer || 'direct'
        };

        userData.pageViews = userData.pageViews || [];
        userData.pageViews.push(pageView);

        // Keep only last 50 page views in localStorage
        if (userData.pageViews.length > 50) {
            userData.pageViews = userData.pageViews.slice(-50);
        }

        // Save to localStorage
        saveUserData(userData);

        // Send to Google Sheets (async, don't wait for response)
        if (TRACKING_CONFIG.SEND_TO_GOOGLE_SHEETS) {
            // Send visitor data
            sendToGoogleSheets('track_visitor', {
                userId: userId,
                firstVisit: userData.firstVisit,
                lastVisit: userData.lastVisit,
                browserInfo: userData.browserInfo
            }).catch(err => console.error('Error tracking visitor:', err));

            // Send page view data
            sendToGoogleSheets('track_pageview', {
                userId: userId,
                sessionId: sessionId,
                pageURL: pageView.url,
                pageTitle: pageView.title,
                referrer: pageView.referrer,
                isReturning: isReturningUser
            }).catch(err => console.error('Error tracking page view:', err));
        }

        // Log tracking info (for debugging - remove in production if desired)
        console.log('User Tracking:', {
            userId: userId,
            isReturningUser: isReturningUser,
            visitCount: userData.visitCount,
            sessionId: sessionId
        });

        return userData;
    }

    // Track interactions
    function trackInteraction(type, element, data = {}) {
        if (!TRACKING_CONFIG.TRACKING_ENABLED) return;

        const userData = getUserData();
        if (!userData) return;

        const interaction = {
            type: type,
            element: element,
            timestamp: new Date().toISOString(),
            sessionId: getSessionId(),
            ...data
        };

        userData.interactions = userData.interactions || [];
        userData.interactions.push(interaction);

        if (userData.interactions.length > 100) {
            userData.interactions = userData.interactions.slice(-100);
        }

        saveUserData(userData);
    }

    // Track form submissions
    function trackFormSubmission(formId, formData) {
        trackInteraction('form_submit', formId, { formData: formData });
        
        // Store email in user data if provided (for chatbot access)
        if (formData.email) {
            const userData = getUserData();
            if (userData) {
                userData.email = formData.email;
                userData.name = formData.name;
                userData.chatbotAccess = true; // Grant chatbot access
                saveUserData(userData);
                
                // Also store in localStorage for chatbot access
                localStorage.setItem('alloftech_chatbot_email', formData.email);
                localStorage.setItem('alloftech_chatbot_logged_in', 'true');
            }
        }
    }

    // Track button clicks
    function trackButtonClick(buttonId, buttonText) {
        trackInteraction('button_click', buttonId, { buttonText: buttonText });
    }

    // Get tracking summary
    function getTrackingSummary() {
        const userData = getUserData();
        if (!userData) return null;

        return {
            userId: userData.userId,
            isReturningUser: userData.isReturningUser || false,
            visitCount: userData.visitCount || 0,
            firstVisit: userData.firstVisit,
            lastVisit: userData.lastVisit,
            totalPageViews: userData.pageViews ? userData.pageViews.length : 0
        };
    }

    // Initialize tracking
    function initializeTracking() {
        if (!TRACKING_CONFIG.TRACKING_ENABLED) return;

        // Track page view
        trackPageView();

        // Track form submissions
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                const name = document.getElementById('name')?.value;
                const email = document.getElementById('email')?.value;
                const message = document.getElementById('message')?.value;
                const serviceInterest = sessionStorage.getItem('selectedService') || '';
                
                const formData = {
                    name: name,
                    email: email,
                    hasMessage: !!message,
                    serviceInterest: serviceInterest
                };
                
                // Track the form submission
                trackFormSubmission('contact-form', formData);
                
                // Also send email to Google Sheets
                if (email && TRACKING_CONFIG.SEND_TO_GOOGLE_SHEETS) {
                    sendToGoogleSheets('track_form_submission', {
                        userId: getUserId(),
                        name: name,
                        email: email,
                        hasMessage: !!message,
                        serviceInterest: serviceInterest
                    }).catch(err => console.error('Error tracking form submission:', err));
                    
                    // Update visitor record with email
                    sendToGoogleSheets('track_visitor', {
                        userId: getUserId(),
                        email: email,
                        firstVisit: getUserData()?.firstVisit || new Date().toISOString(),
                        lastVisit: new Date().toISOString(),
                        browserInfo: getBrowserInfo()
                    }).catch(err => console.error('Error updating visitor email:', err));
                }
            });
        }

        // Track service card clicks
        document.querySelectorAll('.clickable-service').forEach(card => {
            card.addEventListener('click', function() {
                const serviceType = this.getAttribute('data-service');
                trackButtonClick('service-card', serviceType);
            });
        });

        // Track CTA button clicks
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            button.addEventListener('click', function() {
                const buttonText = this.textContent.trim();
                trackButtonClick('cta-button', buttonText);
            });
        });

        // Track chatbot interactions
        const chatbotButton = document.getElementById('chatbotButton');
        if (chatbotButton) {
            chatbotButton.addEventListener('click', function() {
                trackInteraction('chatbot_open', 'chatbot-button');
            });
        }

        // Track section views using Intersection Observer
        const sections = document.querySelectorAll('section[id]');
        if (sections.length > 0) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        trackInteraction('section_view', entry.target.id);
                    }
                });
            }, { threshold: 0.5 });

            sections.forEach(section => {
                sectionObserver.observe(section);
            });
        }
    }

    // Expose functions globally (for debugging/access)
    window.UserTracking = {
        trackPageView: trackPageView,
        trackInteraction: trackInteraction,
        trackFormSubmission: trackFormSubmission,
        trackButtonClick: trackButtonClick,
        getTrackingSummary: getTrackingSummary,
        getUserData: getUserData,
        getUserId: getUserId,
        getSessionId: getSessionId
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTracking);
    } else {
        initializeTracking();
    }

    // Track page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            trackInteraction('page_hidden', 'visibility');
        } else {
            trackInteraction('page_visible', 'visibility');
        }
    });

    // Track when user leaves the page
    window.addEventListener('beforeunload', function() {
        const userData = getUserData();
        if (userData && userData.sessions) {
            const currentSession = userData.sessions.find(s => s.sessionId === getSessionId());
            if (currentSession) {
                currentSession.endTime = new Date().toISOString();
                const duration = new Date(currentSession.endTime) - new Date(currentSession.startTime);
                currentSession.duration = duration;
                saveUserData(userData);
            }
        }
    });

})();

