import re
import json
import pandas as pd
import math
import unicodedata

print("Reading Excel data...")
chapters = pd.read_excel("Adorsho_Poribar_Database.xlsx", sheet_name="Chapters")
sections = pd.read_excel("Adorsho_Poribar_Database.xlsx", sheet_name="Sections")
contents = pd.read_excel("Adorsho_Poribar_Database.xlsx", sheet_name="Content")

# Build structured data: chapter -> sections -> content
book_data = []

for _, ch in chapters.iterrows():
    ch_id = ch["chapter_id"]
    chapter_obj = {
        "id": int(ch_id),
        "title": ch["title"],
        "intro_content": [],  # content directly under chapter (no section)
        "sections": []
    }

    # Get content with no section (intro to chapter)
    intro = contents[(contents["chapter_id"] == ch_id) & (contents["section_id"].isna())]
    for _, row in intro.iterrows():
        chapter_obj["intro_content"].append({
            "page": str(row["page_number"]) if not pd.isna(row["page_number"]) else "",
            "text": str(row["text"])
        })

    # Get sections for this chapter
    ch_sections = sections[sections["chapter_id"] == ch_id]
    for _, sec in ch_sections.iterrows():
        sec_id = sec["section_id"]
        section_obj = {
            "id": int(sec_id),
            "title": sec["title"],
            "content": []
        }
        sec_content = contents[
            (contents["chapter_id"] == ch_id) &
            (contents["section_id"] == sec_id)
        ]
        for _, row in sec_content.iterrows():
            section_obj["content"].append({
                "page": str(row["page_number"]) if not pd.isna(row["page_number"]) else "",
                "text": str(row["text"])
            })
        chapter_obj["sections"].append(section_obj)

    book_data.append(chapter_obj)


def parse_tagged_text(text):
    """Convert <c>...</c> and <a>...</a> tagged text to HTML."""
    def normalize_lines(raw):
        return [line.strip() for line in raw.split('\n') if line.strip()]

    def is_bengali_text(raw):
        return re.search(r'[\u0980-\u09FF]', raw) is not None

    def is_arabic_connector_fragment(raw):
        """True when a <c> block is only punctuation/symbols around Arabic text."""
        compact = ''.join(raw.split())
        if not compact or len(compact) > 12 or is_bengali_text(compact):
            return False

        honorific_chars = {
            '\ufdfa',  # ARABIC LIGATURE SALLALLAHOU ALAYHE WASALLAM
            '\u0610', '\u0611', '\u0612', '\u0613', '\u0614',
        }
        allowed_symbols = set(".:,;!?()[]{}\"'/-\\|<>`~@#$%^&*_+=\u00ab\u00bb\u061f\u060c\u061b")

        for ch in compact:
            category = unicodedata.category(ch)
            if category[0] in ('P', 'S'):
                continue
            if ch in honorific_chars or ch in allowed_symbols:
                continue
            return False
        return True

    def join_connector(prev_arabic, connector):
        connector = ' '.join(normalize_lines(connector))
        if not connector:
            return prev_arabic

        no_space_before = set(".,:;!?)]}\u00bb\u061f\u060c\u061b")
        if connector[0] in no_space_before:
            return prev_arabic.rstrip() + connector
        return prev_arabic.rstrip() + ' ' + connector

    # Parse tagged content into ordered blocks first.
    raw_blocks = []
    parts = re.split(r'(<[ca]>.*?</[ca]>)', text, flags=re.DOTALL)
    for part in parts:
        part = part.strip()
        if not part:
            continue
        c_match = re.match(r'<c>(.*?)</c>', part, re.DOTALL)
        a_match = re.match(r'<a>(.*?)</a>', part, re.DOTALL)
        if c_match:
            raw_blocks.append(('c', c_match.group(1).strip()))
        elif a_match:
            raw_blocks.append(('a', a_match.group(1).strip()))

    # Merge punctuation-only Bengali fragments into adjacent Arabic blocks.
    merged_blocks = []
    i = 0
    while i < len(raw_blocks):
        tag, value = raw_blocks[i]

        if tag == 'c' and is_arabic_connector_fragment(value):
            prev_is_arabic = bool(merged_blocks and merged_blocks[-1][0] == 'a')
            next_is_arabic = bool(i + 1 < len(raw_blocks) and raw_blocks[i + 1][0] == 'a')

            if prev_is_arabic and next_is_arabic:
                left = join_connector(merged_blocks[-1][1], value)
                right = ' '.join(normalize_lines(raw_blocks[i + 1][1]))
                merged_blocks[-1] = ('a', f"{left} {right}".strip())
                i += 2
                continue
            if prev_is_arabic:
                merged_blocks[-1] = ('a', join_connector(merged_blocks[-1][1], value))
                i += 1
                continue
            if next_is_arabic:
                next_value = ' '.join(normalize_lines(raw_blocks[i + 1][1]))
                merged_blocks.append(('a', f"{value.strip()} {next_value}".strip()))
                i += 2
                continue

        if merged_blocks and merged_blocks[-1][0] == tag:
            merged_blocks[-1] = (tag, merged_blocks[-1][1] + '\n' + value)
        else:
            merged_blocks.append((tag, value))
        i += 1

    html_parts = []
    for tag, value in merged_blocks:
        paragraphs = normalize_lines(value)
        if not paragraphs:
            continue
        if tag == 'c':
            html_parts.append(f'<div class="bengali-text">{"<br>".join(paragraphs)}</div>')
        else:
            html_parts.append(f'<div class="arabic-text">{"<br>".join(paragraphs)}</div>')
    return '\n'.join(html_parts)


