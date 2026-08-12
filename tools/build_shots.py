#!/usr/bin/env python3
"""Produce a card image for every project that can honestly have one.

Three kinds of image, in order of preference:

  ui      the project's own template rendered in a browser with sample data
  output  a real artefact the project produced (a knitted report, a notebook plot)
  code    a syntax-highlighted excerpt of a key source file

Company projects are deliberately excluded — their source is private and does
not belong on a public page. Empty repositories are excluded too.

Run from the repo root:  python tools/build_shots.py
Writes assets/screenshots/<slug>.png plus captions.json for build_pages.py.
"""

import base64
import io
import json
import os
import subprocess
import re
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "screenshots")
WORK = os.path.join(ROOT, ".shotwork")
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

os.makedirs(OUT, exist_ok=True)
os.makedirs(WORK, exist_ok=True)

# slug -> (owner, repo, branch, path, language, first_line, line_count, caption)
CODE = {
    "bvmt-analytics": ("benromdhaneaziz", "bvmt-analytics-platform", "main",
                       "pages_pi/Dividend.py", "python", 0, 38,
                       "Dividend forecasting page — Prophet fitted per company."),
    "flight-rag-chatbot": ("DefNotScreaMy", "flight-rag-chatbot", "main",
                           "rag_chain.py", "python", 0, 40,
                           "The retrieval chain: ChromaDB lookup feeding the Groq model."),
    "hotel-nearest-places": ("DefNotScreaMy", "hotel-nearest-places", "main",
                             "app.py", "python", 0, 42,
                             "Flask entry point — LLM geocoding then routing and weather."),
    "minecraft-llm-bot": ("DefNotScreaMy", "minecraft-llm-bot", "main",
                          "llm_handler.py", "python", 0, 40,
                          "The LLM handler that turns plain English into server commands."),
    "eschool": ("benromdhaneaziz", "eSchool", "main",
                "read.php", "php", 0, 40,
                "PHP CRUD reading student records out of MySQL."),
    "devops-project": ("benromdhaneaziz", "Devops-Project", "master",
                       "docker-compose.yml", "yaml", 0, 40,
                       "The compose stack: service, database, Prometheus and Grafana."),
    "knowledge-graph": ("benromdhaneaziz", "A_knowledge_graph_system_for_Project_Management", "main",
                        "research/link_prediction.py", "python", 0, 38,
                        "Link prediction over the knowledge graph."),
}

# slug -> (owner, repo, branch, html path, caption)  — real project output
REPORTS = {
    "time-series-fred": ("benromdhaneaziz", "Time-Series-Project-Federal-Reserve-Economic-Data-FRED-",
                         "main", "Retail Sales Book Stores.html",
                         "The project's own knitted report for the retail-sales series."),
}

# slug -> (owner, repo, branch, notebook path, caption) — first plot in the notebook
NOTEBOOKS = {
    "anomaly-detection": ("benromdhaneaziz", "Anomaly-Detection-and-Intrusion-Detection-System",
                          "main", "Anomaly Detection Using Gaussian Mixture Probability Model to Implement Intrusion Detection System.ipynb",
                          "A plot produced by the notebook itself."),
}


def fetch(owner, repo, branch, path):
    url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/" + urllib.parse.quote(path)
    req = urllib.request.Request(url, headers={"User-Agent": "portfolio-shots"})
    return urllib.request.urlopen(req, timeout=60).read()


def shoot(src_file, out_png, width=1280, height=860, budget=9000):
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
         "--force-device-scale-factor=2",
         f"--window-size={width},{height}",
         f"--screenshot={out_png}",
         f"--virtual-time-budget={budget}",
         "file:///" + src_file.replace("\\", "/")],
        capture_output=True,
    )
    return os.path.exists(out_png)


CODE_PAGE = """<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<style>
  html,body{margin:0;background:#0f0f13;font-family:Inter,system-ui,sans-serif}
  .win{margin:26px;border-radius:12px;overflow:hidden;border:1px solid #2e2e3a;
       box-shadow:0 24px 60px rgba(0,0,0,.5);background:#282c34}
  .bar{display:flex;align-items:center;gap:8px;padding:11px 16px;background:#21252b;
       border-bottom:1px solid #181a1f}
  .dot{width:11px;height:11px;border-radius:50%}
  .file{margin-left:10px;color:#9aa4b2;font-size:13px;font-family:"Fira Code",monospace}
  .lang{margin-left:auto;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
  pre{margin:0}
  code{font-family:"Fira Code",Consolas,monospace;font-size:13.5px;line-height:1.6;padding:18px 20px!important}
  .hljs{background:#282c34!important}
</style>
<div class="win">
  <div class="bar">
    <span class="dot" style="background:#ff5f57"></span>
    <span class="dot" style="background:#febc2e"></span>
    <span class="dot" style="background:#28c840"></span>
    <span class="file">__FILE__</span><span class="lang">__LANG__</span>
  </div>
  <pre><code class="language-__LANG__">__CODE__</code></pre>
</div>
<script>hljs.highlightAll();</script>
"""


