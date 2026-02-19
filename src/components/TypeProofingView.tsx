import { useCallback } from 'react';
import type { ProofingBlock as ProofingBlockType, VariableAxis } from '../types';
import { buildFontFeatureSettings, LOADED_FONT_FAMILY } from '../lib/fontEngine';
import { PROOFING_PRESETS, type ProofingPresetCategory } from '../lib/proofingLibrary';

interface TypeProofingViewProps {
  fontUrl: string | null;
  proofingBlocks: ProofingBlockType[];
  activeProofingBlockId: string | null;
  proofingSyncText: boolean;
  axes: VariableAxis[];
  activeFeatures: Record<string, boolean>;
  theme: 'dark' | 'light';
  setActiveProofingBlockId: (id: string | null) => void;
  addProofingBlock: (initialText?: string) => string;
  updateProofingBlock: (id: string, updates: Partial<Pick<ProofingBlockType, 'text' | 'featureOverrides'>>) => void;
  removeProofingBlock: (id: string) => void;
  duplicateProofingBlock: (id: string) => void;
  setProofingSyncText: (v: boolean) => void;
  syncAllProofingBlocksText: (text: string) => void;
}

function blockToVariationSettings(block: ProofingBlockType, axes: VariableAxis[]): string {
  if (axes.length === 0) return 'normal';
  return axes
    .map((a) => `"${a.tag}" ${block.axisOverrides[a.tag] ?? a.current ?? a.default}`)
    .join(', ');
}

function blockToFeatureSettings(block: ProofingBlockType): string {
  return buildFontFeatureSettings(block.featureOverrides);
}

export function TypeProofingView({
  fontUrl,
  proofingBlocks,
  activeProofingBlockId,
  proofingSyncText,
  axes,
  activeFeatures,
  theme,
  setActiveProofingBlockId,
  addProofingBlock,
  updateProofingBlock,
  removeProofingBlock,
  duplicateProofingBlock,
  setProofingSyncText,
  syncAllProofingBlocksText,
}: TypeProofingViewProps) {
  const fontFamily = fontUrl ? `"${LOADED_FONT_FAMILY}", sans-serif` : 'sans-serif';

  const handleBlockTextChange = useCallback(
    (id: string, text: string) => {
      if (proofingSyncText) syncAllProofingBlocksText(text);
      else updateProofingBlock(id, { text });
    },
    [proofingSyncText, syncAllProofingBlocksText, updateProofingBlock]
  );

  const handlePresetSelect = useCallback(
    (value: string) => {
      if (proofingSyncText && proofingBlocks.length) {
        syncAllProofingBlocksText(value);
      } else if (activeProofingBlockId) {
        updateProofingBlock(activeProofingBlockId, { text: value });
      } else if (proofingBlocks.length) {
        updateProofingBlock(proofingBlocks[0].id, { text: value });
      }
    },
    [proofingSyncText, proofingBlocks, activeProofingBlockId, syncAllProofingBlocksText, updateProofingBlock]
  );

  const toggleBlockFeature = useCallback(
    (blockId: string, tag: string) => {
      const block = proofingBlocks.find((b) => b.id === blockId);
      if (!block) return;
      const next = { ...block.featureOverrides, [tag]: !block.featureOverrides[tag] };
      updateProofingBlock(blockId, { featureOverrides: next });
    },
    [proofingBlocks, updateProofingBlock]
  );

  if (!fontUrl) {
    return (
      <div
        className={`rounded-lg border p-8 text-center ${
          theme === 'light' ? 'border-black/10 bg-white' : 'border-white/10 bg-white/5'
        }`}
      >
        <p className={theme === 'light' ? 'text-gray-500' : 'text-white/60'}>Load a font to use Type Proofing.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={proofingSyncText}
            onChange={(e) => setProofingSyncText(e.target.checked)}
            className="rounded border-gray-400"
          />
          <span className={`text-xs ${theme === 'light' ? 'text-gray-700' : 'text-white/80'}`}>
            Sync all blocks (same text)
          </span>
        </label>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-white/50'}`}>Preset:</span>
          <select
            className={`rounded border px-2 py-1 text-xs ${
              theme === 'light'
                ? 'border-black/15 bg-white text-gray-900'
                : 'border-white/15 bg-white/10 text-white'
            }`}
            value=""
            onChange={(e) => {
              const v = e.target.value;
              if (v) handlePresetSelect(v);
            }}
          >
            <option value="">— Proofing Library —</option>
            {(Object.keys(PROOFING_PRESETS) as ProofingPresetCategory[]).map((cat) => (
              <optgroup key={cat} label={PROOFING_PRESETS[cat].label}>
                {PROOFING_PRESETS[cat].options.map((opt) => (
                  <option key={opt.label + opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => addProofingBlock()}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
            theme === 'light'
              ? 'border-black/20 bg-black/10 hover:bg-black/15'
              : 'border-white/20 bg-white/10 hover:bg-white/15'
          }`}
        >
          Add block
        </button>
      </div>

      {proofingBlocks.length === 0 && (
        <div
          className={`rounded-lg border border-dashed p-8 text-center ${
            theme === 'light' ? 'border-black/15 text-gray-500' : 'border-white/15 text-white/50'
          }`}
        >
          <p className="text-sm">No blocks yet. Add a block or add a character from Glyph Inspector.</p>
        </div>
      )}

      <div className="space-y-6">
        {proofingBlocks.map((block) => {
          const isActive = block.id === activeProofingBlockId;
          const style: React.CSSProperties = {
            fontFamily,
            fontVariationSettings: blockToVariationSettings(block, axes),
            fontFeatureSettings: blockToFeatureSettings(block),
            fontSize: 24,
            lineHeight: 1.4,
          };
          return (
            <div
              key={block.id}
              onClick={() => setActiveProofingBlockId(block.id)}
              className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                isActive
                  ? theme === 'light'
                    ? 'border-black/20 bg-black/5'
                    : 'border-white/20 bg-white/10'
                  : theme === 'light'
                    ? 'border-black/10 hover:bg-black/5'
                    : 'border-white/10 hover:bg-white/5'
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className={`font-ui text-xs uppercase ${theme === 'light' ? 'text-gray-500' : 'text-white/50'}`}>
                  Block
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateProofingBlock(block.id);
                    }}
                    className={`rounded border px-2 py-1 text-xs ${
                      theme === 'light' ? 'border-black/15 hover:bg-black/10' : 'border-white/15 hover:bg-white/10'
                    }`}
                  >
                    Duplicate
                  </button>
                  {proofingBlocks.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProofingBlock(block.id);
                      }}
                      className="rounded border border-red-500/50 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={block.text}
                onChange={(e) => handleBlockTextChange(block.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className={`mb-4 w-full resize-none rounded border-0 bg-transparent p-0 outline-none ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}
                style={style}
                rows={3}
              />
              {isActive && Object.keys(activeFeatures).length > 0 && (
                <div
                  className="flex flex-wrap gap-3 border-t pt-3"
                  style={{ borderColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-white/50'}`}>
                    Features (active block):
                  </span>
                  {Object.keys(activeFeatures)
                    .slice(0, 24)
                    .map((tag) => (
                    <label key={tag} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={!!block.featureOverrides[tag]}
                        onChange={() => toggleBlockFeature(block.id, tag)}
                        className="rounded"
                      />
                      <span className="text-xs font-mono">{tag}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
