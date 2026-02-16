import type { CanvasTool, CurrentTextStyle } from '../types';

interface FloatingToolbarProps {
  activeTool: CanvasTool;
  setActiveTool: (t: CanvasTool) => void;
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
  currentTextStyle: CurrentTextStyle;
  setCurrentTextStyle: (s: CurrentTextStyle | ((prev: CurrentTextStyle) => CurrentTextStyle)) => void;
  theme: 'dark' | 'light';
  showTextControls: boolean;
}

const TOOLS: { id: CanvasTool; label: string }[] = [
  { id: 'cursor', label: 'Select' },
  { id: 'type', label: 'Type' },
  { id: 'draw', label: 'Draw' },
  { id: 'notes', label: 'Notes' },
];

export function FloatingToolbar({
  activeTool,
  setActiveTool,
  zoom,
  zoomIn,
  zoomOut,
  zoomReset,
  currentTextStyle,
  setCurrentTextStyle,
  theme,
  showTextControls,
}: FloatingToolbarProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className="tab-glass absolute left-1/2 top-14 z-20 flex -translate-x-1/2 flex-wrap items-center gap-2 rounded-2xl px-3 py-2 shadow-lg"
      style={{ marginTop: 0 }}
    >
      <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5">
        {TOOLS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTool(id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTool === id
                ? isDark
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-900'
                : isDark
                  ? 'text-white/70 hover:bg-white/10 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-white/15" aria-hidden />

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={zoomOut}
          className="rounded-lg border border-white/15 bg-white/5 p-1.5 text-xs font-medium hover:bg-white/10"
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="min-w-[3rem] text-center text-xs font-ui tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          className="rounded-lg border border-white/15 bg-white/5 p-1.5 text-xs font-medium hover:bg-white/10"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomReset}
          className="rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs font-medium hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      {showTextControls && (
        <>
          <div className="h-6 w-px bg-white/15" aria-hidden />
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-ui opacity-70">Size</span>
              <input
                type="number"
                min={8}
                max={200}
                value={currentTextStyle.fontSize}
                onChange={(e) =>
                  setCurrentTextStyle((s) => ({
                    ...s,
                    fontSize: Math.max(8, Math.min(200, Number(e.target.value) || 16)),
                  }))
                }
                className="w-14 rounded border border-white/15 bg-white/5 px-1.5 py-1 text-right font-ui text-xs"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-ui opacity-70">Weight</span>
              <select
                value={currentTextStyle.fontWeight}
                onChange={(e) =>
                  setCurrentTextStyle((s) => ({
                    ...s,
                    fontWeight: Number(e.target.value),
                  }))
                }
                className="rounded border border-white/15 bg-white/5 px-1.5 py-1 font-ui text-xs"
              >
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-0.5">
              {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() =>
                    setCurrentTextStyle((s) => ({ ...s, textAlign: align }))
                  }
                  className={`rounded border p-1.5 text-[10px] ${
                    currentTextStyle.textAlign === align
                      ? 'border-white/30 bg-white/15'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                  title={`Align ${align}`}
                >
                  {align === 'left' && 'L'}
                  {align === 'center' && 'C'}
                  {align === 'right' && 'R'}
                  {align === 'justify' && 'J'}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-ui opacity-70">LS</span>
              <input
                type="number"
                step={0.05}
                value={currentTextStyle.letterSpacing ?? 0}
                onChange={(e) =>
                  setCurrentTextStyle((s) => ({
                    ...s,
                    letterSpacing: Number(e.target.value),
                  }))
                }
                className="w-14 rounded border border-white/15 bg-white/5 px-1.5 py-1 text-right font-ui text-xs"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <span className="font-ui opacity-70">LH</span>
              <input
                type="number"
                step={0.1}
                min={0.5}
                max={3}
                value={currentTextStyle.lineHeight ?? 1.4}
                onChange={(e) =>
                  setCurrentTextStyle((s) => ({
                    ...s,
                    lineHeight: Number(e.target.value),
                  }))
                }
                className="w-14 rounded border border-white/15 bg-white/5 px-1.5 py-1 text-right font-ui text-xs"
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
