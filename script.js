/* ===== NAVBAR: scroll & active link ===== */
(function () {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  if (!navbar) return;

  let ticking = false;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
    ticking = false;
  }

  // rAF throttle: layout reads happen once per frame, not once per scroll event.
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();
})();

/* ===== HAMBURGER MENU ===== */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  if (!hamburger || !navLinksEl) return;

  function setOpen(open) {
    navLinksEl.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  }

  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.addEventListener('click', () => setOpen(!navLinksEl.classList.contains('open')));
  navLinksEl.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinksEl.classList.contains('open')) setOpen(false);
  });
})();

/* ===== FOOTER YEAR ===== */
(function () {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = String(new Date().getFullYear());
})();

/* ===== TYPING ANIMATION ===== */
(function () {
  const typedEl = document.getElementById('typedText');
  if (!typedEl) return;

  const phrases = [
    'AI & Backend Engineer @ Worldsoft',
    'Multi-Agent AI Systems Builder',
    'LLM Pipelines · RAG · Voice Agents',
    'FastAPI + LangGraph Developer',
    'Data Science Engineering Student @ ESPRIT',
    'Python · Java · C# Developer',
  ];

  // Respect reduced-motion: show the first phrase and stop.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedEl.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 80;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex--;
      typingDelay = 40;
    } else {
      typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;
      typingDelay = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingDelay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingDelay = 300;
    }

    setTimeout(typeEffect, typingDelay);
  }

  typeEffect();
})();

/* ===== PROJECT CARDS: reveal on scroll ===== */
const revealCard = (() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.project-card').forEach(card => observer.observe(card));
  return card => observer.observe(card);
})();

/* ===== PROJECT FILTERS (two axes: type + domain) ===== */
(function () {
  const bar = document.getElementById('projectsFilter');
  const grid = document.getElementById('projectsGrid');
  const empty = document.getElementById('filterEmpty');
  const reset = document.getElementById('filterReset');
  if (!bar || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.project-card'));
  const buttons = Array.from(bar.querySelectorAll('.filter-btn'));
  const active = { type: 'all', cat: 'all' };

  const matches = (card, axis, value) =>
    value === 'all' ||
    (axis === 'type'
      ? card.dataset.type === value
      : (card.dataset.cat || '').split(' ').includes(value));

  const visibleWith = (type, cat) =>
    cards.filter(c => matches(c, 'type', type) && matches(c, 'cat', cat));

  // Counts are relative to the other axis, so a button never promises results
  // the combination cannot deliver.
  function refreshCounts() {
    buttons.forEach(btn => {
      const { axis, filter } = btn.dataset;
      const n = axis === 'type'
        ? visibleWith(filter, active.cat).length
        : visibleWith(active.type, filter).length;

      let label = btn.querySelector('.count');
      if (!label) {
        label = document.createElement('span');
        label.className = 'count';
        btn.appendChild(document.createTextNode(' '));
        btn.appendChild(label);
      }
      label.textContent = n;
      btn.classList.toggle('is-empty', n === 0);
    });
  }

  function apply() {
    let shown = 0;
    cards.forEach(card => {
      const show = matches(card, 'type', active.type) && matches(card, 'cat', active.cat);
      card.classList.toggle('hidden', !show);
      if (show) {
        shown++;
        // A card revealed by a filter change may never have crossed the observer.
        if (!card.classList.contains('visible')) revealCard(card);
      }
    });
    if (empty) empty.hidden = shown > 0;
    refreshCounts();
  }

  bar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (btn) {
      const { axis, filter } = btn.dataset;
      active[axis] = filter;
      buttons
        .filter(b => b.dataset.axis === axis)
        .forEach(b => b.classList.toggle('active', b === btn));
      apply();
      return;
    }
    if (reset && e.target === reset) {
      active.type = 'all';
      active.cat = 'all';
      buttons.forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
      apply();
    }
  });

  apply();
})();

