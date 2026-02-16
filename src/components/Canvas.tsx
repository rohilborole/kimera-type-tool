import { useCallback, useRef, useState, useEffect } from 'react';
import type { ActiveTab } from '../types';
import { SpecimenBlocks } from './SpecimenBlocks';
import { FloatingToolbar } from './FloatingToolbar';
import { CanvasOverlay } from './CanvasOverlay';

const TABS: ActiveTab[] = [
  'ALL',
  'HEADLINES',
  'TEXT',
  'ADHESION',
  'A-Z',
  'WORDS',
  'CAPS',
  'LAYOUT',
  'LETTERING',
  'KERN',
  'HINTING',
  'LATIN',
  'WORLD',
];

interface CanvasProps {
  activeTab: ActiveTab;
  setActiveTab: (t: ActiveTab) => void;
  specimenStyle: React.CSSProperties;
  isPrinting: boolean;
  theme: 'dark' | 'light';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const updateScrollAndSize = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setScrollLeft(el.scrollLeft);
    setScrollTop(el.scrollTop);
    setContentWidth(el.scrollWidth);
    setContentHeight(el.scrollHeight);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateScrollAndSize();
    el.addEventListener('scroll', updateScrollAndSize);
    const ro = new ResizeObserver(updateScrollAndSize);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollAndSize);
      ro.disconnect();
    };
  }, [updateScrollAndSize]);

  const showTextControls = activeTool === 'type' || (activeTool === 'cursor' && !!selectedElementId);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-1 flex-col overflow-auto ${isPrinting ? 'h-auto overflow-visible' : 'h-screen'} canvas-glass ${theme === 'light' ? 'text-gray-900' : 'text-white/90'}`}
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
        <nav className="tab-glass sticky top-0 z-10 flex">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-r border-white/5 px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-white/5 ${
                  activeTab === tab ? 'bg-white/10 text-inherit' : 'opacity-80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>
      )}

      <main className="relative flex-1 p-6 md:p-8">
        <SpecimenBlocks
          activeTab={activeTab}
          specimenStyle={specimenStyle}
          isPrinting={isPrinting}
        />

        {!isPrinting && (
          <CanvasOverlay
            containerRef={containerRef}
            scrollLeft={scrollLeft}
            scrollTop={scrollTop}
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
      </main>
    </div>
  );
}
