(function () {
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const API_URL = 'https://alloftech-website-chatbot-api.vercel.app/chat';

    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true,
        });
    }

    function toggleChatbot() {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatbotInput.focus();
        }
    }

    chatbotButton.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', toggleChatbot);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && chatbotWindow.classList.contains('active')) {
            toggleChatbot();
        }
    });

    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        chatbotInput.value = '';
        chatbotSend.disabled = true;

        const loadingId = addLoadingMessage();

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
            addMessage(botMessage, 'bot');
        } catch (error) {
            console.error('Error:', error);
            removeLoadingMessage(loadingId);
            addMessage(
                "Sorry, I'm having trouble connecting right now. Please try again later.",
                'bot'
            );
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

    chatbotSend.addEventListener('click', sendMessage);

    chatbotInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
})();

