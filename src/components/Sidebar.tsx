import { useRef, useState } from 'react';
import type { Theme, VariableAxis } from '../types';
import type { FontEntry } from '../types';
import { AxisControl } from './AxisControl';
import { buildSingleFeatureSettings } from '../lib/fontEngine';
import { getSampleForFeature, getLabelForFeature } from '../lib/featureSamples';

const MAX_FONTS = 10;

interface SidebarProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  fontUrl: string | null;
  fontEntries: FontEntry[];
  removeFont: (id: string) => void;
  reorderFonts: (fromIndex: number, toIndex: number) => void;
  metadata: { familyName: string; fileType: string; fileSize: number; glyphCount: number } | null;
  axes: VariableAxis[];
  setAxisValue: (tag: string, value: number) => void;
  activeFeatures: Record<string, boolean>;
  toggleFeature: (tag: string) => void;
  loadFont: (file: File) => Promise<void>;
  resetFont: () => void;
  acceptFont: string;
  onExportPdf: () => void;
  axisAnimating: Record<string, boolean>;
  setAxisAnimatingState: (tag: string, animating: boolean) => void;
  loadError: string | null;
  loading: boolean;
  clearLoadError: () => void;
  specimenStyle: React.CSSProperties;
}

const ACCEPT_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2'];

function acceptFile(file: File, acceptFont: string): boolean {
  const name = file.name.toLowerCase();
  return ACCEPT_EXTENSIONS.some((ext) => name.endsWith(ext)) ||
    acceptFont.split(',').some((ext) => name.endsWith(ext.trim().toLowerCase()));
}

const PREVIEW_FONT_SIZE = 16;