def esc(text):
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_code_shot(slug, spec):
    owner, repo, branch, path, lang, start, count, caption = spec
    try:
        text = fetch(owner, repo, branch, path).decode("utf-8", "replace")
    except Exception as exc:                                    # noqa: BLE001
        print(f"  {slug:22} SKIP ({path}: {exc})")
        return None

    lines = text.replace("\t", "    ").splitlines()[start:start + count]
    while lines and not lines[0].strip():
        lines.pop(0)
    snippet = "\n".join(lines)

    page = (CODE_PAGE.replace("__FILE__", esc(os.path.basename(path)))
                     .replace("__LANG__", lang)
                     .replace("__CODE__", esc(snippet)))
    src = os.path.join(WORK, f"{slug}.html")
    io.open(src, "w", encoding="utf-8").write(page)

    out = os.path.join(OUT, f"{slug}.png")
    ok = shoot(src, out, 1180, 26 + 44 + len(lines) * 22 + 26, 6000)
    print(f"  {slug:22} {'code  ' + path if ok else 'FAILED'}")
    return caption if ok else None


def build_report_shot(slug, spec):
    """Pull the charts out of a knitted report — the top of the file is just
    library-loading noise, and one report also embeds a local file path."""
    owner, repo, branch, path, caption = spec
    try:
        html = fetch(owner, repo, branch, path).decode("utf-8", "replace")
    except Exception as exc:                                    # noqa: BLE001
        print(f"  {slug:22} SKIP ({exc})")
        return None

    plots = re.findall(r'<img[^>]+src="(data:image/[^"]+)"', html)
    if not plots:
        print(f"  {slug:22} SKIP (no embedded plots)")
        return None

    picked = plots[1:5] if len(plots) > 4 else plots[:4]
    page = ("<!doctype html><meta charset='utf-8'>"
            "<style>html,body{margin:0;background:#fff;font-family:Inter,system-ui,sans-serif}"
            ".grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:18px}"
            ".grid img{width:100%;height:auto;border:1px solid #e4e4e7;border-radius:8px}</style>"
            "<div class='grid'>" + "".join(f"<img src='{p}'>" for p in picked) + "</div>")
    src = os.path.join(WORK, f"{slug}.html")
    io.open(src, "w", encoding="utf-8").write(page)

    out = os.path.join(OUT, f"{slug}.png")
    ok = shoot(src, out, 1200, 820, 8000)
    print(f"  {slug:22} {'output ' + str(len(picked)) + ' plots from ' + path if ok else 'FAILED'}")
    return caption if ok else None


def build_notebook_shot(slug, spec):
    owner, repo, branch, path, caption = spec
    try:
        nb = json.loads(fetch(owner, repo, branch, path).decode("utf-8", "replace"))
    except Exception as exc:                                    # noqa: BLE001
        print(f"  {slug:22} SKIP ({exc})")
        return None

    # Collect every stored plot, then keep the one closest to a card-friendly
    # 16:9 — the first output is often a 39-panel grid that is unreadable small.
    best, best_score = None, None
    for cell in nb.get("cells", []):
        for output in cell.get("outputs", []):
            png = (output.get("data") or {}).get("image/png")
            if not png:
                continue
            raw = base64.b64decode(png)
            if len(raw) < 24 or raw[12:16] != b"IHDR":
                continue
            width = int.from_bytes(raw[16:20], "big")
            height = int.from_bytes(raw[20:24], "big")
            if width < 400 or height < 200:
                continue
            score = abs((width / height) - 16 / 9)
            if best_score is None or score < best_score:
                best, best_score = raw, score

    if not best:
        print(f"  {slug:22} SKIP (no usable plot outputs)")
        return None

    out = os.path.join(OUT, f"{slug}.png")
    open(out, "wb").write(best)
    print(f"  {slug:22} output plot from {os.path.basename(path)}")
    return caption


captions = {}

print("Reports:")
for slug, spec in REPORTS.items():
    cap = build_report_shot(slug, spec)
    if cap:
        captions[slug] = cap

print("Notebook outputs:")
for slug, spec in NOTEBOOKS.items():
    cap = build_notebook_shot(slug, spec)
    if cap:
        captions[slug] = cap

print("Code excerpts:")
for slug, spec in CODE.items():
    cap = build_code_shot(slug, spec)
    if cap:
        captions[slug] = cap

# The API Logger image is rendered from its own template with stubbed API data;
# that harness lives outside this script because it needs hand-written fixtures.
existing = os.path.join(OUT, "simple-api-logger.png")
if os.path.exists(existing):
    captions["simple-api-logger"] = (
        "The project's own dashboard template and JavaScript, rendered with sample log data."
    )

with open(os.path.join(OUT, "captions.json"), "w", encoding="utf-8") as fh:
    json.dump(captions, fh, indent=2, ensure_ascii=False)

print(f"\n{len(captions)} images in assets/screenshots/")
