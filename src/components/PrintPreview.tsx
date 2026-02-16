import { useEffect } from 'react';
import type { ActiveTab, PageSize, Theme } from '../types';
import { getSpecimenPages } from '../lib/specimenPagination';
import { SpecimenBlocks } from './SpecimenBlocks';

const PAGE_DIMENSIONS: Record<PageSize, { width: string; height: string }> = {
  A4: { width: '210mm', height: '297mm' },
  A3: { width: '297mm', height: '420mm' },
};

interface PrintPreviewProps {
  onClose: () => void;
  onPrint: () => void;
  pageSize: PageSize;
  activeTab: ActiveTab;
  specimenStyle: React.CSSProperties;
  theme: Theme;
}

const PRINT_PAGE_STYLE_ID = 'print-page-size';

export function PrintPreview({
  onClose,
  onPrint,
  pageSize,
  activeTab,
  specimenStyle,
  theme,
}: PrintPreviewProps) {
  const pages = getSpecimenPages(activeTab, pageSize);
  const dims = PAGE_DIMENSIONS[pageSize];
  const isLight = theme === 'light';

  useEffect(() => {
    let style = document.getElementById(PRINT_PAGE_STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = PRINT_PAGE_STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent =
      pageSize === 'A3'
        ? `@media print { @page { margin: 1.5cm; size: 297mm 420mm; } }`
        : `@media print { @page { margin: 1.5cm; size: A4; } }`;
    return () => {
      const el = document.getElementById(PRINT_PAGE_STYLE_ID);
      if (el) el.remove();
    };
  }, [pageSize]);

  return (
    <div
      className={`print-preview fixed inset-0 z-50 flex flex-col print:bg-white ${
        isLight ? 'bg-gray-200' : 'bg-gray-800'
      }`}
    >
      <header
        className={`flex shrink-0 items-center justify-between border-b px-4 py-3 shadow print:hidden ${
          isLight
            ? 'border-black/10 bg-white'
            : 'border-white/10 bg-gray-900'
        }`}
      >
        <h2 className={`text-sm font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
          Print preview — {pages.length} page(s)
        </h2>
        <div className="flex gap-2">
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
            onClick={onPrint}
            className={
              isLight
                ? 'rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
                : 'rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200'
            }
          >
            Print
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto flex max-w-max flex-col gap-6">
          {pages.map((blockTypes, i) => (
            <div
              key={i}
              className={`flex flex-col shadow-lg ${
                isLight ? 'bg-white text-gray-900' : 'bg-[#0a0a0b] text-white/90'
              }`}
              style={{
                width: dims.width,
                height: dims.height,
                breakAfter: 'page',
                pageBreakAfter: 'always',
              }}
            >
              <div className="flex-1 overflow-hidden p-6">
                <SpecimenBlocks
                  activeTab={activeTab}
                  specimenStyle={specimenStyle}
                  isPrinting={true}
                  blockTypesToShow={blockTypes}
                />
              </div>
              <div
                className={`border-t px-4 py-2 text-center text-xs print:hidden ${
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
