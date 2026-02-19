import { useCallback, useEffect, useRef, useState } from 'react';
import type { ActiveTab, PageSize, PageOrientation } from '../types';
import { getSpecimenPages } from '../lib/specimenPagination';
import { getPageDimensions } from '../lib/pageDimensions';
import { SpecimenBlocks } from './SpecimenBlocks';
import { FloatingToolbar } from './FloatingToolbar';
import { CanvasOverlay } from './CanvasOverlay';
import { GlyphInspectorView } from './GlyphInspectorView';
import { TypeProofingView } from './TypeProofingView';

/** Tab order: specimen tabs first, then Glyph Inspector and Type Proofing. */
const TABS: ActiveTab[] = [
  'ALL',
  'HEADLINES',
  'TEXT',
  'ADHESION',
  'A-Z',
  'SPACING',
  'WORDS',
  'CAPS',
  'LAYOUT',
  'LETTERING',
  'KERN',
  'HINTING',
  'LATIN',
  'WORLD',
  'GLYPH_INSPECTOR',
  'TYPE_PROOFING',
];

interface CanvasProps {
  activeTab: ActiveTab;
  setActiveTab: (t: ActiveTab) => void;
  specimenStyle: React.CSSProperties;
  fontUrl: string | null;
  axes: import('../types').VariableAxis[];
  activeFeatures: Record<string, boolean>;
  isPrinting: boolean;
  theme: 'dark' | 'light';
  pageSize: PageSize;
  setPageSize: (s: PageSize) => void;
  pageOrientation: PageOrientation;
  setPageOrientation: (o: PageOrientation) => void;
  currentPageIndex: number;
  setCurrentPageIndex: (n: number) => void;
  annotations: { id: string; x: number; y: number; text: string }[];
  addAnnotation: (x: number, y: number) => void;
  updateAnnotation: (id: string, text: string) => void;
  removeAnnotation: (id: string) => void;
  activeTool: import('../types').CanvasTool;
  setActiveTool: (t: import('../types').CanvasTool) => void;
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
  currentTextStyle: import('../types').CurrentTextStyle;
  setCurrentTextStyle: (s: import('../types').CurrentTextStyle | ((p: import('../types').CurrentTextStyle) => import('../types').CurrentTextStyle)) => void;
  textFrames: import('../types').TextFrame[];
  addTextFrame: (x: number, y: number) => void;
  updateTextFrame: (id: string, updates: Partial<Pick<import('../types').TextFrame, 'text' | 'x' | 'y' | 'fontSize' | 'fontWeight' | 'textAlign' | 'letterSpacing' | 'lineHeight'>>) => void;
  removeTextFrame: (id: string) => void;
  drawings: import('../types').DrawingStroke[];
  addDrawingStroke: (points: { x: number; y: number }[]) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  glyphs: import('../types').GlyphInfo[];
  proofingBlocks: import('../types').ProofingBlock[];
  activeProofingBlockId: string | null;
  proofingSyncText: boolean;
  setActiveProofingBlockId: (id: string | null) => void;
  setProofingSyncText: (v: boolean) => void;
  addProofingBlock: (initialText?: string) => string;
  updateProofingBlock: (id: string, updates: Partial<Pick<import('../types').ProofingBlock, 'text' | 'fontVariationSettings' | 'fontFeatureSettings' | 'axisOverrides' | 'featureOverrides'>>) => void;
  removeProofingBlock: (id: string) => void;
  duplicateProofingBlock: (id: string) => void;
  syncAllProofingBlocksText: (text: string) => void;
}

