import { useCallback, useState } from 'react';
import type { CanvasTool, TextFrame as TextFrameType } from '../types';
import { AnnotationNote } from './AnnotationNote';

interface CanvasOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollLeft: number;
  scrollTop: number;
  contentWidth: number;
  contentHeight: number;
  specimenStyle: React.CSSProperties;
  activeTool: CanvasTool;
  textFrames: TextFrameType[];
  drawings: { id: string; points: { x: number; y: number }[] }[];
  annotations: { id: string; x: number; y: number; text: string }[];
  addAnnotation: (x: number, y: number) => void;
  updateAnnotation: (id: string, text: string) => void;
  removeAnnotation: (id: string) => void;
  addTextFrame: (x: number, y: number) => void;
  updateTextFrame: (id: string, updates: Partial<Pick<TextFrameType, 'text' | 'x' | 'y' | 'fontSize' | 'fontWeight' | 'textAlign' | 'letterSpacing' | 'lineHeight'>>) => void;
  removeTextFrame: (id: string) => void;
  addDrawingStroke: (points: { x: number; y: number }[]) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  isPrinting: boolean;
}

function getContentCoords(
  container: HTMLDivElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const rect = container.getBoundingClientRect();
  const scrollLeft = container.scrollLeft ?? 0;
  const scrollTop = container.scrollTop ?? 0;
  return {
    x: clientX - rect.left + scrollLeft,
    y: clientY - rect.top + scrollTop,
  };
}

export function CanvasOverlay({
  containerRef,
  scrollLeft: _scrollLeft,
  scrollTop: _scrollTop,
  contentWidth,
  contentHeight,
  specimenStyle,
  activeTool,
  textFrames,
  drawings,
  annotations,
  addAnnotation,
  updateAnnotation,
  removeAnnotation,
  addTextFrame,
  updateTextFrame,
  removeTextFrame,
  addDrawingStroke,
  selectedElementId,
  setSelectedElementId,
  isPrinting,
}: CanvasOverlayProps) {
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const isDrawing = currentStroke.length > 0;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isPrinting) return;
      const container = containerRef.current;
      if (!container) return;
      const coords = getContentCoords(container, e.clientX, e.clientY);
      if (activeTool === 'notes') {
        addAnnotation(coords.x, coords.y);
      } else if (activeTool === 'type') {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-text-frame]') && !target.closest('[data-annotation]')) {
          addTextFrame(coords.x, coords.y);
        }
      } else if (activeTool === 'draw') {
        setCurrentStroke([coords]);
      } else if (activeTool === 'cursor') {
        const target = e.target as HTMLElement;
        const frame = target.closest('[data-text-frame]');
        const note = target.closest('[data-annotation]');
        if (frame) setSelectedElementId((frame as HTMLElement).dataset.id ?? null);
        else if (note) setSelectedElementId((note as HTMLElement).dataset.id ?? null);
        else setSelectedElementId(null);
      }
    },
    [
      isPrinting,
      activeTool,
      addAnnotation,
      addTextFrame,
      addDrawingStroke,
      setSelectedElementId,
      containerRef,
    ]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (activeTool !== 'draw' || !isDrawing || !containerRef.current) return;
      e.preventDefault();
      const coords = getContentCoords(containerRef.current, e.clientX, e.clientY);
      setCurrentStroke((prev) => [...prev, coords]);
    },
    [activeTool, isDrawing, containerRef]
  );

  const handlePointerUp = useCallback(() => {
    if (activeTool === 'draw' && currentStroke.length >= 2) {
      addDrawingStroke(currentStroke);
    }
    setCurrentStroke([]);
  }, [activeTool, currentStroke, addDrawingStroke]);

  const handlePointerLeave = useCallback(() => {
    if (activeTool === 'draw' && currentStroke.length >= 2) {
      addDrawingStroke(currentStroke);
    }
    setCurrentStroke([]);
  }, [activeTool, currentStroke, addDrawingStroke]);

  if (isPrinting) return null;

  return (
    <div
      className="absolute left-0 top-0 z-10 cursor-default"
      style={{
        width: contentWidth || '100%',
        height: contentHeight || '100%',
        pointerEvents: 'auto',
        cursor:
          activeTool === 'type' ? 'text' : activeTool === 'draw' ? 'crosshair' : activeTool === 'notes' ? 'copy' : 'default',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      {textFrames.map((frame) => (
        <div
          key={frame.id}
          data-text-frame
          data-id={frame.id}
          className={`absolute min-w-[80px] rounded border bg-white/90 px-2 py-1 dark:bg-gray-900/90 dark:text-white ${
            selectedElementId === frame.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          style={{
            left: frame.x,
            top: frame.y,
            fontFamily: specimenStyle.fontFamily,
            fontFeatureSettings: specimenStyle.fontFeatureSettings,
            fontVariationSettings: specimenStyle.fontVariationSettings,
            fontSize: frame.fontSize,
            fontWeight: frame.fontWeight,
            textAlign: frame.textAlign,
            letterSpacing: frame.letterSpacing ?? 0,
            lineHeight: frame.lineHeight ?? 1.4,
          }}
          onClick={(e) => activeTool === 'cursor' && e.stopPropagation()}
        >
          <textarea
            value={frame.text}
            onChange={(e) => updateTextFrame(frame.id, { text: e.target.value })}
            onBlur={() => {}}
            placeholder="Type…"
            className="min-h-[1.2em] w-full min-w-[60px] resize-none border-0 bg-transparent p-0 outline-none"
            rows={1}
            style={{
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              textAlign: 'inherit',
              letterSpacing: 'inherit',
              lineHeight: 'inherit',
            }}
          />
          {selectedElementId === frame.id && (
            <button
              type="button"
              className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                removeTextFrame(frame.id);
              }}
              aria-label="Remove"
            >
              ×
            </button>
          )}
        </div>
      ))}

      {drawings.length > 0 && (
        <svg
          className="absolute left-0 top-0 pointer-events-none"
          width={contentWidth}
          height={contentHeight}
        >
          {drawings.map((stroke) => (
            <polyline
              key={stroke.id}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={stroke.points.map((p) => `${p.x},${p.y}`).join(' ')}
            />
          ))}
          {currentStroke.length > 1 && (
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={currentStroke.map((p) => `${p.x},${p.y}`).join(' ')}
            />
          )}
        </svg>
      )}

      {annotations.map((a) => (
        <AnnotationNote
          key={a.id}
          id={a.id}
          x={a.x}
          y={a.y}
          text={a.text}
          onUpdate={(text) => updateAnnotation(a.id, text)}
          onRemove={() => removeAnnotation(a.id)}
        />
      ))}
    </div>
  );
}