def build_content_html(content_list):
    html = ""
    for item in content_list:
        page = item["page"]
        if page:
            html += f'<div class="page-marker">{page}</div>\n'
        html += parse_tagged_text(item["text"]) + "\n"
    return html


# Build the full HTML
print("Generating HTML viewer...")

# Build TOC HTML
toc_html = ""
for ch in book_data:
    toc_html += f'<li class="toc-chapter"><a href="#ch-{ch["id"]}">{ch["title"]}</a>\n'
    if ch["sections"]:
        toc_html += '<ul class="toc-sections">\n'
        for sec in ch["sections"]:
            toc_html += f'  <li><a href="#sec-{sec["id"]}">{sec["title"]}</a></li>\n'
        toc_html += '</ul>\n'
    toc_html += '</li>\n'

# Build body HTML
body_html = ""
for ch in book_data:
    body_html += f'<div class="chapter" id="ch-{ch["id"]}">\n'
    body_html += f'  <h1 class="chapter-title">{ch["title"]}</h1>\n'

    if ch["intro_content"]:
        body_html += '  <div class="chapter-intro">\n'
        body_html += build_content_html(ch["intro_content"])
        body_html += '  </div>\n'

    for sec in ch["sections"]:
        body_html += f'  <div class="section" id="sec-{sec["id"]}">\n'
        body_html += f'    <h2 class="section-title">{sec["title"]}</h2>\n'
        body_html += build_content_html(sec["content"])
        body_html += '  </div>\n'

    body_html += '</div>\n'

