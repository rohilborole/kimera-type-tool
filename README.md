# KIMERA 0.1 — Font Specimen & Testing

A high-performance font specimen and testing web application with a **Brutalist / Swiss minimalist** aesthetic and **bento box** layout. Built with React 19, TypeScript, Tailwind CSS, and opentype.js (CDN).

## Features

- **Font upload**: Drag-and-drop or click to upload `.ttf`, `.otf`, `.woff`, `.woff2`
- **Metadata**: Family name, glyph count, file type, file size, variable font detection
- **Variable axes**: Sliders + number inputs with **Play** animation (oscillate min→max)
- **OpenType features**: Toggle detected GSUB features (liga, tnum, ss01, etc.)
- **Specimen blocks**: Hero, Headlines, Text, Adhesion/Kern, A–Z (pangram + density), Words, Caps, Hinting waterfall, Layout, Lettering, World scripts
- **Annotations**: Enable "Collaborate / Annotate", click canvas to add yellow sticky notes
- **PDF export**: Export PDF Specimen (hides sidebar/tabs, forces light theme, calls print)

## Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS** (IBM Plex Mono for UI)
- **opentype.js** (loaded via CDN for font parsing: metadata, fvar axes, GSUB features)

## Run

```bash
npm install
npm run dev
```

Then open the URL shown (e.g. `http://localhost:5173`). Load a font to start testing.

## Project structure

- `src/store/useAppStore.ts` — global state (theme, fontUrl, metadata, axes, activeFeatures, activeTab, isPrinting, annotations)
- `src/lib/fontEngine.ts` — parse font file (opentype.parse), build `fontVariationSettings` and `fontFeatureSettings`
- `src/components/Sidebar.tsx` — upload, axes, features, export
- `src/components/Canvas.tsx` — sticky tab bar, specimen blocks, annotation layer
- `src/components/SpecimenBlocks.tsx` — all block types and content presets
- `src/content-presets.ts` — pangrams, adhesion strings, paragraphs, world scripts

## Design

- **Layout**: Fixed sidebar (320px) + scrollable canvas. Bento-style blocks with border-bottom separators and generous padding.
- **Theme**: Dark (bg-black, text gray-300) / Light (bg-white, text gray-800). PDF export forces light.
- **Scrollbars**: Thin, minimal. UI font: IBM Plex Mono.