export function Canvas({
  activeTab,
  setActiveTab,
  specimenStyle,
  fontUrl,
  axes,
  activeFeatures,
  isPrinting,
  theme,
  pageSize,
  setPageSize,
  pageOrientation,
  setPageOrientation,
  currentPageIndex: _currentPageIndex,
  setCurrentPageIndex: _setCurrentPageIndex,
  annotations,
  addAnnotation,
  updateAnnotation,
  removeAnnotation,
  activeTool,
  setActiveTool,
  zoom,
  zoomIn,
  zoomOut,
  zoomReset,
  currentTextStyle,
  setCurrentTextStyle,
  textFrames,
  addTextFrame,
  updateTextFrame,
  removeTextFrame,
  drawings,
  addDrawingStroke,
  selectedElementId,
  setSelectedElementId,
  glyphs,
  proofingBlocks,
  activeProofingBlockId,
  proofingSyncText,
  setActiveProofingBlockId,
  setProofingSyncText,
  addProofingBlock,
  updateProofingBlock,
  removeProofingBlock,
  duplicateProofingBlock,
  syncAllProofingBlocksText,
}: CanvasProps) {
  const firstPageContainerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const isSpecimenTab =
    activeTab !== 'GLYPH_INSPECTOR' && activeTab !== 'TYPE_PROOFING';
  const pages = getSpecimenPages(activeTab, pageSize);

  const handleAddToProofing = useCallback(
    (char: string) => {
      if (proofingBlocks.length === 0) addProofingBlock(char);
      else if (activeProofingBlockId) {
        const block = proofingBlocks.find((b) => b.id === activeProofingBlockId);
        if (block) updateProofingBlock(block.id, { text: block.text + char });
        else updateProofingBlock(proofingBlocks[0].id, { text: proofingBlocks[0].text + char });
      } else {
        updateProofingBlock(proofingBlocks[0].id, { text: proofingBlocks[0].text + char });
      }
    },
    [proofingBlocks, activeProofingBlockId, addProofingBlock, updateProofingBlock]
  );

  useEffect(() => {
    const el = firstPageContainerRef.current;
    if (!el) return;
    const update = () => {
      setContentWidth(el.offsetWidth);
      setContentHeight(el.offsetHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pages.length]);

  const showTextControls = activeTool === 'type' || (activeTool === 'cursor' && !!selectedElementId);
  const dims = getPageDimensions(pageSize, pageOrientation);

  return (
    <div
      className={`relative flex flex-1 flex-col overflow-hidden ${isPrinting ? 'h-auto overflow-visible' : 'h-screen'} canvas-glass ${theme === 'light' ? 'text-gray-900' : 'text-white/90'}`}
    >
      {!isPrinting && (
        <FloatingToolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          zoom={zoom}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          zoomReset={zoomReset}
          currentTextStyle={currentTextStyle}
          setCurrentTextStyle={setCurrentTextStyle}
          theme={theme}
          showTextControls={showTextControls}
        />
      )}

      {!isPrinting && (
        <nav className="tab-glass sticky top-0 z-10 flex shrink-0 flex-wrap items-center gap-2">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-r px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                  theme === 'light'
                    ? 'border-black/10 hover:bg-black/5 ' + (activeTab === tab ? 'bg-black/10 text-inherit' : 'opacity-80')
                    : 'border-white/5 hover:bg-white/5 ' + (activeTab === tab ? 'bg-white/10 text-inherit' : 'opacity-80')
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {isSpecimenTab && (
            <div
              className={`flex items-center gap-2 border-l pl-2 ${
                theme === 'light' ? 'border-black/10' : 'border-white/10'
              }`}
            >
              <select
                value={pageOrientation}
                onChange={(e) => setPageOrientation(e.target.value as PageOrientation)}
                className={
                  theme === 'light'
                    ? 'rounded border border-black/15 bg-black/5 px-2 py-1.5 text-xs font-ui text-gray-900'
                    : 'rounded border border-white/15 bg-white/5 px-2 py-1.5 text-xs font-ui'
                }
              >
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
              </select>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as PageSize)}
                className={
                  theme === 'light'
                    ? 'rounded border border-black/15 bg-black/5 px-2 py-1.5 text-xs font-ui text-gray-900'
                    : 'rounded border border-white/15 bg-white/5 px-2 py-1.5 text-xs font-ui'
                }
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
              </select>
              <span className={`text-xs font-ui ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                {pages.length} page{pages.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </nav>
      )}

      <main className="relative flex flex-1 flex-col overflow-auto p-6">
        {activeTab === 'GLYPH_INSPECTOR' && (
          <GlyphInspectorView
            glyphs={glyphs}
            fontFamily={specimenStyle.fontFamily ?? ''}
            theme={theme}
            onAddToProofing={handleAddToProofing}
          />
        )}
        {activeTab === 'TYPE_PROOFING' && (
          <TypeProofingView
            fontUrl={fontUrl}
            proofingBlocks={proofingBlocks}
            activeProofingBlockId={activeProofingBlockId}
            proofingSyncText={proofingSyncText}
            axes={axes}
            activeFeatures={activeFeatures}
            theme={theme}
            setActiveProofingBlockId={setActiveProofingBlockId}
            addProofingBlock={addProofingBlock}
            updateProofingBlock={updateProofingBlock}
            removeProofingBlock={removeProofingBlock}
            duplicateProofingBlock={duplicateProofingBlock}
            setProofingSyncText={setProofingSyncText}
            syncAllProofingBlocksText={syncAllProofingBlocksText}
          />
        )}
        {isSpecimenTab && (
        <div className="mx-auto flex w-full max-w-full flex-col items-center gap-0">
          {pages.map((pageBlocks, pageIndex) => (
            <div key={pageIndex} className="flex flex-col items-center">
              {/* Page label above each page for clear pagination */}
              <div
                className={`font-ui mb-2 text-xs uppercase tracking-widest ${
                  theme === 'light' ? 'text-gray-400' : 'text-white/50'
                }`}
              >
                Page {pageIndex + 1}
              </div>
              <div
                ref={pageIndex === 0 ? firstPageContainerRef : undefined}
                className={`relative flex min-h-0 flex-col ${
                  theme === 'light'
                    ? 'border border-black/10 bg-white shadow-xl'
                    : 'border border-white/10 bg-[#141414] shadow-xl shadow-black/30'
                }`}
                style={{
                  width: dims.width,
                  minHeight: dims.height,
                  maxWidth: '100%',
                }}
              >
                <div className="relative flex flex-1 flex-col overflow-visible p-6">
                  <div className="min-w-0 flex-1">
                    <SpecimenBlocks
                      activeTab={activeTab}
                      specimenStyle={specimenStyle}
                      isPrinting={isPrinting}
                      blockTypesToShow={pageBlocks}
                    />
                  </div>
                </div>
                {!isPrinting && pageIndex === 0 && (
                  <CanvasOverlay
                    containerRef={firstPageContainerRef}
                    scrollLeft={0}
                    scrollTop={0}
                    contentWidth={contentWidth}
                    contentHeight={contentHeight}
                    specimenStyle={specimenStyle}
                    activeTool={activeTool}
                    textFrames={textFrames}
                    drawings={drawings}
                    annotations={annotations}
                    addAnnotation={addAnnotation}
                    updateAnnotation={updateAnnotation}
                    removeAnnotation={removeAnnotation}
                    addTextFrame={addTextFrame}
                    updateTextFrame={updateTextFrame}
                    removeTextFrame={removeTextFrame}
                    addDrawingStroke={addDrawingStroke}
                    selectedElementId={selectedElementId}
                    setSelectedElementId={setSelectedElementId}
                    isPrinting={isPrinting}
                  />
                )}
              </div>
              {/* Pagination separator between pages */}
              {pageIndex < pages.length - 1 && (
                <div
                  className={`mt-4 flex w-full items-center justify-center border-t pt-4 ${
                    theme === 'light' ? 'border-black/10' : 'border-white/10'
                  }`}
                  style={{ width: dims.width, maxWidth: '100%' }}
                >
                  <span
                    className={`font-ui text-xs uppercase tracking-widest ${
                      theme === 'light' ? 'text-gray-400' : 'text-white/50'
                    }`}
                  >
                    — Page {pageIndex + 2} —
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        )}
      </main>
    </div>
  );
}
