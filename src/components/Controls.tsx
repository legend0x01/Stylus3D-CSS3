import { useCallback, useRef } from "react";

/* Instrument-style control: engraved tick scale + a single calibration marker. */

export function Dial({
  label,
  value,
  min,
  max,
  step,
  unit,
  accent,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  accent: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const shown = step < 1 ? value.toFixed(2) : String(Math.round(value * 100) / 100);
  const id = `d-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

  return (
    <div className="group/select">
      <div className="flex items-baseline justify-between gap-3 pb-1.5">
        <label htmlFor={id} className="micro truncate" style={{ color: "var(--zmuted)" }}>
          {label}
        </label>
        <span className="numeral shrink-0 text-[11px]" style={{ color: "var(--zink)" }}>
          {shown}
          <span style={{ color: "var(--zmuted)" }}>{unit}</span>
        </span>
      </div>

      {/* engraved scale */}
      <div className="relative h-[10px] w-full" aria-hidden="true">
        <div
          className="absolute inset-x-0 top-0 flex justify-between"
          style={{ opacity: 0.5 }}
        >
          {Array.from({ length: 11 }).map((_, i) => (
            <span
              key={i}
              className="block w-px"
              style={{
                height: i % 5 === 0 ? "8px" : "4px",
                background: "var(--zmuted)",
              }}
            />
          ))}
        </div>
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-[width] duration-75"
          style={{ width: `${pct}%`, background: accent }}
        />
      </div>

      <input
        id={id}
        className="ins -mt-[3px]"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${shown}${unit}`}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function Swatch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = `c-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="micro block pb-1.5" style={{ color: "var(--zmuted)" }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          className="sw min-w-0 flex-1"
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="numeral shrink-0 text-[10px] uppercase" style={{ color: "var(--zmuted)" }}>
          {value}
        </span>
      </div>
    </div>
  );
}

/* Draggable light-source pad — drives --lx / --ly directly, no re-render. */
export function LightPad({
  lx,
  ly,
  accent,
  onChange,
}: {
  lx: number;
  ly: number;
  accent: string;
  onChange: (lx: number, ly: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const R = 26;

  const apply = useCallback(
    (cx: number, cy: number) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = ((cx - r.left) / r.width) * 2 - 1;
      const ny = ((cy - r.top) / r.height) * 2 - 1;
      const cl = (v: number) => Math.max(-1, Math.min(1, v));
      onChange(Math.round(cl(nx) * R), Math.round(cl(ny) * R));
    },
    [onChange],
  );

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    apply(e.clientX, e.clientY);
  };
  const onMove = (e: React.PointerEvent) => {
    if (dragging.current) apply(e.clientX, e.clientY);
  };
  const onUp = () => {
    dragging.current = false;
  };

  const key = (e: React.KeyboardEvent) => {
    const s = e.shiftKey ? 6 : 2;
    if (e.key === "ArrowLeft") onChange(lx - s, ly);
    else if (e.key === "ArrowRight") onChange(lx + s, ly);
    else if (e.key === "ArrowUp") onChange(lx, ly - s);
    else if (e.key === "ArrowDown") onChange(lx, ly + s);
    else return;
    e.preventDefault();
  };

  return (
    <div>
      <div className="flex items-baseline justify-between pb-1.5">
        <span className="micro" style={{ color: "var(--zmuted)" }}>
          light source
        </span>
        <span className="numeral text-[11px]" style={{ color: "var(--zink)" }}>
          {lx >= 0 ? "+" : ""}
          {lx} / {ly >= 0 ? "+" : ""}
          {ly}
        </span>
      </div>
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label="Light source X position"
        aria-valuemin={-R}
        aria-valuemax={R}
        aria-valuenow={lx}
        onKeyDown={key}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="relative h-[104px] w-full cursor-grab touch-none rounded-[inherit] active:cursor-grabbing"
        style={{
          border: "1px solid var(--zhair)",
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%)",
        }}
      >
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-full w-px" style={{ background: "var(--zhair)" }} />
          <div className="absolute left-0 top-1/2 h-px w-full" style={{ background: "var(--zhair)" }} />
          <div className="absolute left-1/2 top-1/2 h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ border: "1px dashed var(--zhair)" }} />
        </div>
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left,top] duration-75"
          style={{
            left: `${50 + (lx / R) * 50}%`,
            top: `${50 + (ly / R) * 50}%`,
            background: accent,
            boxShadow: `0 0 14px -1px ${accent}, 0 0 0 4px color-mix(in srgb, ${accent} 22%, transparent)`,
          }}
        />
      </div>
      <p className="micro pt-1.5" style={{ color: "var(--zmuted)", opacity: 0.7 }}>
        drag · or arrow keys
      </p>
    </div>
  );
}
