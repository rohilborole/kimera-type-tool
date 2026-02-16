import type { ActiveTab, SpecimenBlockType } from '../types';
import {
  PANGRAMS,
  ADHESION_GRID,
  ADHESION_REPEAT,
  HEADLINE_SENTENCES,
  PARAGRAPHS,
  WORLD_SCRIPTS,
  CHARS_UC_LINE1,
  CHARS_UC_LINE2,
  CHARS_LC_LINE1,
  CHARS_LC_LINE2,
  CHARS_NUMERALS,
  CHARS_PUNCTUATION,
  SPACING_LC,
  SPACING_UC,
  SPACING_PUNCT_LC,
  SPACING_PUNCT_UC,
  SPACING_NUMERALS_LC,
  SPACING_NUMERALS_UC,
  SPACING_NUMERALS_HH,
  WORDS_AZ,
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
  SPACING: ['SPACING'],
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
  /** When set, only these block types are rendered (for page-based view). */
  blockTypesToShow?: SpecimenBlockType[];
}

export function SpecimenBlocks({
  activeTab,
  specimenStyle,
  isPrinting,
  blockTypesToShow,
}: SpecimenBlocksProps) {
  const which = TAB_TO_BLOCKS[activeTab];
  const show = (type: SpecimenBlockType) =>
    blockTypesToShow
      ? blockTypesToShow.includes(type)
      : which === 'ALL' || (Array.isArray(which) && which.includes(type));

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
      {show('SPACING') && (
        <SpecimenBlock type="SPACING" isPrinting={isPrinting}>
          <SpacingBlock style={specimenStyle} />
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

const HEADLINE_SIZES_PT = [27, 22, 17, 13, 11, 9, 7.5, 6];

function HeadlinesBlock({ style }: { style: React.CSSProperties }) {
  return (
    <div className="space-y-3">
      {HEADLINE_SIZES_PT.slice(0, 6).map((pt, i) => (
        <div key={pt} className="flex gap-4 items-baseline">
          <span className="font-ui shrink-0 text-xs opacity-70">{pt} pt</span>
          <div style={{ ...style, fontSize: `${pt}pt` }} className="leading-tight">
            {HEADLINE_SENTENCES[i % HEADLINE_SENTENCES.length] ?? PARAGRAPHS.germanSpecimen.slice(0, 60) + '…'}
          </div>
        </div>
      ))}
    </div>
  );
}

const WATERFALL_SIZES_PT = [27, 22, 17, 13, 11, 10, 9, 7.5, 6];

function TextBlock({ style }: { style: React.CSSProperties }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-ui mb-4 text-xs uppercase tracking-wider opacity-70">Regular Specimen / Waterfall</h3>
        <div className="space-y-4">
          {WATERFALL_SIZES_PT.map((pt) => (
            <div key={pt} className="flex gap-4 border-b border-current/10 pb-4 last:border-0">
              <span className="font-ui shrink-0 text-xs opacity-70" style={{ width: '4rem' }}>
                {pt} pt
              </span>
              <p
                style={{ ...style, fontSize: `${pt}pt` }}
                className="max-w-prose leading-relaxed"
              >
                {PARAGRAPHS.germanSpecimen}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-ui mb-4 text-xs uppercase tracking-wider opacity-70">Paragraphs</h3>
        <div className="space-y-6">
          {[
            { size: 12, text: PARAGRAPHS.short },
            { size: 14, text: PARAGRAPHS.typography },
            { size: 16, text: PARAGRAPHS.kafka },
          ].map(({ size, text }, i) => (
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
      </div>
    </div>
  );
}

function AdhesionBlock({ style }: { style: React.CSSProperties }) {
  return (
    <div className="space-y-4" style={{ ...style, fontSize: '14pt' }}>
      <div className="space-y-1 font-mono text-[11pt]" style={style}>
        <div className="flex flex-wrap gap-x-8">
          {Array(5)
            .fill(ADHESION_REPEAT[0])
            .map((word, i) => (
              <span key={i}>{word}</span>
            ))}
        </div>
        <div className="flex flex-wrap gap-x-8">
          {Array(5)
            .fill(ADHESION_REPEAT[1])
            .map((word, i) => (
              <span key={i}>{word}</span>
            ))}
        </div>
      </div>
      <div className="space-y-0.5 font-mono text-[10pt] leading-relaxed" style={style}>
        {ADHESION_GRID.map((row, ri) => (
          <div key={ri} className="flex flex-wrap gap-x-6">
            {row.split(/\s+/).map((word, wi) => (
              <span key={wi}>{word}</span>
            ))}
          </div>
        ))}
      </div>
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
  const charSize = '14pt';
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-ui mb-3 text-xs uppercase tracking-wider opacity-70">Character Overview</h3>
        <div className="space-y-2" style={{ ...style, fontSize: charSize, lineHeight: 1.3 }}>
          <div>{CHARS_UC_LINE1}</div>
          <div>{CHARS_UC_LINE2}</div>
          <div>{CHARS_LC_LINE1}</div>
          <div>{CHARS_LC_LINE2}</div>
          <div>{CHARS_NUMERALS}</div>
          <div>{CHARS_NUMERALS}</div>
          <div className="flex flex-wrap gap-x-4">
            {CHARS_PUNCTUATION.map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        </div>
      </div>
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
  const aToK = WORDS_AZ.filter((w) => w[0].toUpperCase() >= 'A' && w[0].toUpperCase() <= 'K');
  const lToZ = WORDS_AZ.filter((w) => w[0].toUpperCase() >= 'L' && w[0].toUpperCase() <= 'Z');
  return (
    <div className="space-y-4" style={{ ...style, fontSize: '11pt' }}>
      <h3 className="font-ui text-xs uppercase tracking-wider opacity-70">UC – LC Pairing</h3>
      <div className="grid grid-cols-2 gap-x-12 gap-y-1 leading-relaxed">
        <div>
          <div className="font-ui mb-2 text-xs font-medium opacity-80">A – K</div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {aToK.map((word, i) => (
              <span key={i}>{word}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="font-ui mb-2 text-xs font-medium opacity-80">L – Z</div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {lToZ.map((word, i) => (
              <span key={i}>{word}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CapsBlock({ style }: { style: React.CSSProperties }) {
  return (
    <div className="space-y-2" style={{ ...style, fontSize: '14pt' }}>
      <div>{CHARS_UC_LINE1}</div>
      <div>{CHARS_UC_LINE2}</div>
    </div>
  );
}

function SpacingBlock({ style }: { style: React.CSSProperties }) {
  const pt = '10pt';
  return (
    <div className="space-y-6 font-mono" style={{ ...style, fontSize: pt }}>
      <div>
        <h3 className="font-ui mb-2 text-xs uppercase tracking-wider opacity-70">Lowercase</h3>
        <div className="space-y-0.5 leading-tight">
          {SPACING_LC.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-ui mb-2 text-xs uppercase tracking-wider opacity-70">Uppercase</h3>
        <div className="space-y-0.5 leading-tight">
          {SPACING_UC.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-ui mb-2 text-xs uppercase tracking-wider opacity-70">With punctuation</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 leading-tight">
          <div>
            {SPACING_PUNCT_LC.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
          <div>
            {SPACING_PUNCT_UC.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-ui mb-2 text-xs uppercase tracking-wider opacity-70">Numerals</h3>
        <div className="space-y-1 leading-tight">
          {SPACING_NUMERALS_LC.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          {SPACING_NUMERALS_UC.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          {SPACING_NUMERALS_HH.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

const HINTING_SIZES_PT = [16, 14, 12, 11, 10, 9, 7.5, 6];

function HintingBlock({ style }: { style: React.CSSProperties }) {
  const line = 'The quick brown fox jumps over the lazy dog.';
  return (
    <div className="space-y-0.5 font-mono text-left">
      {HINTING_SIZES_PT.map((pt) => (
        <div key={pt} className="flex gap-4 items-baseline">
          <span className="font-ui shrink-0 text-xs opacity-70">{pt} pt</span>
          <span style={{ ...style, fontSize: `${pt}pt` }} className="leading-none">
            {line}
          </span>
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
