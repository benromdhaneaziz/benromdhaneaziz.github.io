/* ===== BILINGUAL PORTFOLIO (EN / FR) =====
   Every translatable node carries data-i18n="key". The English text stays in
   the HTML — it is the source of truth and what a crawler without JS sees —
   and the first switch to French stashes it in data-en so switching back is
   lossless. Product names, tech names and metrics stay untranslated on purpose.

   To add a string: put data-i18n="some.key" on the element, add the key here. */

const FR = {
  /* --- navigation --- */
  'nav.about': 'À propos',
  'nav.skills': 'Compétences',
  'nav.projects': 'Projets',
  'nav.certifications': 'Certifs',
  'nav.contact': 'Contact',

  /* --- hero --- */
  'hero.tag': '&#x1F4BC; En poste @ Worldsoft',
  'hero.greeting': 'Bonjour, je suis',
  'hero.cta.work': 'Voir mes projets',
  'hero.cta.contact': 'Me contacter',

  /* --- section headings --- */
  'sec.about.title': 'À propos de <span class="highlight">moi</span>',
  'sec.skills.title': 'Mes <span class="highlight">compétences</span>',
  'sec.projects.title': 'Mes <span class="highlight">projets</span>',
  'sec.certifications.title': 'Certifi<span class="highlight">cations</span>',
  'sec.contact.title': 'Me <span class="highlight">contacter</span>',
  'sec.about.sub': 'Qui je suis et ce que je fais',
  'sec.skills.sub': 'Les technologies et outils que j’utilise',
  'sec.projects.sub': 'Une sélection de travaux qui illustrent mes compétences',
  'sec.certifications.sub': 'Certifications vérifiées NVIDIA, DeepLearning.AI, Microsoft et plus',
  'sec.contact.sub': 'Ouvert aux opportunités, collaborations et stages',

  /* --- about --- */
  'about.p1': 'Je suis élève ingénieur spécialisé en <strong>Data Science</strong> à <strong>ESPRIT</strong> ' +
    '(École Supérieure Privée d’Ingénierie et de Technologies), en Tunisie. Je conçois des systèmes ' +
    'intelligents qui transforment des données brutes en valeur métier concrète.',
  'about.p2': 'Mon expérience couvre les <strong>architectures d’IA multi-agents</strong>, les ' +
    '<strong>pipelines de machine learning</strong>, le <strong>développement full-stack</strong> et les ' +
    '<strong>pratiques DevOps</strong>. Je travaille à la croisée de l’ingénierie des données et de l’IA appliquée.',
  'about.p3': 'Actuellement chez <strong>Worldsoft</strong>, où je livre des produits IA de bout en bout : ' +
    '<strong>CurvaTrip</strong>, un concierge de voyage IA (32 outils d’agent, voix en temps réel, prise en ' +
    'charge du derja tunisien) derrière l’application de réservation CurvaTrip ; un <strong>SaaS de contrats ' +
    'hôteliers</strong> qui transforme des contrats PDF en un schéma Oracle tarifé et interrogeable ; et la ' +
    '<strong>plateforme CRM &amp; Analytics Voyage</strong>, un système LangGraph à 8 agents avec 52 endpoints ' +
    'REST et un tableau de bord Angular 17. Auparavant en stage chez <strong>Prosper Us</strong> (C# / .NET Core) ' +
    'et <strong>AS2E</strong> (WordPress &amp; Google Apps Script).',
  'about.hire': 'Recrutez-moi',
  'info.label.education': 'Formation',
  'info.label.location': 'Localisation',
  'info.label.status': 'Statut',
  'info.label.languages': 'Langues',
  'info.value.0': 'Cycle ingénieur &#8212; Data Science, ESPRIT',
  'info.value.1': 'Tunisie &#x1F1F9;&#x1F1F3;',
  'info.value.2': 'Ingénieur logiciel @ Worldsoft',
  'info.value.3': 'Arabe &middot; Français &middot; Anglais',
  'info.value.4': 'Tunisie &#x1F1F9;&#x1F1F3;',

  /* --- stats --- */
  'stat.0': 'Dépôts publics',
  'stat.1': 'Entreprises',
  'stat.2': 'Endpoints REST livrés',
  'stat.3': 'Outils d’agent IA',

  /* --- skills --- */
  'skill.0': 'Programmation',
  'skill.1': 'IA &amp; Machine Learning',
  'skill.2': 'Backend &amp; API',
  'skill.3': 'Frontend &amp; Frameworks',
  'skill.4': 'DevOps &amp; Outils',
  'skill.5': 'Données &amp; Analytique',

  /* --- project filters --- */
  'filt.label.0': 'Type',
  'filt.label.1': 'Domaine',
  'filt.type.all': 'Tous',
  'filt.type.company': 'Entreprise',
  'filt.type.internship': 'Stage',
  'filt.type.school': 'Université',
  'filt.type.personal': 'Personnel',
  'filt.cat.all': 'Tous',
  'filt.cat.ai': 'IA &amp; Agents',
  'filt.cat.data': 'Data &amp; ML',
  'filt.cat.web': 'Full-Stack',
  'filt.cat.devops': 'DevOps',

  /* --- badges (repeated across cards) --- */
  'badge.private': '&#x1F512; Privé &#x2014; GitLab',
  'badge.wip': '&#x1F6A7; En développement',
  'badge.delivered': '&#x2705; Livré',
  'badge.esprit': '&#x1F1F9;&#x1F1F3; Projet d’équipe ESPRIT',
  'badge.contrib': '&#x1F465; Forké &amp; contribué',
  'badge.personal': '&#x1F9EA; Projet personnel',

  /* --- project cards --- */
  'proj.more': 'Lire l’étude de cas (en anglais) &#8594;',
  'projects.cta': 'Voir tout sur GitHub &#x2192;',

  'proj.curvatrip.title': 'CurvaTrip &#x2014; Concierge de voyage IA',
  'proj.curvatrip.desc': 'IA conversationnelle qui pilote les écrans de chat et de voix de l’application de ' +
    'réservation <strong>CurvaTrip</strong>. <strong>32 outils d’agent</strong> exploitent un GDS en direct : ' +
    'recherche et affinage de vols, conditions tarifaires, réservation conditionnée au paiement <strong>SATIM</strong>, ' +
    'alertes de prix et plans de voyage jour par jour avec photos, météo et distances. Répond en EN / FR / AR et en ' +
    '<strong>derja tunisien</strong> comme dialecte à part entière, avec la voix en temps réel via un pont ' +
    '<strong>Gemini Live</strong> (PCM16, interruption possible). Livré en API <strong>SSE</strong>, avec une couche ' +
    'de données traduisant les dialectes SQLite&#x2194;Oracle et 16 instances derrière <strong>nginx</strong> avec ' +
    'autoscaler et routage persistant. Runtime d’agent bâti sur le projet open-source Hermes Agent (MIT) ; le produit ' +
    'voyage, la couche linguistique et le pont vocal sont mon propre code.',
  'metric.curvatrip.0': 'Outils d’agent',
  'metric.curvatrip.1': 'Routes API',
  'metric.curvatrip.2': 'Lignes de Python',
  'metric.curvatrip.3': 'Instances autoscalées',

  'proj.hotel-contract-saas.title': 'SaaS Contrats Hôteliers &#x2014; extraction LLM &amp; moteur tarifaire',
  'proj.hotel-contract-saas.desc': 'Plateforme B2B multi-locataire qui transforme les contrats hôteliers ' +
    '(PDF / DOCX / XLSX) en un schéma <strong>Oracle</strong> normalisé de 17 tables via un pipeline d’extraction LLM ' +
    'avec repli OCR, puis tarife n’importe quel séjour avec un <strong>moteur déterministe en Python pur</strong> ' +
    '&#x2014; aucun LLM dans le calcul du prix. <strong>Hermes</strong>, l’assistant intégré à appels d’outils, répond ' +
    'aux questions, détecte les champs manquants et propose des corrections derrière un flux simulation &#x2192; ' +
    'confirmation. Inclut l’isolation des locataires au niveau ligne depuis le JWT, une file d’import asynchrone ' +
    'adossée à Oracle (<code>FOR UPDATE SKIP LOCKED</code>), un score de qualité d’extraction, un journal d’audit et ' +
    'une facturation à l’événement.',
  'metric.hotel-contract-saas.0': 'Endpoints REST',
  'metric.hotel-contract-saas.1': 'Outils de l’assistant',
  'metric.hotel-contract-saas.2': 'Tables de contrat',
  'metric.hotel-contract-saas.3': 'Lignes de code',

  'proj.travel-crm.title': 'CRM &amp; Analytics Voyage &#x2014; système IA multi-agents',
  'proj.travel-crm.desc': 'CRM voyage d’entreprise construit pendant mon stage. Il embarque un ' +
    '<strong>chatbot IA à 8 agents</strong> (SQL, Analyste, Prévision, Anomalie, Segmentation, Hôtel, Vol, ' +
    'Orchestrateur) propulsé par <strong>LangGraph + DeepSeek LLM</strong> via OpenRouter. Le système expose ' +
    '<strong>52 endpoints REST</strong> sur une base Oracle 11.2g, diffuse les réponses en SSE, et se consulte via un ' +
    'tableau de bord <strong>Angular 17</strong> avec graphiques interactifs, cartes en temps réel, analyse de ' +
    'contrats hôteliers en PDF et une interface de test Streamlit.',
  'metric.travel-crm.0': 'Agents IA',
  'metric.travel-crm.1': 'Endpoints REST',
  'metric.travel-crm.2': 'Réponses en streaming',
  'metric.travel-crm.3': 'Base Oracle',

  'proj.bvmt-analytics.title': 'Plateforme BVMT &#x2014; Bourse de Tunis',
  'proj.bvmt-analytics.desc': 'Application <strong>Streamlit</strong> multi-pages pour analyser la ' +
    '<strong>Bourse des Valeurs Mobilières de Tunis (BVMT)</strong>. Prédiction du cours des actions ' +
    '(AdaBoost, Gradient Boosting), classification du risque, clustering DBSCAN + UMAP, prévision des dividendes avec ' +
    '<strong>Prophet</strong>, sentiment de marché par web scraping et un <strong>chatbot RAG</strong> ' +
    '(LangChain + Llama2 + FAISS + embeddings HuggingFace). Données issues de MongoDB Atlas &#x2014; historique 2016&#x2013;2023.',
  'proj.anomaly-detection.title': 'Détection d’anomalies &amp; d’intrusions',
  'proj.anomaly-detection.desc': 'Utilise des <strong>modèles de mélange gaussien (GMM)</strong> pour la détection ' +
    'd’anomalies et un <strong>arbre de décision + K plus proches voisins (KNN)</strong> pour la détection ' +
    'd’intrusions sur le jeu de données <strong>NSL-KDD</strong>. Classe les attaques réseau en 4 catégories : ' +
    'DoS, U2R (User-to-Root), R2L (Remote-to-Local) et Probe.',
  'proj.time-series-fred.title': 'Séries temporelles &#x2014; Réserve fédérale (FRED)',
  'proj.time-series-fred.desc': 'Analyse en 3 phases de deux séries économiques FRED : ' +
    '<strong>ventes au détail &#x2014; librairies</strong> (MRTSSM451211USN) et <strong>mises en chantier de ' +
    'logements</strong> (HOUSTNENSA). Couvre l’exploration statistique, les tests de stationnarité (ADF / KPSS), ' +
    'la modélisation <strong>ARIMA / SARIMA</strong> et le diagnostic des résidus.',
  'proj.knowledge-graph.title': 'Graphe de connaissances &#x2014; deep learning pour la gestion de projet',
  'proj.knowledge-graph.desc': 'Système de deep learning utilisant <strong>PyTorch + RGCN</strong> (réseaux de ' +
    'convolution de graphes relationnels) pour la prédiction de liens, des <strong>embeddings BERT</strong> pour la ' +
    'représentation sémantique, la base vectorielle <strong>Pinecone</strong> pour la recherche par similarité, et ' +
    '<strong>GPT-4 Mini</strong> pour les questions-réponses en langage naturel sur des graphes de gestion de projet. ' +
    'Contributeur confirmé aux côtés d’ArafetMarnissi, saifzribi et Houssemeddine40.',
  'proj.devops-project.title': 'Projet DevOps &#x2014; Spring Boot &amp; Angular',
  'proj.devops-project.desc': 'Microservice <strong>Spring Boot</strong> (<code>tn.esprit.devops_project</code>) ' +
    'avec une chaîne DevOps complète : tests unitaires <strong>JUnit + Mockito</strong>, journalisation ' +
    '<strong>Log4j</strong>, supervision <strong>Prometheus + Grafana</strong> et conteneurisation ' +
    '<strong>Docker Compose</strong>. Associé à un frontend <strong>Angular 16</strong>. Collaboration à deux avec @amenidrira.',
  'proj.simple-api-logger.title': 'Simple API Logger',
  'proj.simple-api-logger.desc': 'Service REST <strong>FastAPI</strong> avec stockage <strong>SQLite</strong> et un ' +
    'middleware maison qui capture chaque requête (méthode, URL, corps, code de statut, temps de réponse). Tableau de ' +
    'bord <strong>Bootstrap 5 + Jinja2</strong> rafraîchi toutes les 5 s. Inclut un mécanisme <em>trigger500</em> pour ' +
    'tester la gestion d’erreurs. Endpoints : <code>POST /api/log</code>, <code>GET /api/logs</code>, <code>GET /api/stats</code>.',
  'proj.smart-real-estate.title': 'Application d’agence immobilière',
  'proj.smart-real-estate.desc': 'Projet d’équipe de développement d’un système de gestion immobilière intelligent ' +
    'avec annonces de biens, gestion d’agence et suivi client. Contribution collaborative au sein de l’équipe Armi64bit.',
  'proj.pidev.title': 'PiDev &#x2014; application web full-stack',
  'proj.pidev.desc': 'Projet intégratif ESPRIT 2022&#x2013;2023 &#x2014; <strong>ChariTeam</strong>, une plateforme ' +
    'caritative et de dons construite avec un backend <strong>Symfony / PHP</strong>, des templates <strong>Twig</strong> ' +
    'et un style <strong>SCSS/CSS</strong>. Docker Compose pour le déploiement. Répartition : CSS 41 %, SCSS 31 %, JS 14 %, Twig 8 %, PHP 6 %.',
  'proj.eschool.title': 'eSchool &#x2014; gestion scolaire',
  'proj.eschool.desc': 'Application web full-stack de gestion scolaire développée en <strong>PHP</strong> et ' +
    '<strong>Bootstrap 4</strong>. Couvre la gestion des élèves, le suivi des présences, les devoirs, les notes, les ' +
    'examens en ligne avec banque de questions et les emplois du temps. Opérations CRUD PHP sur MySQL.',
  'proj.pharmareport.title': 'PharmaReport &#x2014; reporting pharmaceutique',
  'proj.pharmareport.desc': 'Application web <strong>ASP.NET Core</strong> de reporting pharmaceutique, bâtie sur le ' +
    'patron MVC + Razor Pages. Comprend contrôleurs, modèles, vues, migrations Entity Framework Core et deux modules ' +
    'dédiés : <em>MedicalReport</em> et <em>ReportSheet</em> pour générer des documents pharmaceutiques structurés.',
  'proj.dotnet-core-training.title': 'Projet de formation .NET Core',
  'proj.dotnet-core-training.desc': 'Projet de formation / stage en <strong>C# .NET Core</strong> ' +
    '(<em>ProjectForStage</em>). Illustre l’architecture d’une application .NET Core, avec une solution Visual Studio ' +
    'structurée, réalisée dans le cadre d’un stage de perfectionnement.',
  'proj.javafx-sustainable.title': 'Développement durable &#x2014; JavaFX',
  'proj.javafx-sustainable.desc': 'Application de bureau <strong>JavaFX</strong> dédiée aux pratiques de développement ' +
    'durable. Projet d’équipe ESPRIT proposant une interface riche pour suivre et sensibiliser aux habitudes ' +
    'écoresponsables et aux objectifs durables.',
  'proj.hotel-nearest-places.title': 'Hotel Nearest Places',
  'proj.hotel-nearest-places.desc': 'API REST <strong>Flask</strong> qui trouve les points d’intérêt proches de ' +
    'n’importe quel hôtel grâce à <strong>Groq Llama 3</strong> pour le traitement du langage naturel, ' +
    '<strong>OpenRouteService</strong> pour les itinéraires, <strong>OpenWeatherMap</strong> pour la météo et ' +
    '<strong>Overpy/OSM</strong> pour les requêtes géographiques.',
  'proj.flight-rag-chatbot.title': 'Chatbot RAG &#x2014; factures de vols',
  'proj.flight-rag-chatbot.desc': 'Chatbot <strong>Streamlit</strong> utilisant la ' +
    '<strong>génération augmentée par récupération</strong> pour répondre aux questions sur des factures de vols. ' +
    'Construit avec <strong>LangChain</strong>, la base vectorielle <strong>ChromaDB</strong>, des embeddings ' +
    '<strong>HuggingFace</strong> et <strong>Groq Llama 3</strong> pour une inférence rapide.',
  'proj.minecraft-llm-bot.title': 'Bot Minecraft LLM',
  'proj.minecraft-llm-bot.desc': 'Bot de serveur Minecraft piloté par IA utilisant <strong>OpenRouter ' +
    '(Gemini 2.5 Flash)</strong> pour la compréhension du langage naturel. Se connecte via <strong>RCON</strong> pour ' +
    'exécuter des commandes en jeu, modérer le chat, animer des événements, construire des structures et répondre aux ' +
    'joueurs en langage naturel.',

  /* --- certifications --- */
  'cert.verify': '&#x2713; Vérifier le certificat &#x2192;',
  'cert.completed': '&#x2713; Attestation de réussite',

  /* --- contact --- */
  'contact.0': 'E-mail',
  'contact.1': 'LinkedIn',
  'contact.2': 'GitHub',
  'contact.3': 'Localisation',
  'form.name': 'Votre nom',
  'form.email': 'Votre e-mail',
  'form.message': 'Message',
  'form.submit': 'Envoyer le message',

  /* --- chatbot --- */
  'chat.name': 'Assistant IA d’Aziz',
  'chat.status': 'En ligne &mdash; propulsé par Gemini',
  'chat.greeting': '👋 Bonjour ! Je suis l’assistant IA d’Aziz. Posez-moi vos questions sur ses projets, ' +
    'ses compétences, son expérience ou ses certifications !',

  /* --- footer --- */
  'footer.built': 'Conçu &amp; développé par <strong>Mohamed Aziz Ben Romdhane</strong> &middot; ' +
    '<span id="footerYear">2026</span>',
};

