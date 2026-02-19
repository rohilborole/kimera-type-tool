# Type Tool: Final Plan — Canvas, Tabs, Blocks, and Export

Single source of truth for the Type Tool overhaul: replace canvas pagination with All/Custom tabs, add missing-glyph replacement, multi-font with global and per–main-page order, full Main/Variable/Custom tab system with blocks and comparison blocks, per–main-page font selection panel, Variable playground, strict A4/A3 1:1 canvas, and per-tab PDF export.

---

## Current state (summary)

- **Tabs:** Many specimen tabs (ALL, HEADLINES, TEXT, ADHESION, A-Z, WORDS, CAPS, SPACING, etc.) plus GLYPH_INSPECTOR, TYPE_PROOFING. Defined in `src/types.ts` (`ActiveTab`) and `src/components/Canvas.tsx` (`TABS`).
- **Pagination:** `src/lib/specimenPagination.ts` returns one block per page; canvas renders "Page 1", "Page 2" and separators in `Canvas.tsx` (lines 273–282, 316–330).
- **Font:** Single `fontUrl` in `src/store/useAppStore.ts`; loading a new file revokes the previous one.
- **Blocks:** Fixed `SpecimenBlockType` list; each block type hard-wired in `SpecimenBlocks.tsx` (HERO, ADHESION, KERN, etc.) with `specimenStyle` and hardcoded sizes.
- **Toolbar:** `FloatingToolbar.tsx` (Select, Type, Draw, Notes) in Canvas when `!isPrinting`.
- **Page size:** A4/A3 and landscape/portrait in store and `src/lib/pageDimensions.ts`; used for canvas and print.

---

## Product behaviour (target)

### Tabs and content

- **All** — Single scroll, all blocks per font; no page labels; follows global upload order.
- **Custom** — User-defined set of blocks (from proofing sets or empty); initially can mirror All or be empty.
- **Main** — Full proofing: blocks with title, typesetting, string; 11 proofing sets; **per–main-page font selection and order** (one panel: choose 1+ fonts, drag to reorder for that main page only).
- **Variable** — Variable playground: text presets, axis sliders, animation presets (Font Gauntlet–style).
- **Custom 1, 2, …** — Named custom tabs; own block list; added via Plus (max tabs/fonts: e.g. 20 tabs, 10 fonts).

### Main page: font selection and order

- Each **Main** tab has its own **font selection and order**.
- **One panel per main page:** (1) Choose which uploaded fonts appear (1 or more); (2) Drag to set their order for this main page only.
- Font list in the panel = global upload list (`fontEntries`). Main tab stores only selected font IDs and their order.
- Enables e.g. one main page “Display A, B”, another “Body C, D, E”.

### Blocks and proofing sets

- **Text block** — Single content; settings via floating panel (font, weight, size, leading, alignment, justification, hyphenation, reset, copy).
- **Comparison block** — 2–4 columns (50-50, 33-33-33, 25-25-25-25); each column = sub-block with content from proofing sets and own typesetting.
- **11 proofing sets:** basicKerning, customStrings, ruderSpacing, spacingStrings, glyphGrid, paragraphs, headlines, familyOverview, punctuations, specimen, otFeatures (map from `content-presets.ts` or new `proofingSets.ts`).
- Block settings: InDesign-like floating panel; open via settings icon.

### Font management (global)

- User uploads fonts (max 10); stored as ordered list `fontEntries`. Global drag-to-reorder in sidebar (or “Fonts” panel) defines default order. Per–main-page panel overrides apply only when viewing/editing that main page.

### Missing / empty glyphs

- Per-character glyph lookup; if missing or empty, show **red circle** in specimen and Type Proofing (optionally Variable playground later).

### Canvas and export

- **Canvas:** A4 or A3, **default A3**; landscape/portrait; **1:1** mm/pt for print; dynamic page fit (measure block heights, fill page, new page).
- **Export:** Per-tab PDF; preview matches PDF (WYSIWYG); iframe-based print scoped to active tab.

