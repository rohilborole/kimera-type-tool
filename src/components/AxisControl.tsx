import { useRef, useEffect } from 'react';
import type { VariableAxis } from '../types';

interface AxisControlProps {
  axis: VariableAxis;
  setValue: (v: number) => void;
  isAnimating: boolean;
  setAnimating: (v: boolean) => void;
}

export function AxisControl({ axis, setValue, isAnimating, setAnimating }: AxisControlProps) {
  const rafRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    if (!isAnimating) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const min = axis.min;
    const max = axis.max;
    const range = max - min;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      phaseRef.current += dt * 0.5;
      const t = (Math.sin(phaseRef.current) + 1) / 2;
      setValue(min + t * range);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isAnimating, axis.min, axis.max, setValue]);

  const step = (axis.max - axis.min) / 1000;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-white/90">{axis.name}</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={Math.round(axis.current * 100) / 100}
            onChange={(e) => setValue(Number(e.target.value))}
            min={axis.min}
            max={axis.max}
            step={step}
            className="w-16 rounded-lg border border-white/20 bg-white/5 px-2 py-1 text-right text-white focus:border-white/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setAnimating(!isAnimating)}
            className={`rounded-lg border px-2 py-1 text-[10px] font-medium uppercase ${
              isAnimating
                ? 'border-white/40 bg-white/20 text-white'
                : 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10'
            }`}
          >
            Play
          </button>
        </div>
      </div>
      <input
        type="range"
        min={axis.min}
        max={axis.max}
        step={step}
        value={axis.current}
        onChange={(e) => setValue(Number(e.target.value))}
        className="h-1.5 w-full appearance-none rounded-full bg-white/10 accent-white/80 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
      />
    </div>
  );
}
