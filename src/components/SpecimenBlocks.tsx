import type { ActiveTab, SpecimenBlockType } from '../types';
import {
  PANGRAMS,
  ADHESION,
  HEADLINE_SENTENCES,
  PARAGRAPHS,
  WORLD_SCRIPTS,
  CAPS_SAMPLE,
  WORDS_SAMPLE,
} from '../content-presets';
import { SpecimenBlock } from './SpecimenBlock';

const TAB_TO_BLOCKS: Record<ActiveTab, SpecimenBlockType[] | 'ALL'> = {
  ALL: 'ALL',
  HEADLINES: ['HERO', 'HEADLINES'],
  TEXT: ['TEXT'],
  ADHESION: ['ADHESION', 'KERN'],
  'A-Z': ['A-Z'],
  WORDS: ['WORDS'],
  CAPS: ['CAPS'],
  LAYOUT: ['LAYOUT'],
  LETTERING: ['LETTERING'],
  KERN: ['ADHESION', 'KERN'],
  HINTING: ['HINTING'],
  LATIN: ['TEXT', 'A-Z'],
  WORLD: ['WORLD'],
};

interface SpecimenBlocksProps {
  activeTab: ActiveTab;
  specimenStyle: React.CSSProperties;
  isPrinting: boolean;
}

export function SpecimenBlocks({ activeTab, specimenStyle, isPrinting }: SpecimenBlocksProps) {
  const which = TAB_TO_BLOCKS[activeTab];
  const show = (type: SpecimenBlockType) =>
    which === 'ALL' || (Array.isArray(which) && which.includes(type));

  return (
    <div className="space-y-0">
      {show('HERO') && (
        <SpecimenBlock type="HERO" isPrinting={isPrinting}>
          <HeroBlock style={specimenStyle} />
        </SpecimenBlock>
      )}
      {show('HEADLINES') && (
        <SpecimenBlock type="HEADLINES" isPrinting={isPrinting}>
          <HeadlinesBlock style={specimenStyle} />
        </SpecimenBlock>
      )}
      {show('TEXT') && (
        <SpecimenBlock type="TEXT" isPrinting={isPrinting}>
          <TextBlock style={specimenStyle} />
        </SpecimenBlock>
      )}
      {show('ADHESION') && (
        <SpecimenBlock type="ADHESION" isPrinting={isPrinting}>
          <AdhesionBlock style={specimenStyle} />
        </SpecimenBlock>
      )}
      {show('KERN') && (
        <SpecimenBlock type="KERN" isPrinting={isPrinting}>
          <KernBlock style={specimenStyle} />
        </SpecimenBlock>
      )}
      {show('A-Z') && (
        <SpecimenBlock type="A-Z" isPrinting={isPrinting}>
          <AZBlock style={specimenStyle} />
        </SpecimenBlock>
      )}
      {show('WORDS') && (
        <SpecimenBlock type="WORDS" isPrinting={isPrinting}>
          <WordsBlock style={specimenStyle} />
        </SpecimenBlock>
      )}
      {show('CAPS') && (
        <SpecimenBlock type="CAPS" isPrinting={isPrinting}>
          <CapsBlock style={specimenStyle} />
        </SpecimenBlock>
      )}
      {show('HINTING') && (
        <SpecimenBlock type="HINTING" isPrinting={isPrinting}>
          <HintingBlock style={specimenStyle} />
        </SpecimenBlock>
      )}
      {show('LAYOUT') && (
        <SpecimenBlock type="LAYOUT" isPrinting={isPrinting}>
          <LayoutBlock style={specimenStyle} />
        </SpecimenBlock>
      )}
      {show('LETTERING') && (
        <SpecimenBlock type="LETTERING" isPrinting={isPrinting}>
          <LetteringBlock style={specimenStyle} />
        </SpecimenBlock>
      )}
      {show('WORLD') && (
        <SpecimenBlock type="WORLD" isPrinting={isPrinting}>
          <WorldBlock style={specimenStyle} />
        </SpecimenBlock>
      )}
    </div>
  );
}

function HeroBlock({ style }: { style: React.CSSProperties }) {
  const ref = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };
  return (
    <textarea
      ref={ref}
      defaultValue={PANGRAMS[0]}
      className="block w-full resize-none overflow-hidden border-0 bg-transparent p-0 outline-none"
      style={{ ...style, fontSize: 'clamp(2rem, 14vw, 12rem)', lineHeight: 1.1, minHeight: '1.2em' }}
      rows={1}
      onInput={(e) => {
        const el = e.currentTarget;
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
      }}
    />
  );
}

function HeadlinesBlock({ style }: { style: React.CSSProperties }) {
  const sizes = [96, 72, 48, 36, 24, 18, 14, 12];
  return (
    <div className="space-y-2">
      {HEADLINE_SENTENCES.slice(0, 5).map((sentence, i) => (
        <div key={i} style={{ ...style, fontSize: sizes[i] ?? 12 }} className="leading-tight">
          {sentence}
        </div>
      ))}
    </div>
  );
}

