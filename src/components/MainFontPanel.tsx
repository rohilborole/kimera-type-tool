import { useState } from 'react';
import type { FontEntry } from '../types';

interface MainFontPanelProps {
  fontEntries: FontEntry[];
  selectedFontIds: string[];
  onSelectionChange: (fontIds: string[]) => void;
  theme: 'dark' | 'light';
}

export function MainFontPanel({
  fontEntries,
  selectedFontIds,
  onSelectionChange,
  theme,
}: MainFontPanelProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const ordered = selectedFontIds
    .map((id) => fontEntries.find((e) => e.id === id))
    .filter((e): e is FontEntry => !!e);

  const addFont = (id: string) => {
    if (selectedFontIds.includes(id)) return;
    onSelectionChange([...selectedFontIds, id]);
  };

  const removeFont = (id: string) => {
    onSelectionChange(selectedFontIds.filter((f) => f !== id));
  };

  const reorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const next = [...ordered];
    const [removed] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, removed);
    onSelectionChange(next.map((e) => e.id));
  };

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDragIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (dragIndex === null) return;
    reorder(dragIndex, toIndex);
    setDragIndex(null);
  };

  const available = fontEntries.filter((e) => !selectedFontIds.includes(e.id));

  const panelClass = theme === 'light'
    ? 'border-black/10 bg-white/80 text-gray-900'
    : 'border-white/10 bg-white/5 text-white/90';

  return (
    <div className={`rounded-xl border p-3 ${panelClass}`}>
      <h3 className="mb-2 font-ui text-xs font-medium uppercase tracking-wider opacity-80">
        Fonts for this page
      </h3>
      {ordered.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {ordered.map((entry, index) => (
            <li
              key={entry.id}
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={() => setDragIndex(null)}
              className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs ${
                theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-white/5'
              }`}
            >
              <span className="cursor-grab touch-none opacity-60" title="Drag to reorder">⋮⋮</span>
              <span className="min-w-0 flex-1 truncate font-medium">
                {entry.metadata?.familyName ?? `Font ${index + 1}`}
              </span>
              <button
                type="button"
                onClick={() => removeFont(entry.id)}
                className="shrink-0 rounded px-1.5 py-0.5 text-red-400 hover:bg-red-500/20"
                title="Remove from this page"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {available.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="mr-1 font-ui text-xs opacity-70">Add:</span>
          {available.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => addFont(entry.id)}
              className={`rounded border px-2 py-1 text-xs font-medium ${
                theme === 'light'
                  ? 'border-gray-300 hover:bg-gray-100'
                  : 'border-white/20 hover:bg-white/10'
              }`}
            >
              {entry.metadata?.familyName ?? entry.id.slice(0, 8)}
            </button>
          ))}
        </div>
      )}
      {fontEntries.length === 0 && (
        <p className="text-xs opacity-70">Upload fonts in the sidebar to add them here.</p>
      )}
    </div>
  );
}
