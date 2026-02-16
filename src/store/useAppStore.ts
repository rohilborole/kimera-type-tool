import { useState, useCallback } from 'react';
import type {
  Theme,
  FontMetadata,
  VariableAxis,
  ActiveTab,
  Annotation,
  CanvasTool,
  CurrentTextStyle,
  TextFrame,
  DrawingStroke,
} from '../types';
import { parseFontFile, COMMON_OPENTYPE_FEATURES } from '../lib/fontEngine';

const ACCEPT_FONT = '.ttf,.otf,.woff,.woff2';

const initialAxes: VariableAxis[] = [];
const initialFeatures: Record<string, boolean> = {};

const defaultTextStyle: CurrentTextStyle = {
  fontSize: 18,
  fontWeight: 400,
  textAlign: 'left',
  letterSpacing: 0,
  lineHeight: 1.4,
};

export function useAppStore() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontUrl, setFontUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<FontMetadata | null>(null);
  const [axes, setAxes] = useState<VariableAxis[]>(initialAxes);
  const [activeFeatures, setActiveFeatures] = useState<Record<string, boolean>>(initialFeatures);
  const [activeTab, setActiveTab] = useState<ActiveTab>('ALL');
  const [isPrinting, setIsPrinting] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [axisAnimating, setAxisAnimating] = useState<Record<string, boolean>>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [activeTool, setActiveTool] = useState<CanvasTool>('cursor');
  const [zoom, setZoom] = useState(1);
  const [currentTextStyle, setCurrentTextStyle] = useState<CurrentTextStyle>(defaultTextStyle);
  const [textFrames, setTextFrames] = useState<TextFrame[]>([]);
  const [drawings, setDrawings] = useState<DrawingStroke[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const loadFont = useCallback(async (file: File) => {
    setLoadError(null);
    setLoading(true);
    const prevUrl = fontUrl;
    if (prevUrl) URL.revokeObjectURL(prevUrl);
    try {
      const { blobUrl, metadata: meta, axes: newAxes, featureTags } = await parseFontFile(file);
      setFontUrl(blobUrl);
      setMetadata(meta);
      setAxes(newAxes);
      const tags = featureTags?.length ? featureTags : COMMON_OPENTYPE_FEATURES;
      const features: Record<string, boolean> = {};
      for (const tag of tags) features[tag] = tag === 'liga' || tag === 'kern';
      setActiveFeatures(features);
      setAxisAnimating({});
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load font';
      setLoadError(msg);
      setFontUrl(null);
      setMetadata(null);
      setAxes([]);
      setActiveFeatures({});
    } finally {
      setLoading(false);
    }
  }, [fontUrl]);

  const resetFont = useCallback(() => {
    if (fontUrl) URL.revokeObjectURL(fontUrl);
    setFontUrl(null);
    setMetadata(null);
    setAxes([]);
    setActiveFeatures({});
    setAxisAnimating({});
  }, [fontUrl]);

  const setAxisValue = useCallback((tag: string, value: number) => {
    setAxes((prev) =>
      prev.map((a) => (a.tag === tag ? { ...a, current: value } : a))
    );
  }, []);

  const toggleFeature = useCallback((tag: string) => {
    setActiveFeatures((prev) => ({ ...prev, [tag]: !prev[tag] }));
  }, []);

  const addAnnotation = useCallback((x: number, y: number) => {
    setAnnotations((prev) => [
      ...prev,
      { id: crypto.randomUUID(), x, y, text: '' },
    ]);
  }, []);

  const updateAnnotation = useCallback((id: string, text: string) => {
    setAnnotations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, text } : a))
    );
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setAxisAnimatingState = useCallback((tag: string, animating: boolean) => {
    setAxisAnimating((prev) => ({ ...prev, [tag]: animating }));
  }, []);

  const addTextFrame = useCallback((x: number, y: number) => {
    const frame: TextFrame = {
      id: crypto.randomUUID(),
      x,
      y,
      text: '',
      fontSize: currentTextStyle.fontSize,
      fontWeight: currentTextStyle.fontWeight,
      textAlign: currentTextStyle.textAlign,
      letterSpacing: currentTextStyle.letterSpacing,
      lineHeight: currentTextStyle.lineHeight,
    };
    setTextFrames((prev) => [...prev, frame]);
    setSelectedElementId(frame.id);
  }, [currentTextStyle]);

  const updateTextFrame = useCallback((id: string, updates: Partial<Pick<TextFrame, 'text' | 'x' | 'y' | 'fontSize' | 'fontWeight' | 'textAlign' | 'letterSpacing' | 'lineHeight'>>) => {
    setTextFrames((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  const removeTextFrame = useCallback((id: string) => {
    setTextFrames((prev) => prev.filter((f) => f.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  }, [selectedElementId]);

  const addDrawingStroke = useCallback((points: { x: number; y: number }[]) => {
    if (points.length < 2) return;
    setDrawings((prev) => [
      ...prev,
      { id: crypto.randomUUID(), points },
    ]);
  }, []);

  const setZoomValue = useCallback((value: number) => {
    setZoom((z) => Math.min(2, Math.max(0.25, value)));
  }, []);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(2, z + 0.25)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(0.25, z - 0.25)), []);
  const zoomReset = useCallback(() => setZoom(1), []);

  return {
    theme,
    setTheme,
    fontUrl,
    metadata,
    axes,
    setAxisValue,
    activeFeatures,
    toggleFeature,
    activeTab,
    setActiveTab,
    isPrinting,
    setIsPrinting,
    annotations,
    addAnnotation,
    updateAnnotation,
    removeAnnotation,
    axisAnimating,
    setAxisAnimatingState,
    loadFont,
    resetFont,
    acceptFont: ACCEPT_FONT,
    loadError,
    loading,
    clearLoadError: useCallback(() => setLoadError(null), []),
    activeTool,
    setActiveTool,
    zoom,
    setZoom: setZoomValue,
    zoomIn,
    zoomOut,
    zoomReset,
    currentTextStyle,
    setCurrentTextStyle,
    textFrames,
    addTextFrame,
    updateTextFrame,
    removeTextFrame,
    drawings,
    addDrawingStroke,
    selectedElementId,
    setSelectedElementId,
  };
}
