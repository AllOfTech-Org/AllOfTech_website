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
  const API_URL = 'https://business-chatbot-advice-api.vercel.app/business-advice';

  // Google Sheet endpoint (user will provide later)
  // Paste your Apps Script URL here when ready.
  const GOOGLE_SCRIPT_URL = '';

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
        page: 'gig-chatbot.html',
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
    const el = addMessage('Thinking…', 'bot');
    el.id = 'gig-loading';
    return el;
  }

  function removeLoadingMessage() {
    const el = document.getElementById('gig-loading');
    if (el) el.remove();
  }

  function extractApiReply(data) {
    if (!data) return '';
    if (typeof data === 'string') return data;
    return (
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

    const ownerProblem = extraUserMessage
      ? `${ownerProblemBase}\n\nAdditional message: ${extraUserMessage}`
      : ownerProblemBase;

    const payload = {
      website_url: websiteUrl,
      owner_problem: ownerProblem,
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

    if (!businessName) return { ok: false, msg: 'Please enter Business Name.' };
    if (!ownerName) return { ok: false, msg: 'Please enter Owner Name.' };
    if (!problemText) return { ok: false, msg: 'Please write the business problem/requirement.' };

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
    enableChat();
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
      addMessage(reply, 'bot');

      // Track chat turn (optional)
      sendToGoogleSheets('business_advice_chat', {
        userMessage: text,
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

