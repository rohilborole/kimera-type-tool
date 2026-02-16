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
};

/** Proof order: Family → Character → Spacing → Words → Specimen → OT. */
const ALL_BLOCKS_ORDER: SpecimenBlockType[] = [
  'HERO',
  'HEADLINES',
  'A-Z',
  'SPACING',
  'WORDS',
  'CAPS',
  'TEXT',
  'LAYOUT',
  'LETTERING',
  'ADHESION',
  'KERN',
  'HINTING',
  'WORLD',
];

/** Approximate height tier per block (0–1). Sum per page ≤ 1. */
const BLOCK_TIERS: Record<SpecimenBlockType, number> = {
  HERO: 0.5,
  HEADLINES: 0.35,
  TEXT: 0.4,
  ADHESION: 0.2,
  KERN: 0.15,
  'A-Z': 0.5,
  WORDS: 0.15,
  CAPS: 0.2,
  SPACING: 0.4,
  HINTING: 0.35,
  LAYOUT: 0.25,
  LETTERING: 0.2,
  LATIN: 0.4,
  WORLD: 0.3,
};

function getOrderedBlocks(activeTab: ActiveTab): SpecimenBlockType[] {
  const which = TAB_TO_BLOCKS_ORDER[activeTab];
  if (which === 'ALL') return ALL_BLOCKS_ORDER;
  return which;
}

/** Heuristic pagination: partition blocks into pages so each page's tier sum ≤ 1. */
export function getSpecimenPages(
  activeTab: ActiveTab,
  _pageSize: PageSize
): SpecimenBlockType[][] {
  const blocks = getOrderedBlocks(activeTab);
  if (blocks.length === 0) return [[]];

  const pages: SpecimenBlockType[][] = [];
  let currentPage: SpecimenBlockType[] = [];
  let currentSum = 0;
  const maxSum = 1;

  for (const block of blocks) {
    const tier = BLOCK_TIERS[block];
    if (currentSum + tier > maxSum && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentSum = 0;
    }
    currentPage.push(block);
    currentSum += tier;
  }
  if (currentPage.length > 0) pages.push(currentPage);

  return pages;
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
