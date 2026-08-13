#!/usr/bin/env python3
"""Generate the project case-study pages from tools/projects.json.

Run from the repo root:   python tools/build_pages.py

Editing a page by hand will be overwritten on the next run — change
tools/projects.json instead.
"""

import html
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "tools", "projects.json")
DATA_FR = os.path.join(ROOT, "tools", "projects.fr.json")
OUT_DIR = os.path.join(ROOT, "projects")
SITE = "https://benromdhaneaziz-github-io.vercel.app"

# Every page is generated twice: English at /projects/<slug>.html and French at
# /projects/fr/<slug>.html. Long-form prose reads better as static text per
# language than as strings swapped at runtime.
UI = {
    "en": {
        "back": "&#8592; All projects",
        "overview": "Overview",
        "what": "What it does",
        "architecture": "Architecture",
        "stack": "Tech stack",
        "notes": "Notes &amp; decisions",
        "diagramNote": "Diagram drawn from the actual codebase.",
        "privateNote": "Private repository \u2014 code is not public.",
        "portfolio": "Portfolio",
        "footer": 'Designed &amp; built by <strong>Mohamed Aziz Ben Romdhane</strong> &middot; <span id="footerYear">2026</span>',
        "stackGroups": {},
        "types": {},
        "status": {},
    }
}

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


def plain(text):
    """First sentence, tag-free, for meta descriptions."""
    text = re.sub(r"\s+", " ", text).strip()
    return e(text[:180])


def build(slug, p, order, lang="en"):
    badge_class, _ = TYPE_LABELS.get(p["type"], ("", ""))
    ui = UI[lang]
    fr = lang == "fr"
    up = "../../" if fr else "../"      # path back to the site root
    here = "fr/" if fr else ""          # this language's page directory
    title = f'{p["title"]} — {p["tagline"]}'
    desc = plain(p["summary"][0])

    idx = order.index(slug)
    prev_slug = order[idx - 1] if idx > 0 else None
    next_slug = order[idx + 1] if idx < len(order) - 1 else None

    out = []
    add = out.append

    add("<!DOCTYPE html>")
    add(f'<html lang="{lang}">')
    add("<head>")
    add('  <meta charset="UTF-8" />')
    add('  <meta name="viewport" content="width=device-width, initial-scale=1.0" />')
    add(f"  <title>{e(title)} | Mohamed Aziz Ben Romdhane</title>")
    add(f'  <meta name="description" content="{desc}" />')
    add(f'  <link rel="canonical" href="{SITE}/projects/{here}{slug}.html" />')
    add(f'  <link rel="alternate" hreflang="en" href="{SITE}/projects/{slug}.html" />')
    add(f'  <link rel="alternate" hreflang="fr" href="{SITE}/projects/fr/{slug}.html" />')
    add('  <meta property="og:type" content="article" />')
    add(f'  <meta property="og:title" content="{e(title)}" />')
    add(f'  <meta property="og:description" content="{desc}" />')
    add(f'  <meta property="og:url" content="{SITE}/projects/{here}{slug}.html" />')
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
    add(f'  <link rel="stylesheet" href="{up}style.css" />')
    add(f'  <link rel="stylesheet" href="{up}projects/project.css" />' if fr
        else '  <link rel="stylesheet" href="project.css" />')
    add("</head>")
    add("<body>")

    # --- nav ---
    add('  <header class="navbar page-nav">')
    add('    <div class="nav-container">')
    add(f'      <a href="{up}index.html#projects" class="back-link">{ui["back"]}</a>')
    add('      <nav>')
    add(f'        <a href="{up}index.html" class="nav-logo">AZ.</a>')
    en_href = f'../{slug}.html' if fr else f'{slug}.html'
    fr_href = f'{slug}.html' if fr else f'fr/{slug}.html'
    add('        <div class="lang-switch" role="group" aria-label="Language / Langue">')
    add(f'          <a class="lang-btn{chr(32) + chr(97) + chr(99) + chr(116) + chr(105) + chr(118) + chr(101) if not fr else ""}" href="{en_href}" hreflang="en">EN</a>')
    add(f'          <a class="lang-btn{chr(32) + chr(97) + chr(99) + chr(116) + chr(105) + chr(118) + chr(101) if fr else ""}" href="{fr_href}" hreflang="fr">FR</a>')
    add('        </div>')
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
    type_label = ui["types"].get(p["type"], p["typeLabel"]) if fr and p["type"] != "company" else p["typeLabel"]
    add(f'        <span class="project-badge {badge_class}">{e(type_label)}</span>')
    if p.get("status"):
        add(f'        <span class="project-badge wip">{e(ui["status"].get(p["status"], p["status"]))}</span>')
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
        add(f'      <p class="repo-note">{ui["privateNote"]}</p>')

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


    add('      <section class="project-section">')
    add(f'        <h2>{ui["overview"]}</h2>')
    for para in p["summary"]:
        add(f"        <p>{e(para)}</p>")
    add("      </section>")

    if p.get("highlights"):
        add('      <section class="project-section">')
        add(f'        <h2>{ui["what"]}</h2>')
        add('        <ul class="highlight-list">')
        for h in p["highlights"]:
            add(f"          <li>{e(h)}</li>")
        add("        </ul>")
        add("      </section>")

    if p.get("architecture"):
        add('      <section class="project-section">')
        add(f'        <h2>{ui["architecture"]}</h2>')
        add('        <div class="diagram"><pre class="mermaid">')
        add(e(p["architecture"]))
        add("        </pre></div>")
        add(f'        <p class="diagram-note">{ui["diagramNote"]}</p>')
        add("      </section>")

    if p.get("stack"):
        add('      <section class="project-section">')
        add(f'        <h2>{ui["stack"]}</h2>')
        add('        <div class="stack-groups">')
        for group, items in p["stack"].items():
            add('          <div class="stack-group">')
            add(f'            <h3>{e(ui["stackGroups"].get(group, group))}</h3>')
            add('            <div class="skill-tags">')
            for it in items:
                add(f'              <span class="skill-tag">{e(it)}</span>')
            add("            </div>")
            add("          </div>")
        add("        </div>")
        add("      </section>")

    if p.get("notes"):
        add('      <section class="project-section">')
        add(f'        <h2>{ui["notes"]}</h2>')
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
    add(f'      <p>{ui["footer"]}</p>')
    add('      <div class="footer-links">')
    add(f'        <a href="{up}index.html">{ui["portfolio"]}</a>')
    add('        <a href="https://github.com/benromdhaneaziz" target="_blank" rel="noopener">GitHub</a>')
    add('        <a href="mailto:Benromdhane.Aziz@esprit.tn">Email</a>')
    add("      </div>")
    add("    </div>")
    add("  </footer>")

    if p.get("architecture"):
        add('  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>')
    add(f'  <script src="{up}projects/project.js"></script>' if fr
        else '  <script src="project.js"></script>')
    add("</body>")
    add("</html>")
    return "\n".join(out) + "\n"


