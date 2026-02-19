import { useRef, useCallback } from 'react';
import type { ActiveTab, PageSize, PageOrientation, Theme } from '../types';
import { getSpecimenPages } from '../lib/specimenPagination';
import { getPageDimensions, getPrintPageSize, getPrintContentBox } from '../lib/pageDimensions';
import { LOADED_FONT_FAMILY } from '../lib/fontEngine';
import { SpecimenBlocks } from './SpecimenBlocks';

interface PrintPreviewProps {
  onClose: () => void;
  onPrint: () => void;
  pageSize: PageSize;
  pageOrientation: PageOrientation;
  activeTab: ActiveTab;
  specimenStyle: React.CSSProperties;
  theme: Theme;
  fontUrl: string | null;
  fontFileType?: string;
}

function fontFormat(fileType: string | undefined): string {
  if (!fileType) return '';
  const t = fileType.toUpperCase();
  if (t === 'TTF' || t === 'FONT/TTF') return 'truetype';
  if (t === 'OTF' || t === 'FONT/OTF') return 'opentype';
  if (t === 'WOFF' || t === 'FONT/WOFF') return 'woff';
  if (t === 'WOFF2' || t === 'FONT/WOFF2') return 'woff2';
  return '';
}

export function PrintPreview({
  onClose,
  pageSize,
  pageOrientation,
  activeTab,
  specimenStyle,
  theme,
  fontUrl,
  fontFileType,
}: PrintPreviewProps) {
  const pages = getSpecimenPages(activeTab, pageSize);
  const dims = getPageDimensions(pageSize, pageOrientation);
  const isLight = theme === 'light';
  const pagesContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    const container = pagesContainerRef.current;
    if (!container) return;

    const contentBox = getPrintContentBox(pageSize, pageOrientation);
    const pageSizeCss = getPrintPageSize(pageSize, pageOrientation);
    const format = fontFormat(fontFileType);
    const formatPart = format ? ` format("${format}")` : '';
    const fontFaceCss = fontUrl
      ? `@font-face { font-family: "${LOADED_FONT_FAMILY}"; src: url("${fontUrl}")${formatPart}; font-display: block; }`
      : '';

    const iframe = document.createElement('iframe');
    iframe.title = 'Print';
    iframe.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;border:0;visibility:hidden;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    if (!doc) {
      document.body.removeChild(iframe);
      return;
    }

    doc.open();
    doc.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  ${fontFaceCss}
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #fff; color: #111; }
  body { padding: 0; }
  .print-pages { display: block !important; width: 100%; padding: 0; }
  .print-page {
    width: ${contentBox.width} !important;
    min-height: ${contentBox.height} !important;
    margin: 0 auto !important;
    padding: 1rem !important;
    background: #fff !important;
    color: #111 !important;
    page-break-after: always;
    break-after: page;
  }
  .print-page:last-child { page-break-after: auto; break-after: auto; }
  @media print {
    @page { margin: 1.5cm; size: ${pageSizeCss}; }
    html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .print-page { width: ${contentBox.width} !important; min-height: ${contentBox.height} !important; padding: 1rem !important; }
  }
</style>
</head>
<body>
<div class="print-pages"></div>
</body>
</html>
`);
    doc.close();

    const target = doc.querySelector('.print-pages');
    if (target) {
      const clone = container.cloneNode(true) as HTMLElement;
      clone.classList.add('print-pages');
      clone.querySelectorAll('.print-page-footer').forEach((el) => el.remove());
      target.appendChild(clone);
    }

    const win = iframe.contentWindow;
    if (!win) {
      document.body.removeChild(iframe);
      return;
    }

    const cleanup = () => {
      try {
        document.body.removeChild(iframe);
      } catch {
        /* ignore */
      }
    };

    win.addEventListener('afterprint', cleanup);
    setTimeout(() => {
      win.print();
      setTimeout(cleanup, 500);
    }, 250);
  }, [pageSize, pageOrientation, fontUrl, fontFileType]);

  return (
    <div
      className={`print-preview-root fixed inset-0 z-50 flex flex-col ${
        isLight ? 'bg-gray-200' : 'bg-gray-800'
      }`}
    >
      <header
        className={`print-preview-header flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-3 shadow ${
          isLight
            ? 'border-black/10 bg-white'
            : 'border-white/10 bg-gray-900'
        }`}
      >
        <div className="flex flex-col gap-0.5">
          <h2 className={`text-sm font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
            Print preview — {pages.length} page(s)
          </h2>
          <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-white/60'}`}>
            Click Save as PDF, then choose &quot;Save as PDF&quot; as the destination.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className={
              isLight
                ? 'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                : 'rounded-lg border border-white/20 bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700'
            }
          >
            Back
          </button>
          <button
            type="button"
            onClick={handlePrint}
            title="Opens the print dialog. Choose Save as PDF as the destination."
            className={
              isLight
                ? 'rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
                : 'rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200'
            }
          >
            Save as PDF
          </button>
        </div>
      </header>
      <div className="print-preview-content flex-1 overflow-auto p-6">
        <div
          ref={pagesContainerRef}
          className="print-preview-pages mx-auto flex max-w-max flex-col gap-6"
        >
          {pages.map((blockTypes, i) => (
            <div
              key={i}
              className={`print-page flex min-h-0 flex-col shadow-lg ${
                isLight ? 'bg-white text-gray-900' : 'bg-[#0a0a0b] text-white/90'
              }`}
              style={{
                width: dims.width,
                minHeight: dims.height,
              }}
            >
              <div className="print-page-inner flex flex-1 flex-col overflow-visible">
                <SpecimenBlocks
                  activeTab={activeTab}
                  specimenStyle={specimenStyle}
                  isPrinting={true}
                  blockTypesToShow={blockTypes}
                />
              </div>
              <div
                className={`print-page-footer border-t px-4 py-2 text-center text-xs ${
                  isLight ? 'border-gray-200 text-gray-500' : 'border-white/10 text-white/60'
                }`}
              >
                Page {i + 1} of {pages.length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
