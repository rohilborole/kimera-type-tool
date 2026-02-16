import { useState } from 'react';
import type { SpecimenBlockType } from '../types';

const BLOCK_LABELS: Record<SpecimenBlockType, string> = {
  HERO: 'Hero',
  HEADLINES: 'Headlines',
  TEXT: 'Text',
  ADHESION: 'Adhesion',
  'A-Z': 'A–Z',
  WORDS: 'Words',
  CAPS: 'Caps',
  SPACING: 'Spacing',
  LAYOUT: 'Layout',
  LETTERING: 'Lettering',
  KERN: 'Kern',
  HINTING: 'Hinting',
  LATIN: 'Latin',
  WORLD: 'World',
};

interface SpecimenBlockProps {
  type: SpecimenBlockType;
  children: React.ReactNode;
  isPrinting: boolean;
}

export function SpecimenBlock({ type, children, isPrinting }: SpecimenBlockProps) {
  const [hover, setHover] = useState(false);

  return (
    <section
      data-specimen-block
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="specimen-block group relative border-b border-white/10 py-8 last:border-b-0"
    >
      {!isPrinting && hover && (
        <div className="absolute -top-6 left-0 flex items-center gap-2">
          <span className="specimen-block-label font-ui rounded-lg bg-white/10 px-2 py-1 text-xs uppercase text-white/80">
            {BLOCK_LABELS[type]}
          </span>
          <button
            type="button"
            className="specimen-block-remove font-ui rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              (e.currentTarget.closest('[data-specimen-block]') as HTMLElement)?.remove();
            }}
          >
            Remove Block
          </button>
        </div>
      )}
      <div className="min-h-[2em]">{children}</div>
    </section>
  );
}
