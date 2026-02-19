import { useCallback, useEffect, useRef, useState } from 'react';
import type { ActiveTab, PageSize, PageOrientation } from '../types';
import type { FontEntry } from '../types';
import { getOrderedBlocks } from '../lib/specimenPagination';
import { getFontFamilyForEntryId } from '../lib/fontEngine';
import { getPageDimensions } from '../lib/pageDimensions';
import { SpecimenBlocks } from './SpecimenBlocks';
import { CanvasOverlay } from './CanvasOverlay';
import { GlyphInspectorView } from './GlyphInspectorView';
import { TypeProofingView } from './TypeProofingView';
import { MainFontPanel } from './MainFontPanel';
import { VariablePlaygroundView } from './VariablePlaygroundView';
import type { Tab } from '../types';

interface CanvasProps {
  activeTab: ActiveTab;
  setActiveTab: (t: ActiveTab) => void;
  specimenStyle: React.CSSProperties;
  fontUrl: string | null;
  fontEntries: FontEntry[];
  removeFont: (id: string) => void;
  reorderFonts: (fromIndex: number, toIndex: number) => void;
  tabs: Tab[];
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  updateTabFontIds: (tabId: string, fontIds: string[]) => void;
  addCustomTab: () => void;
  axes: import('../types').VariableAxis[];
  setAxisValue: (tag: string, value: number) => void;
  axisAnimating: Record<string, boolean>;
  setAxisAnimatingState: (tag: string, animating: boolean) => void;
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
  activeTab: _activeTab,
  setActiveTab: _setActiveTab,
  specimenStyle,
  fontUrl,
  fontEntries,
  removeFont: _removeFont,
  reorderFonts: _reorderFonts,
  tabs,
  activeTabId,
  setActiveTabId,
  updateTabFontIds,
  addCustomTab,
  axes,
  setAxisValue,
  axisAnimating,
  setAxisAnimatingState,
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
  setActiveTool: _setActiveTool,
  zoom: _zoom,
  zoomIn: _zoomIn,
  zoomOut: _zoomOut,
  zoomReset: _zoomReset,
  currentTextStyle: _currentTextStyle,
  setCurrentTextStyle: _setCurrentTextStyle,
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

  const activeTabRecord = tabs.find((t) => t.id === activeTabId);
  const mainTab = tabs.find((t) => t.type === 'main');
  const fontEntriesToShow: FontEntry[] =
    activeTabId === 'main' && mainTab?.fontIds?.length
      ? mainTab.fontIds
          .map((id) => fontEntries.find((e) => e.id === id))
          .filter((e): e is FontEntry => !!e)
      : fontEntries;

