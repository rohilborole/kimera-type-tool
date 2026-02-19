import type { FontMetadata, VariableAxis, GlyphInfo } from '../types';

/** Internal font-family used for @font-face and all canvas text when a font is loaded */
export const LOADED_FONT_FAMILY = 'KimeraLoadedFont';

/** Common OpenType feature tags — always show toggles so user can try them */
export const COMMON_OPENTYPE_FEATURES = [
  'liga', 'kern', 'calt', 'clig', 'dlig', 'hlig', 'rlig',
  'tnum', 'onum', 'lnum', 'pnum',
  'ss01', 'ss02', 'ss03', 'ss04', 'ss05', 'ss06', 'ss07', 'ss08', 'ss09', 'ss10', 'ss11',
  'smcp', 'c2sc', 'pcap', 'c2pc',
  'frac', 'ordn', 'sups', 'subs', 'sinf',
  'swsh', 'cswh', 'salt', 'styl', 'titl',
  'aalt', 'case', 'locl',
];

interface OpentypeGlyph {
  name?: string;
  unicode?: number;
}

interface OpentypeFont {
  names?: { fontFamily?: { en?: string } };
  glyphs?: { length: number; glyphs?: OpentypeGlyph[]; forEach?: (fn: (g: OpentypeGlyph, i: number) => void) => void };
  tables?: {
    fvar?: {
      axes: Array<{ tag: string; minValue: number; maxValue: number; defaultValue: number; name?: { en?: string } }>;
    };
    gsub?: unknown;
  };
}

function getFeatureTagsFromGsub(gsub: unknown): string[] {
  const tags = new Set<string>();
  try {
    if (!gsub || typeof gsub !== 'object') return [];
    const g = gsub as { features?: Array<{ tag?: string }> };
    if (Array.isArray(g.features)) {
      for (const f of g.features) if (f?.tag) tags.add(f.tag);
    }
    const scriptList = (gsub as { scriptList?: { scripts?: Array<{ defaultLangSys?: { featureIndex?: number }; featureIndexes?: number[] }> } }).scriptList;
    if (scriptList?.scripts) {
      for (const s of scriptList.scripts) {
        const featIndexes = s.featureIndexes ?? (s.defaultLangSys ? [s.defaultLangSys.featureIndex] : []);
        for (const i of featIndexes) {
          if (typeof i === 'number' && (gsub as { featureList?: { features?: Array<{ tag?: string }> } }).featureList?.features?.[i]?.tag) {
            tags.add((gsub as { featureList: { features: Array<{ tag: string }> } }).featureList.features[i].tag);
          }
        }
      }
    }
  } catch {
    /* ignore */
  }
  return Array.from(tags);
}

function extractGlyphs(font: OpentypeFont): GlyphInfo[] {
  const glyphs: GlyphInfo[] = [];
  const gl = font.glyphs;
  if (!gl) return glyphs;
  const len = gl.length ?? 0;
  const arr = (gl as { glyphs?: OpentypeGlyph[] }).glyphs;
  if (Array.isArray(arr)) {
    arr.forEach((g, i) => {
      glyphs.push({
        name: g?.name ?? `.notdef`,
        unicode: g?.unicode ?? 0,
        index: i,
      });
    });
  } else {
    for (let i = 0; i < len; i++) {
      const g = (gl as unknown as { get?: (i: number) => OpentypeGlyph }).get?.(i) ?? (gl as unknown as OpentypeGlyph[])[i];
      glyphs.push({
        name: (g as OpentypeGlyph)?.name ?? `.notdef`,
        unicode: (g as OpentypeGlyph)?.unicode ?? 0,
        index: i,
      });
    }
  }
  return glyphs;
}

