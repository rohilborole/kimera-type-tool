import { useRef, useEffect } from 'react';

interface AnnotationNoteProps {
  id: string;
  x: number;
  y: number;
  text: string;
  onUpdate: (text: string) => void;
  onRemove: () => void;
}

export function AnnotationNote({ id, x, y, text, onUpdate, onRemove }: AnnotationNoteProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [text]);

  return (
    <div
      data-annotation
      className="absolute z-20 w-48 rounded border-2 border-amber-400 bg-amber-50 shadow-lg dark:border-amber-500 dark:bg-amber-950"
      style={{ left: x, top: y }}
    >
      <div className="flex items-center justify-end gap-1 border-b border-amber-300/50 p-1 dark:border-amber-600/50">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded px-1.5 py-0.5 text-xs hover:bg-amber-200 dark:hover:bg-amber-800"
        >
          Delete
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="Note…"
        className="min-h-[60px] w-full resize-none border-0 bg-transparent p-2 text-sm outline-none"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      />
    </div>
  );
}
