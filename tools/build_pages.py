#!/usr/bin/env python3
"""Generate the project case-study pages from tools/projects.json.

Run from the repo root:   python tools/build_pages.py

Editing a page by hand will be overwritten on the next run — change
tools/projects.json instead. A screenshot dropped at
assets/screenshots/<slug>.png (or .jpg/.webp) is picked up automatically.
"""

import html
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "tools", "projects.json")
OUT_DIR = os.path.join(ROOT, "projects")
SHOTS_DIR = os.path.join(ROOT, "assets", "screenshots")
SITE = "https://benromdhaneaziz-github-io.vercel.app"

TYPE_LABELS = {
    "company": ("company", "🏢"),
    "internship": ("private", "🎓"),
    "school": ("contrib", "🏫"),
    "personal": ("", "🧪"),
}

FAVICON = (
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E"
    "%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234f46e5'/%3E"
    "%3Cstop offset='.5' stop-color='%237c3aed'/%3E%3Cstop offset='1' stop-color='%2306b6d4'/%3E"
    "%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='14' fill='url(%23g)'/%3E"
    "%3Ctext x='32' y='44' font-family='Inter,Arial,sans-serif' font-size='32' font-weight='800'"
    " fill='%23fff' text-anchor='middle'%3EAZ%3C/text%3E%3C/svg%3E"
)


def e(text):
    return html.escape(str(text), quote=False)


def find_screenshot(slug):
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        rel = f"assets/screenshots/{slug}{ext}"
        if os.path.exists(os.path.join(ROOT, rel.replace("/", os.sep))):
            return "../" + rel
    return None


def plain(text):
    """First sentence, tag-free, for meta descriptions."""
    text = re.sub(r"\s+", " ", text).strip()
    return e(text[:180])


