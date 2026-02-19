import type { GlyphInfo } from '../types';
import { isGlyphMissingOrEmpty } from '../lib/fontEngine';

interface MissingGlyphTextProps {
  text: string;
  style: React.CSSProperties;
  glyphs: GlyphInfo[];
  className?: string;
  /** Optional component to wrap each segment (e.g. p, span). Default span. */
  as?: 'span' | 'p' | 'div';
}

/**
 * Renders text with missing or empty glyphs (e.g. .notdef) replaced by a red circle.
 * Splits by code point and uses glyphs to decide replacement.
 */
export function MissingGlyphText({
  text,
  style,
  glyphs,
  className = '',
  as: Wrapper = 'span',
}: MissingGlyphTextProps) {
  if (!text) return <Wrapper className={className} style={style} />;
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < text.length; ) {
    const code = text.codePointAt(i) ?? text.charCodeAt(i);
    const char = code >= 0x10000 ? text.slice(i, i + 2) : text[i];
    const missing = isGlyphMissingOrEmpty(glyphs, code);
    if (missing) {
      nodes.push(
        <span
          key={`${i}-${code}`}
          className="inline-flex h-[1em] w-[1em] items-center justify-center rounded-full bg-red-500 align-middle"
          style={{ fontSize: '0.6em', verticalAlign: 'middle' }}
          aria-hidden
          title={`U+${code.toString(16).toUpperCase().padStart(4, '0')} missing`}
        />
      );
    } else {
      nodes.push(<span key={`${i}-${code}`}>{char}</span>);
    }
    i += code >= 0x10000 ? 2 : 1;
  }
  return (
    <Wrapper className={className} style={style}>
      {nodes}
    </Wrapper>
  );
}
