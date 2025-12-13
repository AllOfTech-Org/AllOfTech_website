(function () {
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotLoginModal = document.getElementById('chatbotLoginModal');
    const chatbotLoginForm = document.getElementById('chatbotLoginForm');
    const chatbotInputContainer = document.getElementById('chatbotInputContainer');
    const chatbotStatus = document.getElementById('chatbotStatus');
    const API_URL = 'https://alloftech-website-chatbot-api.vercel.app/chat';
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_7iVFOZh41iT2ycjp_wiDphTwnt39NpcB2mEocvSd80VGJAhX1HweKG_gXaU6TLo8/exec';

    // Login state management
    const LOGIN_STORAGE_KEY = 'alloftech_chatbot_logged_in';
    const EMAIL_STORAGE_KEY = 'alloftech_chatbot_email';

    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true,
        });
    }

    // Get browser info
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
        try {
            const payload = {
                action: action,
                ...data
            };

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('Error sending to Google Sheets:', error);
        }
    }

    // Track chatbot login
    function trackChatbotLogin(email, loginType) {
        const userId = typeof UserTracking !== 'undefined' ? UserTracking.getUserId() : '';
        const sessionId = typeof UserTracking !== 'undefined' ? UserTracking.getSessionId() : '';
        
        sendToGoogleSheets('track_chatbot_login', {
            userId: userId,
            email: email,
            loginType: loginType, // 'automatic' or 'manual'
            browserInfo: getBrowserInfo(),
            sessionId: sessionId
        });
    }

    // Track chatbot message
    function trackChatbotMessage(message, messageType, responseTime = '') {
        const email = getStoredEmail();
        const userId = typeof UserTracking !== 'undefined' ? UserTracking.getUserId() : '';
        const sessionId = typeof UserTracking !== 'undefined' ? UserTracking.getSessionId() : '';
        
        if (email) {
            sendToGoogleSheets('track_chatbot_message', {
                userId: userId,
                email: email,
                messageType: messageType, // 'user' or 'bot'
                message: message,
                sessionId: sessionId,
                responseTime: responseTime
            });
        }
    }

    // Check if user is logged in
    function isLoggedIn() {
        const loggedIn = localStorage.getItem(LOGIN_STORAGE_KEY) === 'true';
        const email = localStorage.getItem(EMAIL_STORAGE_KEY);
        
        // Also check if user has submitted email via contact form (from tracking)
        if (!email && typeof UserTracking !== 'undefined') {
            const userData = UserTracking.getUserData();
            if (userData && userData.email) {
                localStorage.setItem(EMAIL_STORAGE_KEY, userData.email);
                localStorage.setItem(LOGIN_STORAGE_KEY, 'true');
                // Track automatic login
                trackChatbotLogin(userData.email, 'automatic');
                return true;
            }
        }
        
        return loggedIn && email;
    }

    // Get stored email
    function getStoredEmail() {
        let email = localStorage.getItem(EMAIL_STORAGE_KEY);
        
        // Check tracking data if no email in localStorage
        if (!email && typeof UserTracking !== 'undefined') {
            const userData = UserTracking.getUserData();
            if (userData && userData.email) {
                email = userData.email;
                localStorage.setItem(EMAIL_STORAGE_KEY, email);
            }
        }
        
        return email;
    }

    // Set login state
    function setLoggedIn(email) {
        localStorage.setItem(LOGIN_STORAGE_KEY, 'true');
        localStorage.setItem(EMAIL_STORAGE_KEY, email);
        
        // Track login
        trackChatbotLogin(email, 'manual');
        
        // Also update tracking data
        if (typeof UserTracking !== 'undefined') {
            const userData = UserTracking.getUserData();
            if (userData) {
                userData.email = email;
                userData.chatbotAccess = true;
            }
        }
    }

    // Show login modal
    function showLoginModal() {
        chatbotLoginModal.style.display = 'flex';
        chatbotMessages.style.display = 'none';
        chatbotInputContainer.style.display = 'none';
        chatbotStatus.textContent = 'Enter Email';
    }

    // Hide login modal and show chat
    function hideLoginModal() {
        chatbotLoginModal.style.display = 'none';
        chatbotMessages.style.display = 'flex';
        chatbotInputContainer.style.display = 'flex';
        const email = getStoredEmail();
        chatbotStatus.textContent = email ? `Chatting as ${email}` : 'Online';
        
        // Focus on input
        setTimeout(() => {
            chatbotInput.focus();
        }, 100);
    }

    // Handle login form submission (email only, no password)
    function handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('chatbotLoginEmail').value.trim();
        const errorDiv = document.getElementById('chatbotLoginError');
        const submitButton = document.getElementById('chatbotLoginSubmit');
        const buttonText = submitButton.querySelector('.login-button-text');
        const buttonLoading = submitButton.querySelector('.login-button-loading');
        
        // Clear previous errors
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
        
        // Email validation
        if (!email) {
            errorDiv.textContent = 'Please enter your email address';
            errorDiv.style.display = 'block';
            return;
        }
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorDiv.textContent = 'Please enter a valid email address';
            errorDiv.style.display = 'block';
            return;
        }
        
        // Show loading state
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'inline';
        submitButton.disabled = true;
        
        // Set logged in and track
        setTimeout(() => {
            setLoggedIn(email);
            hideLoginModal();
            
            // Show welcome message
            addMessage(`Hello! I'm the AllOfTech assistant. How can I help you today?`, 'bot');
            
            // Reset form
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';
            submitButton.disabled = false;
            chatbotLoginForm.reset();
        }, 300);
    }

    // Initialize login state
    function initializeLoginState() {
        if (isLoggedIn()) {
            hideLoginModal();
            const email = getStoredEmail();
            if (email) {
                chatbotStatus.textContent = `Chatting as ${email}`;
            }
        } else {
            showLoginModal();
        }
    }

    function toggleChatbot() {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            initializeLoginState();
            if (isLoggedIn()) {
                chatbotInput.focus();
            } else {
                document.getElementById('chatbotLoginEmail').focus();
            }
        }
    }

    chatbotButton.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', toggleChatbot);
    
    // Handle login form
    if (chatbotLoginForm) {
        chatbotLoginForm.addEventListener('submit', handleLogin);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && chatbotWindow.classList.contains('active')) {
            toggleChatbot();
        }
    });

    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Track user message
        trackChatbotMessage(message, 'user');

        addMessage(message, 'user');
        chatbotInput.value = '';
        chatbotSend.disabled = true;

        const loadingId = addLoadingMessage();
        const startTime = Date.now();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            removeLoadingMessage(loadingId);

            const botMessage =
                data.response ||
                data.message ||
                "I apologize, but I couldn't process your request. Please try again.";
            
            // Calculate response time
            const responseTime = Date.now() - startTime;
            
            // Track bot message
            trackChatbotMessage(botMessage, 'bot', responseTime);
            
            addMessage(botMessage, 'bot');
        } catch (error) {
            console.error('Error:', error);
            removeLoadingMessage(loadingId);
            const errorMessage = "Sorry, I'm having trouble connecting right now. Please try again later.";
            trackChatbotMessage(errorMessage, 'bot', Date.now() - startTime);
            addMessage(errorMessage, 'bot');
        } finally {
            chatbotSend.disabled = false;
            chatbotInput.focus();
        }
    }

    function parseMarkdown(text) {
        if (typeof marked !== 'undefined') {
            try {
                return marked.parse(text);
            } catch (e) {
                console.error('Markdown parsing error:', e);
                return escapeHtml(text);
            }
        } else {
            return parseMarkdownSimple(text);
        }
    }

    function parseMarkdownSimple(text) {
        let html = escapeHtml(text);
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        html = html.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');

        const lines = html.split('\n');
        const processedLines = [];
        let inList = false;
        let listItems = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            if (trimmedLine.match(/^###\s+/)) {
                if (inList) {
                    processedLines.push(closeList(listItems));
                    listItems = [];
                    inList = false;
                }
                processedLines.push(line.replace(/^###\s+(.+)$/, '<h3>$1</h3>'));
            } else if (trimmedLine.match(/^##\s+/)) {
                if (inList) {
                    processedLines.push(closeList(listItems));
                    listItems = [];
                    inList = false;
                }
                processedLines.push(line.replace(/^##\s+(.+)$/, '<h2>$1</h2>'));
            } else if (trimmedLine.match(/^#\s+/)) {
                if (inList) {
                    processedLines.push(closeList(listItems));
                    listItems = [];
                    inList = false;
                }
                processedLines.push(line.replace(/^#\s+(.+)$/, '<h1>$1</h1>'));
            } else if (trimmedLine.match(/^[\-\*]\s+/)) {
                if (!inList) {
                    inList = true;
                }
                listItems.push(trimmedLine.replace(/^[\-\*]\s+(.+)$/, '<li>$1</li>'));
            } else if (trimmedLine.match(/^\d+\.\s+/)) {
                if (!inList) {
                    inList = true;
                }
                listItems.push(trimmedLine.replace(/^\d+\.\s+(.+)$/, '<li>$1</li>'));
            } else {
                if (inList) {
                    processedLines.push(closeList(listItems));
                    listItems = [];
                    inList = false;
                }
                if (trimmedLine) {
                    processedLines.push('<p>' + line + '</p>');
                } else {
                    processedLines.push('<br>');
                }
            }
        }

        if (inList) {
            processedLines.push(closeList(listItems));
        }

        html = processedLines.join('\n');
        html = html.replace(/<p><\/p>/g, '');
        return html;
    }

    function closeList(items) {
        if (items.length === 0) return '';
        return '<ul>' + items.join('') + '</ul>';
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message chatbot-message-${type}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';

        if (type === 'bot') {
            const logoImg = document.createElement('img');
            logoImg.src = 'images/new-Logo.png';
            logoImg.alt = 'AllOfTech Logo';
            logoImg.className = 'message-logo';
            avatar.appendChild(logoImg);
        } else {
            avatar.textContent = '👤';
        }

        const content = document.createElement('div');
        content.className = 'message-content markdown-body';

        if (type === 'bot') {
            content.innerHTML = parseMarkdown(text);
        } else {
            const paragraph = document.createElement('p');
            paragraph.textContent = text;
            content.appendChild(paragraph);
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function addLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'chatbot-message chatbot-message-bot';
        loadingDiv.id = 'loading-message';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        const logoImg = document.createElement('img');
        logoImg.src = 'images/new-Logo.png';
        logoImg.alt = 'AllOfTech Logo';
        logoImg.className = 'message-logo';
        avatar.appendChild(logoImg);

        const content = document.createElement('div');
        content.className = 'message-content chatbot-loading';
        content.innerHTML = '<span></span><span></span><span></span>';

        loadingDiv.appendChild(avatar);
        loadingDiv.appendChild(content);

        chatbotMessages.appendChild(loadingDiv);
        scrollToBottom();

        return 'loading-message';
    }

    function removeLoadingMessage(id) {
        const loadingElement = document.getElementById(id);
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    chatbotSend.addEventListener('click', function() {
        if (isLoggedIn()) {
            sendMessage();
        } else {
            showLoginModal();
        }
    });

    chatbotInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isLoggedIn()) {
                sendMessage();
            } else {
                showLoginModal();
            }
        }
    });
    
    // Initialize login state on page load
    if (chatbotWindow.classList.contains('active')) {
        initializeLoginState();
    }
})();
