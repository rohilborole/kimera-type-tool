import { useEffect, useMemo } from 'react';
import { getFontFamilyForEntryId } from '../lib/fontEngine';
import type { FontEntry } from '../types';

function formatForFontFace(fileType: string | undefined): string {
  if (!fileType) return '';
  const t = fileType.toUpperCase();
  if (t === 'TTF' || t === 'FONT/TTF') return 'truetype';
  if (t === 'OTF' || t === 'FONT/OTF') return 'opentype';
  if (t === 'WOFF' || t === 'FONT/WOFF') return 'woff';
  if (t === 'WOFF2' || t === 'FONT/WOFF2') return 'woff2';
  return '';
}

export function useFontFace(fontEntries: FontEntry[]) {
  const fontEntriesKey = useMemo(
    () => fontEntries.map((e) => `${e.id}:${e.blobUrl}`).join('|'),
    [fontEntries]
  );

  useEffect(() => {
    if (fontEntries.length === 0) return;
    const id = 'kimera-loaded-fonts';
    let style = document.getElementById(id) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }
    const rules = fontEntries.map((entry) => {
      const format = formatForFontFace(entry.fileType);
      const formatPart = format ? ` format("${format}")` : '';
      const family = getFontFamilyForEntryId(entry.id);
      return `@font-face { font-family: "${family}"; src: url("${entry.blobUrl}")${formatPart}; font-display: block; }`;
    });
    style.textContent = rules.join('\n');
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [fontEntries.length, fontEntriesKey]);
}
