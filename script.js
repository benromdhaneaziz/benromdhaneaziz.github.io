/* ===== NAVBAR: scroll & active link ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // scrolled class for shadow
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // active link highlight
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('open');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ===== TYPING ANIMATION ===== */
const phrases = [
  'Data Science Engineering Student',
  'Multi-Agent AI Systems Builder',
  'NLP & Transformer Models',
  'FastAPI + LangGraph Developer',
  'NVIDIA · DeepLearning.AI · Azure Certified',
  'Python · Java · C# Developer',
];
const typedEl = document.getElementById('typedText');
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
    // Pause at end
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

/* ===== INTERSECTION OBSERVER: project cards ===== */
const cards = document.querySelectorAll('.project-card');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

cards.forEach(card => observer.observe(card));

/* ===== CONTACT FORM (mailto fallback) ===== */
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  let valid = true;

  // Simple validation
  [name, email, message].forEach(field => field.classList.remove('error'));

  if (!name.value.trim()) { name.classList.add('error'); valid = false; }
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.classList.add('error'); valid = false;
  }
  if (!message.value.trim()) { message.classList.add('error'); valid = false; }

  if (!valid) {
    formNote.textContent = 'Please fill in all fields correctly.';
    formNote.className = 'form-note error-msg';
    return;
  }

  // Open mailto as fallback (no backend needed for GitHub Pages)
  const subject = encodeURIComponent(`Portfolio contact from ${name.value}`);
  const body = encodeURIComponent(
    `Name: ${name.value}\nEmail: ${email.value}\n\n${message.value}`
  );
  window.location.href = `mailto:Benromdhane.Aziz@esprit.tn?subject=${subject}&body=${body}`;

  formNote.textContent = 'Opening your email client... Thanks for reaching out!';
  formNote.className = 'form-note success';

  contactForm.reset();
  setTimeout(() => { formNote.textContent = ''; }, 5000);
});

