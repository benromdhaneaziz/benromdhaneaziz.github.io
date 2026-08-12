/* Case-study page behaviour: theme toggle, footer year, and mermaid diagrams
   that re-render when the theme changes. */

/* ===== DARK MODE ===== */
(function () {
  const btn = document.getElementById('themeToggle');
  const DARK = 'dark';

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
    document.dispatchEvent(new CustomEvent('themechange', { detail: { dark: isDark } }));
  });
})();

/* ===== FOOTER YEAR ===== */
(function () {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = String(new Date().getFullYear());
})();

/* ===== ARCHITECTURE DIAGRAMS ===== */
(function () {
  const nodes = Array.from(document.querySelectorAll('.mermaid'));
  if (!nodes.length || typeof mermaid === 'undefined') return;

  // Keep the source: mermaid replaces the element's content with SVG, so a
  // re-render after a theme switch needs the original definition back.
  nodes.forEach(n => { n.dataset.src = n.textContent.trim(); });

  function render() {
    const dark = document.body.classList.contains('dark');
    mermaid.initialize({
      startOnLoad: false,
      theme: dark ? 'dark' : 'default',
      securityLevel: 'strict',
      flowchart: { curve: 'basis', padding: 16, useMaxWidth: true },
      themeVariables: dark
        ? { primaryColor: '#312e81', primaryTextColor: '#e0e7ff', lineColor: '#6366f1', fontSize: '14px' }
        : { primaryColor: '#eef2ff', primaryTextColor: '#1e1b4b', lineColor: '#6366f1', fontSize: '14px' },
    });

    nodes.forEach((n, i) => {
      n.removeAttribute('data-processed');
      n.textContent = n.dataset.src;
      n.id = 'mmd-' + i;
    });
    mermaid.run({ nodes });
  }

  render();
  document.addEventListener('themechange', render);
})();
