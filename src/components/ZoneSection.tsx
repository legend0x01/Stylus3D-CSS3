import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, RotateCcw, Sparkles, Terminal, Activity, Zap, Layers, Radio, Cpu, Move } from "lucide-react";
import { Dial, LightPad, Swatch } from "./Controls";
import { CodeTray, CopyButton, type TabKey } from "./Code";
import {
  BENTO_SHAPES,
  BENTO_TILES,
  ZONES,
  areasToTemplate,
  type Rec,
  type Vals,
  type Zone,
} from "../lib/zones";

const ease = [0.2, 0.8, 0.2, 1] as const;

/* ------------------------------------------------------------------ */

function PrimitiveRow({ term, note, accent }: { term: string; note: string; accent: string }) {
  return (
    <li className="grid grid-cols-[10px_1fr] gap-x-3.5 py-3" style={{ borderTop: "1px solid var(--zhair)" }}>
      <span className="pt-[7px]">
        <span className="block h-[5px] w-[5px]" style={{ background: accent }} />
      </span>
      <span className="min-w-0">
        <code className="block break-words font-[family-name:var(--font-mono)] text-[12px] font-medium" style={{ color: "var(--zink)" }}>
          {term}
        </code>
        <span className="block pt-1 text-[12.5px] leading-[1.6]" style={{ color: "var(--zmuted)" }}>
          {note}
        </span>
      </span>
    </li>
  );
}

/* ------------------------------------------------------------- demos */

interface StageProps {
  zone: Zone;
  vals: Vals;
  accent: string;
  bentoAreas: string[];
  onSwapArea: (key: string) => void;
  bentoSel: string | null;
}

