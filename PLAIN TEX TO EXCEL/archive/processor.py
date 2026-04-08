import json
import re
import pandas as pd
from bs4 import BeautifulSoup

# ==========================================
# PART 1: CONVERT TEXT + JSON TO TAGGED XML
# ==========================================

print("1. Loading files...")
with open("ADORSHO PORIBAR - COMBINED.txt", "r", encoding="utf-8") as f:
    text = f.read()

with open("hierarchy.json", "r", encoding="utf-8") as f:
    hierarchy = json.load(f)

# Flatten the JSON to easily look up if a heading is a chapter or section
chapters_list = [item["chapter"] for item in hierarchy]
sections_list = [sec for item in hierarchy for sec in item["sections"]]

def heading_replacer(match):
    raw_heading = match.group(1).strip()
    clean_heading = " ".join(raw_heading.split())
    
    if clean_heading in chapters_list:
        return f"<chapter>{clean_heading}</chapter>"
    else:
        # Default to section if it's not a main chapter
        return f"<section>{clean_heading}</section>"

print("2. Converting tags and isolating Arabic text...")
# Convert page numbers and headings
text = re.sub(r'<page_number>\s*(.*?)\s*</page_number>', r'<p>\1</p>', text, flags=re.DOTALL)
text = re.sub(r'<heading>\s*(.*?)\s*</heading>', heading_replacer, text, flags=re.DOTALL)

# Isolate Arabic Text (Unicode block \u0600-\u06FF) and wrap in <a> tags
arabic_pattern = r'([\u0600-\u06FF][\u0600-\u06FF\s\d،؛؟.,\-\(\)\[\]«»\'"{}]+[\u0600-\u06FF]|[\u0600-\u06FF]+)'

def process_content(match):
    content = match.group(1).strip()
    # Temporarily break the Bengali <c> tag to insert the Arabic <a> tag
    processed = re.sub(arabic_pattern, r'</c>\n<a>\1</a>\n<c>', content)
    return f"<c>\n{processed}\n</c>"

text = re.sub(r'<text>(.*?)</text>', process_content, text, flags=re.DOTALL)

# Clean up empty <c> tags that might have been created
text = re.sub(r'<c>\s*</c>', '', text, flags=re.DOTALL)

# Save the intermediate XML file
xml_output = f"<book>\n{text}\n</book>"
with open("tagged_output.xml", "w", encoding="utf-8") as f:
    f.write(xml_output)

print("XML Tagging complete! Moving to Excel generation...")

# ==========================================
# PART 2: PARSE XML TO RELATIONAL EXCEL
# ==========================================

print("3. Parsing XML for Relational Database...")
soup = BeautifulSoup(xml_output, "html.parser")

# Data storage lists
chapters_data = []
sections_data = []
contents_data = []

# ID Counters
chapter_id = 0
section_id = 0
content_id = 0

# State Trackers
current_chapter_id = None
current_section_id = None
current_page = None

# Accumulator for content parts under the current section/chapter
current_content_parts = []  # list of (tag, text) tuples
current_content_page = None  # page when content started

def flush_content():
    """Merge consecutive same-type parts and save as one row."""
    global content_id
    if not current_content_parts:
        return

    # Merge consecutive same-type tags
    merged = []
    for tag, txt in current_content_parts:
        if merged and merged[-1][0] == tag:
            merged[-1] = (tag, merged[-1][1] + '\n' + txt)
        else:
            merged.append((tag, txt))

    # Build tagged string preserving reading order
    combined = '\n'.join(f'<{tag}>{txt}</{tag}>' for tag, txt in merged)

    content_id += 1
    contents_data.append({
        "content_id": content_id,
        "chapter_id": current_chapter_id,
        "section_id": current_section_id,
        "page_number": current_content_page,
        "text": combined
    })

# Iterate through every element in the XML sequentially
for element in soup.book.children:
    if element.name is None:
        continue  # Skip empty newlines

    tag = element.name
    text_val = element.text.strip()

    if not text_val:
        continue

    # Update Page Tracking
    if tag == 'p':
        current_page = text_val

    # Handle Chapters
    elif tag == 'chapter':
        flush_content()  # Save accumulated content before new chapter
        current_content_parts = []
        current_content_page = None

        chapter_id += 1
        current_chapter_id = chapter_id
        current_section_id = None

        chapters_data.append({
            "chapter_id": current_chapter_id,
            "title": text_val
        })

    # Handle Sections
    elif tag == 'section':
        flush_content()  # Save accumulated content before new section
        current_content_parts = []
        current_content_page = None

        section_id += 1
        current_section_id = section_id

        sections_data.append({
            "section_id": current_section_id,
            "chapter_id": current_chapter_id,
            "title": text_val
        })

    # Handle Content (Both Bengali <c> and Arabic <a>)
    elif tag in ['c', 'a']:
        if not current_content_parts:
            current_content_page = current_page  # Track starting page
        current_content_parts.append((tag, text_val))

# Flush any remaining content after the last element
flush_content()

# ==========================================
# PART 3: EXPORT TO EXCEL
# ==========================================

print("4. Writing to Excel file...")
# Convert lists to Pandas DataFrames
df_chapters = pd.DataFrame(chapters_data)
df_sections = pd.DataFrame(sections_data)
df_contents = pd.DataFrame(contents_data)

# Create an Excel writer and save the sheets
with pd.ExcelWriter("Adorsho_Poribar_Database.xlsx", engine="openpyxl") as writer:
    df_chapters.to_excel(writer, sheet_name="Chapters", index=False)
    df_sections.to_excel(writer, sheet_name="Sections", index=False)
    df_contents.to_excel(writer, sheet_name="Content", index=False)

print("Success! 'tagged_output.xml' and 'Adorsho_Poribar_Database.xlsx' have been generated.")