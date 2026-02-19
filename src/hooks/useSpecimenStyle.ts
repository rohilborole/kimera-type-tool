import { useMemo } from 'react';
import { buildFontVariationSettings, buildFontFeatureSettings } from '../lib/fontEngine';
import type { VariableAxis } from '../types';

export function useSpecimenStyle(
  primaryFontFamily: string | null,
  axes: VariableAxis[],
  activeFeatures: Record<string, boolean>
): React.CSSProperties {
  return useMemo(() => {
    if (!primaryFontFamily) return {};
    return {
      fontFamily: `"${primaryFontFamily}", sans-serif`,
      fontVariationSettings: buildFontVariationSettings(axes),
      fontFeatureSettings: buildFontFeatureSettings(activeFeatures),
    };
  }, [primaryFontFamily, axes, activeFeatures]);
}
