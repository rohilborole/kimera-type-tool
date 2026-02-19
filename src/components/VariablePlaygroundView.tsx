import { useState, useCallback } from 'react';
import type { VariableAxis } from '../types';
import { buildFontVariationSettings } from '../lib/fontEngine';
import { PANGRAMS } from '../content-presets';
import { AxisControl } from './AxisControl';

interface VariablePlaygroundViewProps {
  specimenStyle: React.CSSProperties;
  fontUrl: string | null;
  axes: VariableAxis[];
  setAxisValue: (tag: string, value: number) => void;
  axisAnimating: Record<string, boolean>;
  setAxisAnimatingState: (tag: string, animating: boolean) => void;
  theme: 'dark' | 'light';
}

const TEXT_PRESETS = [
  { label: 'The quick brown fox…', value: PANGRAMS[0] ?? '' },
  { label: 'Sphinx of black quartz…', value: PANGRAMS[1] ?? '' },
  { label: 'Pack my box with five dozen…', value: PANGRAMS[2] ?? '' },
  { label: 'How vexingly quick daft zebras…', value: PANGRAMS[3] ?? '' },
  { label: 'Hamburgevons', value: 'Hamburgevons' },
  { label: 'Type specimen', value: 'Type specimen' },
];

export function VariablePlaygroundView({
  specimenStyle,
  fontUrl,
  axes,
  setAxisValue,
  axisAnimating,
  setAxisAnimatingState,
  theme,
}: VariablePlaygroundViewProps) {
  const [text, setText] = useState(TEXT_PRESETS[0].value);

  const handlePresetSelect = useCallback(
    (value: string) => setText(value),
    []
  );

  const isLight = theme === 'light';
  const cardClass = isLight
    ? 'border-black/10 bg-white text-gray-900'
    : 'border-white/10 bg-white/5 text-white/90';

  if (!fontUrl) {
    return (
      <div className={`rounded-xl border p-8 text-center ${cardClass}`}>
        <p className={isLight ? 'text-gray-500' : 'text-white/60'}>
          Load a variable font to use the playground.
        </p>
      </div>
    );
  }

  const variationSettings = buildFontVariationSettings(axes);
  const sampleStyle: React.CSSProperties = {
    ...specimenStyle,
    fontVariationSettings: variationSettings,
    fontSize: 48,
    lineHeight: 1.2,
  };

  const firstAxis = axes[0];

  return (
    <div className="flex flex-col gap-6">
      <div className={`rounded-xl border p-6 ${cardClass}`}>
        <h3 className={`mb-3 font-ui text-xs font-medium uppercase tracking-wider ${isLight ? 'text-gray-600' : 'text-white/70'}`}>
          Text preset
        </h3>
        <select
          value={text}
          onChange={(e) => handlePresetSelect(e.target.value)}
          className={`mb-4 w-full max-w-md rounded-lg border px-3 py-2 text-sm ${
            isLight ? 'border-gray-300 bg-white text-gray-900' : 'border-white/20 bg-white/10 text-white'
          }`}
        >
          {TEXT_PRESETS.map((p) => (
            <option key={p.value.slice(0, 20)} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <div
          className="min-h-[120px] rounded-lg border p-4"
          style={{
            borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
            ...sampleStyle,
          }}
        >
          {text}
        </div>
      </div>

      {axes.length > 0 && (
        <div className={`rounded-xl border p-6 ${cardClass}`}>
          <h3 className={`mb-3 font-ui text-xs font-medium uppercase tracking-wider ${isLight ? 'text-gray-600' : 'text-white/70'}`}>
            Axis sliders
          </h3>
          <div className="space-y-4">
            {axes.map((axis) => (
              <AxisControl
                key={axis.tag}
                axis={axis}
                setValue={(v) => setAxisValue(axis.tag, v)}
                isAnimating={!!axisAnimating[axis.tag]}
                setAnimating={(v) => setAxisAnimatingState(axis.tag, v)}
              />
            ))}
          </div>
          {firstAxis && (
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-xs ${isLight ? 'text-gray-500' : 'text-white/60'}`}>
                Animation:
              </span>
              <button
                type="button"
                onClick={() => setAxisAnimatingState(firstAxis.tag, !axisAnimating[firstAxis.tag])}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                  axisAnimating[firstAxis.tag]
                    ? isLight ? 'border-gray-400 bg-gray-200' : 'border-white/40 bg-white/20'
                    : isLight ? 'border-gray-300 hover:bg-gray-100' : 'border-white/20 hover:bg-white/10'
                }`}
              >
                {axisAnimating[firstAxis.tag] ? 'Stop' : 'Weight sweep'}
              </button>
            </div>
          )}
        </div>
      )}

      {axes.length === 0 && (
        <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-white/60'}`}>
          This font has no variable axes.
        </p>
      )}
    </div>
  );
}