/* ===== CONTACT FORM ===== */
(function () {
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const submitBtn = document.getElementById('contactSubmit');
  if (!contactForm || !formNote) return;

  const EMAIL = 'Benromdhane.Aziz@esprit.tn';

  function note(text, kind) {
    formNote.textContent = text;
    formNote.className = 'form-note' + (kind ? ' ' + kind : '');
  }

  function mailtoFallback(name, email, message) {
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const company = document.getElementById('company');
    let valid = true;

    [name, email, message].forEach(field => field.classList.remove('error'));

    if (!name.value.trim()) { name.classList.add('error'); valid = false; }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('error'); valid = false;
    }
    if (!message.value.trim()) { message.classList.add('error'); valid = false; }

    if (!valid) {
      note('Please fill in all fields correctly.', 'error-msg');
      return;
    }

    const payload = {
      name: name.value.trim(),
      email: email.value.trim(),
      message: message.value.trim(),
      company: company ? company.value : '',
    };

    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('is-loading'); }
    note('Sending…');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        note('Thanks! Your message is on its way — I usually reply within a day.', 'success');
        contactForm.reset();
      } else if (data.fallback === 'mailto') {
        // Mail service unavailable: hand the message to the visitor's mail client.
        note('Opening your email client…');
        mailtoFallback(payload.name, payload.email, payload.message);
      } else {
        note(data.error || 'Could not send the message. Please try again.', 'error-msg');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      note('Network error — opening your email client instead…');
      mailtoFallback(payload.name, payload.email, payload.message);
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('is-loading'); }
      setTimeout(() => { if (formNote.classList.contains('success')) note(''); }, 6000);
    }
  });
})();

/* ===== SMOOTH SCROLL for all anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const offset = document.getElementById('navbar').offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  });
});

/* ===== DARK MODE TOGGLE ===== */
(function () {
  const btn = document.getElementById('themeToggle');
  const DARK = 'dark';

  // Apply saved preference or system preference on load
  const saved = localStorage.getItem('theme');
  if (saved === DARK || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add(DARK);
  }
  if (!btn) return;

  btn.addEventListener('click', () => {
    document.body.classList.toggle(DARK);
    const isDark = document.body.classList.contains(DARK);
    localStorage.setItem('theme', isDark ? DARK : 'light');
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
})();

/* ===== AI CHATBOT ===== */
(function () {
  const fab       = document.getElementById('chatbotFab');
  const panel     = document.getElementById('chatbotPanel');
  const closeBtn  = document.getElementById('chatbotCloseBtn');
  const input     = document.getElementById('chatbotInput');
  const sendBtn   = document.getElementById('chatbotSendBtn');
  const messages  = document.getElementById('chatbotMessages');
  const notif     = document.getElementById('chatbotNotif');
  if (!fab || !panel || !input || !sendBtn || !messages) return;

  // The system prompt lives in api/_persona.js — the browser never sees it.
  const history = [];
  let isOpen = false;
  let isLoading = false;

  if (notif && localStorage.getItem('chatSeen') === '1') notif.style.display = 'none';

  function togglePanel(force) {
    isOpen = typeof force === 'boolean' ? force : !isOpen;
    fab.classList.toggle('open', isOpen);
    panel.classList.toggle('open', isOpen);
    panel.setAttribute('aria-hidden', String(!isOpen));
    fab.setAttribute('aria-expanded', String(isOpen));
    fab.setAttribute('aria-label', isOpen ? 'Close AI assistant' : 'Open AI assistant');

    if (isOpen) {
      setTimeout(() => input.focus(), 300);
      if (notif) notif.style.display = 'none';
      localStorage.setItem('chatSeen', '1');
    } else {
      fab.focus();
    }
  }

  fab.addEventListener('click', () => togglePanel());
  if (closeBtn) closeBtn.addEventListener('click', () => togglePanel(false));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) togglePanel(false);
  });

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    if (role === 'assistant' && typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
      bubble.innerHTML = DOMPurify.sanitize(marked.parse(text));
    } else {
      bubble.textContent = text;
    }
    div.appendChild(bubble);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg assistant';
    div.id = 'chatTypingIndicator';
    div.innerHTML = '<div class="chat-bubble chat-typing"><span></span><span></span><span></span></div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  function hideTyping() {
    const el = document.getElementById('chatTypingIndicator');
    if (el) el.remove();
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isLoading) return;

    isLoading = true;
    sendBtn.disabled = true;
    input.value = '';

    appendMessage('user', text);
    history.push({ role: 'user', content: text });
    showTyping();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await response.json().catch(() => ({}));
      hideTyping();

      if (!response.ok) {
        appendMessage(
          'assistant',
          response.status === 429
            ? (data.error || 'Too many messages — give me a minute and try again.')
            : (data.error || 'Sorry, something went wrong. Please try again in a moment.')
        );
        history.pop();
        return;
      }

      const reply = (data.reply || '').trim() || 'Sorry, I could not generate a response.';
      appendMessage('assistant', reply);
      history.push({ role: 'assistant', content: reply });

      // Keep the history bounded (last 10 exchanges).
      if (history.length > 20) history.splice(0, history.length - 20);
    } catch (err) {
      hideTyping();
      appendMessage('assistant', 'Sorry, something went wrong. Please try again in a moment.');
      history.pop();
      console.error('Chatbot error:', err);
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();
