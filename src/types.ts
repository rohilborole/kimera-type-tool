export type Theme = 'dark' | 'light';

export type PageSize = 'A4' | 'A3';

export type PageOrientation = 'landscape' | 'portrait';

export interface FontMetadata {
  familyName: string;
  glyphCount: number;
  fileType: string;
  fileSize: number;
  isVariable: boolean;
}

export interface VariableAxis {
  tag: string;
  name: string;
  min: number;
  max: number;
  default: number;
  current: number;
}

export type ActiveTab =
  | 'ALL'
  | 'HEADLINES'
  | 'TEXT'
  | 'ADHESION'
  | 'A-Z'
  | 'WORDS'
  | 'CAPS'
  | 'SPACING'
  | 'LAYOUT'
  | 'LETTERING'
  | 'KERN'
  | 'HINTING'
  | 'LATIN'
  | 'WORLD'
  | 'GLYPH_INSPECTOR'
  | 'TYPE_PROOFING';

export type CanvasTool = 'cursor' | 'type' | 'draw' | 'notes';

export interface CurrentTextStyle {
  fontSize: number;
  fontWeight: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  letterSpacing?: number;
  lineHeight?: number;
}

export interface TextFrame {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontWeight: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  letterSpacing?: number;
  lineHeight?: number;
}

export interface DrawingStroke {
  id: string;
  points: { x: number; y: number }[];
}

/** Single block in the Type Proofing playground; owns its own variation/feature settings and text. */
export interface ProofingBlock {
  id: string;
  text: string;
  fontVariationSettings: string;
  fontFeatureSettings: string;
  /** Axis overrides for variable fonts: tag -> value */
  axisOverrides: Record<string, number>;
  /** Feature toggles for this block */
  featureOverrides: Record<string, boolean>;
}

export interface GlyphInfo {
  name: string;
  unicode: number;
  index: number;
}

export interface AppState {
  theme: Theme;
  fontUrl: string | null;
  metadata: FontMetadata | null;
  axes: VariableAxis[];
  activeFeatures: Record<string, boolean>;
  activeTab: ActiveTab;
  isPrinting: boolean;
  annotations: Annotation[];
  axisAnimating: Record<string, boolean>;
  activeTool: CanvasTool;
  zoom: number;
  currentTextStyle: CurrentTextStyle;
  textFrames: TextFrame[];
  drawings: DrawingStroke[];
  selectedElementId: string | null;
}

export interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
}

export type SpecimenBlockType =
  | 'HERO'
  | 'HEADLINES'
  | 'TEXT'
  | 'ADHESION'
  | 'A-Z'
  | 'WORDS'
  | 'CAPS'
  | 'SPACING'
  | 'LAYOUT'
  | 'LETTERING'
  | 'KERN'
  | 'HINTING'
  | 'LATIN'
  | 'WORLD';
