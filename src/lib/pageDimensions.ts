import type { PageSize, PageOrientation } from '../types';

/** Portrait dimensions (mm): width × height. */
const PORTRAIT: Record<PageSize, { width: string; height: string }> = {
  A4: { width: '210mm', height: '297mm' },
  A3: { width: '297mm', height: '420mm' },
};

/** Landscape dimensions (mm): width × height. Horizontal default for print. */
const LANDSCAPE: Record<PageSize, { width: string; height: string }> = {
  A4: { width: '297mm', height: '210mm' },
  A3: { width: '420mm', height: '297mm' },
};

export function getPageDimensions(
  pageSize: PageSize,
  orientation: PageOrientation
): { width: string; height: string } {
  return orientation === 'landscape' ? LANDSCAPE[pageSize] : PORTRAIT[pageSize];
}

/** CSS @page size value for print (width height). */
export function getPrintPageSize(
  pageSize: PageSize,
  orientation: PageOrientation
): string {
  const { width, height } = getPageDimensions(pageSize, orientation);
  return `${width} ${height}`;
}

/** Printable content box (page size minus 1.5cm margin each side). For use in print layout. */
export function getPrintContentBox(
  pageSize: PageSize,
  orientation: PageOrientation
): { width: string; height: string } {
  const { width, height } = getPageDimensions(pageSize, orientation);
  const toMm = (s: string) => parseFloat(s.replace('mm', '')) || 0;
  const w = toMm(width) - 30;
  const h = toMm(height) - 30;
  return { width: `${w}mm`, height: `${h}mm` };
}