function TextBlock({ style }: { style: React.CSSProperties }) {
  const items = [
    { size: 12, text: PARAGRAPHS.short },
    { size: 14, text: PARAGRAPHS.typography },
    { size: 16, text: PARAGRAPHS.kafka },
  ];
  return (
    <div className="space-y-6">
      {items.map(({ size, text }, i) => (
        <div key={i} className="flex gap-6 border-b border-current/10 pb-6 last:border-0">
          <span className="font-ui shrink-0 text-xs opacity-70" style={{ width: '3rem' }}>
            {size}px
          </span>
          <p style={{ ...style, fontSize: size }} className="max-w-prose leading-relaxed">
            {text}
          </p>
        </div>
      ))}
    </div>
  );
}

function AdhesionBlock({ style }: { style: React.CSSProperties }) {
  return (
    <div className="space-y-4" style={{ ...style, fontSize: 24 }}>
      {ADHESION.map((s, i) => (
        <div key={i} contentEditable suppressContentEditableWarning className="outline-none">
          {s}
        </div>
      ))}
    </div>
  );
}

function KernBlock({ style }: { style: React.CSSProperties }) {
  const pairs = ['nn oo HH OO', 'AV Ta P.', 'Te Ty We'];
  return (
    <div className="space-y-4" style={{ ...style, fontSize: 32 }}>
      {pairs.map((s, i) => (
        <div key={i} contentEditable suppressContentEditableWarning className="outline-none">
          {s}
        </div>
      ))}
    </div>
  );
}

function AZBlock({ style }: { style: React.CSSProperties }) {
  const pangramSizes = [96, 72, 48, 36, 24, 18];
  const densitySizes = [16, 14, 12, 10];
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-ui mb-4 text-xs uppercase tracking-wider opacity-70">Pangram</h3>
        <div className="space-y-2" style={{ lineHeight: 1.1 }}>
          {pangramSizes.map((size, i) => (
            <div key={i} className="flex gap-4">
              <span className="font-ui w-12 shrink-0 text-xs opacity-70">{size}px</span>
              <span style={{ ...style, fontSize: size }}>{PANGRAMS[i % PANGRAMS.length]}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-ui mb-4 text-xs uppercase tracking-wider opacity-70">Density</h3>
        <div className="space-y-2" style={{ lineHeight: 1.4 }}>
          {densitySizes.map((size, i) => (
            <div key={i} className="flex gap-4">
              <span className="font-ui w-12 shrink-0 text-xs opacity-70">{size}px</span>
              <p
                style={{ ...style, fontSize: size }}
                className="flex-1 text-justify"
              >
                {PARAGRAPHS.kafka}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WordsBlock({ style }: { style: React.CSSProperties }) {
  return (
    <p style={{ ...style, fontSize: 18 }} className="leading-relaxed">
      {WORDS_SAMPLE}
    </p>
  );
}

function CapsBlock({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{ ...style, fontSize: 48 }} className="tracking-wide">
      {CAPS_SAMPLE}
    </div>
  );
}

function HintingBlock({ style }: { style: React.CSSProperties }) {
  const line = 'The quick brown fox jumps over the lazy dog.';
  return (
    <div className="space-y-0 font-mono text-left">
      {[16, 15, 14, 13, 12, 11, 10, 9, 8].map((size) => (
        <div key={size} style={{ ...style, fontSize: size }} className="leading-none">
          {size}px — {line}
        </div>
      ))}
    </div>
  );
}

function LayoutBlock({ style }: { style: React.CSSProperties }) {
  return (
    <div className="grid gap-6 border-b border-current/10 pb-6 md:grid-cols-2 lg:grid-cols-3" style={style}>
      <p className="text-sm leading-relaxed">{PARAGRAPHS.short}</p>
      <p className="text-sm leading-relaxed">{PARAGRAPHS.typography}</p>
      <p className="text-sm leading-relaxed">{PARAGRAPHS.kafka}</p>
    </div>
  );
}

function LetteringBlock({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{ ...style, fontSize: 64 }} className="leading-tight">
      {PANGRAMS[1]}
    </div>
  );
}

function WorldBlock({ style }: { style: React.CSSProperties }) {
  return (
    <div className="space-y-6" style={style}>
      <div>
        <span className="font-ui block text-xs uppercase opacity-70">Greek</span>
        <p className="mt-1 text-lg">{WORLD_SCRIPTS.greek}</p>
      </div>
      <div>
        <span className="font-ui block text-xs uppercase opacity-70">Cyrillic</span>
        <p className="mt-1 text-lg">{WORLD_SCRIPTS.cyrillic}</p>
      </div>
      <div>
        <span className="font-ui block text-xs uppercase opacity-70">Hebrew</span>
        <p className="mt-1 text-lg" dir="rtl">
          {WORLD_SCRIPTS.hebrew}
        </p>
      </div>
    </div>
  );
}