---

## Phases (goals, changes, result)

### Phase 1 — Kill pagination; All + Custom tabs

- **Goal:** Remove page labels and separators; replace many tabs with **All** (all blocks in one scroll) and **Custom** (user-defined; initially same as All or empty).
- **Changes:**  
  - Types: `ActiveTab` → e.g. `'ALL' | 'CUSTOM' | 'GLYPH_INSPECTOR' | 'TYPE_PROOFING'` (or drop inspector/proofing if not needed yet).  
  - Canvas: stop using `getSpecimenPages()`; render single scrollable area for ALL; remove "Page N" label and separator.  
  - Tabs UI: replace `TABS` with `['ALL', 'CUSTOM']` (+ optional inspector/proofing).  
  - SpecimenBlocks: when ALL, show full block list; no `pages.map`; one flat list.  
  - Store: keep `activeTab`; remove or repurpose `currentPageIndex` if only for pagination.
- **Result:** One canvas strip, no page labels; two tabs All and Custom.

### Phase 2 — Red circle for missing/empty glyphs

- **Goal:** Missing or empty glyph (e.g. .notdef) → render red circle in specimen and proofing.
- **Changes:**  
  - Font API: in `fontEngine.ts`, add e.g. `getGlyphForChar(font, codePoint)` and/or `isGlyphMissingOrEmpty(font, codePoint)` (opentype.js: glyph lookup; empty = zero path or advanceWidth).  
  - Rendering: either (a) wrapper elements per character + red circle span/SVG when missing/empty, or (b) canvas/SVG with per-codepoint check.  
  - Integrate in SpecimenBlocks and TypeProofingView (shared component or utility: string + font → text nodes + red-circle elements).
- **Result:** Red circle visible for missing/empty glyphs in specimen and proofing.

### Phase 3 — Multiple fonts: upload, order, proofs per font

- **Goal:** Multiple font files; user can reorder (e.g. drag); proofs generated per font in that order.
- **Changes:**  
  - Store: replace `fontUrl` with `fontEntries: { id, blobUrl, fileType?, metadata? }[]`; add `addFontFile`, `removeFont`, `reorderFonts(fromIndex, toIndex)`. Limit max 10.  
  - Font loading: on drop/select, parse with `parseFontFile`, create blob URLs, append; on remove/replace, revoke blob URLs.  
  - `@font-face`: multiple rules (e.g. in `useFontFace.ts`) — one family per file or family + weight/style.  
  - Specimen: render blocks once per font in order; data shape = “for each font in order, render this list of blocks”.  
  - Sidebar: list fonts with drag handles; reorder updates `fontEntries`.
- **Result:** Multiple fonts; drag to reorder; All shows all blocks repeated per font in order.

### Phase 4 — Tab system: Main, Variable, Custom 1, 2, … ; blocks and comparison blocks

- **Goal:** Tabs like browser tabs: Main (default), Variable (playground), Custom 1, Custom 2, … with “+”. Each tab has blocks; each block has title, typesetting, content. **Per–main-page font panel:** same panel to choose 1+ fonts and reorder for that main page only.
- **Data model:**  
  - **Tabs:** `tabs: { id, type: 'main'|'variable'|'custom', name, fontIds?: string[] }[]`, `activeTabId`. Main has `fontIds` (selected font IDs in order for that main page). Variable has no block list. Custom has list of block IDs.  
  - **Blocks:** `blocks: { id, tabId, type: 'text'|'comparison', title, typesetting: BlockTypesetting, contentKey?, contentOverride?, subBlocks? }[]`. BlockTypesetting: fontId, fontSize (pt), fontWeight, fontStyle, underline, lineHeight, letterSpacing, wordSpacing, alignment, justification, hyphenation. Comparison: subBlocks 2..4 with contentKey/contentOverride and typesetting each.  
  - **Proofing sets:** 11 keys mapping to content (e.g. in `proofingSets.ts` or `content-presets.ts`).