/* Strings created by script.js at runtime rather than living in the HTML. */
const FR_DYN = {
  'type.0': 'Ingénieur IA &amp; Backend @ Worldsoft',
  'type.1': 'Concepteur de systèmes IA multi-agents',
  'type.2': 'Pipelines LLM · RAG · Agents vocaux',
  'type.3': 'Développeur FastAPI + LangGraph',
  'type.4': 'Élève ingénieur Data Science @ ESPRIT',
  'type.5': 'Développeur Python · Java · C#',
  'form.invalid': 'Merci de remplir correctement tous les champs.',
  'form.sending': 'Envoi en cours…',
  'form.sent': 'Merci ! Votre message est parti — je réponds généralement sous 24 h.',
  'form.mailto': 'Ouverture de votre client e-mail…',
  'form.failed': 'Impossible d’envoyer le message. Merci de réessayer.',
  'form.network': 'Erreur réseau — ouverture de votre client e-mail…',
  'chat.rate': 'Trop de messages — patientez une minute et réessayez.',
  'chat.error': 'Désolé, une erreur est survenue. Merci de réessayer dans un instant.',
  'chat.empty': 'Désolé, je n’ai pas pu générer de réponse.',
  'aria.openChat': 'Ouvrir l’assistant IA',
  'aria.closeChat': 'Fermer l’assistant IA',
  'aria.light': 'Passer en mode clair',
  'aria.dark': 'Passer en mode sombre',
};