with open(DATA, encoding="utf-8") as fh:
    DATA_CACHE = json.load(fh)

with open(DATA_FR, encoding="utf-8") as fh:
    FR_DATA = json.load(fh)

UI["fr"] = FR_DATA.pop("_ui")


def french(slug, base):
    """English project merged with its French copy; untranslated keys fall back."""
    tr = FR_DATA.get(slug)
    if not tr:
        return None
    merged = dict(base)
    for key in ("tagline", "summary", "highlights", "notes"):
        if tr.get(key):
            merged[key] = tr[key]
    labels = tr.get("metrics") or []
    if labels and base.get("metrics"):
        merged["metrics"] = [
            {"value": m["value"], "label": labels[i] if i < len(labels) else m["label"]}
            for i, m in enumerate(base["metrics"])
        ]
    return merged


order = list(DATA_CACHE.keys())
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(os.path.join(OUT_DIR, "fr"), exist_ok=True)

written = untranslated = 0
for slug, project in DATA_CACHE.items():
    with open(os.path.join(OUT_DIR, f"{slug}.html"), "w", encoding="utf-8") as fh:
        fh.write(build(slug, project, order, "en"))
    written += 1

    fr_project = french(slug, project)
    if fr_project:
        with open(os.path.join(OUT_DIR, "fr", f"{slug}.html"), "w", encoding="utf-8") as fh:
            fh.write(build(slug, fr_project, order, "fr"))
        written += 1
    else:
        untranslated += 1
        print(f"  {slug}: no French content")

print(f"\n{written} pages written ({untranslated} without a French version)")

# --- sitemap: the landing page plus both language versions of every study ---
sitemap = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
           '        xmlns:xhtml="http://www.w3.org/1999/xhtml">']


def sm_entry(loc, en_url, fr_url, priority):
    sitemap.append("  <url>")
    sitemap.append(f"    <loc>{loc}</loc>")
    sitemap.append(f'    <xhtml:link rel="alternate" hreflang="en" href="{en_url}" />')
    sitemap.append(f'    <xhtml:link rel="alternate" hreflang="fr" href="{fr_url}" />')
    sitemap.append("    <changefreq>monthly</changefreq>")
    sitemap.append(f"    <priority>{priority}</priority>")
    sitemap.append("  </url>")


sm_entry(f"{SITE}/", f"{SITE}/", f"{SITE}/", "1.0")
for slug in order:
    en_url = f"{SITE}/projects/{slug}.html"
    fr_url = f"{SITE}/projects/fr/{slug}.html"
    sm_entry(en_url, en_url, fr_url, "0.8")
    if os.path.exists(os.path.join(OUT_DIR, "fr", f"{slug}.html")):
        sm_entry(fr_url, en_url, fr_url, "0.6")
sitemap.append("</urlset>")

with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as fh:
    fh.write("\n".join(sitemap) + "\n")

print(f"sitemap.xml: {sum(1 for line in sitemap if line.strip().startswith('<loc>'))} urls")