  const isSpecimenTab = activeTabId === 'main';
  const specimenBlocks = getOrderedBlocks('ALL');

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
  }, [isSpecimenTab, fontEntriesToShow.length]);

  const dims = getPageDimensions(pageSize, pageOrientation);

  return (
    <div
      className={`relative flex flex-1 flex-col overflow-hidden ${isPrinting ? 'h-auto overflow-visible' : 'h-screen'} canvas-glass ${theme === 'light' ? 'text-gray-900' : 'text-white/90'}`}
    >
      {!isPrinting && (
        <nav className="tab-glass sticky top-0 z-10 flex shrink-0 flex-wrap items-center gap-2">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`shrink-0 border-r px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                  theme === 'light'
                    ? 'border-black/10 hover:bg-black/5 ' + (activeTabId === tab.id ? 'bg-black/10 text-inherit' : 'opacity-80')
                    : 'border-white/5 hover:bg-white/5 ' + (activeTabId === tab.id ? 'bg-white/10 text-inherit' : 'opacity-80')
                }`}
              >
                {tab.name}
              </button>
            ))}
            <button
              type="button"
              onClick={addCustomTab}
              className={`shrink-0 border-r px-3 py-3 text-xs font-medium opacity-70 transition-colors hover:opacity-100 ${
                theme === 'light' ? 'border-black/10 hover:bg-black/5' : 'border-white/5 hover:bg-white/5'
              }`}
              title="Add custom tab"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setActiveTabId('glyph-inspector')}
              className={`shrink-0 border-r px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                theme === 'light'
                  ? 'border-black/10 hover:bg-black/5 ' + (activeTabId === 'glyph-inspector' ? 'bg-black/10 text-inherit' : 'opacity-80')
                  : 'border-white/5 hover:bg-white/5 ' + (activeTabId === 'glyph-inspector' ? 'bg-white/10 text-inherit' : 'opacity-80')
              }`}
            >
              Glyph Inspector
            </button>
            <button
              type="button"
              onClick={() => setActiveTabId('type-proofing')}
              className={`shrink-0 border-r px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                theme === 'light'
                  ? 'border-black/10 hover:bg-black/5 ' + (activeTabId === 'type-proofing' ? 'bg-black/10 text-inherit' : 'opacity-80')
                  : 'border-white/5 hover:bg-white/5 ' + (activeTabId === 'type-proofing' ? 'bg-white/10 text-inherit' : 'opacity-80')
              }`}
            >
              Type Proofing
            </button>
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
            </div>
          )}
        </nav>
      )}

      <main className="relative flex flex-1 flex-col overflow-auto p-6">
        {activeTabId === 'glyph-inspector' && (
          <GlyphInspectorView
            glyphs={glyphs}
            fontFamily={specimenStyle.fontFamily ?? ''}
            theme={theme}
            onAddToProofing={handleAddToProofing}
          />
        )}
        {activeTabId === 'type-proofing' && (
          <TypeProofingView
            fontUrl={fontUrl}
            proofingBlocks={proofingBlocks}
            activeProofingBlockId={activeProofingBlockId}
            proofingSyncText={proofingSyncText}
            axes={axes}
            activeFeatures={activeFeatures}
            theme={theme}
            glyphs={glyphs}
            setActiveProofingBlockId={setActiveProofingBlockId}
            addProofingBlock={addProofingBlock}
            updateProofingBlock={updateProofingBlock}
            removeProofingBlock={removeProofingBlock}
            duplicateProofingBlock={duplicateProofingBlock}
            setProofingSyncText={setProofingSyncText}
            syncAllProofingBlocksText={syncAllProofingBlocksText}
          />
        )}
        {activeTabId === 'variable' && (
          <VariablePlaygroundView
            specimenStyle={specimenStyle}
            fontUrl={fontUrl}
            axes={axes}
            setAxisValue={setAxisValue}
            axisAnimating={axisAnimating}
            setAxisAnimatingState={setAxisAnimatingState}
            theme={theme}
          />
        )}
        {activeTabRecord?.type === 'custom' && (
          <div
            className={`rounded-xl border p-8 text-center ${
              theme === 'light' ? 'border-black/10 bg-white' : 'border-white/10 bg-white/5'
            }`}
          >
            <p className={theme === 'light' ? 'text-gray-500' : 'text-white/60'}>
              Custom tab — block list (Phase 4).
            </p>
          </div>
        )}
        {isSpecimenTab && specimenBlocks.length > 0 && (
        <div className="mx-auto flex w-full max-w-full flex-col items-center gap-8">
          {mainTab && (
            <div className="w-full max-w-2xl">
              <MainFontPanel
                fontEntries={fontEntries}
                selectedFontIds={mainTab.fontIds ?? []}
                onSelectionChange={(fontIds) => updateTabFontIds(mainTab.id, fontIds)}
                theme={theme}
              />
            </div>
          )}
          {fontEntriesToShow.length === 0 ? (
          <div
            ref={firstPageContainerRef}
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
                  activeTab="ALL"
                  specimenStyle={specimenStyle}
                  isPrinting={isPrinting}
                  blockTypesToShow={specimenBlocks}
                  glyphs={glyphs}
                />
              </div>
            </div>
          </div>
            ) : (
            fontEntriesToShow.map((entry, idx) => (
              <div
                key={entry.id}
                ref={idx === 0 ? firstPageContainerRef : undefined}
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
                <div className="border-b border-current/10 px-4 py-2 font-ui text-xs uppercase tracking-wider opacity-70">
                  {entry.metadata?.familyName ?? `Font ${idx + 1}`}
                </div>
                <div className="relative flex flex-1 flex-col overflow-visible p-6">
                  <div className="min-w-0 flex-1">
                    <SpecimenBlocks
                      activeTab="ALL"
                      specimenStyle={{
                        ...specimenStyle,
                        fontFamily: `"${getFontFamilyForEntryId(entry.id)}", sans-serif`,
                      }}
                      isPrinting={isPrinting}
                      blockTypesToShow={specimenBlocks}
                      glyphs={entry.glyphs ?? []}
                    />
                  </div>
                </div>
              </div>
            ))
            )}
          {!isPrinting && (
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
        )}
      </main>
    </div>
  );
}
