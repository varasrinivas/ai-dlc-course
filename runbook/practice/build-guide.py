"""Build guide.html: the whole practice kit as one standalone page.

The Markdown files stay the source. Edit them, then run:

    python runbook/practice/build-guide.py

The page needs no other file. It loads only Google Fonts, and every link between cards
becomes an in-page anchor.
"""
import datetime
import html
import posixpath
import re
from pathlib import Path

import markdown

HERE = Path(__file__).resolve().parent
OUT = HERE / "guide.html"

# (anchor id, short label for the contents list, source file relative to practice/)
SECTIONS = [
    ("start", "Start here", "README.md"),
    ("begin", "Before you begin", "walkthrough/00-before-you-begin.md"),
    *[(f"step-{p.name[:2]}", None, f"steps/{p.name}") for p in sorted((HERE / "steps").glob("[0-9][0-9]-*.md"))],
    ("answers", "Mob answer sheet", "answers/mob-answer-sheet.md"),
    ("extensions", "Learning helpers", "extensions/README.md"),
    ("run-notes", "Reference run notes", "reference-run/RUN-NOTES.md"),
]


def card_names():
    # The README's path table already names each card briefly: "| 01 | [Workspace](steps/01-...md) |".
    readme = (HERE / "README.md").read_text(encoding="utf-8")
    return dict(re.findall(r"\[([^\]]+)\]\((steps/[^)]+\.md)\)", readme))
    # -> {"Workspace": "steps/01-workspace.md", ...}; inverted in main()


def rewrite_links(body, src, anchors):
    src_dir = posixpath.dirname(src)

    def fix(m):
        href = html.unescape(m.group(1))
        if re.match(r"^[a-z]+:|^#", href):
            return m.group(0)
        path, _, frag = href.partition("#")
        target = posixpath.normpath(posixpath.join(src_dir, path)) if path else src
        if target in anchors:
            new = "#" + anchors[target]
        elif target.startswith("../"):
            new = target + ("#" + frag if frag else "")
        else:
            # A kit file with no section of its own (seed/, extensions/...): link the file.
            new = target + ("/" if path.endswith("/") else "") + ("#" + frag if frag else "")
        return f'href="{html.escape(new)}"'

    return re.sub(r'href="([^"]+)"', fix, body)


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def render(sec_id, src, anchors):
    text = (HERE / src).read_text(encoding="utf-8")
    m = re.match(r"#\s+(.+)\n", text)
    title = m.group(1).strip() if m else src
    text = text[m.end():] if m else text
    body = markdown.markdown(text, extensions=["tables", "fenced_code", "sane_lists"])
    # The section owns the h2; the file's own headings move down one level.
    body = re.sub(r"<(/?)h([2-5])>", lambda h: f"<{h.group(1)}h{int(h.group(2)) + 1}>", body)
    body = re.sub(
        r"<h([34])>(.+?)</h\1>",
        lambda h: f'<h{h.group(1)} id="{sec_id}-{slug(re.sub("<[^>]+>", "", h.group(2)))}">{h.group(2)}</h{h.group(1)}>',
        body,
    )
    body = rewrite_links(body, src, anchors)
    return title, body


def walkthrough_for(sec_id, src, anchors):
    """Split walkthrough/NN-*.md into its h3 parts: {"background": html, "in-the-reference-workspace": html}."""
    wt = f"walkthrough/{posixpath.basename(src)}"
    if not src.startswith("steps/") or not (HERE / wt).exists():
        return {}
    _, body = render(sec_id, wt, anchors)
    parts = re.split(r'(?=<h3 id=")', body)
    out = {}
    for p in parts:
        m = re.match(r'<h3 id="[^"]*?-(background|in-the-reference-workspace)"', p)
        if m:
            label = "Background" if m.group(1) == "background" else "In the reference workspace"
            out[m.group(1)] = re.sub(r"^<h3 ", f'<h3 class="wt" data-wt="{label}" ', p)
    return out


def merge_walkthrough(sec_id, body, wt):
    # Background opens the card; the real workspace goes right after "Do it".
    if "background" in wt:
        body = wt["background"] + body
    if "in-the-reference-workspace" in wt:
        ws = wt["in-the-reference-workspace"]
        if not re.sub(r"<h3.*?</h3>|<!--.*?-->|\s", "", ws, flags=re.S):
            wt["in-the-reference-workspace"] = ws + (
                "<p><em>The reference run hasn't reached this step yet. Its real workspace, "
                "commands and output will appear here when it does.</em></p>")
        anchor = f'<h3 id="{sec_id}-what-you-ll-see"'
        body = body.replace(anchor, wt["in-the-reference-workspace"] + anchor, 1) if anchor in body \
            else body + wt["in-the-reference-workspace"]
    return body


