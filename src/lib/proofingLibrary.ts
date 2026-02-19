/**
 * Proofing Library presets for the Type Proofing page.
 * Injected via preset dropdown.
 */

import {
  KERNING_CLASSIC,
  INCIDENTALS_LETTER_PUNCT,
  INCIDENTALS_EXCLAM_QUEST,
  SIDEBEARING_H_UC,
  SIDEBEARING_N_LC,
  SIDEBEARING_O_LC,
  SPACING_LC,
  SPACING_UC,
  WORDS_AZ,
  PARAGRAPHS,
} from '../content-presets';

export const PROOFING_PRESETS = {
  /** Character Sets */
  characterSets: {
    label: 'Character Sets',
    options: [
      { label: 'Uppercase', value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
      { label: 'Lowercase', value: 'abcdefghijklmnopqrstuvwxyz' },
      { label: 'Figures', value: '0123456789' },
      { label: 'Punctuation', value: ".,;:!?\"'–—()[]{}" },
    ],
  },
  /** Spacing strings */
  spacingStrings: {
    label: 'Spacing Strings',
    options: [
      { label: 'nnnnnononoooo', value: 'nnnnnononoooo' },
      { label: 'HHHHHOHOHOOOOO', value: 'HHHHHOHOHOOOOO' },
      { label: 'HnndHnnoHoonHddn', value: 'HnndHnnoHoonHddn' },
      { label: 'Spacing: lowercase (nn/oo) – sample', value: SPACING_LC[0] ?? '' },
      { label: 'Spacing: uppercase (HH/OO) – sample', value: SPACING_UC[0] ?? '' },
      { label: 'Spacing: lowercase (nn/oo) full', value: SPACING_LC.join('\n') },
      { label: 'Spacing: uppercase (HH/OO) full', value: SPACING_UC.join('\n') },
    ],
  },
  /** Classic kerning pairs and incidentals (letter + punctuation) */
  kerningPairs: {
    label: 'Kerning Pairs',
    options: [
      { label: 'Classic pairs (AT, AV, Fa, LO…)', value: KERNING_CLASSIC.join(' ') },
      { label: 'Incidentals: letter + punctuation (f r v w y T V W Y)', value: INCIDENTALS_LETTER_PUNCT.join(' ') },
      { label: 'Incidentals: w! w? f! f? guillemots', value: INCIDENTALS_EXCLAM_QUEST.join(' ') },
    ],
  },
  /** Sidebearing: H/n/o + all letters */
  sidebearing: {
    label: 'Sidebearing',
    options: [
      { label: 'H + all (UC)', value: SIDEBEARING_H_UC },
      { label: 'n + all (LC)', value: SIDEBEARING_N_LC },
      { label: 'o + all (LC)', value: SIDEBEARING_O_LC },
    ],
  },
  /** Hoefler-style bounding words A–Z */
  hoeflerBounding: {
    label: 'Hoefler Bounding',
    options: [
      { label: 'Angel Adept', value: 'Angel Adept' },
      { label: 'Baker Bold', value: 'Baker Bold' },
      { label: 'Catch Cold', value: 'Catch Cold' },
      { label: 'Distant Door', value: 'Distant Door' },
      { label: 'Eager Edge', value: 'Eager Edge' },
      { label: 'Fancy Font', value: 'Fancy Font' },
      { label: 'Great Grid', value: 'Great Grid' },
      { label: 'Happy Height', value: 'Happy Height' },
      { label: 'Italic Idea', value: 'Italic Idea' },
      { label: 'Jolly Jump', value: 'Jolly Jump' },
      { label: 'Keen Kern', value: 'Keen Kern' },
      { label: 'Light Line', value: 'Light Line' },
      { label: 'Mild Mode', value: 'Mild Mode' },
      { label: 'Narrow Note', value: 'Narrow Note' },
      { label: 'Open Ode', value: 'Open Ode' },
      { label: 'Prime Proof', value: 'Prime Proof' },
      { label: 'Quick Quirk', value: 'Quick Quirk' },
      { label: 'Roman Rule', value: 'Roman Rule' },
      { label: 'Serif Set', value: 'Serif Set' },
      { label: 'Tall Type', value: 'Tall Type' },
      { label: 'Upper Unit', value: 'Upper Unit' },
      { label: 'Valid Value', value: 'Valid Value' },
      { label: 'Wide Word', value: 'Wide Word' },
      { label: 'X-Height', value: 'X-Height' },
      { label: 'Yield Y', value: 'Yield Y' },
      { label: 'Zero Zoom', value: 'Zero Zoom' },
    ],
  },
  /** DNA / specimen words */
  dnaWords: {
    label: 'DNA Words',
    options: [
      { label: 'hamburgefontsiv', value: 'hamburgefontsiv' },
      { label: 'adhesion', value: 'adhesion' },
      { label: 'frybaked', value: 'frybaked' },
      { label: 'glovm', value: 'glovm' },
    ],
  },
  /** A–Z single words (Aaron…Zulu) */
  wordsAZ: {
    label: 'Words A–Z',
    options: [{ label: 'A–Z words (Aaron…Zulu)', value: WORDS_AZ.join(' ') }],
  },
  /** Paragraphs / specimen text */
  paragraphs: {
    label: 'Paragraphs',
    options: [
      { label: 'Short (Kafka)', value: PARAGRAPHS.short },
      { label: 'Typography', value: PARAGRAPHS.typography },
      { label: 'German specimen', value: PARAGRAPHS.germanSpecimen },
      { label: 'Ruder (multilingual)', value: PARAGRAPHS.ruder },
    ],
  },
} as const;

export type ProofingPresetCategory = keyof typeof PROOFING_PRESETS;