def build(slug, p, order):
    badge_class, _ = TYPE_LABELS.get(p["type"], ("", ""))
    title = f'{p["title"]} — {p["tagline"]}'
    desc = plain(p["summary"][0])
    shot = find_screenshot(slug)

    idx = order.index(slug)
    prev_slug = order[idx - 1] if idx > 0 else None
    next_slug = order[idx + 1] if idx < len(order) - 1 else None

    out = []
    add = out.append

    add("<!DOCTYPE html>")
    add('<html lang="en">')
    add("<head>")
    add('  <meta charset="UTF-8" />')
    add('  <meta name="viewport" content="width=device-width, initial-scale=1.0" />')
    add(f"  <title>{e(title)} | Mohamed Aziz Ben Romdhane</title>")
    add(f'  <meta name="description" content="{desc}" />')
    add(f'  <link rel="canonical" href="{SITE}/projects/{slug}.html" />')
    add('  <meta property="og:type" content="article" />')
    add(f'  <meta property="og:title" content="{e(title)}" />')
    add(f'  <meta property="og:description" content="{desc}" />')
    add(f'  <meta property="og:url" content="{SITE}/projects/{slug}.html" />')
    add('  <meta name="theme-color" content="#4f46e5" />')
    add(f'  <link rel="icon" href="{FAVICON}" />')
    add("""  <script>
    (function () {
      var CANONICAL_ORIGIN = 'https://benromdhaneaziz-github-io.vercel.app';
      if (location.hostname.indexOf('github.io') !== -1) {
        location.replace(CANONICAL_ORIGIN + location.pathname + location.search + location.hash);
      }
    })();
  </script>""")
    add('  <link rel="preconnect" href="https://fonts.googleapis.com" />')
    add('  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />')
    add('  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />')
    add('  <link rel="stylesheet" href="../style.css" />')
    add('  <link rel="stylesheet" href="project.css" />')
    add("</head>")
    add("<body>")

    # --- nav ---
    add('  <header class="navbar page-nav">')
    add('    <div class="nav-container">')
    add('      <a href="../index.html#projects" class="back-link">&#8592; All projects</a>')
    add('      <nav>')
    add('        <a href="../index.html" class="nav-logo">AZ.</a>')
    add('        <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">')
    add('          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>')
    add('          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>')
    add('        </button>')
    add('      </nav>')
    add('    </div>')
    add('  </header>')

    # --- hero ---
    add('  <section class="project-hero">')
    add('    <div class="container">')
    add('      <div class="hero-badges">')
    add(f'        <span class="project-badge {badge_class}">{e(p["typeLabel"])}</span>')
    if p.get("status"):
        add(f'        <span class="project-badge wip">{e(p["status"])}</span>')
    add("      </div>")
    if p.get("period"):
        add(f'      <p class="hero-meta">{e(p["period"])}</p>')
    add(f'      <h1><span class="hero-icon">{p["icon"]}</span>{e(p["title"])}</h1>')
    add(f'      <p class="tagline">{e(p["tagline"])}</p>')

    links = p.get("links") or []
    if links:
        add('      <div class="hero-links">')
        for ln in links:
            add(f'        <a class="btn btn-secondary" href="{e(ln["url"])}" target="_blank" rel="noopener">{e(ln["label"])} &#8599;</a>')
        add("      </div>")
    else:
        add('      <p class="shot-caption" style="text-align:left">Private repository — code is not public.</p>')

    metrics = p.get("metrics") or []
    if metrics:
        add('      <div class="metrics-strip">')
        for m in metrics:
            add(f'        <div class="metric-box"><b>{e(m["value"])}</b><span>{e(m["label"])}</span></div>')
        add("      </div>")
    add("    </div>")
    add("  </section>")

    # --- body ---
    add('  <main class="project-body">')
    add('    <div class="container">')

    if shot:
        add('      <section class="project-section">')
        add('        <div class="project-shot">')
        add(f'          <img src="{shot}" alt="{e(p["title"])} interface" loading="lazy" />')
        add("        </div>")
        add('        <p class="shot-caption">The application in use.</p>')
        add("      </section>")

    add('      <section class="project-section">')
    add("        <h2>Overview</h2>")
    for para in p["summary"]:
        add(f"        <p>{e(para)}</p>")
    add("      </section>")

    if p.get("highlights"):
        add('      <section class="project-section">')
        add("        <h2>What it does</h2>")
        add('        <ul class="highlight-list">')
        for h in p["highlights"]:
            add(f"          <li>{e(h)}</li>")
        add("        </ul>")
        add("      </section>")

    if p.get("architecture"):
        add('      <section class="project-section">')
        add("        <h2>Architecture</h2>")
        add('        <div class="diagram"><pre class="mermaid">')
        add(e(p["architecture"]))
        add("        </pre></div>")
        add('        <p class="diagram-note">Diagram drawn from the actual codebase.</p>')
        add("      </section>")

    if p.get("stack"):
        add('      <section class="project-section">')
        add("        <h2>Tech stack</h2>")
        add('        <div class="stack-groups">')
        for group, items in p["stack"].items():
            add('          <div class="stack-group">')
            add(f"            <h3>{e(group)}</h3>")
            add('            <div class="skill-tags">')
            for it in items:
                add(f'              <span class="skill-tag">{e(it)}</span>')
            add("            </div>")
            add("          </div>")
        add("        </div>")
        add("      </section>")

    if p.get("notes"):
        add('      <section class="project-section">')
        add("        <h2>Notes &amp; decisions</h2>")
        for n in p["notes"]:
            add('        <div class="note-card">')
            add(f'          <h3>{e(n["title"])}</h3>')
            add(f'          <p>{e(n["body"])}</p>')
            add("        </div>")
        add("      </section>")

    add('      <nav class="project-footer-nav">')
    if prev_slug:
        add(f'        <a class="btn btn-secondary" href="{prev_slug}.html">&#8592; {e(DATA_CACHE[prev_slug]["title"])}</a>')
    else:
        add("        <span></span>")
    if next_slug:
        add(f'        <a class="btn btn-secondary" href="{next_slug}.html">{e(DATA_CACHE[next_slug]["title"])} &#8594;</a>')
    add("      </nav>")

    add("    </div>")
    add("  </main>")

    add('  <footer class="footer">')
    add('    <div class="container">')
    add('      <p>Designed &amp; built by <strong>Mohamed Aziz Ben Romdhane</strong> &middot; <span id="footerYear">2026</span></p>')
    add('      <div class="footer-links">')
    add('        <a href="../index.html">Portfolio</a>')
    add('        <a href="https://github.com/benromdhaneaziz" target="_blank" rel="noopener">GitHub</a>')
    add('        <a href="mailto:Benromdhane.Aziz@esprit.tn">Email</a>')
    add("      </div>")
    add("    </div>")
    add("  </footer>")

    if p.get("architecture"):
        add('  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>')
    add('  <script src="project.js"></script>')
    add("</body>")
    add("</html>")
    return "\n".join(out) + "\n"


with open(DATA, encoding="utf-8") as fh:
    DATA_CACHE = json.load(fh)

order = list(DATA_CACHE.keys())
os.makedirs(OUT_DIR, exist_ok=True)

written = 0
for slug, project in DATA_CACHE.items():
    path = os.path.join(OUT_DIR, f"{slug}.html")
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(build(slug, project, order))
    written += 1
    shot = find_screenshot(slug)
    print(f"  {slug:24} {'[screenshot]' if shot else ''}")

print(f"\n{written} pages written to projects/")
