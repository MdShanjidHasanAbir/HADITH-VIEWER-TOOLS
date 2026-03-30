# Hadith Viewer

A beautiful, premium, and responsive web application built with HTML, CSS, and Vanilla JavaScript for viewing and merging Hadith collections from JSON files.

## Features
- **Premium Interface:** High-quality UI with custom Bengali typography.
- **Dark Mode / Light Mode:** Fully supported theme toggling.
- **Multiple JSON Support:** View single books or merge multiple split JSON files into a consolidated book directly in the browser.
- **Global Search:** Easily navigate through uploaded books and chapters.
- **Clipboard Integration:** Instantly copy Arabic text, narration, and Bengali translation.
- **No Backend Required:** Runs entirely in the browser using the local file system.

## How to Run Locally
1. Clone the repository.
2. You can open `index.html` directly in any modern web browser — this project is purely static and needs no backend.

### Serving via a local server
If you prefer to debug with VS Code or want `localhost` URLs, run a simple HTTP server from the project root. For example:

```bash
# with npm (no install required if using npx):
npx http-server -p 8080
# or with Python 3:
python -m http.server 8080
```

Then point your browser or the VS Code Chrome launch configuration to `http://localhost:8080`.

3. Use the sidebar to upload your structured JSON Hadith files.

## Tech Stack
- HTML5
- CSS3 (Custom Properties, Flexbox)
- Vanilla JavaScript
- FontAwesome Icons

## License
MIT License
