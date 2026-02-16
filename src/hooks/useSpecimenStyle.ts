import { useMemo } from 'react';
import { buildFontVariationSettings, buildFontFeatureSettings, LOADED_FONT_FAMILY } from '../lib/fontEngine';
import type { VariableAxis } from '../types';

export function useSpecimenStyle(
  fontUrl: string | null,
  axes: VariableAxis[],
  activeFeatures: Record<string, boolean>
): React.CSSProperties {
  return useMemo(() => {
    if (!fontUrl) return {};
    return {
      fontFamily: `"${LOADED_FONT_FAMILY}", sans-serif`,
      fontVariationSettings: buildFontVariationSettings(axes),
      fontFeatureSettings: buildFontFeatureSettings(activeFeatures),
    };
  }, [fontUrl, axes, activeFeatures]);
}
