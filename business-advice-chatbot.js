(function () {
  const form = document.getElementById('gigIntakeForm');
  const resetBtn = document.getElementById('gigResetBtn');
  const errorEl = document.getElementById('gigFormError');

  const messagesEl = document.getElementById('gigMessages');
  const statusEl = document.getElementById('gigStatus');
  const modeBadgeEl = document.getElementById('gigBadgeMode');

  const inputEl = document.getElementById('gigInput');
  const sendBtn = document.getElementById('gigSendBtn');

  // Business Advice API
  const API_URL = 'https://business-chatbot-advice-api.vercel.app/solution';

  // Google Sheet endpoint (user will provide later)
  // Paste your Apps Script URL here when ready.
  const GOOGLE_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbwOFvZgNICdW3jW7kFHar62FKSt0f38y5qyQf3APD1DZITKIcD1ZB-Edh76nrZxkXLZ-w/exec';

  const intake = {
    businessName: '',
    ownerName: '',
    websiteLink: '',
    problemText: '',
  };

  let started = false;
  let requestInFlight = false;

  function setError(msg) {
    if (!msg) {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
      return;
    }
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function setModeLabel(label) {
    modeBadgeEl.textContent = `Mode: ${label}`;
  }

  async function sendToGoogleSheets(action, data) {
    if (!GOOGLE_SCRIPT_URL) return;
    try {
      const payload = {
        action,
        ...data,
        page: 'business-advice-chatbot.html',
        timestamp: new Date().toISOString(),
      };
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // Do not block chatbot if tracking fails
      // eslint-disable-next-line no-console
      console.error('Google Sheets tracking failed:', err);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function parseMarkdownSimple(text) {
    let html = escapeHtml(text);

    // links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    // bold **text**
    html = html.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
    // italic *text*
    html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');

    // basic line breaks to paragraphs
    const lines = html.split('\n');
    const processed = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        processed.push('<br>');
      } else if (line.startsWith('### ')) {
        processed.push('<h3>' + line.substring(4) + '</h3>');
      } else if (line.startsWith('## ')) {
        processed.push('<h2>' + line.substring(3) + '</h2>');
      } else if (line.startsWith('# ')) {
        processed.push('<h1>' + line.substring(2) + '</h1>');
      } else {
        processed.push('<p>' + line + '</p>');
      }
    }

    return processed.join('\n');
  }

  function parseMarkdown(text) {
    // If marked is loaded, use it
    if (typeof marked !== 'undefined') {
      try {
        return marked.parse(text);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Markdown parsing error:', e);
        return parseMarkdownSimple(text);
      }
    }
    return parseMarkdownSimple(text);
  }

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `gig-msg gig-msg-${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'gig-msg-avatar';

    if (type === 'bot') {
      const img = document.createElement('img');
      img.src = 'images/new-Logo.png';
      img.alt = 'AllOfTech Logo';
      avatar.appendChild(img);
    } else {
      avatar.textContent = '👤';
    }

    const bubble = document.createElement('div');
    bubble.className = 'gig-msg-bubble';
    bubble.innerHTML = `<p>${escapeHtml(text)}</p>`;

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messagesEl.appendChild(msg);
    scrollToBottom();
    return msg;
  }

  function addTypewriterMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'gig-msg gig-msg-bot';

    const avatar = document.createElement('div');
    avatar.className = 'gig-msg-avatar';
    const img = document.createElement('img');
    img.src = 'images/new-Logo.png';
    img.alt = 'AllOfTech Logo';
    avatar.appendChild(img);

    const bubble = document.createElement('div');
    bubble.className = 'gig-msg-bubble';
    const p = document.createElement('p');
    bubble.appendChild(p);

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messagesEl.appendChild(msg);
    scrollToBottom();

    let i = 0;
    const fullText = text || '';
    const chars = fullText;
    const interval = setInterval(() => {
      if (i >= chars.length) {
        clearInterval(interval);
        // After typing is finished, render markdown properly
        bubble.innerHTML = parseMarkdown(fullText);
        scrollToBottom();
        return;
      }
      const ch = chars[i];
      if (ch === '\n') {
        p.appendChild(document.createElement('br'));
      } else {
        p.appendChild(document.createTextNode(ch));
      }
      i += 1;
      scrollToBottom();
    }, 12); // typing speed

    return msg;
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function normalizeWebsite(url) {
    const v = (url || '').trim();
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${v}`;
  }

  function addLoadingMessage() {
    const msg = document.createElement('div');
    msg.className = 'gig-msg gig-msg-bot';
    msg.id = 'gig-loading';

    const avatar = document.createElement('div');
    avatar.className = 'gig-msg-avatar';
    const img = document.createElement('img');
    img.src = 'images/new-Logo.png';
    img.alt = 'AllOfTech Logo';
    avatar.appendChild(img);

    const bubble = document.createElement('div');
    bubble.className = 'gig-msg-bubble';
    bubble.innerHTML = '<div class="gig-loading"><span></span><span></span><span></span></div>';

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messagesEl.appendChild(msg);
    scrollToBottom();
    return msg;
  }

  function removeLoadingMessage() {
    const el = document.getElementById('gig-loading');
    if (el) el.remove();
  }

  function extractApiReply(data) {
    if (!data) return '';
    if (typeof data === 'string') return data;
    return (
      data.solution ||
      data.advice ||
      data.response ||
      data.message ||
      data.reply ||
      (data.data && (data.data.advice || data.data.response || data.data.message)) ||
      ''
    );
  }

  async function fetchBusinessAdvice(extraUserMessage) {
    const websiteUrl = normalizeWebsite(intake.websiteLink);
    const ownerProblemBase = (intake.problemText || '').trim();

    let problemText = ownerProblemBase;
    if (!problemText) {
      problemText = websiteUrl
        ? `Please review this website and suggest business advice: ${websiteUrl}`
        : 'Please provide business advice based on my follow-up message.';
    }
    if (extraUserMessage) {
      problemText = `${problemText}\n\nAdditional message: ${extraUserMessage}`;
    }

    const payload = {
      website_url: websiteUrl,
      problem_text: problemText,
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    const reply = extractApiReply(data);
    if (!reply) return 'I received a response, but it was empty. Please try again.';
    return reply;
  }

  function enableChat() {
    inputEl.disabled = false;
    sendBtn.disabled = false;
    inputEl.focus();
  }

  function disableChat() {
    inputEl.disabled = true;
    sendBtn.disabled = true;
  }

  function resetAll() {
    started = false;
    requestInFlight = false;
    setModeLabel('Advice');
    setError('');
    form.reset();
    intake.businessName = '';
    intake.ownerName = '';
    intake.websiteLink = '';
    intake.problemText = '';
    setStatus('Waiting for your business details…');
    disableChat();

    // Clear messages but keep the first bot hint
    messagesEl.innerHTML = '';
    addMessage(
      'Please fill the business details on the left, then click “Start Advice Chat”.',
      'bot'
    );
  }

  function validateIntake() {
    const businessName = document.getElementById('businessName').value.trim();
    const ownerName = document.getElementById('ownerName').value.trim();
    const websiteLinkRaw = document.getElementById('websiteLink').value.trim();
    const problemText = document.getElementById('problemText').value.trim();

    // Require at least one of website link or problem
    if (!websiteLinkRaw && !problemText) {
      return { ok: false, msg: 'Please provide at least a website link or a problem.' };
    }

    let websiteLink = websiteLinkRaw;
    if (websiteLink) {
      websiteLink = normalizeWebsite(websiteLink);
      try {
        // eslint-disable-next-line no-new
        new URL(websiteLink);
      } catch {
        return { ok: false, msg: 'Website Link looks invalid. Example: https://example.com' };
      }
    }

    return {
      ok: true,
      value: { businessName, ownerName, websiteLink, problemText },
    };
  }

  function onStart(e) {
    e.preventDefault();
    setError('');

    const v = validateIntake();
    if (!v.ok) {
      setError(v.msg);
      return;
    }

    Object.assign(intake, v.value);
    started = true;
    setModeLabel('Advice');
    setStatus('Advice chat is ready');

    // Track intake in Google Sheets (not displayed in chat)
    sendToGoogleSheets('business_advice_intake', {
      businessName: intake.businessName,
      ownerName: intake.ownerName,
      websiteLink: normalizeWebsite(intake.websiteLink),
      problemText: intake.problemText,
    });

    // Clear previous messages (privacy: don't echo intake)
    messagesEl.innerHTML = '';
    addMessage(
      'Thanks. I have your details. Ask your questions here and I’ll give business advice.',
      'bot'
    );
    startInitialAdvice();
  }

  async function startInitialAdvice() {
    requestInFlight = true;
    disableChat();
    const loadingEl = addLoadingMessage();
    try {
      const reply = await fetchBusinessAdvice('');
      removeLoadingMessage();
      addTypewriterMessage(reply);
      sendToGoogleSheets('business_advice_chat', {
        userMessage: '(auto initial advice)',
        botMessage: reply,
        website_url: normalizeWebsite(intake.websiteLink),
      });
    } catch (err) {
      removeLoadingMessage();
      addMessage(
        'Sorry, I could not connect to the advice API right now. Please try again in a moment.',
        'bot'
      );
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      requestInFlight = false;
      enableChat();
    }
  }

  async function sendUserMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    if (!started) return;
    if (requestInFlight) return;

    addMessage(text, 'user');
    inputEl.value = '';

    requestInFlight = true;
    sendBtn.disabled = true;

    const loadingEl = addLoadingMessage();

    try {
      const reply = await fetchBusinessAdvice(text);
      removeLoadingMessage();
      addTypewriterMessage(reply);

      // Track chat turn (optional)
      sendToGoogleSheets('business_advice_chat', {
        userMessage: text,
        botMessage: reply,
        website_url: normalizeWebsite(intake.websiteLink),
      });
    } catch (err) {
      removeLoadingMessage();
      addMessage(
        'Sorry, I could not connect to the advice API right now. Please try again in a moment.',
        'bot'
      );
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      requestInFlight = false;
      sendBtn.disabled = false;
      inputEl.focus();
      if (loadingEl && loadingEl.id === 'gig-loading') {
        // already removed by removeLoadingMessage()
      }
    }
  }

  form.addEventListener('submit', onStart);
  resetBtn.addEventListener('click', resetAll);
  sendBtn.addEventListener('click', sendUserMessage);
  inputEl.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendUserMessage();
    }
  });

  // Ensure initial state
  setModeLabel('Advice');
  disableChat();
})();