function Stage({ zone, vals, accent, bentoAreas, onSwapArea, bentoSel }: StageProps) {
  const [pressed, setPressed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  switch (zone.demo) {
    /* 01 Glassmorphism */
    case "glass":
      return (
        <div className="relative overflow-hidden rounded-[22px]" style={{ border: "1px solid var(--zhair)" }}>
          <img src="/images/aurora.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(4,6,14,.25), rgba(4,6,14,.6))" }} />
          <div className="relative grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            <div className="g-card p-5 sm:col-span-2">
              <p className="micro" style={{ color: accent }}>Frost panel / primary</p>
              <p className="pt-2.5 font-[family-name:var(--font-display)] text-[20px] font-medium leading-tight text-white">
                backdrop-filter samples the stack below
              </p>
            </div>
            <div className="g-card p-4">
              <p className="text-[13px] leading-snug text-white/90">Edge specular keeps the plane readable.</p>
            </div>
            <div className="g-card flex items-center justify-between p-4">
              <span className="micro text-white/80">alpha</span>
              <span className="numeral text-[13px] text-white">{String(vals.op)}%</span>
            </div>
          </div>
        </div>
      );

    /* 02 Neumorphism */
    case "neo":
      return (
        <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-9">
          <button
            type="button"
            data-press={pressed}
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
            className="n-card flex flex-col justify-between p-6 text-left transition-all duration-150"
          >
            <span className="micro" style={{ color: "#6C7CE0" }}>{pressed ? "sunken well" : "extruded"}</span>
            <span className="pt-8 font-[family-name:var(--font-display)] text-[19px] font-medium" style={{ color: "#36404C" }}>
              Press to indent
            </span>
          </button>
          <div className="n-card flex flex-col justify-center gap-2.5 p-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="n-card flex items-center gap-3 px-3.5 py-2.5" style={{ borderRadius: 999 }}>
                <span className="h-2 w-2 rounded-full" style={{ background: "#6C7CE0" }} />
                <span className="numeral text-[11px]" style={{ color: "#5A6779" }}>
                  module {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1" />
                <span className="h-px w-8" style={{ background: "#B9C4D0" }} />
              </div>
            ))}
          </div>
        </div>
      );

    /* 03 Claymorphism */
    case "clay":
      return (
        <div className="grid gap-6 p-6 sm:grid-cols-[1.4fr_1fr] sm:p-9">
          <div className="c-card flex flex-col justify-between p-7">
            <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
              <circle cx="20" cy="20" r="15" fill="rgba(255,255,255,.7)" />
              <path d="M15 14v12l11-6z" fill="#A8441F" />
            </svg>
            <div className="pt-10">
              <p className="font-[family-name:var(--font-display)] text-[21px] font-semibold leading-tight" style={{ color: "rgba(60,20,8,.9)" }}>
                Inflate it until it wobbles
              </p>
              <p className="micro pt-2.5" style={{ color: "rgba(60,20,8,.6)" }}>
                puff {String(vals.puff)}px · inner {String(vals.inner)}px
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
            {["Play", "Shuffle"].map((l) => (
              <div key={l} className="c-card grid place-items-center py-5">
                <span className="micro" style={{ color: "rgba(60,20,8,.75)" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      );

    /* 04 Skeuomorphism */
    case "sk":
      return (
        <div className="p-6 sm:p-9">
          <div className="sk-card p-6" style={{ ["--tex-url" as string]: "url(/images/metal.webp)" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="micro" style={{ color: "rgba(255,235,210,.62)" }}>Master out</p>
                <p className="pt-1.5 font-[family-name:var(--font-display)] text-[19px] font-semibold" style={{ color: "#F6E9D8" }}>
                  Machined channel
                </p>
              </div>
              <div
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full"
                style={{
                  background: "radial-gradient(circle at 34% 28%, #C9B296, #6B573F 62%, #3A2B1D)",
                  boxShadow: "inset 0 2px 3px rgba(255,240,220,.5), inset 0 -3px 5px rgba(0,0,0,.7), 0 4px 10px -3px rgba(0,0,0,.9)",
                }}
              >
                <span className="block h-[2px] w-5 rounded-full" style={{ background: "#221709" }} />
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {[0.72, 0.44, 0.88].map((v, i) => (
                <div
                  key={i}
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${v * 100}%`,
                    background: "linear-gradient(180deg, #2A1D12, #55402C)",
                    boxShadow: "inset 0 2px 3px rgba(0,0,0,.85), inset 0 -1px 1px rgba(255,225,190,.35)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      );

    /* 05 Liquidmorphism */
    case "liquid":
      return (
        <div className="flex min-h-[260px] items-center justify-center p-8">
          <div className="lq-card flex h-48 w-64 flex-col justify-between p-6">
            <span className="micro" style={{ color: "#38EF7D" }}>Viscous Membrane</span>
            <div>
              <p className="font-[family-name:var(--font-display)] text-[20px] font-semibold text-white">Liquid Lens</p>
              <p className="text-[12px] text-white/70">Organic 8-point morphing curve</p>
            </div>
          </div>
        </div>
      );

    /* 06 Metallic & Chrome */
    case "metallic":
      return (
        <div className="p-6 sm:p-9">
          <div className="ch-card flex flex-col justify-between p-8 text-black">
            <span className="micro text-black/70">Mirror Horizon</span>
            <div className="pt-8">
              <h3 className="font-[family-name:var(--font-display)] text-[24px] font-black uppercase tracking-wider text-black">
                Chromemorphism
              </h3>
              <p className="micro text-black/60 pt-1">Liquid metal reflection</p>
            </div>
          </div>
        </div>
      );

    /* 07 Glowmorphism */
    case "glow":
      return (
        <div className="p-6 sm:p-9">
          <div className="gw-card flex flex-col justify-between p-7 text-white">
            <span className="micro" style={{ color: accent }}>Emissive Core</span>
            <div className="pt-6">
              <p className="font-[family-name:var(--font-display)] text-[24px] font-bold">Neon Bloom</p>
              <p className="text-[13px] text-pink-200/70 pt-1">Multi-tier radiant luminescent tube</p>
            </div>
          </div>
        </div>
      );

    /* 08 Holographic */
    case "holographic":
      return (
        <div className="p-6 sm:p-9">
          <div className="hl-card flex flex-col justify-between p-8 text-black">
            <span className="micro text-black/80 font-bold">Prismatic Diffraction</span>
            <div className="pt-8">
              <h3 className="font-[family-name:var(--font-display)] text-[22px] font-extrabold uppercase tracking-wide text-black">
                Hologram Foil
              </h3>
              <p className="micro text-black/70">Iridescent angle shift</p>
            </div>
          </div>
        </div>
      );

    /* 09 Paperism */
    case "paper":
      return (
        <div className="p-6 sm:p-9">
          <div className="pp-card p-6">
            <p className="micro" style={{ color: "#A8553A" }}>Layer 01 / Stock</p>
            <p className="pt-2 font-[family-name:var(--font-display)] text-[20px] font-semibold text-stone-800">
              Folded Paper Cut
            </p>
            <p className="text-[13px] text-stone-600 pt-2">Real cast drop-shadows on warm cardstock substrate.</p>
          </div>
        </div>
      );

    /* 10 Minimalism */
    case "minimalism":
      return (
        <div className="p-6 sm:p-9">
          <div className="mn-card">
            <span className="micro text-zinc-400">Pure Form</span>
            <h3 className="font-[family-name:var(--font-display)] text-[26px] font-bold text-zinc-900 tracking-tight">
              Essential Focus.
            </h3>
            <p className="text-[14px] text-zinc-600">Zero artificial decoration. Type and proportion carry all weight.</p>
          </div>
        </div>
      );

    /* 11 Flat 2.0 */
    case "flat":
      return (
        <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-9">
          {[1, 2].map((i) => (
            <div key={i} className="f-card p-5">
              <span className="numeral text-[11px] text-blue-600 font-bold">Tier 0{i}</span>
              <p className="pt-2 text-[15px] font-semibold text-slate-800">Elevation Layer</p>
              <p className="text-[12px] text-slate-500 pt-1">Solid color affordance without gradients.</p>
            </div>
          ))}
        </div>
      );

    /* 12 Material Design 3 */
    case "material":
      return (
        <div className="p-6 sm:p-9">
          <div className="m3-card p-6 text-purple-100">
            <span className="micro text-purple-300">Material You</span>
            <p className="pt-2 font-[family-name:var(--font-display)] text-[22px] font-medium">Tonal Surface</p>
            <button type="button" className="mt-4 rounded-full bg-[#D0BCFF] px-5 py-2.5 text-xs font-bold text-[#381E72]">
              Action Pill
            </button>
          </div>
        </div>
      );

    /* 13 Fluent Design */
    case "fluent":
      return (
        <div className="p-6 sm:p-9">
          <div className="fl-card p-6 text-white">
            <span className="micro text-sky-400">Acrylic & Mica</span>
            <p className="pt-2 font-[family-name:var(--font-display)] text-[22px] font-semibold">Fluent Substrate</p>
            <p className="text-[13px] text-gray-300 pt-1">Translucent depth with pointer reveal lighting.</p>
          </div>
        </div>
      );

    /* 14 Brutalism */
    case "brut":
      return (
        <div className="p-6 sm:p-9">
          <div className="br-card text-black">
            <span className="micro font-bold">Raw / Unfinished</span>
            <h3 className="font-mono text-[24px] font-black uppercase pt-2">Brutalist Grid</h3>
            <p className="font-mono text-[12px] pt-2">No anti-aliasing tricks. Exposed right-angle structural honesty.</p>
          </div>
        </div>
      );

    /* 15 Neubrutalism */
    case "neo-brutalism":
      return (
        <div className="grid gap-5 p-6 sm:grid-cols-[1.3fr_1fr] sm:p-9">
          <button type="button" className="brut-card flex flex-col justify-between p-6 text-left">
            <span className="micro">0 blur shadow</span>
            <span className="pt-8 font-[family-name:var(--font-display)] text-[24px] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-black">
              Hard<br />Edge
            </span>
          </button>
          <div className="grid gap-4">
            <div className="brut-card grid place-items-center py-4">
              <span className="micro text-black">Sticker Pop</span>
            </div>
            <div className="brut-card grid place-items-center py-4" style={{ background: "#FF6B9A" }}>
              <span className="micro text-black">Clash Color</span>
            </div>
          </div>
        </div>
      );

    /* 16 Swiss International */
    case "swiss":
      return (
        <div className="p-6 sm:p-10">
          <div className="sw-card p-6 text-black">
            <p className="micro text-red-600 font-bold">Helvetica · Grid</p>
            <p className="pt-2 font-[family-name:var(--font-display)] text-[28px] font-bold uppercase tracking-tight">
              Order Over Ornament
            </p>
            <p className="text-[13px] text-zinc-700 pt-2">Mathematical column alignment and flush-left typography.</p>
          </div>
        </div>
      );

    /* 17 Bauhaus */
    case "bauhaus":
      return (
        <div className="p-6 sm:p-9">
          <div className="bh-card p-6 text-black">
            <div className="flex items-center gap-3 pb-4">
              <span className="h-6 w-6 rounded-full bg-red-600" />
              <span className="h-6 w-6 bg-blue-600" />
              <span className="h-0 w-0 border-x-[12px] border-x-transparent border-b-[20px] border-b-yellow-400" />
            </div>
            <p className="font-[family-name:var(--font-display)] text-[22px] font-bold uppercase">Form Follows Function</p>
          </div>
        </div>
      );

    /* 18 Luxury & Editorial */
    case "luxury":
      return (
        <div className="p-6 sm:p-9">
          <div className="lx-card p-8 text-amber-100">
            <p className="micro text-[#D4AF37]">Haute Couture</p>
            <h3 className="pt-3 font-serif text-[28px] italic font-normal tracking-widest text-[#F9F6F0]">
              Obsidian & Gold
            </h3>
            <p className="text-[12px] text-stone-400 pt-2 tracking-wider">Uncompromising elegance and bespoke luxury craft.</p>
          </div>
        </div>
      );

    /* 19 Cyberpunk */
    case "cyberpunk":
      return (
        <div className="p-6 sm:p-9">
          <div className="cp-card p-7 text-[#00F0FF]">
            <div className="flex items-center justify-between pb-3">
              <span className="micro text-[#FF0055] font-bold">SYSTEM_OVERRIDE</span>
              <span className="numeral text-xs">PORT://8080</span>
            </div>
            <h3 className="font-mono text-[24px] font-black uppercase text-[#00F0FF]">
              Night City HUD
            </h3>
            <p className="font-mono text-[12px] text-cyan-200/80 pt-2">
              45° polygon chamfers, cyan telemetry, CRT raster.
            </p>
          </div>
        </div>
      );

    /* 20 Synthwave */
    case "synthwave":
      return (
        <div className="p-6 sm:p-9">
          <div className="sw-grid p-7 text-[#FF007F]">
            <span className="micro text-cyan-300">Outrun 1984</span>
            <p className="pt-2 font-[family-name:var(--font-display)] text-[26px] font-extrabold uppercase text-[#FF007F]">
              Neon Horizon
            </p>
            <p className="text-[13px] text-pink-200 pt-1">Perspective wireframe grid fading into sunset purple.</p>
          </div>
        </div>
      );

    /* 21 Memphis Design */
    case "memphis":
      return (
        <div className="p-6 sm:p-9">
          <div className="mp-card p-6 text-[#292F36]">
            <span className="micro font-bold text-red-500">Milano 80s</span>
            <h3 className="pt-1 font-[family-name:var(--font-display)] text-[24px] font-black uppercase">
              Squiggle & Clash
            </h3>
            <p className="text-[13px] text-slate-700 pt-2">Geometric confetti scatter and joyful asymmetric color blocking.</p>
          </div>
        </div>
      );

    /* 22 Pop Art */
    case "pop-art":
      return (
        <div className="p-6 sm:p-9">
          <div className="pa-card p-6 text-black">
            <span className="micro font-black text-red-600">POW! / Benday</span>
            <h3 className="pt-1 font-[family-name:var(--font-display)] text-[26px] font-black uppercase">
              Halftone Punch
            </h3>
            <p className="text-[13px] font-medium pt-2">CMYK printing press raster dots with bold comic ink outlines.</p>
          </div>
        </div>
      );

    /* 23 Terminal */
    case "terminal":
      return (
        <div className="p-6 sm:p-9">
          <div className="tm-card p-6 font-mono">
            <div className="flex items-center gap-2 pb-3 text-xs opacity-70">
              <span>root@stylus3d:~#</span>
            </div>
            <p className="text-[18px] font-bold">cat /dev/phosphor_matrix</p>
            <p className="pt-2 text-[13px] leading-relaxed opacity-90">
              Phosphor green emission, CRT raster lines <span className="term-cursor" />
            </p>
          </div>
        </div>
      );

    /* 24 Scandinavian / Zen */
    case "scandinavian":
      return (
        <div className="p-6 sm:p-9">
          <div className="sc-card p-6">
            <span className="micro text-[#8A9A86] font-bold">Wabi-Sabi</span>
            <h3 className="pt-2 font-[family-name:var(--font-display)] text-[22px] font-semibold text-[#2C3531]">
              Tranquil Earth
            </h3>
            <p className="text-[13px] text-[#55645F] pt-2">Organic oat linen tones, serene negative space, and gentle calm.</p>
          </div>
        </div>
      );

    /* 25 Bento Grid */
    case "bento":
      return (
        <div className="p-5 sm:p-8">
          <BentoStage accent={accent} areas={bentoAreas} sel={bentoSel} onPick={onSwapArea} />
          <p className="micro pt-4" style={{ color: "var(--zmuted)" }}>
            {bentoSel ? `“${bentoSel}” armed — tap another tile to swap` : "tap two tiles to swap their named areas"}
          </p>
        </div>
      );

    /* 26 Kinetic Typography */
    case "kinetic-type":
      return (
        <div className="overflow-hidden p-6 sm:p-9">
          <div className="marquee-track flex gap-8 whitespace-nowrap">
            <span className="kt-text font-[family-name:var(--font-display)] font-extrabold tracking-tighter text-[#FBBF24]">
              FLUID VARIABLE KINETIC TYPE ·
            </span>
            <span className="kt-text font-[family-name:var(--font-display)] font-extrabold tracking-tighter text-[#FBBF24]">
              FLUID VARIABLE KINETIC TYPE ·
            </span>
          </div>
        </div>
      );

    /* 27 Extruded 3D Type */
    case "extruded-type":
      return (
        <div className="p-6 sm:p-9 text-center">
          <h2 className="et-text font-[family-name:var(--font-display)] text-[44px] sm:text-[58px] font-black uppercase tracking-tight">
            MONUMENT
          </h2>
          <p className="micro text-pink-300/80 pt-4">Pure CSS layered isometric projection</p>
        </div>
      );

    /* 28 Mesh Gradient */
    case "mesh-gradient":
      return (
        <div className="p-6 sm:p-9">
          <div className="mg-card h-[220px] rounded-2xl p-6 flex flex-col justify-end text-white">
            <span className="micro text-sky-200">Fluid Radial Mesh</span>
            <p className="font-[family-name:var(--font-display)] text-[24px] font-bold">Aurora Atmosphere</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* Bento Stage */
function BentoStage({
  areas,
  sel,
  onPick,
  accent,
}: {
  areas: string[];
  sel: string | null;
  onPick: (key: string) => void;
  accent: string;
}) {
  const tpl = [0, 1, 2]
    .map((r) => `"${areas[r * 4]} ${areas[r * 4 + 1]} ${areas[r * 4 + 2]} ${areas[r * 4 + 3]}"`)
    .join(" ");

  return (
    <div>
      <div className="b-grid h-[280px] grid-cols-4 grid-rows-3" style={{ gridTemplateAreas: tpl }}>
        {BENTO_TILES.map((t) => {
          const isSel = sel === t.key;
          return (
            <button
              key={t.key}
              type="button"
              data-sel={isSel}
              onClick={() => onPick(t.key)}
              className="b-tile group flex flex-col justify-between p-3.5 text-left"
              style={{ gridArea: t.key }}
              aria-label={`${t.label}, area ${t.key}`}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="micro" style={{ color: isSel ? accent : "var(--zmuted)" }}>
                  {t.key}
                </span>
                <span
                  className="h-1.5 w-1.5 rounded-full transition-opacity"
                  style={{ background: accent, opacity: isSel ? 1 : 0.3 }}
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[12px] font-medium" style={{ color: "var(--zink)" }}>
                  {t.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <pre
        className="numeral mt-4 overflow-auto rounded-[10px] p-3 text-[10px] leading-[1.75]"
        style={{ border: "1px dashed var(--zhair)", color: "var(--zmuted)" }}
      >
        <span style={{ color: accent }}>grid-template-areas:</span>
        {"\n"}
        {areasToTemplate(areas).join("\n").replace(/"/g, "")}
      </pre>
    </div>
  );
}

/* ---------------------------------------------------------- section */

export default function ZoneSection({
  zone,
  index,
  onEnter,
}: {
  zone: Zone;
  index: number;
  onEnter: (id: string) => void;
}) {
  const secRef = useRef<HTMLElement | null>(null);
  const valsRef = useRef<Vals>({ ...zone.vars });
  const rafRef = useRef(0);
  const [vals, setVals] = useState<Vals>({ ...zone.vars });

  /* reset when a different zone reuses this slot */
  useEffect(() => {
    valsRef.current = { ...zone.vars };
    setVals({ ...zone.vars });
    const el = secRef.current;
    if (el) {
      Object.entries(zone.vars).forEach(([k, v]) => {
        el.style.setProperty(`--${k}`, `${v}${zone.units[k] ?? ""}`);
      });
    }
  }, [zone.id, zone.vars, zone.units]);

  const set = useCallback(
    (key: string, value: number | string) => {
      valsRef.current = { ...valsRef.current, [key]: value };
      secRef.current?.style.setProperty(`--${key}`, `${value}${zone.units[key] ?? ""}`);
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        setVals({ ...valsRef.current });
      });
    },
    [zone.units],
  );

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const reset = () => {
    Object.entries(zone.vars).forEach(([k, v]) => set(k, v));
  };

  /* bento code extras */
  const [bentoAreas, setBentoAreas] = useState<string[]>(BENTO_SHAPES.flat());
  const [bentoSel, setBentoSel] = useState<string | null>(null);
  useEffect(() => {
    setBentoAreas(BENTO_SHAPES.flat());
    setBentoSel(null);
  }, [zone.id]);

  const pickArea = useCallback((key: string) => {
    setBentoSel((cur) => {
      if (!cur || cur === key) return key;
      const from = cur;
      setBentoAreas((prev) => prev.map((c) => (c === from ? key : c === key ? from : c)));
      return null;
    });
  }, []);

  const rec: Rec = useMemo(() => {
    if (zone.id !== "bento") return {} as Rec;
    const rows = areasToTemplate(bentoAreas).join("\n");
    return {
      gap: `${vals.bgap}px`,
      rows,
      rowsFlat: areasToTemplate(bentoAreas)
        .map((r) => r.trim().replace(/"/g, "'").replace(/\s+/g, "_"))
        .join("_"),
      tiles: BENTO_TILES.map((t) => `.tile-${t.label.toLowerCase().replace(/\s+/g, "-")} { grid-area: ${t.key}; }`).join("\n"),
      tilesTw: BENTO_TILES.map((t) => `/* grid-area: ${t.key} */  ${t.label}`).join("\n"),
      tilesInline: BENTO_TILES.map((t) => `  <div style="grid-area: ${t.key}">…</div>  <!-- ${t.label} -->`).join("\n"),
    };
  }, [zone.id, bentoAreas, vals.bgap]);

  const code: Record<TabKey, string> = useMemo(
    () => ({
      css: zone.buildCss(vals, rec),
      tailwind: zone.buildTw(vals, rec),
      inline: zone.buildInline(vals, rec),
      html:
        zone.id === "bento"
          ? rec.tilesInline
          : zone.id === "glassmorphism"
            ? `<section class="stage">\n  <article class="glass-card">\n    <h3>Frost panel</h3>\n    <p>backdrop-filter samples the stack below.</p>\n  </article>\n</section>`
            : `<article class="${zone.id}-card">\n  <h3>${zone.name}</h3>\n  <p>${zone.headline}</p>\n  <button>Interact</button>\n</article>`,
    }),
    [zone, vals, rec],
  );

  const accent = zone.accent;

  return (
    <section
      id={zone.id}
      ref={secRef}
      data-zone-sec={zone.id}
      data-z={zone.id}
      data-mode={zone.mode}
      className="zone relative overflow-hidden"
      style={{ scrollMarginTop: "4rem" }}
    >
      <style>{zone.css}</style>

      {/* legibility scrim */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background: `color-mix(in srgb, var(--surface) ${zone.mode === "light" ? 88 : 78}%, transparent)`,
        }}
      />

      <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28 xl:pl-24 xl:pr-24">
        {/* header band */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.55, ease }}
          className="grid grid-cols-12 gap-x-6"
        >
          <div className="col-span-12 lg:col-span-9">
            <div className="flex flex-wrap items-center gap-3 pb-5">
              <span className="numeral text-[13px] font-bold" style={{ color: accent }}>
                {zone.idx}
              </span>
              <span className="h-px w-6" style={{ background: accent }} />
              <span className="micro" style={{ color: "var(--zmuted)" }}>
                {zone.kicker}
              </span>
            </div>

            <h2
              className="font-[family-name:var(--font-display)] font-bold tracking-[-0.033em]"
              style={{ fontSize: "clamp(1.9rem, 4.6vw, 3.6rem)", lineHeight: 1.02, maxWidth: "20ch" }}
            >
              {zone.headline}
            </h2>
          </div>

          <div className="col-span-12 hidden lg:col-span-2 lg:col-start-11 lg:flex lg:justify-end lg:pt-1">
            <button
              type="button"
              onClick={() => onEnter(zone.id)}
              className="micro group inline-flex items-center gap-1.5 transition-colors"
              style={{ color: "var(--zmuted)" }}
            >
              Anchor
              <ArrowUpRight size={12} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.div>

        {/* content grid: 12 cols */}
        <div className="mt-14 grid grid-cols-12 gap-x-8 gap-y-12 lg:mt-16">
          {/* left column: primitives & description */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-4">
            <p className="text-[14.5px] leading-[1.7]" style={{ color: "var(--zmuted)" }}>
              {zone.blurb}
            </p>

            <div className="mt-8">
              <p className="micro pb-3" style={{ color: "var(--zmuted)" }}>
                Core primitives
              </p>
              <ul className="list-none p-0">
                {zone.primitives.map((p, i) => (
                  <PrimitiveRow key={i} term={p.term} note={p.note} accent={accent} />
                ))}
              </ul>
            </div>
          </div>

          {/* right column: interactive stage + controls + live code */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-8">
            <div
              className="overflow-hidden rounded-[20px]"
              style={{ border: "1px solid var(--zhair)", background: "var(--panel)" }}
            >
              {/* interactive demo stage */}
              <Stage
                zone={zone}
                vals={vals}
                accent={accent}
                bentoAreas={bentoAreas}
                onSwapArea={pickArea}
                bentoSel={bentoSel}
              />

              {/* instrument controls strip */}
              {zone.controls.length > 0 && (
                <div
                  className="p-5 sm:p-7"
                  style={{ borderTop: "1px solid var(--zhair)", background: "color-mix(in srgb, var(--surface) 45%, transparent)" }}
                >
                  <div className="flex items-center justify-between pb-5">
                    <span className="micro" style={{ color: accent }}>
                      Live parameters
                    </span>
                    <button
                      type="button"
                      onClick={reset}
                      className="ghost-btn micro inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1"
                      aria-label="Reset parameters to default"
                    >
                      <RotateCcw size={10} strokeWidth={2.5} />
                      Reset
                    </button>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {zone.controls.map((c) => {
                      if (c.kind === "range") {
                        return (
                          <Dial
                            key={c.key}
                            label={c.label}
                            value={Number(vals[c.key] ?? c.min)}
                            min={c.min}
                            max={c.max}
                            step={c.step}
                            unit={c.unit}
                            accent={accent}
                            onChange={(v) => set(c.key, v)}
                          />
                        );
                      }
                      if (c.kind === "color") {
                        return (
                          <Swatch
                            key={c.key}
                            label={c.label}
                            value={String(vals[c.key] ?? "#FFFFFF")}
                            onChange={(v) => set(c.key, v)}
                          />
                        );
                      }
                      if (c.kind === "pad") {
                        return (
                          <LightPad
                            key={c.key}
                            lx={Number(vals.lx ?? 10)}
                            ly={Number(vals.ly ?? 10)}
                            accent={accent}
                            onChange={(lx, ly) => {
                              set("lx", lx);
                              set("ly", ly);
                            }}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              {/* copy-ready code tray */}
              <CodeTray code={code} accent={accent} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