export function Sidebar({
  theme,
  setTheme,
  fontUrl,
  fontEntries,
  removeFont,
  reorderFonts,
  metadata: _metadata,
  axes,
  setAxisValue,
  activeFeatures,
  toggleFeature,
  loadFont,
  resetFont,
  acceptFont,
  onExportPdf,
  axisAnimating,
  setAxisAnimatingState,
  loadError,
  loading,
  clearLoadError,
  specimenStyle,
}: SidebarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && acceptFile(file, acceptFont) && fontEntries.length < MAX_FONTS) loadFont(file).catch(() => {});
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && fontEntries.length < MAX_FONTS) loadFont(file).catch(() => {});
    e.target.value = '';
  };

  const handleListDragStart = (index: number) => (e: React.DragEvent) => {
    setDragIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleListDragOver = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (dragIndex === null) return;
    if (dragIndex !== toIndex) reorderFonts(dragIndex, toIndex);
    setDragIndex(null);
  };
  const handleListDragEnd = () => setDragIndex(null);

  const featureTags = fontUrl && Object.keys(activeFeatures).length > 0
    ? Object.keys(activeFeatures).sort()
    : [];

  const baseStyle: React.CSSProperties = {
    fontFamily: specimenStyle.fontFamily,
    fontVariationSettings: specimenStyle.fontVariationSettings,
    fontSize: PREVIEW_FONT_SIZE,
  };

  return (
    <aside className={`glass-panel flex h-full w-[320px] shrink-0 flex-col print:hidden ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
      <header className="glass-header flex items-center justify-between px-4 py-3">
        <h1 className="text-sm font-semibold tracking-tight">KIMERA 0.1</h1>
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="glass-button rounded-lg px-3 py-1.5 text-xs font-medium uppercase tracking-wider"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {/* Fonts */}
        <section>
          <h2 className={`mb-2 text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>Fonts</h2>
          {fontEntries.length > 0 && (
            <ul className="mb-3 space-y-2">
              {fontEntries.map((entry, index) => (
                <li
                  key={entry.id}
                  draggable
                  onDragStart={handleListDragStart(index)}
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                  onDrop={(e) => handleListDragOver(e, index)}
                  onDragEnd={handleListDragEnd}
                  className={`flex items-center gap-2 rounded-xl border p-2 ${
                    theme === 'light' ? 'border-gray-200 bg-gray-50/80' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <span className="cursor-grab touch-none text-xs opacity-60" title="Drag to reorder">⋮⋮</span>
                  <span className="min-w-0 flex-1 truncate text-xs font-medium" title={entry.metadata?.familyName}>
                    {entry.metadata?.familyName ?? `Font ${index + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFont(entry.id)}
                    className="shrink-0 rounded px-1.5 py-0.5 text-xs text-red-400 hover:bg-red-500/20"
                    title="Remove font"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          {fontEntries.length < MAX_FONTS && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`glass-upload flex min-h-[80px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
                isDragging ? 'border-white/50 bg-white/10' : 'border-white/20 hover:border-white/40 hover:bg-white/5'
              } ${theme === 'light' ? 'border-gray-300 hover:border-gray-400' : ''} ${loading ? 'pointer-events-none opacity-70' : ''}`}
            >
              {loading ? (
                <span className="text-sm">Loading font…</span>
              ) : (
                <>
                  <span className="block text-xs font-medium">Add font · drop or click</span>
                  <span className={`mt-0.5 block text-xs ${theme === 'light' ? 'text-gray-500' : 'text-white/60'}`}>
                    {fontEntries.length}/{MAX_FONTS}
                  </span>
                  {loadError && (
                    <p className="mt-2 max-w-full truncate text-xs text-red-400">{loadError}</p>
                  )}
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          )}
          {fontEntries.length > 0 && (
            <button
              type="button"
              onClick={() => { clearLoadError(); resetFont(); }}
              className={`mt-3 w-full rounded-xl border py-2 text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'border-gray-300 text-gray-800 hover:bg-gray-100' : 'border-white/20 text-white/90 hover:bg-white/10'}`}
            >
              Reset all fonts
            </button>
          )}
        </section>

        {/* Variable Axes */}
        {axes.length > 0 && (
          <section>
            <h2 className={`mb-2 text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>Variable Axes</h2>
            <div className="space-y-3">
              {axes.map((axis) => (
                <AxisControl
                  key={axis.tag}
                  axis={axis}
                  setValue={(v) => setAxisValue(axis.tag, v)}
                  isAnimating={!!axisAnimating[axis.tag]}
                  setAnimating={(v) => setAxisAnimatingState(axis.tag, v)}
                />
              ))}
            </div>
          </section>
        )}

        {/* OpenType Features — toggle + visual preview (Off vs On) */}
        {featureTags.length > 0 && fontUrl && (
          <section>
            <h2 className={`mb-2 text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>OpenType Features</h2>
            <div className="space-y-3">
              {featureTags.map((tag) => {
                const sample = getSampleForFeature(tag);
                const label = getLabelForFeature(tag);
                const isOn = !!activeFeatures[tag];
                return (
                  <div
                    key={tag}
                    className={`glass-card rounded-xl border p-3 transition-colors ${
                      isOn
                        ? theme === 'light'
                          ? 'border-gray-300 bg-gray-100/80'
                          : 'border-white/25 bg-white/10'
                        : theme === 'light'
                          ? 'border-gray-200 bg-gray-50/50'
                          : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium opacity-90" title={tag}>
                        {label}
                      </span>
                      <button
                        type="button"
                        aria-label={`Toggle ${tag}`}
                        onClick={() => toggleFeature(tag)}
                        className={`relative h-6 w-10 shrink-0 rounded-full border transition-colors ${
                          isOn
                            ? theme === 'light'
                              ? 'border-gray-400 bg-gray-700'
                              : 'border-white/40 bg-white/30'
                            : theme === 'light'
                              ? 'border-gray-300 bg-gray-200'
                              : 'border-white/20 bg-white/10'
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                            isOn ? 'left-5' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className={`mb-0.5 font-ui text-[10px] uppercase ${theme === 'light' ? 'text-gray-500' : 'text-white/50'}`}>
                          Off
                        </div>
                        <div
                          className="min-h-[1.5em] truncate rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/5"
                          style={{
                            ...baseStyle,
                            fontFeatureSettings: buildSingleFeatureSettings(tag, false),
                          }}
                        >
                          {sample}
                        </div>
                      </div>
                      <div>
                        <div className={`mb-0.5 font-ui text-[10px] uppercase ${theme === 'light' ? 'text-gray-500' : 'text-white/50'}`}>
                          On
                        </div>
                        <div
                          className="min-h-[1.5em] truncate rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/5"
                          style={{
                            ...baseStyle,
                            fontFeatureSettings: buildSingleFeatureSettings(tag, true),
                          }}
                        >
                          {sample}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Export */}
        <section className="mt-auto space-y-3 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onExportPdf}
            className="glass-button w-full rounded-xl py-2.5 text-xs font-medium uppercase tracking-wider"
          >
            Export PDF Specimen
          </button>
        </section>
      </div>
    </aside>
  );
}
