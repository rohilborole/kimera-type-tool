import { useEffect } from 'react';
import { LOADED_FONT_FAMILY } from '../lib/fontEngine';

function formatForFontFace(fileType: string | undefined): string {
  if (!fileType) return '';
  const t = fileType.toUpperCase();
  if (t === 'TTF' || t === 'FONT/TTF') return 'truetype';
  if (t === 'OTF' || t === 'FONT/OTF') return 'opentype';
  if (t === 'WOFF' || t === 'FONT/WOFF') return 'woff';
  if (t === 'WOFF2' || t === 'FONT/WOFF2') return 'woff2';
  return '';
}

export function useFontFace(blobUrl: string | null, fileType?: string) {
  useEffect(() => {
    if (!blobUrl) return;
    const id = 'kimera-loaded-font';
    let style = document.getElementById(id) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }
    const format = formatForFontFace(fileType);
    const formatPart = format ? ` format("${format}")` : '';
    style.textContent = `
      @font-face {
        font-family: "${LOADED_FONT_FAMILY}";
        src: url("${blobUrl}")${formatPart};
        font-display: block;
      }
    `;
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [blobUrl, fileType]);
}
