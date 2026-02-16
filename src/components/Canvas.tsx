import { useCallback, useEffect, useRef, useState } from 'react';
import type { ActiveTab, PageSize } from '../types';
import {
  getCurrentPageBlocks,
  getTotalPages,
} from '../lib/specimenPagination';
import { SpecimenBlocks } from './SpecimenBlocks';
import { FloatingToolbar } from './FloatingToolbar';
import { CanvasOverlay } from './CanvasOverlay';

/** Tab order aligned with proof: Family → Character → Spacing → Words → Specimen → OT. */
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
];

const PAGE_DIMENSIONS: Record<PageSize, { width: string; height: string }> = {
  A4: { width: '210mm', height: '297mm' },
  A3: { width: '297mm', height: '420mm' },
};

interface CanvasProps {
  activeTab: ActiveTab;
  setActiveTab: (t: ActiveTab) => void;
  specimenStyle: React.CSSProperties;
  isPrinting: boolean;
  theme: 'dark' | 'light';
  pageSize: PageSize;
  setPageSize: (s: PageSize) => void;
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
}

export function Canvas({
  activeTab,
  setActiveTab,
  specimenStyle,
  isPrinting,
  theme,
  pageSize,
  setPageSize,
  currentPageIndex,
  setCurrentPageIndex,
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
}: CanvasProps) {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const pageContentAreaRef = useRef<HTMLDivElement>(null);
  const pageContentInnerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(1);

  const totalPages = getTotalPages(activeTab, pageSize);
  const currentPageBlocks = getCurrentPageBlocks(activeTab, pageSize, currentPageIndex);
  const safePageIndex = Math.max(0, Math.min(currentPageIndex, totalPages - 1));

  useEffect(() => {
    if (currentPageIndex !== safePageIndex) setCurrentPageIndex(safePageIndex);
  }, [currentPageIndex, safePageIndex, setCurrentPageIndex]);

  const updatePageSize = useCallback(() => {
    const el = pageContainerRef.current;
    if (!el) return;
    setContentWidth(el.offsetWidth);
    setContentHeight(el.offsetHeight);
  }, []);

  useEffect(() => {
    const el = pageContainerRef.current;
    if (!el) return;
    updatePageSize();
    const ro = new ResizeObserver(updatePageSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updatePageSize, currentPageBlocks]);

  useEffect(() => {
    const area = pageContentAreaRef.current;
    const inner = pageContentInnerRef.current;
    if (!area || !inner) return;
    const available = area.clientHeight;
    const natural = inner.scrollHeight;
    if (natural > 0 && available > 0) {
      const scale = Math.min(1, available / natural);
      setScaleFactor(scale);
    } else {
      setScaleFactor(1);
    }
  }, [currentPageBlocks, contentHeight]);

  const showTextControls = activeTool === 'type' || (activeTool === 'cursor' && !!selectedElementId);
  const dims = PAGE_DIMENSIONS[pageSize];

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
          <div
            className={`flex items-center gap-2 border-l pl-2 ${
              theme === 'light' ? 'border-black/10' : 'border-white/10'
            }`}
          >
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
              Page {safePageIndex + 1} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPageIndex(Math.max(0, safePageIndex - 1))}
              disabled={safePageIndex <= 0}
              className={
                theme === 'light'
                  ? 'rounded border border-black/15 bg-black/5 px-2 py-1 text-xs text-gray-900 disabled:opacity-50'
                  : 'rounded border border-white/15 bg-white/5 px-2 py-1 text-xs disabled:opacity-50'
              }
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setCurrentPageIndex(Math.min(totalPages - 1, safePageIndex + 1))}
              disabled={safePageIndex >= totalPages - 1}
              className={
                theme === 'light'
                  ? 'rounded border border-black/15 bg-black/5 px-2 py-1 text-xs text-gray-900 disabled:opacity-50'
                  : 'rounded border border-white/15 bg-white/5 px-2 py-1 text-xs disabled:opacity-50'
              }
            >
              Next
            </button>
          </div>
        </nav>
      )}

      <main className="relative flex flex-1 items-start justify-center overflow-auto p-6">
        <div
          ref={pageContainerRef}
          className={`relative flex flex-col shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}
          style={{
            width: dims.width,
            height: dims.height,
            maxWidth: '100%',
          }}
        >
          <div
            ref={pageContentAreaRef}
            className="relative flex-1 overflow-hidden p-6"
          >
            <div
              ref={pageContentInnerRef}
              className="absolute left-6 top-6 w-[calc(100%-3rem)] origin-top-left"
              style={{
                transform: `scale(${scaleFactor})`,
              }}
            >
              <SpecimenBlocks
                activeTab={activeTab}
                specimenStyle={specimenStyle}
                isPrinting={isPrinting}
                blockTypesToShow={currentPageBlocks}
              />
            </div>
            {scaleFactor < 1 && (
              <div className={`absolute bottom-2 left-6 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                Scaled to fit
              </div>
            )}
          </div>

          {!isPrinting && (
            <CanvasOverlay
              containerRef={pageContainerRef}
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
      </main>
    </div>
  );
}