def main():
    present = [(i, l, s) for i, l, s in SECTIONS if (HERE / s).exists()]
    anchors = {s: i for i, _, s in present}
    anchors["reference-run/RUN-NOTES.md"] = anchors.get("reference-run/RUN-NOTES.md", "run-notes")

    names = {src: name for name, src in card_names().items()}
    toc, parts = [], []
    for sec_id, label, src in present:
        title, body = render(sec_id, src, anchors)
        body = merge_walkthrough(sec_id, body, walkthrough_for(sec_id, src, anchors))
        is_step = sec_id.startswith("step-")
        num = sec_id[5:] if is_step else ""
        label = label or names.get(src, title)
        if sec_id == "answers":
            toc.append('<li class="sep" aria-hidden="true"></li>')
        toc.append(
            f'<li><a href="#{sec_id}"><span class="n">{num or "·"}</span>{html.escape(label)}</a></li>'
        )
        kicker = f'<div class="sec-k">Step {num}</div>' if is_step else ""
        heading = html.escape(re.sub(r"^Step \d+ — ", "", title))
        parts.append(
            f'<section class="block" id="{sec_id}">{kicker}<h2>{heading}</h2>'
            f'<div class="panel card">{body}</div></section>'
        )

    if not (HERE / "reference-run/RUN-NOTES.md").exists():
        toc.append('<li class="sep" aria-hidden="true"></li>')
        toc.append('<li><a href="#run-notes"><span class="n">·</span>Reference run notes</a></li>')
        parts.append(
            '<section class="block" id="run-notes"><h2>Reference run notes</h2><div class="panel card">'
            "<p>The reference run is still in progress. Its gate-by-gate notes will appear here "
            "when it is committed to <code>reference-run/</code>.</p></div></section>"
        )

    built = datetime.date.today().isoformat()
    page = TEMPLATE.replace("{{TOC}}", "\n".join(toc)).replace("{{BODY}}", "\n".join(parts)).replace("{{BUILT}}", built)
    OUT.write_text(page, encoding="utf-8", newline="\n")
    print(f"wrote {OUT.relative_to(HERE.parent.parent)} ({len(page):,} bytes, {len(present)} sections)")


TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Multi-repo practice guide</title>
<meta name="description" content="Run the multi-repo Prior Auth feature through AWS AI-DLC v2 yourself: ten step cards, the mob answer sheet, the learning helpers and what the reference run produced.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230d9488'/%3E%3Ctext x='16' y='23' font-family='monospace' font-size='19' font-weight='700' fill='white' text-anchor='middle'%3EP%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
/* Tokens match runbook/multi-repo-feature.html, so the guide reads as part of the course. */
:root{
  --paper:#f3f5f8; --panel:#ffffff; --ink:#16202e; --ink-soft:#4b5a6e; --line:#dde3ec;
  --accent:#0d9488; --t5:#1d4ed8; --warn:#be185d;
  --tint:#fafbfd; --tint2:#eef1f6; --code-bg:#e7ebf2; --pre:#16202e; --pre-ink:#e6edf7;
  --radius:10px;
  --font-display:"Fraunces",serif;
  --font-body:"Inter",system-ui,sans-serif;
  --font-mono:"JetBrains Mono",monospace;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --paper:#0f141c; --panel:#161d28; --ink:#e3e9f2; --ink-soft:#9aa8bb; --line:#2a3546;
    --accent:#2dd4bf; --t5:#8ab4ff; --warn:#f472b6;
    --tint:#131a24; --tint2:#1d2633; --code-bg:#243043; --pre:#0a0e14; --pre-ink:#e6edf7;
  }
}
:root[data-theme="dark"]{
  --paper:#0f141c; --panel:#161d28; --ink:#e3e9f2; --ink-soft:#9aa8bb; --line:#2a3546;
  --accent:#2dd4bf; --t5:#8ab4ff; --warn:#f472b6;
  --tint:#131a24; --tint2:#1d2633; --code-bg:#243043; --pre:#0a0e14; --pre-ink:#e6edf7;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}}
body{font-family:var(--font-body);background:var(--paper);color:var(--ink);line-height:1.65;font-size:16px}
a{color:var(--t5)}
button{font-family:inherit;cursor:pointer}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

.top{background:#16202e;color:#e8edf5;padding:34px 16px 30px}
.top-in{max-width:1180px;margin:0 auto}
.kicker{font-family:var(--font-mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:#5eead4}
.top h1{font-family:var(--font-display);font-weight:700;font-size:clamp(1.7rem,4.4vw,2.6rem);line-height:1.15;margin:10px 0 12px;color:#fff;text-wrap:balance}
.top p{max-width:760px;color:#c3cede}
.top a{color:#9ec5ff}
.facts{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.fact{border:1px solid #33435a;border-radius:8px;padding:8px 12px;min-width:0}
.fact b{display:block;font-family:var(--font-display);font-size:1.25rem;color:#fff;line-height:1.2}
.fact span{font-family:var(--font-mono);font-size:.62rem;letter-spacing:.08em;text-transform:uppercase;color:#9fb0c6}
.theme{float:right;background:none;border:1px solid #33435a;color:#c3cede;border-radius:6px;padding:4px 10px;font-size:.75rem}

.wrap{max-width:1180px;margin:0 auto;padding:0 16px;display:grid;grid-template-columns:240px minmax(0,1fr);gap:36px}
.toc{position:sticky;top:0;align-self:start;max-height:100vh;overflow-y:auto;padding:26px 0 30px}
.toc-h{font-family:var(--font-mono);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:8px}
.toc ol{list-style:none;margin:0}
.toc li{margin:0}
.toc a{display:flex;gap:8px;align-items:baseline;text-decoration:none;color:var(--ink-soft);font-size:.84rem;padding:5px 8px;border-radius:6px;border-left:3px solid transparent}
.toc a:hover{background:var(--tint2);color:var(--ink)}
.toc a.on{color:var(--ink);background:var(--panel);border-left-color:var(--accent)}
.toc .n{font-family:var(--font-mono);font-size:.68rem;color:var(--ink-soft);min-width:20px}
.toc .sep{height:1px;background:var(--line);margin:8px 0}
.main{min-width:0;padding:26px 0 80px}
@media (max-width:900px){
  .wrap{grid-template-columns:minmax(0,1fr);gap:0}
  .toc{position:static;max-height:none;padding:16px 0 0}
  .toc ol{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px}
  .toc li{flex:0 0 auto}
  .toc a{border-left:none;border:1px solid var(--line);background:var(--panel);white-space:nowrap}
  .toc .sep{display:none}
}

h2{font-family:var(--font-display);font-weight:600;font-size:1.6rem;line-height:1.25;margin:0 0 12px;text-wrap:balance}
h3{font-family:var(--font-display);font-weight:600;font-size:1.15rem;margin:26px 0 8px;padding-top:14px;border-top:1px solid var(--line)}
.card > h3:first-child{margin-top:0;padding-top:0;border-top:none}
h4{font-family:var(--font-display);font-weight:600;font-size:1rem;margin:18px 0 6px}
p{margin:0 0 12px}
ul,ol{margin:0 0 12px 22px}
li{margin:3px 0}
li > ul,li > ol{margin-bottom:4px}
pre{background:var(--pre);color:var(--pre-ink);border-radius:var(--radius);padding:16px 18px;overflow-x:auto;font-family:var(--font-mono);font-size:.8rem;line-height:1.6;margin:12px 0;position:relative}
code{font-family:var(--font-mono);font-size:.85em;background:var(--code-bg);border-radius:4px;padding:1px 5px;overflow-wrap:anywhere}
pre code{background:none;padding:0;overflow-wrap:normal;color:inherit}
pre{max-height:36em;overflow-y:auto}
h3.wt{color:var(--accent)}
h4{scroll-margin-top:12px}
blockquote{border-left:3px solid var(--accent);background:var(--tint);padding:10px 16px;margin:12px 0;color:var(--ink-soft);border-radius:0 8px 8px 0}
blockquote p:last-child{margin-bottom:0}
.card > blockquote:first-child{font-family:var(--font-mono);font-size:.74rem;letter-spacing:.02em;border-left-color:var(--t5)}
table{border-collapse:collapse;width:100%;margin:12px 0;font-size:.88rem;display:block;overflow-x:auto}
th,td{border:1px solid var(--line);padding:7px 10px;text-align:left;vertical-align:top}
th{background:var(--tint2);font-weight:600}
.block{margin:0 0 46px;scroll-margin-top:12px}
.sec-k{font-family:var(--font-mono);font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:4px}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:22px 24px}
@media (max-width:600px){.panel{padding:18px 16px}}

.copy{position:absolute;top:8px;right:8px;background:#2a3a52;color:#dbe6f5;border:none;border-radius:6px;font-size:.7rem;padding:3px 9px;opacity:.85}
.copy:hover{opacity:1}
.tabs{margin:12px 0}
.tabs [role=tablist]{display:flex;gap:4px}
.tabs [role=tab]{background:var(--tint2);color:var(--ink-soft);border:1px solid var(--line);border-bottom:none;border-radius:8px 8px 0 0;padding:5px 12px;font-size:.78rem;font-family:var(--font-mono)}
.tabs [role=tab][aria-selected=true]{background:var(--pre);color:var(--pre-ink);border-color:var(--pre)}
.tabs pre{margin-top:0;border-top-left-radius:0}
footer{color:var(--ink-soft);font-size:.8rem;border-top:1px solid var(--line);padding-top:16px}
@media print{.toc,.copy,.theme{display:none}.wrap{display:block}.tabs [role=tabpanel][hidden]{display:block}}
</style>
</head>
<body>
<header class="top"><div class="top-in">
  <button class="theme" type="button" id="theme">Theme</button>
  <div class="kicker">AI-DLC course · practice kit</div>
  <h1>Run the multi-repo feature yourself</h1>
  <p>One Prior Auth feature (urgent requests get a 72-hour decision clock) taken through AWS AI-DLC v2 across
  <code>prior-auth-api</code>, <code>prior-auth-web</code> and a new <code>prior-auth-notify</code>. This page is the whole
  kit in one file: the ten step cards, the answer sheet for playing the room, the learning helpers, and what the reference
  run produced. Each step shows what the workspace, the commands and the engine really looked like, quoted from a real run,
  so you can follow it without the <a href="../multi-repo-feature.html">runbook</a> open beside you.</p>
  <div class="facts">
    <div class="fact"><b>10</b><span>step cards</span></div>
    <div class="fact"><b>3</b><span>repos, 1 hub</span></div>
    <div class="fact"><b>5 · 33</b><span>phases · stages</span></div>
    <div class="fact"><b>v2.11</b><span>aidlc engine</span></div>
  </div>
</div></header>
<div class="wrap">
  <nav class="toc" aria-label="Contents"><div class="toc-h">Contents</div><ol>
{{TOC}}
  </ol></nav>
  <main class="main">
{{BODY}}
<footer>Built {{BUILT}} from the Markdown in <code>runbook/practice/</code> by <code>build-guide.py</code>.
Edit the Markdown, then re-run the script; don't edit this page by hand.</footer>
  </main>
</div>
<script>
(function(){
  var root=document.documentElement, btn=document.getElementById('theme');
  // Session-only, like the course: no browser storage.
  btn.addEventListener('click',function(){
    var dark=root.getAttribute('data-theme')==='dark'||(!root.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-theme',dark?'light':'dark');
  });

  // Claude Code / Codex CLI blocks that sit side by side become tabs.
  function engine(pre){var t=pre.textContent.trimStart(); return t.indexOf('# Claude Code')===0?'Claude Code':t.indexOf('# Codex CLI')===0?'Codex CLI':null;}
  var n=0;
  document.querySelectorAll('.card pre').forEach(function(pre){
    if(!pre.isConnected||pre.closest('.tabs')||engine(pre)!=='Claude Code') return;
    var next=pre.nextElementSibling;
    if(!next||next.tagName!=='PRE'||engine(next)!=='Codex CLI') return;
    var box=document.createElement('div'); box.className='tabs';
    var list=document.createElement('div'); list.setAttribute('role','tablist');
    box.appendChild(list); pre.parentNode.insertBefore(box,pre);
    [pre,next].forEach(function(p,i){
      var id='tab'+(++n), tab=document.createElement('button');
      tab.type='button'; tab.setAttribute('role','tab'); tab.id=id+'-t'; tab.textContent=engine(p);
      tab.setAttribute('aria-controls',id); tab.setAttribute('aria-selected',i===0?'true':'false');
      p.id=id; p.setAttribute('role','tabpanel'); p.setAttribute('aria-labelledby',id+'-t'); if(i) p.hidden=true;
      list.appendChild(tab); box.appendChild(p);
      tab.addEventListener('click',function(){
        list.querySelectorAll('[role=tab]').forEach(function(t){t.setAttribute('aria-selected',t===tab?'true':'false');});
        box.querySelectorAll('[role=tabpanel]').forEach(function(q){q.hidden=q!==p;});
      });
    });
  });

  document.querySelectorAll('pre').forEach(function(pre){
    var b=document.createElement('button'); b.type='button'; b.className='copy'; b.textContent='Copy';
    b.addEventListener('click',function(){
      var text=pre.querySelector('code')?pre.querySelector('code').textContent:pre.textContent;
      navigator.clipboard.writeText(text).then(function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy';},1200);});
    });
    pre.appendChild(b);
  });

  // The tabs above changed the layout, so the browser's jump to #anchor missed. Jump again.
  function toHash(){var t=location.hash&&document.getElementById(decodeURIComponent(location.hash.slice(1))); if(t) t.scrollIntoView({behavior:'instant'});}
  toHash(); if(document.fonts) document.fonts.ready.then(toHash);

  var links=[].slice.call(document.querySelectorAll('.toc a'));
  var obs=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id);}); } });
  },{rootMargin:'-20% 0px -70% 0px'});
  document.querySelectorAll('section.block').forEach(function(s){obs.observe(s);});
})();
</script>
</body>
</html>
"""

if __name__ == "__main__":
    main()