function extractFromFont(font: OpentypeFont): {
  familyName: string;
  glyphCount: number;
  axes: VariableAxis[];
  featureTags: string[];
  glyphs: GlyphInfo[];
} {
  const familyName =
    (font.names?.fontFamily as { en?: string } | undefined)?.en ??
    (font as unknown as { familyName?: string }).familyName ??
    '';
  const glyphCount = font.glyphs?.length ?? 0;
  const axes: VariableAxis[] = [];
  const fvar = font.tables?.fvar;
  if (fvar?.axes) {
    for (const a of fvar.axes) {
      const name = (a.name as { en?: string } | undefined)?.en ?? a.tag;
      axes.push({
        tag: a.tag,
        name,
        min: a.minValue,
        max: a.maxValue,
        default: a.defaultValue,
        current: a.defaultValue,
      });
    }
  }
  const fromGsub = getFeatureTagsFromGsub(font.tables?.gsub);
  const featureTags = fromGsub.length > 0 ? fromGsub : [...COMMON_OPENTYPE_FEATURES];
  const glyphs = extractGlyphs(font);
  return { familyName, glyphCount, axes, featureTags, glyphs };
}

const PARSE_TIMEOUT_MS = 4000;

function parseWithOpentype(buffer: ArrayBuffer): Promise<{
  familyName: string;
  glyphCount: number;
  axes: VariableAxis[];
  featureTags: string[];
  glyphs: GlyphInfo[];
} | null> {
  const opentypeLib = (window as unknown as {
    opentype?: {
      parse: (buf: ArrayBuffer, cb?: (err: Error | null, font?: OpentypeFont) => void) => OpentypeFont | undefined;
    };
  }).opentype;

  if (!opentypeLib?.parse) return Promise.resolve(null);

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: ReturnType<typeof extractFromFont> | null) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const timeoutId = setTimeout(() => {
      finish(null);
    }, PARSE_TIMEOUT_MS);

    try {
      const syncResult = opentypeLib.parse(buffer, (err: Error | null, font?: OpentypeFont) => {
        clearTimeout(timeoutId);
        if (err || !font) finish(null);
        else finish(extractFromFont(font));
      });
      if (syncResult && typeof syncResult === 'object' && (syncResult as OpentypeFont).glyphs != null) {
        clearTimeout(timeoutId);
        finish(extractFromFont(syncResult as OpentypeFont));
      }
    } catch {
      clearTimeout(timeoutId);
      finish(null);
    }
  });
}

export async function parseFontFile(file: File): Promise<{
  blobUrl: string;
  metadata: FontMetadata;
  axes: VariableAxis[];
  featureTags: string[];
  glyphs: GlyphInfo[];
}> {
  const buffer = await file.arrayBuffer();
  const blob = new Blob([buffer], { type: file.type || 'font/otf' });
  const blobUrl = URL.createObjectURL(blob);

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const isWoff = ext === 'woff' || ext === 'woff2';
  const parsed = isWoff ? null : await parseWithOpentype(buffer);

  const displayName = parsed?.familyName?.trim() || file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  const metadata: FontMetadata = {
    familyName: displayName,
    glyphCount: parsed?.glyphCount ?? 0,
    fileType: (file.type || ext).toUpperCase(),
    fileSize: file.size,
    isVariable: (parsed?.axes?.length ?? 0) > 0,
  };
  const axes = parsed?.axes ?? [];
  const featureTags = (parsed?.featureTags?.length ? parsed.featureTags : COMMON_OPENTYPE_FEATURES) as string[];
  const glyphs = parsed?.glyphs ?? [];

  return { blobUrl, metadata, axes, featureTags, glyphs };
}

export function buildFontVariationSettings(axes: VariableAxis[]): string {
  if (axes.length === 0) return 'normal';
  return axes.map((a) => `"${a.tag}" ${a.current}`).join(', ');
}

export function buildFontFeatureSettings(activeFeatures: Record<string, boolean>): string {
  const parts = Object.entries(activeFeatures).map(([tag, on]) => `"${tag}" ${on ? 1 : 0}`);
  return parts.length ? parts.join(', ') : 'normal';
}

/** Build fontFeatureSettings with only one feature on or off (for preview). */
export function buildSingleFeatureSettings(tag: string, on: boolean): string {
  return `"${tag}" ${on ? 1 : 0}`;
}