const META = {
  en: {
    title: 'Mohamed Aziz Ben Romdhane | AI & Backend Engineer',
    desc: 'Software Engineer at Worldsoft and Data Science engineering student at ESPRIT. I build multi-agent AI systems, LLM pipelines and production backends.',
  },
  fr: {
    title: 'Mohamed Aziz Ben Romdhane | Ingénieur IA & Backend',
    desc: 'Ingénieur logiciel chez Worldsoft et élève ingénieur en Data Science à ESPRIT. Je conçois des systèmes IA multi-agents, des pipelines LLM et des backends de production.',
  },
};

/* Badges repeat across cards, so they resolve by content instead of by key. */
const BADGE_ALIASES = [
  [/Private/i, 'badge.private'],
  [/In Development/i, 'badge.wip'],
  [/Delivered/i, 'badge.delivered'],
  [/ESPRIT Team Project/i, 'badge.esprit'],
  [/Forked/i, 'badge.contrib'],
  [/Personal Project/i, 'badge.personal'],
];

const STORAGE_KEY = 'lang';
let current = 'en';

function resolve(key, el) {
  if (FR[key]) return FR[key];
  if (key.startsWith('badge.')) {
    const en = el.dataset.en || el.innerHTML;
    const hit = BADGE_ALIASES.find(([re]) => re.test(en));
    if (hit) return FR[hit[1]];
  }
  return null;
}

