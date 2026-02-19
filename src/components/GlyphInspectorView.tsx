import { useCallback, useMemo, useRef, useState } from 'react';
import type { GlyphInfo } from '../types';

const ROW_HEIGHT = 48;
const COLS = 16;
const CONTAINER_HEIGHT = 400;

interface GlyphInspectorViewProps {
  glyphs: GlyphInfo[];
  fontFamily: string;
  theme: 'dark' | 'light';
  onAddToProofing: (char: string) => void;
}

export function GlyphInspectorView({
  glyphs,
  fontFamily,
  theme,
  onAddToProofing,
}: GlyphInspectorViewProps) {
  const [selected, setSelected] = useState<GlyphInfo | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    const r: GlyphInfo[][] = [];
    for (let i = 0; i < glyphs.length; i += COLS) {
      r.push(glyphs.slice(i, i + COLS));
    }
    return r;
  }, [glyphs]);

  const totalHeight = rows.length * ROW_HEIGHT;
  const visibleStart = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT));
  const visibleEnd = Math.min(
    rows.length,
    Math.ceil((scrollTop + CONTAINER_HEIGHT) / ROW_HEIGHT) + 1
  );
  const visibleRows = useMemo(
    () => rows.slice(visibleStart, visibleEnd),
    [rows, visibleStart, visibleEnd]
  );
  const offsetY = visibleStart * ROW_HEIGHT;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) setScrollTop(el.scrollTop);
  }, []);

  const cellStyle: React.CSSProperties = {
    fontFamily: fontFamily ? `${fontFamily}, sans-serif` : 'sans-serif',
    fontSize: 24,
  };

  if (glyphs.length === 0) {
    return (
      <div
        className={`rounded-lg border p-8 text-center ${
          theme === 'light' ? 'border-black/10 bg-white' : 'border-white/10 bg-white/5'
        }`}
      >
        <p className={theme === 'light' ? 'text-gray-500' : 'text-white/60'}>
          Load a font to inspect glyphs (TTF/OTF only; WOFF/WOFF2 do not expose glyph list here).
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div
          ref={scrollRef}
          className="overflow-auto rounded-lg border"
          style={{
            height: CONTAINER_HEIGHT,
            borderColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
          }}
          onScroll={handleScroll}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div style={{ transform: `translateY(${offsetY}px)` }}>
              {visibleRows.map((row, ri) => (
                <div
                  key={visibleStart + ri}
                  className="grid flex-shrink-0 items-center justify-items-center gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                    height: ROW_HEIGHT,
                  }}
                >
                  {row.map((g) => {
                    const char = g.unicode ? String.fromCodePoint(g.unicode) : '';
                    const isSelected = selected?.index === g.index;
                    return (
                      <button
                        key={g.index}
                        type="button"
                        onClick={() => setSelected(g)}
                        className={`flex h-10 w-10 items-center justify-center rounded border text-center transition-colors ${
                          isSelected
                            ? theme === 'light'
                              ? 'border-black/30 bg-black/10'
                              : 'border-white/30 bg-white/10'
                            : theme === 'light'
                              ? 'border-black/10 hover:bg-black/5'
                              : 'border-white/10 hover:bg-white/5'
                        }`}
                        style={cellStyle}
                        title={g.name}
                      >
                        {char || '·'}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className={`mt-2 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-white/50'}`}>
          {glyphs.length} glyphs — click a glyph for details
        </p>
      </div>

      {selected && (
        <div
          className={`w-64 shrink-0 rounded-lg border p-4 ${
            theme === 'light' ? 'border-black/10 bg-white' : 'border-white/10 bg-white/5'
          }`}
        >
          <h3 className={`font-ui mb-3 text-xs uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-white/60'}`}>
            Glyph details
          </h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className={theme === 'light' ? 'text-gray-500' : 'text-white/50'}>Name</dt>
              <dd className="font-mono">{selected.name}</dd>
            </div>
            <div>
              <dt className={theme === 'light' ? 'text-gray-500' : 'text-white/50'}>Unicode (hex)</dt>
              <dd className="font-mono">U+{selected.unicode.toString(16).toUpperCase().padStart(4, '0')}</dd>
            </div>
            <div>
              <dt className={theme === 'light' ? 'text-gray-500' : 'text-white/50'}>Index</dt>
              <dd className="font-mono">{selected.index}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => {
              const char = selected.unicode ? String.fromCodePoint(selected.unicode) : '';
              if (char) onAddToProofing(char);
            }}
            className={`mt-4 w-full rounded-lg border py-2 text-xs font-medium uppercase tracking-wider ${
              theme === 'light'
                ? 'border-black/20 bg-black/10 hover:bg-black/15'
                : 'border-white/20 bg-white/10 hover:bg-white/15'
            }`}
          >
            Add to Proofing
          </button>
        </div>
      )}
    </div>
  );
}
