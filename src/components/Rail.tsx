import type { Zone } from "../lib/zones";
import { ZONES } from "../lib/zones";

/* The right-hand instrument rail — a fixed strip carrying the zone index,
   a scroll tick scale, and the live accent chip. */
export default function Rail({
  zone,
  activeIdx,
  onGo,
}: {
  zone: Zone | null;
  activeIdx: number;
  onGo: (id: string) => void;
}) {
  const zid = zone?.id ?? "hero";

  return (
    <aside
      className="rail fixed right-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-12 flex-col items-center justify-between py-4 sm:h-[calc(100vh-4rem)] sm:top-16 lg:flex xl:w-14"
      data-z={zid}
      aria-label="Zone instrument rail"
    >
      {/* index */}
      <div className="flex flex-col items-center gap-0.5">
        <span
          className="numeral text-[16px] font-bold leading-none transition-colors duration-500"
          style={{ color: zone?.accent ?? "var(--accent)" }}
        >
          {zone?.idx ?? "00"}
        </span>
        <span className="micro" style={{ color: "var(--zmuted)", fontSize: 8 }}>
          / {String(ZONES.length).padStart(2, "0")}
        </span>
      </div>

      {/* tick scale — navigation */}
      <nav className="flex flex-col items-center gap-0 max-h-[55vh] overflow-y-auto no-scrollbar" aria-label="Jump to zone">
        {ZONES.map((z, i) => {
          const on = i === activeIdx;
          return (
            <button
              key={z.id}
              type="button"
              onClick={() => onGo(z.id)}
              title={`${z.idx} — ${z.name}`}
              aria-label={`Go to ${z.name}`}
              aria-current={on ? "true" : undefined}
              className="group flex h-[16px] w-full items-center justify-center"
            >
              <span
                className="rail-tick block h-px transition-all"
                style={{
                  width: on ? "28px" : "10px",
                  height: on ? "2.5px" : "1px",
                  background: on ? z.accent : "currentColor",
                  opacity: on ? 1 : 0.28,
                  color: "var(--zmuted)",
                }}
              />
            </button>
          );
        })}
      </nav>

      {/* scroll progress */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative h-16 w-[2.5px] overflow-hidden rounded-full"
          style={{ background: "color-mix(in srgb, currentColor 22%, transparent)" }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-x-0 top-0 origin-top"
            style={{
              height: "100%",
              background: zone?.accent ?? "var(--accent)",
              transform: "scaleY(var(--scroll, 0))",
              transformOrigin: "top",
            }}
          />
        </div>
        <span
          className="h-3 w-3 shrink-0 rounded-[2px] transition-colors duration-500"
          style={{
            background: zone?.accent ?? "var(--accent)",
            boxShadow: `0 0 10px -1px ${zone?.accent ?? "var(--accent)"}`,
          }}
          aria-hidden="true"
        />
        <span className="micro" style={{ color: "var(--zmuted)", fontSize: 7.5, writingMode: "vertical-rl" }}>
          {zone?.mode === "light" ? "lit" : "bench"}
        </span>
      </div>
    </aside>
  );
}