html = f"""<!DOCTYPE html>
<html lang="bn" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>আদর্শ পরিবার</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&family=Noto+Naskh+Arabic:wght@400;600;700&display=swap');

  * {{ margin: 0; padding: 0; box-sizing: border-box; }}

  :root {{
    --page-bg: #faf6f0;
    --page-border: #d4c5a9;
    --text-dark: #2c1810;
    --text-muted: #6b5b4f;
    --accent: #8b4513;
    --accent-light: #d4a574;
    --arabic-bg: #f0ebe3;
    --arabic-border: #c9b896;
    --sidebar-bg: #3b2f24;
    --sidebar-text: #e8ddd0;
    --sidebar-hover: #d4a574;
    --shadow: 0 2px 20px rgba(0,0,0,0.1);
  }}

  body {{
    font-family: 'Noto Sans Bengali', 'Segoe UI', sans-serif;
    background: #e8e0d4;
    color: var(--text-dark);
    line-height: 1.9;
    display: flex;
    min-height: 100vh;
  }}

  /* ===== SIDEBAR / TOC ===== */
  .sidebar {{
    width: 300px;
    min-width: 300px;
    background: var(--sidebar-bg);
    color: var(--sidebar-text);
    padding: 30px 20px;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 100;
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
  }}

  .sidebar-header {{
    text-align: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    flex-shrink: 0;
  }}

  .sidebar-header h2 {{
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--accent-light);
    margin-bottom: 4px;
  }}

  .sidebar-header p {{
    font-size: 0.8rem;
    opacity: 0.6;
  }}

  .toc {{
    list-style: none;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-right: 4px;
    padding-bottom: 20px;
  }}

  .toc-chapter {{
    margin-bottom: 8px;
  }}

  .toc-chapter > a {{
    display: block;
    padding: 8px 12px;
    color: var(--sidebar-text);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    border-radius: 6px;
    transition: all 0.2s;
  }}

  .toc-chapter > a:hover,
  .toc-chapter > a.active {{
    background: rgba(255,255,255,0.1);
    color: var(--sidebar-hover);
  }}

  .toc-sections {{
    list-style: none;
    padding-left: 16px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }}

  .toc-chapter.expanded .toc-sections {{
    max-height: 2000px;
  }}

  .toc-sections li a {{
    display: block;
    padding: 4px 12px;
    color: rgba(232, 221, 208, 0.7);
    text-decoration: none;
    font-size: 0.85rem;
    border-left: 2px solid transparent;
    transition: all 0.2s;
  }}

  .toc-sections li a:hover,
  .toc-sections li a.active {{
    color: var(--sidebar-hover);
    border-left-color: var(--sidebar-hover);
  }}

  .sidebar-footer {{
    flex-shrink: 0;
    padding-top: 12px;
    margin-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.12);
  }}

  .sidebar-action {{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.08);
    color: var(--sidebar-text);
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }}

  .sidebar-action:hover {{
    background: rgba(255,255,255,0.14);
    color: var(--sidebar-hover);
    border-color: rgba(212,165,116,0.7);
  }}

  .json-merger-modal {{
    display: none;
    position: fixed;
    inset: 0;
    z-index: 400;
    background: rgba(17, 12, 8, 0.6);
    align-items: center;
    justify-content: center;
    padding: 24px;
  }}

  .json-merger-modal.open {{
    display: flex;
  }}

  .json-merger-dialog {{
    width: min(1100px, 96vw);
    height: min(820px, 92vh);
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 16px 60px rgba(0,0,0,0.35);
    display: flex;
    flex-direction: column;
  }}

  .json-merger-header {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #e7dfd4;
    background: #f8f4ee;
    color: #3b2f24;
    font-weight: 700;
  }}

  .json-merger-close {{
    border: 1px solid #cbb89b;
    background: #fff;
    color: #3b2f24;
    border-radius: 8px;
    padding: 6px 10px;
    cursor: pointer;
    font-size: 0.95rem;
  }}

  .json-merger-frame {{
    width: 100%;
    height: 100%;
    border: none;
    flex: 1;
  }}

  /* ===== HAMBURGER ===== */
  .menu-toggle {{
    display: none;
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 200;
    background: var(--sidebar-bg);
    color: var(--sidebar-text);
    border: none;
    border-radius: 8px;
    width: 44px;
    height: 44px;
    font-size: 1.4rem;
    cursor: pointer;
    box-shadow: var(--shadow);
  }}

  /* ===== MAIN CONTENT ===== */
  .main {{
    margin-left: 300px;
    flex: 1;
    padding: 40px;
    display: flex;
    justify-content: center;
  }}

  .book-page {{
    max-width: 780px;
    width: 100%;
  }}

  /* ===== CHAPTER ===== */
  .chapter {{
    background: var(--page-bg);
    border: 1px solid var(--page-border);
    border-radius: 4px;
    padding: 50px 60px;
    margin-bottom: 40px;
    box-shadow: var(--shadow), inset 0 0 80px rgba(0,0,0,0.02);
    position: relative;
  }}

  .chapter::before {{
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--accent);
    border-radius: 4px 0 0 4px;
  }}

  .chapter-title {{
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--accent);
    text-align: center;
    padding-bottom: 20px;
    margin-bottom: 30px;
    border-bottom: 2px solid var(--accent-light);
    line-height: 1.4;
  }}

  /* ===== SECTION ===== */
  .section {{
    margin-top: 35px;
    padding-top: 25px;
    border-top: 1px dashed var(--page-border);
  }}

  .section-title {{
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 18px;
    padding-left: 14px;
    border-left: 3px solid var(--accent-light);
    line-height: 1.4;
  }}

  /* ===== CONTENT BLOCKS ===== */
  .bengali-text {{
    font-size: 1.05rem;
    line-height: 2;
    margin-bottom: 16px;
    text-align: justify;
    color: var(--text-dark);
  }}

  .arabic-text {{
    direction: rtl;
    font-family: 'Noto Naskh Arabic', 'Traditional Arabic', serif;
    font-size: 1.25rem;
    line-height: 2.2;
    background: var(--arabic-bg);
    border: 1px solid var(--arabic-border);
    border-radius: 6px;
    padding: 18px 24px;
    margin: 20px 0;
    text-align: right;
    color: #1a1200;
  }}

  /* ===== PAGE MARKERS ===== */
  .page-marker {{
    text-align: center;
    font-size: 0.78rem;
    color: var(--text-muted);
    margin: 24px 0 8px;
    opacity: 0.7;
    letter-spacing: 0.5px;
  }}

  .page-marker::before,
  .page-marker::after {{
    content: ' \\2014\\2014 ';
    opacity: 0.4;
  }}

  /* ===== SCROLL TO TOP ===== */
  .scroll-top {{
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 44px;
    height: 44px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: var(--shadow);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 50;
  }}

  .scroll-top.visible {{
    opacity: 1;
  }}

  /* ===== RESPONSIVE ===== */
  @media (max-width: 900px) {{
    .sidebar {{
      transform: translateX(-100%);
    }}
    .sidebar.open {{
      transform: translateX(0);
    }}
    .menu-toggle {{
      display: block;
    }}
    .main {{
      margin-left: 0;
      padding: 20px;
      padding-top: 70px;
    }}
    .chapter {{
      padding: 30px 25px;
    }}
  }}

  /* ===== PRINT ===== */
  @media print {{
    .sidebar, .menu-toggle, .scroll-top, .json-merger-modal {{ display: none; }}
    .main {{ margin-left: 0; padding: 0; }}
    .chapter {{ box-shadow: none; border: none; page-break-inside: avoid; }}
    .section {{ page-break-inside: avoid; }}
  }}
</style>
</head>
<body>

<button class="menu-toggle" id="menuToggle">&#9776;</button>

<nav class="sidebar" id="sidebar">
  <div class="sidebar-header">
    <h2>আদর্শ পরিবার</h2>
    <p>Adorsho Poribar</p>
  </div>
  <ul class="toc">
    {toc_html}
  </ul>
  <div class="sidebar-footer">
    <button class="sidebar-action" id="jsonMergerBtn" type="button">
      JSON Merger
    </button>
  </div>
</nav>

<main class="main">
  <div class="book-page">
    {body_html}
  </div>
</main>

<button class="scroll-top" id="scrollTop">&#8593;</button>

<div class="json-merger-modal" id="jsonMergerModal" aria-hidden="true">
  <div class="json-merger-dialog" role="dialog" aria-modal="true" aria-label="JSON Merger">
    <div class="json-merger-header">
      <span>JSON Merger</span>
      <button class="json-merger-close" id="jsonMergerCloseBtn" type="button">Close</button>
    </div>
    <iframe class="json-merger-frame" src="archive/merge_json_files.html" title="JSON Merger"></iframe>
  </div>
</div>

<script>
  // Sidebar toggle (mobile)
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const jsonMergerBtn = document.getElementById('jsonMergerBtn');
  const jsonMergerModal = document.getElementById('jsonMergerModal');
  const jsonMergerCloseBtn = document.getElementById('jsonMergerCloseBtn');
  menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

  // Close sidebar on link click (mobile)
  sidebar.querySelectorAll('a').forEach(a => {{
    a.addEventListener('click', () => {{
      if (window.innerWidth <= 900) sidebar.classList.remove('open');
    }});
  }});

  // Expand/collapse TOC chapters
  document.querySelectorAll('.toc-chapter > a').forEach(link => {{
    link.addEventListener('click', (e) => {{
      const li = link.parentElement;
      // Collapse all others
      document.querySelectorAll('.toc-chapter').forEach(el => {{
        if (el !== li) el.classList.remove('expanded');
      }});
      li.classList.toggle('expanded');
    }});
  }});

  // Scroll to top button
  const scrollBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {{
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }});
  scrollBtn.addEventListener('click', () => {{
    window.scrollTo({{ top: 0, behavior: 'smooth' }});
  }});

  // Active section tracking
  const observer = new IntersectionObserver((entries) => {{
    entries.forEach(entry => {{
      if (entry.isIntersecting) {{
        const id = entry.target.id;
        document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.sidebar a[href="#${{id}}"]`);
        if (active) {{
          active.classList.add('active');
          // Expand parent chapter in TOC
          const parentLi = active.closest('.toc-chapter');
          if (parentLi) parentLi.classList.add('expanded');
        }}
      }}
    }});
  }}, {{ threshold: 0.2 }});

  document.querySelectorAll('.chapter, .section').forEach(el => observer.observe(el));

  function openJsonMergerModal() {{
    jsonMergerModal.classList.add('open');
    jsonMergerModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.innerWidth <= 900) sidebar.classList.remove('open');
  }}

  function closeJsonMergerModal() {{
    jsonMergerModal.classList.remove('open');
    jsonMergerModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }}

  jsonMergerBtn.addEventListener('click', openJsonMergerModal);
  jsonMergerCloseBtn.addEventListener('click', closeJsonMergerModal);

  jsonMergerModal.addEventListener('click', (e) => {{
    if (e.target === jsonMergerModal) {{
      closeJsonMergerModal();
    }}
  }});

  window.addEventListener('keydown', (e) => {{
    if (e.key === 'Escape' && jsonMergerModal.classList.contains('open')) {{
      closeJsonMergerModal();
    }}
  }});
</script>
</body>
</html>"""

with open("book_viewer.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Success! 'book_viewer.html' has been generated.")
