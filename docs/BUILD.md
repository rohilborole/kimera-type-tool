# Type Tool Overhaul — Build Guide

Use this with the full plan: [type-tool-plan.md](type-tool-plan.md).

## Entry points

| Document | Purpose |
|----------|--------|
| [type-tool-plan.md](type-tool-plan.md) | Full plan: current state, product behaviour, all 8 phases (goal/changes/result), implementation order, open decisions, build readiness (files, types, checklist). |
| [type-tool-flowchart.mmd](type-tool-flowchart.mmd) | Mermaid flowchart: app entry, tab types, main-page font panel, blocks, proofing sets, font management, glyph replacement, canvas, export, implementation order. |

## Implementation order (do in this sequence)

1. **Phase 1** — Kill pagination; All + Custom tabs; single scroll.
2. **Phase 2** — Red circle for missing/empty glyphs.
3. **Phase 3** — Multiple fonts + global order (upload, drag, proofs per font).
4. **Phase 6** — Remove FloatingToolbar.
5. **Phase 7** — A4/A3, default A3, 1:1; dynamic page fit.
6. **Phase 4** — Tab system (Main, Variable, Custom 1…), blocks, comparison blocks, **per–main-page font panel** (choose 1+ fonts, reorder for that main page).
7. **Phase 5** — Variable playground (presets, sliders, animation).
8. **Phase 8** — Per-tab PDF export; WYSIWYG.

## Quick reference: files by phase

- **1:** `types.ts`, `Canvas.tsx`, `SpecimenBlocks.tsx`, `useAppStore.ts`, `specimenPagination.ts`
- **2:** `fontEngine.ts`, red-circle component/util, `SpecimenBlocks.tsx`, TypeProofingView
- **3:** `useAppStore.ts` (fontEntries), `useFontFace.ts`, Sidebar (font list + drag), SpecimenBlocks
- **4:** `types.ts` (Tab, Block, BlockTypesetting), store (tabs, blocks, fontIds per main), TabBar, BlockCard, BlockSettingsPanel, ComparisonBlock, proofingSets/content-presets, **Main font panel**
- **5:** `VariablePlaygroundView.tsx`, presets, axes, rAF animation
- **6:** `Canvas.tsx` (remove FloatingToolbar)
- **7:** store (A3 default), `pageDimensions.ts`, canvas mm/1:1, dynamic pagination
- **8:** Export trigger, PrintPreview/iframe (active tab, same dimensions/fonts)

## Before you start

- [ ] Read [type-tool-plan.md](type-tool-plan.md) (at least Current state, Product behaviour, and your next phase).
- [ ] Resolve open decisions in the plan (glyph scope, custom content, max tabs/fonts).
- [ ] For Phase 4: implement the **per–main-page font panel** (one panel per main page: select 1+ fonts from uploads, drag to reorder for that page only).
