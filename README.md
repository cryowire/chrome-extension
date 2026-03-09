# Cryowire Viewer – Chrome Extension

A Chrome extension that renders `cooldown.yaml` files directly from GitHub as interactive wiring diagrams. Like Swagger UI, but for cryostat wiring configurations.

## Features

- **Auto-detection**: Detects `cooldown.yaml` files when browsing GitHub repositories
- **One-click viewer**: Adds a "Cryowire Viewer" button on GitHub file pages
- **Full viewer**: Opens the cryowire viewer in a new tab with wiring diagrams, summary tables, and line details
- **Drag & drop**: Also supports local file upload via drag-and-drop

## How it works

1. Browse to any `cooldown.yaml` file on GitHub
2. Click the **Cryowire Viewer** button that appears
3. The file opens in the full cryowire viewer with:
   - Metadata display (cooldown ID, date, cryo, operator)
   - Interactive SVG wiring diagram with animated signal pulses
   - Summary tables showing per-stage components and attenuation/gain
   - Line detail browser with component-level inspection

## Development

```bash
# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Production build
npm run build
```

## Load in Chrome

1. Run `npm run build`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist/` directory

## Tech Stack

- React 19 + TypeScript
- Vite + [@crxjs/vite-plugin](https://crxjs.dev/)
- Tailwind CSS 4
- js-yaml for YAML parsing