function apply(lang) {
  current = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
    if (lang === 'fr') {
      const fr = resolve(el.dataset.i18n, el);
      if (fr) el.innerHTML = fr;
    } else {
      el.innerHTML = el.dataset.en;
    }
  });

  // Placeholders are attributes, not content.
  const ph = {
    name: ['John Doe', 'Jean Dupont'],
    email: ['john@example.com', 'jean@exemple.com'],
    message: ["Hello! I'd like to talk about...", 'Bonjour ! Je souhaite échanger à propos de…'],
    chatbotInput: ['Ask about projects, skills, experience…', 'Posez une question sur les projets, compétences…'],
  };
  Object.entries(ph).forEach(([id, [en, fr]]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = lang === 'fr' ? fr : en;
  });

  const meta = META[lang];
  document.title = meta.title;
  const descTag = document.querySelector('meta[name="description"]');
  if (descTag) descTag.setAttribute('content', meta.desc);

  document.querySelectorAll('.lang-btn').forEach(b => {
    const isActive = b.dataset.lang === lang;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', String(isActive));
  });

  // The footer year is injected by script.js; re-rendering the footer wipes it.
  const year = document.getElementById('footerYear');
  if (year) year.textContent = String(new Date().getFullYear());

  localStorage.setItem(STORAGE_KEY, lang);
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

/** Translate a runtime string produced by script.js. */
window.T = (id, en) => (current === 'fr' && FR_DYN[id] ? FR_DYN[id] : en);
window.currentLang = () => current;

(function init() {
  // Saved choice wins; otherwise fall back to the browser's language.
  const saved = localStorage.getItem(STORAGE_KEY);
  const browserFr = (navigator.language || '').toLowerCase().startsWith('fr');
  const lang = saved === 'fr' || saved === 'en' ? saved : (browserFr ? 'fr' : 'en');

  document.addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (btn && btn.dataset.lang !== current) apply(btn.dataset.lang);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => apply(lang));
  } else {
    apply(lang);
  }
})();
