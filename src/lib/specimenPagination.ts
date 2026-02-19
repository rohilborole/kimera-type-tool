import type { ActiveTab, PageSize, SpecimenBlockType } from '../types';

const TAB_TO_BLOCKS_ORDER: Record<ActiveTab, SpecimenBlockType[] | 'ALL'> = {
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
  GLYPH_INSPECTOR: [],
  TYPE_PROOFING: [],
};

/** Proof order: Family/Adhesion → Character → Spacing → Kerning → Words → Specimen text → rest. */
const ALL_BLOCKS_ORDER: SpecimenBlockType[] = [
  'HERO',
  'ADHESION',
  'CAPS',
  'SPACING',
  'KERN',
  'WORDS',
  'A-Z',
  'TEXT',
  'HEADLINES',
  'LAYOUT',
  'LETTERING',
  'HINTING',
  'WORLD',
];

function getOrderedBlocks(activeTab: ActiveTab): SpecimenBlockType[] {
  const which = TAB_TO_BLOCKS_ORDER[activeTab];
  if (which === 'ALL') return ALL_BLOCKS_ORDER;
  return which;
}

/** One block per page so content flows to new pages for accurate print and canvas display. */
export function getSpecimenPages(
  activeTab: ActiveTab,
  _pageSize: PageSize
): SpecimenBlockType[][] {
  const blocks = getOrderedBlocks(activeTab);
  if (blocks.length === 0) return [[]];
  return blocks.map((block) => [block]);
}

export function getCurrentPageBlocks(
  activeTab: ActiveTab,
  pageSize: PageSize,
  pageIndex: number
): SpecimenBlockType[] {
  const pages = getSpecimenPages(activeTab, pageSize);
  const totalPages = pages.length;
  const safeIndex = Math.max(0, Math.min(pageIndex, totalPages - 1));
  return pages[safeIndex] ?? [];
}

export function getTotalPages(activeTab: ActiveTab, _pageSize: PageSize): number {
  const pages = getSpecimenPages(activeTab, _pageSize);
  return Math.max(1, pages.length);
}