/* ===== SMOOTH SCROLL for all anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== AI CHATBOT ===== */
(function () {
  const fab       = document.getElementById('chatbotFab');
  const panel     = document.getElementById('chatbotPanel');
  const closeBtn  = document.getElementById('chatbotCloseBtn');
  const input     = document.getElementById('chatbotInput');
  const sendBtn   = document.getElementById('chatbotSendBtn');
  const messages  = document.getElementById('chatbotMessages');

  // ── System prompt ────────────────────────────────────────────────
  const SYSTEM_PROMPT = `You are the AI assistant embedded in the personal portfolio of Mohamed Aziz Ben Romdhane.
Your job is to help visitors discover Aziz's work, skills, and background in an engaging, human way.

**Tone & Style rules — follow these strictly:**
- Be warm, enthusiastic, and conversational — like a proud colleague talking about Aziz
- Use clear structure: bold project names, short bullet points for features, never walls of text
- Keep answers focused — 3-5 sentences or a short bullet list max, unless more detail is asked
- Always mention the tech stack when talking about a project
- If asked about the best/top projects, pick 3 with a short exciting description each
- End with a helpful nudge: offer to dive deeper, or link to GitHub / contact section
- Respond in the same language the visitor uses
- Never say "I don't have information about that" for things in this prompt — you know everything below

---

## About Aziz
Mohamed Aziz Ben Romdhane is a **Data Science Engineering student at ESPRIT** (Tunisia) and a full-time **Software Engineer at Worldsoft**.
He specialises in **multi-agent AI systems, NLP, backend APIs, and full-stack development**.
- GitHub (main): https://github.com/benromdhaneaziz
- GitHub (personal): https://github.com/DefNotScreaMy
- Email: Benromdhane.Aziz@esprit.tn

## Work Experience
**Worldsoft** (current) — Software Engineer
- Enterprise Travel CRM: 8-agent AI system (LangGraph + DeepSeek via OpenRouter), 52 REST endpoints, Oracle DB, SSE streaming, Angular 17 dashboard with maps & charts, hotel PDF parsing, Amadeus API

**Prosper Us** (internship) — .NET Developer
- PharmaReport: ASP.NET Core MVC + Razor Pages pharmacy reporting app (EF Core, MedicalReport & ReportSheet modules)

**AS2E** (internship)
- WordPress management & Google Apps Script automation

## Skills
- **Languages**: Python, Java, C#, TypeScript, PHP, HTML5, CSS3, SQL
- **AI/ML**: LangChain, LangGraph, PyTorch, Scikit-learn, HuggingFace, FAISS, ChromaDB, Pandas, NumPy
- **Backend**: FastAPI, Spring Boot, ASP.NET Core, EF Core, Symfony/PHP, JWT, SSE
- **Frontend**: Angular 17, Bootstrap 4/5, Streamlit, JavaFX, ApexCharts, MapLibre GL
- **Databases**: Oracle DB, MySQL, SQLite, MongoDB
- **DevOps**: Git, Docker, Maven, Prometheus, Grafana

## Projects (use these when asked about projects)

**🌍 Travel CRM & Analytics Platform** — Worldsoft (private/GitLab)
8-agent AI chatbot (SQL, Analyst, Forecast, Anomaly, Segmentation, Hotel, Flight, Orchestrator) • LangGraph + DeepSeek LLM • 52 FastAPI endpoints • Oracle 11.2g • SSE streaming • Angular 17 with interactive maps & charts • hotel contract PDF parsing • Amadeus API

**📈 BVMT Analytics Platform** — github.com/benromdhaneaziz/bvmt-analytics-platform
Streamlit app for Tunisian Stock Market • AdaBoost & Gradient Boosting for price prediction • DBSCAN + UMAP clustering • Prophet dividend forecasting • RAG chatbot (LangChain + Llama2 + FAISS) • MongoDB Atlas 2016–2023 data • Selenium scraping

**🔍 Anomaly & Intrusion Detection** — github.com/benromdhaneaziz/Anomaly-Detection-and-Intrusion-Detection-System
GMM anomaly detection + Decision Tree / KNN intrusion detection on NSL-KDD dataset • classifies DoS, U2R, R2L, Probe attacks

**📊 Time Series Forecasting** — github.com/benromdhaneaziz/Time-Series-Analysis-and-Forecasting
ARIMA, Prophet, deep learning models • Python, Pandas, Jupyter

**🧠 Knowledge Graph Builder** — github.com/benromdhaneaziz/KnowledgeGraph
NLP entity extraction → knowledge graph • spaCy, NetworkX

**⚙️ DevOps Full Pipeline** — github.com/benromdhaneaziz/DevOps-Project
Full CI/CD • Docker, Maven, Jenkins, Prometheus, Grafana

**🏠 Smart Real Estate Platform** — github.com/benromdhaneaziz/Smart-Real-Estate
AI price prediction for real estate • Python ML + Spring Boot

**💊 PharmaReport** — github.com/benromdhaneaziz/PharmaReport (Prosper Us internship)
ASP.NET Core MVC + Razor Pages pharmacy app • EF Core • C#

**🏫 eSchool** — github.com/benromdhaneaziz/eSchool
PHP + Bootstrap 4 school management: students, attendance, marks, online exams, question bank • MySQL

**☕ PiDev / JavaFX Projects** — Spring Boot + JavaFX desktop apps (ESPRIT projects)

**🏨 Hotel Nearest Places** — github.com/DefNotScreaMy/hotel-nearest-places
Flask web app • Groq Llama 3 for NLP • OpenRouteService routing • OpenWeatherMap • Overpy/OSM

**✈️ Flight Invoice RAG Chatbot** — github.com/DefNotScreaMy/flight-rag-chatbot
Streamlit RAG chatbot for flight invoices • LangChain + ChromaDB + HuggingFace embeddings + Groq Llama 3

**🎮 Minecraft LLM Bot** — github.com/DefNotScreaMy/minecraft-llm-bot
AI Minecraft server bot • OpenRouter (Gemini 2.5 Flash) • RCON commands • chat moderation • event engine • structure building

## Certifications
- NVIDIA: Building Transformer-Based NLP Applications (Apr 2024)
- DeepLearning.AI: NLP Specialisation x4 — Classification & Vector Spaces, Probabilistic Models, Sequence Models, Attention Models (Nov 2024)
- Microsoft Azure x3 — Cloud Services, Services & Lifecycles, Management Tools & Security (Nov 2024)
- The Hashgraph Association: Hashgraph Developer Course (Nov 2024)`;


  // ── State ─────────────────────────────────────────────────────────
  const history = [];
  let isOpen = false;
  let isLoading = false;

  // ── Toggle panel ─────────────────────────────────────────────────
  function togglePanel() {
    isOpen = !isOpen;
    fab.classList.toggle('open', isOpen);
    panel.classList.toggle('open', isOpen);
    panel.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) {
      setTimeout(() => input.focus(), 300);
    }
  }

  fab.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', togglePanel);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) togglePanel();
  });

  // ── Append message bubble ─────────────────────────────────────────
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

  // ── Typing indicator ──────────────────────────────────────────────
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

  // ── Send message ──────────────────────────────────────────────────
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
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + atob('c2stb3ItdjEtZGEyNzRlMTk4MTk0ZDRjMTUxMGMzN2RiM2Q2MzhmZmI5MmNkNTQ4M2ZhMDk3OWE2MDVhYTQ1ZDJmN2Y2ZTU0Mw=='),
          'HTTP-Referer': window.location.href,
          'X-Title': 'Aziz Portfolio Chatbot',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
          ],
          max_tokens: 600,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';

      hideTyping();
      appendMessage('assistant', reply);
      history.push({ role: 'assistant', content: reply });

      // Keep history from growing too large (last 10 exchanges)
      if (history.length > 20) history.splice(0, 2);

    } catch (err) {
      hideTyping();
      appendMessage('assistant', 'Sorry, something went wrong. Please try again in a moment.');
      console.error('Chatbot error:', err);
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();