- **UI:**  
  - Tab bar: chips (Main, Variable, Custom 1, …) + “+”. New Main → panel to choose 1+ fonts (and reorder); New Custom → “Custom N” with empty block list.  
  - Block: title, typesetting summary, content; settings icon → floating panel (font, weight, size, line height, alignment, etc.).  
  - Comparison: 2–4 columns; per-column content dropdown (proofing set keys) and typesetting panel.  
  - **Main font panel:** Same panel for each main page: select which fonts (1+) and drag to set order for that page only.
- **Files:** New types in `types.ts` (Tab, Block, BlockTypesetting, proofing set keys). Store: tabs, activeTabId, blocks; actions for tabs/blocks. New components: TabBar, BlockCard, BlockSettingsPanel, ComparisonBlock. Refactor SpecimenBlocks to render from `blocks` by activeTabId. Proofing set map for block content dropdown.
- **Result:** Main/Variable/Custom tabs; blocks with settings; comparison blocks; per–main-page font selection and order in one panel.

### Phase 5 — Variable tab: playground

- **Goal:** Variable font testing: text presets, axis sliders, animation presets (e.g. weight sweep). Reference: fontgauntlet.com.
- **Changes:**  
  - Variable tab view: text preset dropdown/list; axis sliders (one per axis: min, max, current, reset); animation presets (“Weight sweep”, etc.) via requestAnimationFrame.  
  - New component e.g. `VariablePlaygroundView.tsx`; use axes and setAxisValue (or local state for tab). Optional: “Select font” if multiple variable fonts.
- **Result:** Variable tab with presets, sliders, and at least one animation preset.

### Phase 6 — Remove Select / Type / Draw / Notes toolbar

- **Goal:** Remove floating toolbar for now.
- **Changes:** Remove `<FloatingToolbar />` from Canvas; drop props only used there. If CanvasOverlay/activeTool depend on it, default to single mode (e.g. cursor) or remove that behaviour.
- **Result:** No floating toolbar; canvas = blocks/tabs and Variable playground.

### Phase 7 — Canvas: A4/A3, 1:1, default A3, dynamic fit

- **Goal:** Canvas = real paper: A4 or A3 (default A3), orientation toggle; 1:1 so 10pt on screen = 10pt printed; content laid out into pages that fit the format.
- **Changes:**  
  - Units: physical mm/pt for page container and font sizes; no scaling (avoid vw/vh/scale). Use `pageDimensions.ts`; 1.5cm margin for print.  
  - Default: store default `pageSize` = `'A3'`.  
  - Dynamic fit: measure block heights (typesetting + content); assign blocks to pages until content height ≤ page content box; then new page. Option: two-pass (measure then render) or CSS `break-inside: avoid` with simulated break points for on-screen preview.
- **Result:** A4/A3 in real units; default A3; when pagination is used, blocks fill pages dynamically; 1:1 for print.

### Phase 8 — Per-tab PDF export; WYSIWYG

- **Goal:** Export active tab to PDF; preview matches PDF.
- **Changes:**  
  - Export trigger per tab (e.g. “Export PDF” in tab bar). Export only current tab’s content.  
  - Reuse same block list and layout; iframe-based print (e.g. PrintPreview.tsx): clone current tab’s canvas into iframe, same mm dimensions and fonts; same @page and margins.  
  - Variable tab: export current playground state (or define behaviour).
- **Result:** Per-tab PDF; PDF matches on-screen preview (1:1, high quality).

---

## Implementation order (recommended)

Execute in this order so dependencies and quick wins are respected:

| Step | Phase | Scope |
|------|--------|--------|
| 1 | **Phase 1** | Kill pagination; All + Custom tabs; single scroll. |
| 2 | **Phase 2** | Red circle for missing/empty glyphs. |
| 3 | **Phase 3** | Multiple font upload + global order UI (drag); proofs per font. |
| 4 | **Phase 6** | Remove FloatingToolbar. |
| 5 | **Phase 7** | A4/A3 in mm, default A3, 1:1; then dynamic page fit. |
| 6 | **Phase 4** | Full tab system (Main, Variable, Custom 1…), blocks, comparison, **per–main-page font panel**. |
| 7 | **Phase 5** | Variable playground (presets, sliders, animation). |
| 8 | **Phase 8** | Per-tab PDF export; WYSIWYG. |

Phases 1, 2, 3, 6 are self-contained. Phase 7 can follow Phase 1. Phases 4 and 5 depend on the new tab/block model. Phase 8 depends on 4 and 7.

---

## Open decisions

- **Glyph replacement scope:** Specimen + proofing only, or also Variable playground and future text inputs? (Recommendation: at least specimen and proofing.)
- **Custom tab content:** Only 11 proofing sets per block, or also free text / paste? (Recommendation: both — dropdown of sets + optional override.)
- **Caps:** e.g. max 20 tabs, 10 fonts; document in UI or config.

---

## Build readiness

### Key files to touch (by phase)

- **Phase 1:** `src/types.ts` (ActiveTab), `src/components/Canvas.tsx` (tabs, no pagination), `src/components/SpecimenBlocks.tsx` (flat list), `src/store/useAppStore.ts` (activeTab, page index), `src/lib/specimenPagination.ts` (usage removed or refactored).
- **Phase 2:** `src/lib/fontEngine.ts` (glyph helpers), shared component or util for red-circle text, `SpecimenBlocks.tsx`, TypeProofingView.
- **Phase 3:** `src/store/useAppStore.ts` (fontEntries, add/remove/reorder), `src/hooks/useFontFace.ts` (multiple @font-face), `src/components/Sidebar.tsx` (font list + drag), SpecimenBlocks (per-font block list).
- **Phase 4:** `src/types.ts` (Tab, Block, BlockTypesetting, proofing keys), `src/store/useAppStore.ts` (tabs, activeTabId, blocks, main fontIds), new: TabBar, BlockCard, BlockSettingsPanel, ComparisonBlock; refactor SpecimenBlocks; new or extended proofing set map (e.g. `proofingSets.ts`); **Main font panel** (select 1+ fonts, reorder for that main page).
- **Phase 5:** New `VariablePlaygroundView.tsx`; content presets; axes/sliders; animation (e.g. rAF).
- **Phase 6:** `Canvas.tsx` (remove FloatingToolbar), optionally CanvasOverlay / activeTool.
- **Phase 7:** `src/store/useAppStore.ts` (default A3), `src/lib/pageDimensions.ts`, canvas layout (mm, 1:1), dynamic pagination (measure + assign blocks to pages).
- **Phase 8:** Export trigger (tab bar or menu), `PrintPreview.tsx` or equivalent (clone active tab, same dimensions/fonts), @page and margins.

### Types to introduce (Phase 4)

- `Tab`: `{ id: string; type: 'main'|'variable'|'custom'; name: string; fontIds?: string[] }`
- `Block`: `{ id: string; tabId: string; type: 'text'|'comparison'; title: string; typesetting: BlockTypesetting; contentKey?: string; contentOverride?: string; subBlocks?: SubBlock[] }`
- `BlockTypesetting`: fontId, fontSize (pt), fontWeight, fontStyle, underline, lineHeight, letterSpacing, wordSpacing, alignment, justification, hyphenation
- `FontEntry`: `{ id: string; blobUrl: string; fileType?: string; metadata?: FontMetadata }`
- Proofing set key type (e.g. union of 11 keys).

### Checklist before starting

- [ ] Read this plan and the flowchart (`docs/type-tool-flowchart.mmd`).
- [ ] Confirm open decisions (glyph scope, custom content, caps).
- [ ] Implement in recommended order: 1 → 2 → 3 → 6 → 7 → 4 → 5 → 8.
- [ ] For Phase 4, implement the **per–main-page font panel** (same panel: select fonts + reorder for that main page only).
