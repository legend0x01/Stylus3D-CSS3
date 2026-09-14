export type Vals = Record<string, number | string>;

export type CategoryKey = "all" | "morphism" | "essential" | "theme" | "layout" | "typography";

export interface CategoryInfo {
  key: CategoryKey;
  label: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { key: "all", label: "All Styles", icon: "✦", description: "Complete interactive catalogue across all design movements" },
  { key: "morphism", label: "Morphism & Depth", icon: "🫧", description: "Glass, soft UI, clay, liquid, chrome, holographic, and paper surfaces" },
  { key: "essential", label: "Essential & Architectural", icon: "🏛️", description: "Minimalism, Flat, Material, Fluent, Brutalism, Swiss, and Bauhaus" },
  { key: "theme", label: "Aesthetic & Subcultures", icon: "🎨", description: "Cyberpunk, Y2K, Vaporwave, Memphis, Pop Art, Terminal, and Zen" },
  { key: "layout", label: "Layout Paradigms", icon: "📐", description: "Bento grids, split-screen, masonry, and modular dashboards" },
  { key: "typography", label: "Typography & Textures", icon: "🔤", description: "Kinetic type, 3D extruded lettering, neon outline, and mesh gradients" },
];

export type Control =
  | {
      kind: "range";
      key: string;
      label: string;
      min: number;
      max: number;
      step: number;
      unit: string;
    }
  | { kind: "color"; key: string; label: string }
  | { kind: "pad"; key: string; label: string };

export type DemoKind =
  | "glass"
  | "neo"
  | "clay"
  | "sk"
  | "liquid"
  | "metallic"
  | "glow"
  | "holographic"
  | "paper"
  | "minimalism"
  | "flat"
  | "material"
  | "fluent"
  | "brut"
  | "neo-brutalism"
  | "swiss"
  | "bauhaus"
  | "luxury"
  | "corporate"
  | "cyberpunk"
  | "retro-futurism"
  | "synthwave"
  | "memphis"
  | "pop-art"
  | "terminal"
  | "scandinavian"
  | "bento"
  | "split-screen"
  | "masonry"
  | "dashboard"
  | "kinetic-type"
  | "extruded-type"
  | "glow-type"
  | "mesh-gradient";

export interface Zone {
  id: string;
  idx: string;
  name: string;
  category: CategoryKey;
  kicker: string;
  headline: string;
  blurb: string;
  primitives: { term: string; note: string }[];
  mode: "dark" | "light";
  accent: string;
  vars: Vals;
  units: Record<string, string>;
  controls: Control[];
  css: string;
  demo: DemoKind;
  buildCss: (v: Vals, x: Rec) => string;
  buildTw: (v: Vals, x: Rec) => string;
  buildInline: (v: Vals, x: Rec) => string;
}

export type Rec = Record<string, string>;

/* ------------------------------------------------------------- helpers */

const N = (v: Vals, k: string) => Number(v[k]);
const C = (v: Vals, k: string) => String(v[k]);

export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return [255, 255, 255];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgba(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
}

export function mix(hex: string, target: string, t: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/* =================================================================== 
   01-09: MORPHISM & SURFACE DEPTH
=================================================================== */

const glassmorphism: Zone = {
  id: "glassmorphism",
  idx: "01",
  category: "morphism",
  name: "Glassmorphism",
  kicker: "Morphism / Frost Layer & Specular Edge",
  headline: "Light passes through. Type stays crystal legible.",
  blurb:
    "A translucent plane stacked over a rich background. The key to authentic glass is the 1px specular highlight on the top edge and saturation boost, preventing the frosted surface from washing out into dull fog.",
  primitives: [
    { term: "backdrop-filter: blur()", note: "Samples and diffuses pixels rendered behind the element box." },
    { term: "saturate()", note: "Injects vibrancy back into blurred background lights." },
    { term: "1px border specular", note: "Simulates the sharp light catching on cut glass bevels." },
    { term: "fill opacity", note: "Keeping background alpha under 0.25 preserves airy transparency." },
  ],
  mode: "dark",
  accent: "#4EC9F5",
  vars: { blur: 18, sat: 170, op: 14, radius: 24, brd: 1, tint: "#ffffff" },
  units: { blur: "px", sat: "%", op: "%", radius: "px", brd: "px", tint: "" },
  controls: [
    { kind: "range", key: "blur", label: "blur", min: 0, max: 40, step: 1, unit: "px" },
    { kind: "range", key: "sat", label: "saturate", min: 0, max: 300, step: 5, unit: "%" },
    { kind: "range", key: "op", label: "fill alpha", min: 0, max: 60, step: 1, unit: "%" },
    { kind: "range", key: "brd", label: "specular border", min: 0, max: 4, step: 1, unit: "px" },
    { kind: "range", key: "radius", label: "corner radius", min: 0, max: 48, step: 1, unit: "px" },
    { kind: "color", key: "tint", label: "glass tint" },
  ],
  css: `.g-card {
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--tint) var(--op), transparent);
  backdrop-filter: blur(var(--blur)) saturate(var(--sat));
  -webkit-backdrop-filter: blur(var(--blur)) saturate(var(--sat));
  border: var(--brd) solid color-mix(in srgb, var(--tint) 45%, transparent);
  box-shadow: 0 24px 50px -20px rgba(0,0,0,.7), inset 0 1px 0 color-mix(in srgb, var(--tint) 50%, transparent);
}`,
  demo: "glass",
  buildCss: (v) => {
    const t = C(v, "tint");
    return `.glass-card {
  padding: 28px;
  border-radius: ${N(v, "radius")}px;
  background: ${rgba(t, N(v, "op") / 100)};
  backdrop-filter: blur(${N(v, "blur")}px) saturate(${N(v, "sat")}%);
  -webkit-backdrop-filter: blur(${N(v, "blur")}px) saturate(${N(v, "sat")}%);
  border: ${N(v, "brd")}px solid ${rgba(t, 0.45)};
  box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.7), inset 0 1px 0 ${rgba(t, 0.5)};
}`;
  },
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-[${rgba(C(v, "tint"), N(v, "op") / 100)}]\n` +
    `backdrop-blur-[${N(v, "blur")}px] backdrop-saturate-[${(N(v, "sat") / 100).toFixed(2)}]\n` +
    `border-[${N(v, "brd")}px] border-[${rgba(C(v, "tint"), 0.45)}]\n` +
    `shadow-[0_24px_50px_-20px_rgba(0,0,0,.7)]\n` +
    `shadow-[inset_0_1px_0_${rgba(C(v, "tint"), 0.5)}]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: ${rgba(C(v, "tint"), N(v, "op") / 100)};\n  backdrop-filter: blur(${N(v, "blur")}px) saturate(${N(v, "sat")}%);\n  border: ${N(v, "brd")}px solid ${rgba(C(v, "tint"), 0.45)};\n  box-shadow: 0 24px 50px -20px rgba(0,0,0,.7), inset 0 1px 0 ${rgba(C(v, "tint"), 0.5)};\n">…</div>`,
};

const neomorphism: Zone = {
  id: "neomorphism",
  idx: "02",
  category: "morphism",
  name: "Neumorphism",
  kicker: "Morphism / Soft UI Extrusion",
  headline: "One continuous plane. Dual opposing shadows.",
  blurb:
    "Soft UI makes UI elements appear molded seamlessly from the background substrate. A single directional light creates a pale highlight on one side and a soft dark shadow on the opposite side.",
  primitives: [
    { term: "dual box-shadow", note: "Paired light and dark offsets create the raised tactile bevel." },
    { term: "inset inversion", note: "Flipping shadows to inset transforms buttons into sunken wells." },
    { term: "monochrome substrate", note: "The element background must match the canvas background exactly." },
  ],
  mode: "light",
  accent: "#6C7CE0",
  vars: { depth: 16, lx: 10, ly: 10, radius: 24, contrast: 100, "surface-c": "#E2E7EC", shade: "#8FA3B8" },
  units: { depth: "px", lx: "px", ly: "px", radius: "px", contrast: "%", "surface-c": "", shade: "" },
  controls: [
    { kind: "pad", key: "lx", label: "light direction" },
    { kind: "range", key: "depth", label: "extrusion blur", min: 4, max: 32, step: 1, unit: "px" },
    { kind: "range", key: "radius", label: "corner radius", min: 0, max: 48, step: 1, unit: "px" },
    { kind: "color", key: "surface-c", label: "substrate color" },
  ],
  css: `.n-card {
  border-radius: var(--radius);
  background: var(--surface-c);
  box-shadow: calc(var(--lx) * 1px) calc(var(--ly) * 1px) var(--depth) rgba(150,165,185,.55),
              calc(var(--lx) * -1px) calc(var(--ly) * -1px) var(--depth) rgba(255,255,255,.95);
}
.n-card[data-press="true"], .n-card:active {
  box-shadow: inset calc(var(--lx) * 1px) calc(var(--ly) * 1px) var(--depth) rgba(150,165,185,.6),
              inset calc(var(--lx) * -1px) calc(var(--ly) * -1px) var(--depth) rgba(255,255,255,.9);
}`,
  demo: "neo",
  buildCss: (v) => {
    const lx = N(v, "lx");
    const ly = N(v, "ly");
    const d = N(v, "depth");
    const s = C(v, "surface-c");
    return `.neumorphic-btn {
  background: ${s};
  border-radius: ${N(v, "radius")}px;
  border: none;
  box-shadow:
    ${lx}px ${ly}px ${d}px rgba(150, 165, 185, 0.55),
    ${-lx}px ${-ly}px ${d}px rgba(255, 255, 255, 0.95);
  transition: box-shadow 0.2s ease;
}
.neumorphic-btn:active {
  box-shadow:
    inset ${lx}px ${ly}px ${d}px rgba(150, 165, 185, 0.6),
    inset ${-lx}px ${-ly}px ${d}px rgba(255, 255, 255, 0.9);
}`;
  },
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-[${C(v, "surface-c")}]\n` +
    `shadow-[${N(v, "lx")}px_${N(v, "ly")}px_${N(v, "depth")}px_rgba(150,165,185,.55),_${-N(v, "lx")}px_${-N(v, "ly")}px_${N(v, "depth")}px_rgba(255,255,255,.95)]\n` +
    `active:shadow-[inset_${N(v, "lx")}px_${N(v, "ly")}px_${N(v, "depth")}px_rgba(150,165,185,.6),_inset_${-N(v, "lx")}px_${-N(v, "ly")}px_${N(v, "depth")}px_rgba(255,255,255,.9)]`,
  buildInline: (v) =>
    `<button style="\n  border-radius: ${N(v, "radius")}px;\n  background: ${C(v, "surface-c")};\n  box-shadow: ${N(v, "lx")}px ${N(v, "ly")}px ${N(v, "depth")}px rgba(150,165,185,.55), ${-N(v, "lx")}px ${-N(v, "ly")}px ${N(v, "depth")}px rgba(255,255,255,.95);\n">…</button>`,
};

const claymorphism: Zone = {
  id: "claymorphism",
  idx: "03",
  category: "morphism",
  name: "Claymorphism",
  kicker: "Morphism / Inflatable 3D Matte",
  headline: "Chubby, tactile, floating matte forms.",
  blurb:
    "Claymorphism gives UI elements an inflated, friendly 3D look. It combines thick dual inset shadows for inner volumetric curvature with a deep, soft drop shadow that detaches the clay object from the canvas.",
  primitives: [
    { term: "dual inset curvature", note: "Top-left light inset and bottom-right dark inset carve the 3D volume." },
    { term: "soft floating drop shadow", note: "High blur with Y-offset simulates physical elevation." },
    { term: "ultra-smooth corners", note: "Large border-radius ensures a plush, friendly silhouette." },
  ],
  mode: "dark",
  accent: "#FF8A5B",
  vars: { puff: 20, inner: 16, radius: 32, base: "#FF8A5B" },
  units: { puff: "px", inner: "px", radius: "px", base: "" },
  controls: [
    { kind: "range", key: "puff", label: "elevation shadow", min: 8, max: 40, step: 2, unit: "px" },
    { kind: "range", key: "inner", label: "inner inflation", min: 6, max: 30, step: 1, unit: "px" },
    { kind: "range", key: "radius", label: "roundness", min: 16, max: 50, step: 2, unit: "px" },
    { kind: "color", key: "base", label: "clay color" },
  ],
  css: `.c-card {
  border-radius: var(--radius);
  background: var(--base);
  box-shadow: 0 var(--puff) calc(var(--puff) * 1.8) rgba(0,0,0,.35),
              inset calc(var(--inner) * -0.5) calc(var(--inner) * -0.5) var(--inner) rgba(0,0,0,.35),
              inset calc(var(--inner) * 0.5) calc(var(--inner) * 0.5) var(--inner) rgba(255,255,255,.6);
}`,
  demo: "clay",
  buildCss: (v) => `.clay-card {
  padding: 32px;
  border-radius: ${N(v, "radius")}px;
  background: ${C(v, "base")};
  box-shadow:
    0 ${N(v, "puff")}px ${Math.round(N(v, "puff") * 1.8)}px rgba(0, 0, 0, 0.35),
    inset ${Math.round(N(v, "inner") * -0.5)}px ${Math.round(N(v, "inner") * -0.5)}px ${N(v, "inner")}px rgba(0, 0, 0, 0.35),
    inset ${Math.round(N(v, "inner") * 0.5)}px ${Math.round(N(v, "inner") * 0.5)}px ${N(v, "inner")}px rgba(255, 255, 255, 0.6);
}`,
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-[${C(v, "base")}]\n` +
    `shadow-[0_${N(v, "puff")}px_${Math.round(N(v, "puff") * 1.8)}px_rgba(0,0,0,.35),_inset_${Math.round(N(v, "inner") * -0.5)}px_${Math.round(N(v, "inner") * -0.5)}px_${N(v, "inner")}px_rgba(0,0,0,.35),_inset_${Math.round(N(v, "inner") * 0.5)}px_${Math.round(N(v, "inner") * 0.5)}px_${N(v, "inner")}px_rgba(255,255,255,.6)]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: ${C(v, "base")};\n  box-shadow: 0 ${N(v, "puff")}px ${Math.round(N(v, "puff") * 1.8)}px rgba(0,0,0,.35), inset ${Math.round(N(v, "inner") * -0.5)}px ${Math.round(N(v, "inner") * -0.5)}px ${N(v, "inner")}px rgba(0,0,0,.35), inset ${Math.round(N(v, "inner") * 0.5)}px ${Math.round(N(v, "inner") * 0.5)}px ${N(v, "inner")}px rgba(255,255,255,.6);\n">…</div>`,
};

const skeuomorphism: Zone = {
  id: "skeuomorphism",
  idx: "04",
  category: "morphism",
  name: "Skeuomorphism",
  kicker: "Morphism / Machined Analog Hardware",
  headline: "Real-world textures. Tactile engineered controls.",
  blurb:
    "Skeuomorphism channels physical materials—brushed titanium, knurled dials, stamped anodized aluminum, and recessed meters. Gradients emulate specular catch-lights while multi-stop linear borders create authentic metallic chamfers.",
  primitives: [
    { term: "conic specular gradient", note: "Sweeps metal sheen across rotary dials and machined bevels." },
    { term: "multi-stop chamfer", note: "Simulates milled metal edge highlights with 4-stop gradients." },
    { term: "recessed well shadow", note: "Multi-layered inset shadows embed knobs directly into the faceplate." },
  ],
  mode: "dark",
  accent: "#D9A05B",
  vars: { sheen: 75, bevel: 2, radius: 14, metallic: "#8A929C" },
  units: { sheen: "%", bevel: "px", radius: "px", metallic: "" },
  controls: [
    { kind: "range", key: "sheen", label: "specular shine", min: 30, max: 100, step: 5, unit: "%" },
    { kind: "range", key: "bevel", label: "chamfer width", min: 1, max: 5, step: 1, unit: "px" },
    { kind: "range", key: "radius", label: "corner radius", min: 4, max: 28, step: 2, unit: "px" },
    { kind: "color", key: "metallic", label: "metal tone" },
  ],
  css: `.sk-card {
  border-radius: var(--radius);
  background: linear-gradient(145deg, #2A241E, #14110E);
  border: var(--bevel) solid #3D332A;
  box-shadow: inset 0 1px 1px rgba(255,225,180,.35), inset 0 -2px 4px rgba(0,0,0,.8), 0 16px 36px rgba(0,0,0,.85);
}`,
  demo: "sk",
  buildCss: (v) => `.skeuo-dial {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(from 180deg at 50% 50%, #4a3e35 0deg, #1c1713 90deg, #6e5c4f 180deg, #1c1713 270deg, #4a3e35 360deg);
  border: ${N(v, "bevel")}px solid #3d332a;
  box-shadow:
    0 14px 28px rgba(0, 0, 0, 0.8),
    inset 0 2px 3px rgba(255, 230, 190, 0.4),
    inset 0 -3px 5px rgba(0, 0, 0, 0.7);
}`,
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-gradient-to-br from-[#2A241E] to-[#14110E]\n` +
    `border-[${N(v, "bevel")}px] border-[#3D332A]\n` +
    `shadow-[0_16px_36px_rgba(0,0,0,.85),_inset_0_1px_1px_rgba(255,225,180,.35),_inset_0_-2px_4px_rgba(0,0,0,.8)]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: linear-gradient(145deg, #2A241E, #14110E);\n  border: ${N(v, "bevel")}px solid #3D332A;\n  box-shadow: inset 0 1px 1px rgba(255,225,180,.35), inset 0 -2px 4px rgba(0,0,0,.8), 0 16px 36px rgba(0,0,0,.85);\n">…</div>`,
};

const liquidmorphism: Zone = {
  id: "liquidmorphism",
  idx: "05",
  category: "morphism",
  name: "Liquid Glassmorphism",
  kicker: "Morphism / Refractive Fluid & Blobmorphism",
  headline: "Organic, viscous fluidity with chromatic refraction.",
  blurb:
    "Liquidmorphism combines organic morphing border-radii with distorted multi-layer refraction gradients. It simulates molten glass, soap bubbles, and liquid lenses that deform dynamically under interaction.",
  primitives: [
    { term: "dynamic border-radius 8-point", note: "Asymmetric corner values create natural organic fluid droplets." },
    { term: "chromatic aberration shadow", note: "Staggered red/cyan inset glows emulate light passing through fluid." },
    { term: "turbulent background-filter", note: "Distorts background elements as if viewed through moving water." },
  ],
  mode: "dark",
  accent: "#38EF7D",
  vars: { viscous: 30, blur: 20, glow: 24, tint: "#11998E" },
  units: { viscous: "%", blur: "px", glow: "px", tint: "" },
  controls: [
    { kind: "range", key: "viscous", label: "fluidity morph", min: 10, max: 60, step: 5, unit: "%" },
    { kind: "range", key: "blur", label: "refraction blur", min: 8, max: 36, step: 2, unit: "px" },
    { kind: "range", key: "glow", label: "chromatic glow", min: 10, max: 45, step: 1, unit: "px" },
    { kind: "color", key: "tint", label: "liquid tint" },
  ],
  css: `.lq-card {
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  background: linear-gradient(135deg, rgba(255,255,255,.2), rgba(255,255,255,.03));
  backdrop-filter: blur(var(--blur)) saturate(190%);
  border: 1.5px solid rgba(255,255,255,.35);
  box-shadow: 0 20px 45px -15px rgba(0,0,0,.7), inset 0 0 var(--glow) color-mix(in srgb, var(--tint) 55%, transparent);
}`,
  demo: "liquid",
  buildCss: (v) => `.liquid-blob {
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.04));
  backdrop-filter: blur(${N(v, "blur")}px) saturate(190%);
  -webkit-backdrop-filter: blur(${N(v, "blur")}px) saturate(190%);
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 20px 45px -15px rgba(0, 0, 0, 0.7),
    inset 0 0 ${N(v, "glow")}px ${rgba(C(v, "tint"), 0.55)};
  animation: liquid-morph 8s ease-in-out infinite;
}`,
  buildTw: (v) =>
    `rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-br from-white/20 to-white/5\n` +
    `backdrop-blur-[${N(v, "blur")}px] backdrop-saturate-[1.9]\n` +
    `border-[1.5px] border-white/35\n` +
    `shadow-[0_20px_45px_-15px_rgba(0,0,0,.7),_inset_0_0_${N(v, "glow")}px_${rgba(C(v, "tint"), 0.55)}]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;\n  background: linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,.04));\n  backdrop-filter: blur(${N(v, "blur")}px) saturate(190%);\n  border: 1.5px solid rgba(255,255,255,.35);\n  box-shadow: 0 20px 45px -15px rgba(0,0,0,.7), inset 0 0 ${N(v, "glow")}px ${rgba(C(v, "tint"), 0.55)};\n">…</div>`,
};

const metallicmorphism: Zone = {
  id: "metallicmorphism",
  idx: "06",
  category: "morphism",
  name: "Chromemorphism & Metallic",
  kicker: "Morphism / Polished Chrome & Mirror Bevel",
  headline: "High-specular liquid mercury and brushed titanium.",
  blurb:
    "Chromemorphism layers extreme multi-stop linear gradients to emulate reflected horizon lines and sky maps. Heavy specular catch-lights and mirrored bevels give surfaces an unmistakable liquid metal sheen.",
  primitives: [
    { term: "horizon line gradient", note: "Sharp midpoint color stops simulate the reflected ground-to-sky horizon." },
    { term: "specular catch-rim", note: "Pure white 1px outer bevel delivers the polished mirror edge." },
    { term: "metallic reflection map", note: "Subtle noise or texture gives brushed grain realism." },
  ],
  mode: "dark",
  accent: "#E2E8F0",
  vars: { chromeAngle: 135, contrast: 90, radius: 20, luster: "#C0D6DF" },
  units: { chromeAngle: "deg", contrast: "%", radius: "px", luster: "" },
  controls: [
    { kind: "range", key: "chromeAngle", label: "reflection angle", min: 0, max: 360, step: 15, unit: "deg" },
    { kind: "range", key: "contrast", label: "specular contrast", min: 50, max: 100, step: 5, unit: "%" },
    { kind: "range", key: "radius", label: "corner radius", min: 4, max: 40, step: 2, unit: "px" },
    { kind: "color", key: "luster", label: "luster tint" },
  ],
  css: `.ch-card {
  border-radius: var(--radius);
  background: linear-gradient(var(--chromeAngle), #F8FAFC 0%, #94A3B8 24%, #0F172A 50%, #64748B 52%, #CBD5E1 76%, #FFFFFF 100%);
  border: 1px solid rgba(255,255,255,.7);
  box-shadow: 0 22px 50px rgba(0,0,0,.75), inset 0 1px 2px rgba(255,255,255,.9);
}`,
  demo: "metallic",
  buildCss: (v) => `.chrome-panel {
  padding: 30px;
  border-radius: ${N(v, "radius")}px;
  background: linear-gradient(
    ${N(v, "chromeAngle")}deg,
    #f8fafc 0%,
    #94a3b8 24%,
    #0f172a 50%,
    #64748b 52%,
    #cbd5e1 76%,
    #ffffff 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow:
    0 22px 50px rgba(0, 0, 0, 0.75),
    inset 0 1px 2px rgba(255, 255, 255, 0.9);
}`,
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-[linear-gradient(${N(v, "chromeAngle")}deg,#F8FAFC_0%,#94A3B8_24%,#0F172A_50%,#64748B_52%,#CBD5E1_76%,#FFFFFF_100%)]\n` +
    `border border-white/70\n` +
    `shadow-[0_22px_50px_rgba(0,0,0,.75),_inset_0_1px_2px_rgba(255,255,255,.9)]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: linear-gradient(${N(v, "chromeAngle")}deg, #F8FAFC 0%, #94A3B8 24%, #0F172A 50%, #64748B 52%, #CBD5E1 76%, #FFFFFF 100%);\n  border: 1px solid rgba(255,255,255,.7);\n  box-shadow: 0 22px 50px rgba(0,0,0,.75), inset 0 1px 2px rgba(255,255,255,.9);\n">…</div>`,
};

const glowmorphism: Zone = {
  id: "glowmorphism",
  idx: "07",
  category: "morphism",
  name: "Glowmorphism & Neon",
  kicker: "Morphism / Multi-Tier Radiant Bloom",
  headline: "Luminescent self-emitting light sources.",
  blurb:
    "Glowmorphism uses layered drop-shadows and emissive halos to turn UI containers into radiant lamps. Tight, high-opacity halos define edge luminance, while expansive soft blurs cast ambient light onto neighbouring surfaces.",
  primitives: [
    { term: "stacked box-shadow ×4", note: "Combines 2px, 8px, 24px, and 64px blurs for realistic photorealistic bloom." },
    { term: "saturated neon stroke", note: "Semi-transparent glowing borders reinforce the light tube perimeter." },
    { term: "ambient surface spill", note: "Illuminates adjacent cards and typography with colored light falloff." },
  ],
  mode: "dark",
  accent: "#FF3DF0",
  vars: { glow: 28, bloom: 45, radius: 22, neonColor: "#FF3DF0" },
  units: { glow: "px", bloom: "px", radius: "px", neonColor: "" },
  controls: [
    { kind: "range", key: "glow", label: "inner core glow", min: 8, max: 40, step: 2, unit: "px" },
    { kind: "range", key: "bloom", label: "ambient bloom", min: 20, max: 80, step: 5, unit: "px" },
    { kind: "range", key: "radius", label: "corner radius", min: 8, max: 40, step: 2, unit: "px" },
    { kind: "color", key: "neonColor", label: "neon color" },
  ],
  css: `.gw-card {
  border-radius: var(--radius);
  background: rgba(10,12,18,.85);
  border: 1px solid var(--neonColor);
  box-shadow: 0 0 10px var(--neonColor), 0 0 calc(var(--glow) * 1px) var(--neonColor), 0 0 calc(var(--bloom) * 1px) color-mix(in srgb, var(--neonColor) 50%, transparent);
}`,
  demo: "glow",
  buildCss: (v) => {
    const c = C(v, "neonColor");
    return `.glow-card {
  padding: 30px;
  border-radius: ${N(v, "radius")}px;
  background: rgba(10, 12, 18, 0.88);
  border: 1.5px solid ${c};
  box-shadow:
    0 0 10px ${c},
    0 0 ${N(v, "glow")}px ${c},
    0 0 ${N(v, "bloom")}px ${rgba(c, 0.5)};
}`;
  },
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-[#0A0C12]/90\n` +
    `border-[1.5px] border-[${C(v, "neonColor")}]\n` +
    `shadow-[0_0_10px_${C(v, "neonColor")},_0_0_${N(v, "glow")}px_${C(v, "neonColor")},_0_0_${N(v, "bloom")}px_${rgba(C(v, "neonColor"), 0.5)}]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: rgba(10,12,18,.88);\n  border: 1.5px solid ${C(v, "neonColor")};\n  box-shadow: 0 0 10px ${C(v, "neonColor")}, 0 0 ${N(v, "glow")}px ${C(v, "neonColor")}, 0 0 ${N(v, "bloom")}px ${rgba(C(v, "neonColor"), 0.5)};\n">…</div>`,
};

const holographicmorphism: Zone = {
  id: "holographicmorphism",
  idx: "08",
  category: "morphism",
  name: "Holographic & Iridescent",
  kicker: "Morphism / Prismatic Rainbow Diffraction",
  headline: "Prismatic rainbow diffraction that shifts with angle.",
  blurb:
    "Holographic design recreates the iridescent foil sheen of security stickers and collector cards. Multi-color linear mesh gradients rotate across the surface, overlaid with glass specular sheen.",
  primitives: [
    { term: "conic spectral gradient", note: "Cycles through red, yellow, cyan, purple, and green wavelength bands." },
    { term: "specular foil shimmer", note: "Overlay blend mode brightens highlights while keeping deep darks intact." },
    { term: "interactive tilt angle", note: "Mouse position directly shifts gradient angles to simulate true physical foil." },
  ],
  mode: "dark",
  accent: "#A78BFA",
  vars: { foilAngle: 120, sat: 150, radius: 24, foilTint: "#C084FC" },
  units: { foilAngle: "deg", sat: "%", radius: "px", foilTint: "" },
  controls: [
    { kind: "range", key: "foilAngle", label: "prismatic angle", min: 0, max: 360, step: 15, unit: "deg" },
    { kind: "range", key: "sat", label: "iridescent vibrancy", min: 100, max: 250, step: 10, unit: "%" },
    { kind: "range", key: "radius", label: "corner radius", min: 8, max: 40, step: 2, unit: "px" },
    { kind: "color", key: "foilTint", label: "accent prism" },
  ],
  css: `.hl-card {
  border-radius: var(--radius);
  background: linear-gradient(var(--foilAngle), #FF6B9A, #FFA94D, #FFE066, #69DB7C, #4DABF7, #748FFC, #DA77F2);
  background-size: 200% 200%;
  filter: saturate(var(--sat));
  box-shadow: 0 20px 48px -15px rgba(116,143,252,.5), inset 0 1px 2px rgba(255,255,255,.9);
}`,
  demo: "holographic",
  buildCss: (v) => `.holo-foil {
  padding: 32px;
  border-radius: ${N(v, "radius")}px;
  background: linear-gradient(
    ${N(v, "foilAngle")}deg,
    #ff6b9a 0%,
    #ffa94d 20%,
    #ffe066 40%,
    #69db7c 60%,
    #4dabf7 80%,
    #da77f2 100%
  );
  filter: saturate(${N(v, "sat")}%);
  box-shadow:
    0 20px 48px -15px rgba(116, 143, 252, 0.5),
    inset 0 1px 2px rgba(255, 255, 255, 0.9);
}`,
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-[linear-gradient(${N(v, "foilAngle")}deg,#FF6B9A_0%,#FFA94D_20%,#FFE066_40%,#69DB7C_60%,#4DABF7_80%,#DA77F2_100%)]\n` +
    `saturate-[${(N(v, "sat") / 100).toFixed(2)}]\n` +
    `shadow-[0_20px_48px_-15px_rgba(116,143,252,.5),_inset_0_1px_2px_rgba(255,255,255,.9)]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: linear-gradient(${N(v, "foilAngle")}deg, #FF6B9A 0%, #FFA94D 20%, #FFE066 40%, #69DB7C 60%, #4DABF7 80%, #DA77F2 100%);\n  filter: saturate(${N(v, "sat")}%);\n  box-shadow: 0 20px 48px -15px rgba(116,143,252,.5), inset 0 1px 2px rgba(255,255,255,.9);\n">…</div>`,
};

const paperism: Zone = {
  id: "paperism",
  idx: "09",
  category: "morphism",
  name: "Paperism & Paper Cut",
  kicker: "Morphism / Multi-Layer Origami Elevation",
  headline: "Tactile cardstock, origami folds, and cast shadows.",
  blurb:
    "Paper Cut design stacks crisp sheets of paper with tight, directional ambient shadows. Subtle fiber noise and cut-out silhouettes give digital layouts the authentic warmth of hand-crafted papercraft.",
  primitives: [
    { term: "staggered drop-shadow sheets", note: "Incremental Z-height shadows produce real multi-tier physical layering." },
    { term: "paper fiber texture", note: "Subtle organic grain overlay removes digital sterility." },
    { term: "curved fold highlights", note: "Corner gradients simulate lifted or curled paper stock edges." },
  ],
  mode: "light",
  accent: "#E29578",
  vars: { elevation: 12, curl: 8, radius: 10, paperTone: "#FDFBF7" },
  units: { elevation: "px", curl: "deg", radius: "px", paperTone: "" },
  controls: [
    { kind: "range", key: "elevation", label: "sheet elevation", min: 4, max: 28, step: 2, unit: "px" },
    { kind: "range", key: "curl", label: "corner lift angle", min: 0, max: 20, step: 1, unit: "deg" },
    { kind: "range", key: "radius", label: "corner radius", min: 0, max: 24, step: 2, unit: "px" },
    { kind: "color", key: "paperTone", label: "cardstock tint" },
  ],
  css: `.pp-card {
  border-radius: var(--radius);
  background: var(--paperTone);
  box-shadow: 0 var(--elevation) calc(var(--elevation) * 2) rgba(60,40,30,.14), 0 2px 5px rgba(60,40,30,.08);
  border: 1px solid rgba(220,210,195,.6);
}`,
  demo: "paper",
  buildCss: (v) => `.paper-cut {
  padding: 30px;
  border-radius: ${N(v, "radius")}px;
  background: ${C(v, "paperTone")};
  border: 1px solid rgba(220, 210, 195, 0.6);
  box-shadow:
    0 ${N(v, "elevation")}px ${Math.round(N(v, "elevation") * 2)}px rgba(60, 40, 30, 0.14),
    0 2px 5px rgba(60, 40, 30, 0.08);
}`,
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-[${C(v, "paperTone")}]\n` +
    `border border-[#DCD2C3]/60\n` +
    `shadow-[0_${N(v, "elevation")}px_${Math.round(N(v, "elevation") * 2)}px_rgba(60,40,30,.14),_0_2px_5px_rgba(60,40,30,.08)]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: ${C(v, "paperTone")};\n  border: 1px solid rgba(220,210,195,.6);\n  box-shadow: 0 ${N(v, "elevation")}px ${Math.round(N(v, "elevation") * 2)}px rgba(60,40,30,.14), 0 2px 5px rgba(60,40,30,.08);\n">…</div>`,
};

/* =================================================================== 
   10-18: ESSENTIAL & ARCHITECTURAL DESIGN
=================================================================== */

const minimalism: Zone = {
  id: "minimalism",
  idx: "10",
  category: "essential",
  name: "Minimalism",
  kicker: "Essential / Pure Form & Radical Whitespace",
  headline: "Nothing extra. Every element justifies its existence.",
  blurb:
    "Minimalism removes all decoration in favor of expansive whitespace, rigorous grid proportions, and quiet contrast. Form follows content with absolute clarity.",
  primitives: [
    { term: "whitespace dominance", note: "60%+ of viewport area dedicated to breathing room." },
    { term: "single accent hairline", note: "One deliberate color highlight guides focus." },
    { term: "high typographic hierarchy", note: "Dramatic size contrasts replace colored UI clutter." },
  ],
  mode: "light",
  accent: "#18181B",
  vars: { pad: 48, spacing: 32, stroke: 1, theme: "#FFFFFF" },
  units: { pad: "px", spacing: "px", stroke: "px", theme: "" },
  controls: [
    { kind: "range", key: "pad", label: "whitespace padding", min: 24, max: 72, step: 4, unit: "px" },
    { kind: "range", key: "spacing", label: "element gap", min: 16, max: 48, step: 2, unit: "px" },
    { kind: "range", key: "stroke", label: "divider hairline", min: 1, max: 3, step: 1, unit: "px" },
    { kind: "color", key: "theme", label: "canvas background" },
  ],
  css: `.mn-card {
  padding: var(--pad);
  background: var(--theme);
  border: var(--stroke) solid #E4E4E7;
}`,
  demo: "minimalism",
  buildCss: (v) => `.minimalist-card {
  padding: ${N(v, "pad")}px;
  background: ${C(v, "theme")};
  border: ${N(v, "stroke")}px solid #e4e4e7;
  display: flex;
  flex-direction: column;
  gap: ${N(v, "spacing")}px;
}`,
  buildTw: (v) =>
    `p-[${N(v, "pad")}px] bg-[${C(v, "theme")}]\n` +
    `border-[${N(v, "stroke")}px] border-zinc-200\n` +
    `flex flex-col gap-[${N(v, "spacing")}px]`,
  buildInline: (v) =>
    `<div style="\n  padding: ${N(v, "pad")}px;\n  background: ${C(v, "theme")};\n  border: ${N(v, "stroke")}px solid #e4e4e7;\n  display: flex;\n  flex-direction: column;\n  gap: ${N(v, "spacing")}px;\n">…</div>`,
};

const flat: Zone = {
  id: "flat",
  idx: "11",
  category: "essential",
  name: "Flat Design 2.0",
  kicker: "Essential / Chromatic Clarity & Z-Index",
  headline: "Zero gradient trickery. Crisp chromatic hierarchy.",
  blurb:
    "Flat 2.0 refines original flat design with subtle micro-elevations, accessible high-contrast palettes, and instant visual affordance without skeuomorphic baggage.",
  primitives: [
    { term: "solid color blocking", note: "Clean, un-blurred fills provide immediate semantic meaning." },
    { term: "crisp elevation scale", note: "Consistent, tight drop-shadows denote interaction layer order." },
    { term: "flat affordance", note: "Geometric contrast and crisp labels replace bevel illusions." },
  ],
  mode: "light",
  accent: "#2F6FEB",
  vars: { elevation: 2, radius: 8, flatBg: "#FFFFFF" },
  units: { elevation: "", radius: "px", flatBg: "" },
  controls: [
    { kind: "range", key: "elevation", label: "elevation tier", min: 1, max: 4, step: 1, unit: "" },
    { kind: "range", key: "radius", label: "corner radius", min: 0, max: 20, step: 2, unit: "px" },
    { kind: "color", key: "flatBg", label: "card background" },
  ],
  css: `.f-card {
  border-radius: var(--radius);
  background: var(--flatBg);
  box-shadow: 0 calc(var(--elevation) * 2px) calc(var(--elevation) * 6px) rgba(15,23,42,.08);
  border: 1px solid #E2E8F0;
}`,
  demo: "flat",
  buildCss: (v) => `.flat-card {
  padding: 24px;
  border-radius: ${N(v, "radius")}px;
  background: ${C(v, "flatBg")};
  border: 1px solid #e2e8f0;
  box-shadow: 0 ${N(v, "elevation") * 2}px ${N(v, "elevation") * 6}px rgba(15, 23, 42, 0.08);
}`,
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-[${C(v, "flatBg")}]\n` +
    `border border-slate-200\n` +
    `shadow-[0_${N(v, "elevation") * 2}px_${N(v, "elevation") * 6}px_rgba(15,23,42,.08)]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: ${C(v, "flatBg")};\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 ${N(v, "elevation") * 2}px ${N(v, "elevation") * 6}px rgba(15,23,42,.08);\n">…</div>`,
};

const material: Zone = {
  id: "material",
  idx: "12",
  category: "essential",
  name: "Material Design 3",
  kicker: "Essential / Tonal Surface & Elevation",
  headline: "Tonal palettes, dynamic elevation, and tactile ripples.",
  blurb:
    "Material You (M3) builds on tactile physics: elevation is denoted through tonal color blending rather than harsh shadows, accompanied by responsive ripple states and organic rounded containers.",
  primitives: [
    { term: "tonal elevation overlay", note: "Primary color tint blends higher with each Z-index tier." },
    { term: "state-layer ripples", note: "Transparent color overlay brightens on hover and expands on press." },
    { term: "full tokenized radius", note: "Standardized 12px/16px/28px pills and rounded rectangles." },
  ],
  mode: "dark",
  accent: "#D0BCFF",
  vars: { elevation: 3, radius: 24, surfaceTone: "#2B2930" },
  units: { elevation: "dp", radius: "px", surfaceTone: "" },
  controls: [
    { kind: "range", key: "elevation", label: "elevation dp", min: 0, max: 5, step: 1, unit: "dp" },
    { kind: "range", key: "radius", label: "container radius", min: 8, max: 36, step: 4, unit: "px" },
    { kind: "color", key: "surfaceTone", label: "surface color" },
  ],
  css: `.m3-card {
  border-radius: var(--radius);
  background: var(--surfaceTone);
  box-shadow: 0 calc(var(--elevation) * 3px) calc(var(--elevation) * 8px) rgba(0,0,0,.4);
}`,
  demo: "material",
  buildCss: (v) => `.m3-container {
  padding: 28px;
  border-radius: ${N(v, "radius")}px;
  background: ${C(v, "surfaceTone")};
  box-shadow: 0 ${N(v, "elevation") * 3}px ${N(v, "elevation") * 8}px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1);
}`,
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-[${C(v, "surfaceTone")}]\n` +
    `shadow-[0_${N(v, "elevation") * 3}px_${N(v, "elevation") * 8}px_rgba(0,0,0,.4)]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: ${C(v, "surfaceTone")};\n  box-shadow: 0 ${N(v, "elevation") * 3}px ${N(v, "elevation") * 8}px rgba(0,0,0,.4);\n">…</div>`,
};

const fluent: Zone = {
  id: "fluent",
  idx: "13",
  category: "essential",
  name: "Fluent Design (Acrylic & Mica)",
  kicker: "Essential / Dynamic Light & Acrylic Depth",
  headline: "Mica material, reveal lighting, and depth hierarchy.",
  blurb:
    "Fluent design integrates acrylic translucency with cursor-following reveal highlights. Mica material samples desktop wallpaper to create a subtle connection between application layers and background.",
  primitives: [
    { term: "acrylic blur blend", note: "Subtle multi-pass blur maintains contrast over diverse backgrounds." },
    { term: "reveal highlight", note: "Borders illuminate brighter as the pointer approaches." },
    { term: "depth elevation stack", note: "Layered 1px strokes replace heavy drop shadows." },
  ],
  mode: "dark",
  accent: "#0078D4",
  vars: { acrylicBlur: 30, opacity: 70, radius: 8, micaBase: "#202020" },
  units: { acrylicBlur: "px", opacity: "%", radius: "px", micaBase: "" },
  controls: [
    { kind: "range", key: "acrylicBlur", label: "acrylic blur", min: 10, max: 50, step: 5, unit: "px" },
    { kind: "range", key: "opacity", label: "mica opacity", min: 40, max: 95, step: 5, unit: "%" },
    { kind: "range", key: "radius", label: "corner radius", min: 4, max: 20, step: 2, unit: "px" },
    { kind: "color", key: "micaBase", label: "mica tint" },
  ],
  css: `.fl-card {
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--micaBase) var(--opacity), transparent);
  backdrop-filter: blur(var(--acrylicBlur)) saturate(150%);
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 36px rgba(0,0,0,.45);
}`,
  demo: "fluent",
  buildCss: (v) => `.fluent-acrylic {
  padding: 28px;
  border-radius: ${N(v, "radius")}px;
  background: ${rgba(C(v, "micaBase"), N(v, "opacity") / 100)};
  backdrop-filter: blur(${N(v, "acrylicBlur")}px) saturate(150%);
  -webkit-backdrop-filter: blur(${N(v, "acrylicBlur")}px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
}`,
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-[${rgba(C(v, "micaBase"), N(v, "opacity") / 100)}]\n` +
    `backdrop-blur-[${N(v, "acrylicBlur")}px] backdrop-saturate-[1.5]\n` +
    `border border-white/12\n` +
    `shadow-[0_16px_36px_rgba(0,0,0,.45)]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: ${rgba(C(v, "micaBase"), N(v, "opacity") / 100)};\n  backdrop-filter: blur(${N(v, "acrylicBlur")}px) saturate(150%);\n  border: 1px solid rgba(255,255,255,.12);\n  box-shadow: 0 16px 36px rgba(0,0,0,.45);\n">…</div>`,
};

const brutalism: Zone = {
  id: "brutalism",
  idx: "14",
  category: "essential",
  name: "Brutalism",
  kicker: "Essential / Raw Concrete & Unapologetic Form",
  headline: "Raw HTML aesthetic, unvarnished grids, and zero decoration.",
  blurb:
    "Brutalism embraces raw structural honesty: exposed browser defaults, monospaced typography, jarring high-contrast lines, and refusal to conform to comfortable commercial polish.",
  primitives: [
    { term: "monospace default", note: "Type set directly in terminal fonts with no anti-aliasing tricks." },
    { term: "0-radius unrounded corners", note: "Harsh right-angle geometry throughout." },
    { term: "black & white contrast", note: "Pure #000000 on #FFFFFF with no subtle intermediate grey gracing." },
  ],
  mode: "light",
  accent: "#000000",
  vars: { borderW: 3, pad: 24, bg: "#F4F3EF" },
  units: { borderW: "px", pad: "px", bg: "" },
  controls: [
    { kind: "range", key: "borderW", label: "border thickness", min: 2, max: 8, step: 1, unit: "px" },
    { kind: "range", key: "pad", label: "padding", min: 12, max: 48, step: 4, unit: "px" },
    { kind: "color", key: "bg", label: "substrate background" },
  ],
  css: `.br-card {
  padding: var(--pad);
  background: var(--bg);
  border: var(--borderW) solid #000000;
  border-radius: 0;
}`,
  demo: "brut",
  buildCss: (v) => `.brutalist-block {
  padding: ${N(v, "pad")}px;
  background: ${C(v, "bg")};
  border: ${N(v, "borderW")}px solid #000000;
  border-radius: 0;
  font-family: monospace;
}`,
  buildTw: (v) =>
    `p-[${N(v, "pad")}px] bg-[${C(v, "bg")}]\n` +
    `border-[${N(v, "borderW")}px] border-black\n` +
    `rounded-none font-mono`,
  buildInline: (v) =>
    `<div style="\n  padding: ${N(v, "pad")}px;\n  background: ${C(v, "bg")};\n  border: ${N(v, "borderW")}px solid #000000;\n  border-radius: 0;\n  font-family: monospace;\n">…</div>`,
};

const neobrutalism: Zone = {
  id: "neo-brutalism",
  idx: "15",
  category: "essential",
  name: "Neubrutalism",
  kicker: "Essential / Hard Edge & Chromatic Clash",
  headline: "Thick black borders, zero-blur drop shadows, bold pop colors.",
  blurb:
    "Neubrutalism mixes the playful vibrance of pop culture with the stark attitude of brutalism: heavy 3px black strokes, un-blurred solid drop shadows, and clash-happy yellow, pink, and lime accents.",
  primitives: [
    { term: "0-blur hard shadow", note: "Offsets at 5px/5px with 0px blur deliver the iconic sticker pop." },
    { term: "clash color fills", note: "Pure saturated primaries paired with aggressive contrast." },
    { term: "translate on active", note: "Buttons physically sink into their shadow when clicked." },
  ],
  mode: "light",
  accent: "#FFD43B",
  vars: { shadow: 6, stroke: 3, radius: 0, popColor: "#FFD43B" },
  units: { shadow: "px", stroke: "px", radius: "px", popColor: "" },
  controls: [
    { kind: "range", key: "shadow", label: "hard shadow offset", min: 2, max: 14, step: 1, unit: "px" },
    { kind: "range", key: "stroke", label: "black border stroke", min: 1, max: 6, step: 1, unit: "px" },
    { kind: "range", key: "radius", label: "corner radius", min: 0, max: 24, step: 2, unit: "px" },
    { kind: "color", key: "popColor", label: "clash fill color" },
  ],
  css: `.brut-card {
  border-radius: var(--radius);
  background: var(--popColor);
  border: var(--stroke) solid #000000;
  box-shadow: calc(var(--shadow) * 1px) calc(var(--shadow) * 1px) 0 #000000;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}
.brut-card:active {
  transform: translate(calc(var(--shadow) * 1px), calc(var(--shadow) * 1px));
  box-shadow: 0 0 0 #000000;
}`,
  demo: "neo-brutalism",
  buildCss: (v) => `.neubrutal-card {
  padding: 28px;
  border-radius: ${N(v, "radius")}px;
  background: ${C(v, "popColor")};
  border: ${N(v, "stroke")}px solid #000000;
  box-shadow: ${N(v, "shadow")}px ${N(v, "shadow")}px 0 #000000;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}
.neubrutal-card:active {
  transform: translate(${N(v, "shadow")}px, ${N(v, "shadow")}px);
  box-shadow: 0 0 0 #000000;
}`,
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-[${C(v, "popColor")}]\n` +
    `border-[${N(v, "stroke")}px] border-black\n` +
    `shadow-[${N(v, "shadow")}px_${N(v, "shadow")}px_0_#000]\n` +
    `active:translate-x-[${N(v, "shadow")}px] active:translate-y-[${N(v, "shadow")}px] active:shadow-none`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: ${C(v, "popColor")};\n  border: ${N(v, "stroke")}px solid #000000;\n  box-shadow: ${N(v, "shadow")}px ${N(v, "shadow")}px 0 #000000;\n">…</div>`,
};

const swiss: Zone = {
  id: "swiss",
  idx: "16",
  category: "essential",
  name: "Swiss International Style",
  kicker: "Essential / Asymmetric Grid & Typography",
  headline: "Math-driven column grid. Bold objective sans-serif.",
  blurb:
    "Swiss (International Typographic Style) is founded on mathematical grid modules, flush-left rag-right typography, and asymmetric tension. White space is treated as an active design element.",
  primitives: [
    { term: "rigid column module", note: "Standardized 12-column grid aligns every heading and image." },
    { term: "flush-left ragged-right", note: "Maintains uniform word spacing without artificial justification." },
    { term: "red accent punctuation", note: "Iconic Swiss vermilion color anchors headings." },
  ],
  mode: "light",
  accent: "#E03131",
  vars: { cols: 12, gap: 20, accentRed: "#E03131" },
  units: { cols: "", gap: "px", accentRed: "" },
  controls: [
    { kind: "range", key: "cols", label: "grid columns", min: 4, max: 12, step: 2, unit: "" },
    { kind: "range", key: "gap", label: "gutter gap", min: 10, max: 36, step: 2, unit: "px" },
    { kind: "color", key: "accentRed", label: "swiss red" },
  ],
  css: `.sw-card {
  background: #F4F3EF;
  border-top: 2px solid #101010;
  color: #101010;
}`,
  demo: "swiss",
  buildCss: (v) => `.swiss-grid {
  display: grid;
  grid-template-columns: repeat(${N(v, "cols")}, 1fr);
  gap: ${N(v, "gap")}px;
  background: #f4f3ef;
  border-top: 2px solid #101010;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}`,
  buildTw: (v) =>
    `grid grid-cols-${N(v, "cols")} gap-[${N(v, "gap")}px]\n` +
    `bg-[#F4F3EF] border-t-2 border-black font-sans`,
  buildInline: (v) =>
    `<div style="\n  display: grid;\n  grid-template-columns: repeat(${N(v, "cols")}, 1fr);\n  gap: ${N(v, "gap")}px;\n  background: #F4F3EF;\n  border-top: 2px solid #101010;\n">…</div>`,
};

const bauhaus: Zone = {
  id: "bauhaus",
  idx: "17",
  category: "essential",
  name: "Bauhaus",
  kicker: "Essential / Primary Shapes & Form Function",
  headline: "Circles, triangles, squares. Form strictly follows function.",
  blurb:
    "Bauhaus unites craft with industrial architecture. Strict primary colors (red, blue, yellow) pair with bold geometric primitives to create functional, balanced compositions.",
  primitives: [
    { term: "primary color palette", note: "Red, blue, and yellow anchored by heavy black lines." },
    { term: "elementary geometry", note: "Circles, squares, and 45-degree angles build the composition." },
    { term: "diagonal dynamic tension", note: "Angled typographic axes introduce energy into rational grids." },
  ],
  mode: "light",
  accent: "#1E40AF",
  vars: { shapeSize: 64, angle: -12, primaryColor: "#E11D48" },
  units: { shapeSize: "px", angle: "deg", primaryColor: "" },
  controls: [
    { kind: "range", key: "shapeSize", label: "primitive scale", min: 32, max: 96, step: 4, unit: "px" },
    { kind: "range", key: "angle", label: "axis angle", min: -45, max: 45, step: 3, unit: "deg" },
    { kind: "color", key: "primaryColor", label: "primary red" },
  ],
  css: `.bh-card {
  background: #FAF9F6;
  border: 3px solid #111827;
}`,
  demo: "bauhaus",
  buildCss: (v) => `.bauhaus-composition {
  position: relative;
  padding: 36px;
  background: #faf9f6;
  border: 3px solid #111827;
  overflow: hidden;
}`,
  buildTw: (v) => `relative p-9 bg-[#FAF9F6] border-[3px] border-gray-900 overflow-hidden`,
  buildInline: (v) => `<div style="\n  position: relative;\n  padding: 36px;\n  background: #FAF9F6;\n  border: 3px solid #111827;\n">…</div>`,
};

const luxury: Zone = {
  id: "luxury",
  idx: "18",
  category: "essential",
  name: "Luxury & Editorial",
  kicker: "Essential / Obsidian, Gold & High-Contrast Serif",
  headline: "Understated elegance, gold foil hairlines, deep obsidian.",
  blurb:
    "Luxury design evokes haute couture: deep obsidian black substrates, delicate champagne gold borders, dramatic high-contrast serif typography, and generous letter spacing.",
  primitives: [
    { term: "champagne gold foil", note: "Delicate metallic hairline accents with subtle sheen gradients." },
    { term: "high-contrast display serif", note: "Didone-style high contrast letterforms convey prestige." },
    { term: "deep obsidian surface", note: "Rich, ultra-dark #080706 background establishes exclusivity." },
  ],
  mode: "dark",
  accent: "#D4AF37",
  vars: { letterSpacing: 0.25, goldSheen: 1, radius: 2, goldTone: "#D4AF37" },
  units: { letterSpacing: "em", goldSheen: "", radius: "px", goldTone: "" },
  controls: [
    { kind: "range", key: "letterSpacing", label: "letter tracking", min: 0.05, max: 0.5, step: 0.05, unit: "em" },
    { kind: "range", key: "radius", label: "corner radius", min: 0, max: 12, step: 1, unit: "px" },
    { kind: "color", key: "goldTone", label: "gold tone" },
  ],
  css: `.lx-card {
  border-radius: var(--radius);
  background: linear-gradient(180deg, #12100E 0%, #080706 100%);
  border: 1px solid var(--goldTone);
  box-shadow: 0 24px 60px rgba(0,0,0,.9), inset 0 1px 0 rgba(212,175,55,.3);
}`,
  demo: "luxury",
  buildCss: (v) => `.luxury-card {
  padding: 36px;
  border-radius: ${N(v, "radius")}px;
  background: linear-gradient(180deg, #12100e 0%, #080706 100%);
  border: 1px solid ${C(v, "goldTone")};
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.9),
    inset 0 1px 0 rgba(212, 175, 55, 0.3);
  letter-spacing: ${N(v, "letterSpacing")}em;
}`,
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-gradient-to-b from-[#12100E] to-[#080706]\n` +
    `border border-[${C(v, "goldTone")}]\n` +
    `shadow-[0_24px_60px_rgba(0,0,0,.9),_inset_0_1px_0_rgba(212,175,55,.3)]\n` +
    `tracking-[${N(v, "letterSpacing")}em]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: linear-gradient(180deg, #12100E, #080706);\n  border: 1px solid ${C(v, "goldTone")};\n  box-shadow: 0 24px 60px rgba(0,0,0,.9), inset 0 1px 0 rgba(212,175,55,.3);\n  letter-spacing: ${N(v, "letterSpacing")}em;\n">…</div>`,
};

/* =================================================================== 
   19-24: AESTHETIC & SUBCULTURE THEMES
=================================================================== */

const cyberpunk: Zone = {
  id: "cyberpunk",
  idx: "19",
  category: "theme",
  name: "Cyberpunk & Hi-Tech HUD",
  kicker: "Theme / Cyan-Magenta Glitch & Hologram HUD",
  headline: "Aggressive neon, scanline grids, cut corner polygons.",
  blurb:
    "Cyberpunk channels dystopian sci-fi interfaces: chamfered clip-path polygon containers, high-voltage cyan/magenta glows, CRT scanlines, and telemetry readout grids.",
  primitives: [
    { term: "polygon clip-path chamfer", note: "Cuts 45-degree angled corners for militarized telemetry styling." },
    { term: "CRT scanline overlay", note: "Linear repeating gradients simulate retro display raster lines." },
    { term: "chromatic glitch split", note: "Offsets red and cyan channels on hover for electric glitch impact." },
  ],
  mode: "dark",
  accent: "#00F0FF",
  vars: { clip: 14, glow: 18, cyberColor: "#00F0FF", pinkColor: "#FF0055" },
  units: { clip: "px", glow: "px", cyberColor: "", pinkColor: "" },
  controls: [
    { kind: "range", key: "clip", label: "corner chamfer", min: 6, max: 28, step: 2, unit: "px" },
    { kind: "range", key: "glow", label: "HUD neon intensity", min: 8, max: 36, step: 2, unit: "px" },
    { kind: "color", key: "cyberColor", label: "cyan primary" },
    { kind: "color", key: "pinkColor", label: "magenta accent" },
  ],
  css: `.cp-card {
  background: rgba(5,8,16,.92);
  border: 1px solid var(--cyberColor);
  clip-path: polygon(0 0, calc(100% - var(--clip)) 0, 100% var(--clip), 100% 100%, var(--clip) 100%, 0 calc(100% - var(--clip)));
  box-shadow: 0 0 var(--glow) color-mix(in srgb, var(--cyberColor) 45%, transparent);
}`,
  demo: "cyberpunk",
  buildCss: (v) => {
    const c = C(v, "cyberColor");
    const k = N(v, "clip");
    return `.cyberpunk-hud {
  padding: 28px;
  background: rgba(5, 8, 16, 0.92);
  border: 1.5px solid ${c};
  clip-path: polygon(
    0 0,
    calc(100% - ${k}px) 0,
    100% ${k}px,
    100% 100%,
    ${k}px 100%,
    0 calc(100% - ${k}px)
  );
  box-shadow: 0 0 ${N(v, "glow")}px ${rgba(c, 0.45)};
}`;
  },
  buildTw: (v) =>
    `bg-[#050810]/90 border-[1.5px] border-[${C(v, "cyberColor")}]\n` +
    `shadow-[0_0_${N(v, "glow")}px_${rgba(C(v, "cyberColor"), 0.45)}]\n` +
    `[clip-path:polygon(0_0,calc(100%-${N(v, "clip")}px)_0,100%_${N(v, "clip")}px,100%_100%,${N(v, "clip")}px_100%,0_calc(100%-${N(v, "clip")}px))]`,
  buildInline: (v) =>
    `<div style="\n  background: rgba(5,8,16,.92);\n  border: 1.5px solid ${C(v, "cyberColor")};\n  clip-path: polygon(0 0, calc(100% - ${N(v, "clip")}px) 0, 100% ${N(v, "clip")}px, 100% 100%, ${N(v, "clip")}px 100%, 0 calc(100% - ${N(v, "clip")}px));\n  box-shadow: 0 0 ${N(v, "glow")}px ${rgba(C(v, "cyberColor"), 0.45)};\n">…</div>`,
};

const synthwave: Zone = {
  id: "synthwave",
  idx: "20",
  category: "theme",
  name: "Synthwave & Vaporwave",
  kicker: "Theme / 80s Grid Sunsets & Neon Horizons",
  headline: "Perspective wireframe grids, sunset gradients, CRT bloom.",
  blurb:
    "Synthwave captures the nostalgic 1980s retro-futuristic horizon: neon wireframe ground planes receding to infinity under glowing purple sunsets and chrome gradients.",
  primitives: [
    { term: "3D perspective wireframe grid", note: "Rotates a grid plane 60deg along the X-axis for endless highway depth." },
    { term: "sunset band gradient", note: "Strips of yellow, orange, and fuchsia emulate retro sci-fi suns." },
    { term: "chromatic glow bloom", note: "Deep violet ambient shadows envelope all interactive components." },
  ],
  mode: "dark",
  accent: "#FF007F",
  vars: { horizon: 60, gridScale: 30, neonPink: "#FF007F", neonCyan: "#00F0FF" },
  units: { horizon: "deg", gridScale: "px", neonPink: "", neonCyan: "" },
  controls: [
    { kind: "range", key: "horizon", label: "horizon tilt angle", min: 45, max: 75, step: 5, unit: "deg" },
    { kind: "range", key: "gridScale", label: "grid density", min: 15, max: 50, step: 5, unit: "px" },
    { kind: "color", key: "neonPink", label: "sunset magenta" },
    { kind: "color", key: "neonCyan", label: "horizon cyan" },
  ],
  css: `.sw-grid {
  background: linear-gradient(180deg, #18002E 0%, #090014 100%);
  border: 1px solid var(--neonPink);
  box-shadow: 0 0 25px rgba(255,0,127,.4);
}`,
  demo: "synthwave",
  buildCss: (v) => `.synthwave-card {
  padding: 32px;
  background: linear-gradient(180deg, #18002e 0%, #090014 100%);
  border: 1px solid ${C(v, "neonPink")};
  box-shadow: 0 0 25px ${rgba(C(v, "neonPink"), 0.4)};
}`,
  buildTw: (v) =>
    `bg-gradient-to-b from-[#18002E] to-[#090014]\n` +
    `border border-[${C(v, "neonPink")}]\n` +
    `shadow-[0_0_25px_${rgba(C(v, "neonPink"), 0.4)}]`,
  buildInline: (v) =>
    `<div style="\n  background: linear-gradient(180deg, #18002E, #090014);\n  border: 1px solid ${C(v, "neonPink")};\n  box-shadow: 0 0 25px ${rgba(C(v, "neonPink"), 0.4)};\n">…</div>`,
};

const memphis: Zone = {
  id: "memphis",
  idx: "21",
  category: "theme",
  name: "Memphis Design",
  kicker: "Theme / 80s Geometric Patterns & Squiggles",
  headline: "Squiggles, confetti shapes, and joyful pastel clashes.",
  blurb:
    "Memphis Milano design throws away rigid modernist rules in favor of playful squiggles, triangle confetti patterns, zigzag dividers, and saturated pop palettes.",
  primitives: [
    { term: "geometric confetti scatter", note: "Randomly arranged triangles, squiggles, and dots." },
    { term: "thick black outlines", note: "Bold cartoonish borders keep clashing pastel shapes crisp." },
    { term: "asymmetric color blocking", note: "Contrasting background quadrants inject pure energy." },
  ],
  mode: "light",
  accent: "#FF6B6B",
  vars: { borderW: 3, radius: 14, bgPattern: "#FFE66D" },
  units: { borderW: "px", radius: "px", bgPattern: "" },
  controls: [
    { kind: "range", key: "borderW", label: "border stroke", min: 2, max: 6, step: 1, unit: "px" },
    { kind: "range", key: "radius", label: "corner roundness", min: 0, max: 28, step: 2, unit: "px" },
    { kind: "color", key: "bgPattern", label: "memphis yellow" },
  ],
  css: `.mp-card {
  border-radius: var(--radius);
  background: var(--bgPattern);
  border: var(--borderW) solid #292F36;
  box-shadow: 6px 6px 0 #4ECDC4;
}`,
  demo: "memphis",
  buildCss: (v) => `.memphis-card {
  padding: 28px;
  border-radius: ${N(v, "radius")}px;
  background: ${C(v, "bgPattern")};
  border: ${N(v, "borderW")}px solid #292f36;
  box-shadow: 6px 6px 0 #4ecdc4;
}`,
  buildTw: (v) =>
    `rounded-[${N(v, "radius")}px] bg-[${C(v, "bgPattern")}]\n` +
    `border-[${N(v, "borderW")}px] border-[#292F36]\n` +
    `shadow-[6px_6px_0_#4ECDC4]`,
  buildInline: (v) =>
    `<div style="\n  border-radius: ${N(v, "radius")}px;\n  background: ${C(v, "bgPattern")};\n  border: ${N(v, "borderW")}px solid #292F36;\n  box-shadow: 6px 6px 0 #4ECDC4;\n">…</div>`,
};

const popArt: Zone = {
  id: "pop-art",
  idx: "22",
  category: "theme",
  name: "Pop Art & Halftone",
  kicker: "Theme / Comic Halftone Dots & Primary Punch",
  headline: "Benday halftone dot matrices and comic-book impact.",
  blurb:
    "Pop Art channels Roy Lichtenstein: CMYK halftone dot rasters, action burst polygons, heavy comic ink lines, and hyper-saturated primaries that jump off the screen.",
  primitives: [
    { term: "benday halftone dot matrix", note: "Radial dot repeating patterns emulate vintage print printing presses." },
    { term: "comic action bursts", note: "Jagged polygon starbursts highlight discounts and key callouts." },
    { term: "heavy black ink line", note: "Solid 4px black strokes anchor every graphic element." },
  ],
  mode: "light",
  accent: "#E63946",
  vars: { dotSize: 10, dotSpacing: 18, borderW: 4, popBg: "#FFF176" },
  units: { dotSize: "px", dotSpacing: "px", borderW: "px", popBg: "" },
  controls: [
    { kind: "range", key: "dotSize", label: "halftone dot size", min: 4, max: 16, step: 2, unit: "px" },
    { kind: "range", key: "dotSpacing", label: "raster spacing", min: 10, max: 30, step: 2, unit: "px" },
    { kind: "range", key: "borderW", label: "comic stroke", min: 2, max: 8, step: 1, unit: "px" },
    { kind: "color", key: "popBg", label: "comic yellow" },
  ],
  css: `.pa-card {
  background: var(--popBg);
  border: var(--borderW) solid #000000;
  box-shadow: 8px 8px 0 #E63946;
}`,
  demo: "pop-art",
  buildCss: (v) => `.pop-art-panel {
  padding: 32px;
  background: radial-gradient(#000000 15%, transparent 16%) 0 0 / ${N(v, "dotSpacing")}px ${N(v, "dotSpacing")}px, ${C(v, "popBg")};
  border: ${N(v, "borderW")}px solid #000000;
  box-shadow: 8px 8px 0 #e63946;
}`,
  buildTw: (v) =>
    `p-8 bg-[radial-gradient(#000_15%,transparent_16%)_0_0/${N(v, "dotSpacing")}px_${N(v, "dotSpacing")}px] bg-[${C(v, "popBg")}]\n` +
    `border-[${N(v, "borderW")}px] border-black\n` +
    `shadow-[8px_8px_0_#E63946]`,
  buildInline: (v) =>
    `<div style="\n  padding: 32px;\n  background: radial-gradient(#000 15%, transparent 16%) 0 0 / ${N(v, "dotSpacing")}px ${N(v, "dotSpacing")}px, ${C(v, "popBg")};\n  border: ${N(v, "borderW")}px solid #000000;\n  box-shadow: 8px 8px 0 #E63946;\n">…</div>`,
};

const terminal: Zone = {
  id: "terminal",
  idx: "23",
  category: "theme",
  name: "Terminal & Hacker Matrix",
  kicker: "Theme / CRT Phosphor Glow & Command Prompt",
  headline: "Monochrome green phosphor, blip cursors, CRT raster.",
  blurb:
    "Terminal aesthetics celebrate the command line: glowing monochromatic green/amber phosphor typography, blinking block cursors, subtle CRT glass curvature, and ASCII headers.",
  primitives: [
    { term: "phosphor text bloom", note: "Layered text-shadow creates authentic CRT monitor luminescence." },
    { term: "blinking block cursor", note: "CSS step-end animation mimics hardware terminal cursors." },
    { term: "scanline raster lines", note: "Subtle 2px repeating linear background overlay." },
  ],
  mode: "dark",
  accent: "#33FF33",
  vars: { glow: 8, scanline: 50, phosphor: "#33FF33" },
  units: { glow: "px", scanline: "%", phosphor: "" },
  controls: [
    { kind: "range", key: "glow", label: "phosphor glow", min: 2, max: 20, step: 1, unit: "px" },
    { kind: "range", key: "scanline", label: "scanline opacity", min: 10, max: 80, step: 5, unit: "%" },
    { kind: "color", key: "phosphor", label: "phosphor color" },
  ],
  css: `.tm-card {
  background: #020A02;
  border: 1px solid var(--phosphor);
  color: var(--phosphor);
  box-shadow: inset 0 0 15px rgba(51,255,51,.25), 0 0 20px rgba(51,255,51,.2);
  text-shadow: 0 0 var(--glow) var(--phosphor);
}`,
  demo: "terminal",
  buildCss: (v) => {
    const c = C(v, "phosphor");
    return `.terminal-window {
  padding: 24px;
  background: #020a02;
  border: 1px solid ${c};
  color: ${c};
  font-family: 'Courier New', monospace;
  box-shadow:
    inset 0 0 15px ${rgba(c, 0.25)},
    0 0 20px ${rgba(c, 0.2)};
  text-shadow: 0 0 ${N(v, "glow")}px ${c};
}`;
  },
  buildTw: (v) =>
    `bg-[#020A02] border border-[${C(v, "phosphor")}] text-[${C(v, "phosphor")}] font-mono\n` +
    `shadow-[inset_0_0_15px_${rgba(C(v, "phosphor"), 0.25)},_0_0_20px_${rgba(C(v, "phosphor"), 0.2)}]`,
  buildInline: (v) =>
    `<div style="\n  background: #020A02;\n  border: 1px solid ${C(v, "phosphor")};\n  color: ${C(v, "phosphor")};\n  font-family: monospace;\n  box-shadow: inset 0 0 15px ${rgba(C(v, "phosphor"), 0.25)}, 0 0 20px ${rgba(C(v, "phosphor"), 0.2)};\n  text-shadow: 0 0 ${N(v, "glow")}px ${C(v, "phosphor")};\n">…</div>`,
};

const scandinavian: Zone = {
  id: "scandinavian",
  idx: "24",
  category: "theme",
  name: "Scandinavian & Zen Minimalism",
  kicker: "Theme / Wabi-Sabi, Linen & Warm Earth",
  headline: "Warm oat, tactile linen, muted forest, and calm balance.",
  blurb:
    "Scandinavian & Japanese Zen design focus on warmth, organic tranquility, muted terracotta/sage hues, generous negative space, and gentle tactile surfaces.",
  primitives: [
    { term: "warm muted earth palette", note: "Soft oat #F5F2EB paired with sage, slate, and terracotta." },
    { term: "soft pill containers", note: "Gentle 16px/24px corner radii with zero aggressive drop shadows." },
    { term: "serene typography hierarchy", note: "Refined geometric sans with open leading promotes calmness." },
  ],
  mode: "light",
  accent: "#8A9A86",
  vars: { pad: 36, radius: 18, earthBg: "#F5F2EB", textTone: "#2C3531" },
  units: { pad: "px", radius: "px", earthBg: "", textTone: "" },
  controls: [
    { kind: "range", key: "pad", label: "serene spacing", min: 20, max: 56, step: 4, unit: "px" },
    { kind: "range", key: "radius", label: "soft radius", min: 8, max: 32, step: 2, unit: "px" },
    { kind: "color", key: "earthBg", label: "oat canvas" },
    { kind: "color", key: "textTone", label: "charcoal ink" },
  ],
  css: `.sc-card {
  padding: var(--pad);
  border-radius: var(--radius);
  background: var(--earthBg);
  color: var(--textTone);
  border: 1px solid rgba(138,154,134,.25);
}`,
  demo: "scandinavian",
  buildCss: (v) => `.zen-card {
  padding: ${N(v, "pad")}px;
  border-radius: ${N(v, "radius")}px;
  background: ${C(v, "earthBg")};
  color: ${C(v, "textTone")};
  border: 1px solid rgba(138, 154, 134, 0.25);
  box-shadow: 0 4px 20px rgba(44, 53, 49, 0.04);
}`,
  buildTw: (v) =>
    `p-[${N(v, "pad")}px] rounded-[${N(v, "radius")}px] bg-[${C(v, "earthBg")}]\n` +
    `text-[${C(v, "textTone")}] border border-[#8A9A86]/25\n` +
    `shadow-[0_4px_20px_rgba(44,53,49,.04)]`,
  buildInline: (v) =>
    `<div style="\n  padding: ${N(v, "pad")}px;\n  border-radius: ${N(v, "radius")}px;\n  background: ${C(v, "earthBg")};\n  color: ${C(v, "textTone")};\n  border: 1px solid rgba(138,154,134,.25);\n">…</div>`,
};

/* =================================================================== 
   25-28: LAYOUT & TYPOGRAPHY LABS
=================================================================== */

export const BENTO_SHAPES = [
  ["hero", "hero", "stat-a", "stat-b"],
  ["hero", "hero", "chart", "chart"],
  ["feed", "preview", "chart", "chart"],
];

export const BENTO_TILES = [
  { key: "hero", label: "Hero Showcase", span: "2 × 2" },
  { key: "stat-a", label: "Active Sessions", span: "1 × 1" },
  { key: "stat-b", label: "Avg Latency", span: "1 × 1" },
  { key: "chart", label: "Telemetry Stream", span: "2 × 2" },
  { key: "feed", label: "Live Pipeline", span: "1 × 1" },
  { key: "preview", label: "Render Output", span: "1 × 1" },
];

export function areasToTemplate(areas: string[]): string[] {
  const rows: string[] = [];
  for (let r = 0; r < 3; r++) {
    const chunk = areas.slice(r * 4, r * 4 + 4).join(" ");
    rows.push(`"${chunk}"`);
  }
  return rows;
}

const bento: Zone = {
  id: "bento",
  idx: "25",
  category: "layout",
  name: "Bento Grid System",
  kicker: "Layout / Modular Tile Hierarchy & Named Areas",
  headline: "Modular asymmetric tiles. CSS Grid template areas.",
  blurb:
    "Inspired by Japanese bento lunchboxes, the Bento layout organizes diverse UI modules into a balanced, responsive puzzle. Each tile claims named grid areas for effortless responsive reflow.",
  primitives: [
    { term: "grid-template-areas", note: "Named spatial regions that reorganise cleanly on mobile breakpoints." },
    { term: "modular aspect ratios", note: "1x1, 2x1, and 2x2 modules create visual hierarchy without chaos." },
    { term: "self-contained micro-cards", note: "Each compartment houses an independent interactive component." },
  ],
  mode: "dark",
  accent: "#C6F24E",
  vars: { bgap: 14, bradius: 18, bborder: 1 },
  units: { bgap: "px", bradius: "px", bborder: "px" },
  controls: [
    { kind: "range", key: "bgap", label: "grid gap", min: 8, max: 28, step: 2, unit: "px" },
    { kind: "range", key: "bradius", label: "tile radius", min: 8, max: 32, step: 2, unit: "px" },
    { kind: "range", key: "bborder", label: "hairline stroke", min: 1, max: 3, step: 1, unit: "px" },
  ],
  css: `.b-grid {
  display: grid;
  gap: var(--bgap);
}
.b-tile {
  border-radius: var(--bradius);
  background: var(--panel);
  border: var(--bborder) solid var(--zhair);
}`,
  demo: "bento",
  buildCss: (v, x) => `.bento-grid {
  display: grid;
  gap: ${N(v, "bgap")}px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, minmax(80px, auto));
  grid-template-areas:
    ${x.rows || '"hero hero stat-a stat-b"\n    "hero hero chart chart"\n    "feed preview chart chart"'};
}
.bento-tile {
  border-radius: ${N(v, "bradius")}px;
  background: #171b21;
  border: ${N(v, "bborder")}px solid #262c34;
  padding: 20px;
}
${x.tiles || ""}`,
  buildTw: (v, x) =>
    `grid grid-cols-4 gap-[${N(v, "bgap")}px]\n` +
    `[grid-template-areas:${x.rowsFlat || "'hero_hero_stat-a_stat-b'_'hero_hero_chart_chart'_'feed_preview_chart_chart'"}]`,
  buildInline: (v, x) =>
    `<div style="\n  display: grid;\n  gap: ${N(v, "bgap")}px;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-areas:\n    ${x.rows || '"hero hero stat-a stat-b"\n    "hero hero chart chart"\n    "feed preview chart chart"'};\n">\n${x.tilesInline || ""}\n</div>`,
};

const kineticTypography: Zone = {
  id: "kinetic-type",
  idx: "26",
  category: "typography",
  name: "Kinetic & Variable Typography",
  kicker: "Typography / Variable Slant, Weight & Marquee",
  headline: "Variable font axes in continuous fluid motion.",
  blurb:
    "Kinetic typography uses variable font technology (`font-variation-settings`), fluid stagger delays, and dynamic optical sizing to create living, breathing headline displays.",
  primitives: [
    { term: "font-variation-settings: 'wght', 'slnt'", note: "Transitions thickness and angle smoothly without extra font file payloads." },
    { term: "infinite staggered marquee", note: "Translates text continuously across the screen at hardware 60fps." },
    { term: "clamp() fluid typography", note: "Scales font size mathematically relative to viewport width." },
  ],
  mode: "dark",
  accent: "#FBBF24",
  vars: { weight: 800, slant: -8, speed: 12, fontSize: 52 },
  units: { weight: "", slant: "deg", speed: "s", fontSize: "px" },
  controls: [
    { kind: "range", key: "weight", label: "variable weight", min: 200, max: 900, step: 50, unit: "" },
    { kind: "range", key: "slant", label: "italic slant", min: -20, max: 20, step: 2, unit: "deg" },
    { kind: "range", key: "fontSize", label: "headline scale", min: 32, max: 80, step: 4, unit: "px" },
    { kind: "range", key: "speed", label: "marquee duration", min: 4, max: 24, step: 2, unit: "s" },
  ],
  css: `.kt-text {
  font-variation-settings: "wght" var(--weight);
  font-size: var(--fontSize);
  transform: skewX(var(--slant));
}`,
  demo: "kinetic-type",
  buildCss: (v) => `.kinetic-headline {
  font-size: ${N(v, "fontSize")}px;
  font-weight: ${N(v, "weight")};
  transform: skewX(${N(v, "slant")}deg);
  letter-spacing: -0.03em;
  line-height: 0.95;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}`,
  buildTw: (v) =>
    `text-[${N(v, "fontSize")}px] font-[${N(v, "weight")}]\n` +
    `skew-x-[${N(v, "slant")}deg] tracking-tight leading-none`,
  buildInline: (v) =>
    `<h1 style="\n  font-size: ${N(v, "fontSize")}px;\n  font-weight: ${N(v, "weight")};\n  transform: skewX(${N(v, "slant")}deg);\n  letter-spacing: -0.03em;\n">…</h1>`,
};

const extrudedType: Zone = {
  id: "extruded-type",
  idx: "27",
  category: "typography",
  name: "3D Extruded Typography",
  kicker: "Typography / Multi-Layer Isometric Relief",
  headline: "True 3D isometric text depth carved purely in CSS.",
  blurb:
    "Extruded 3D typography creates monumental depth using dense, layered text-shadows step-by-step down the isometric projection axis, topped with specular edge catch-lights.",
  primitives: [
    { term: "repeating text-shadow stack", note: "1px incremental offsets generate seamless solid 3D extrusion walls." },
    { term: "orthographic isometric angle", note: "Consistent 45-degree shadow angle creates mechanical precision." },
    { term: "ambient cast shadow", note: "Final high-blur shadow grounds the extruded letters on the canvas." },
  ],
  mode: "dark",
  accent: "#F43F5E",
  vars: { depth: 12, angle: 45, textFill: "#F43F5E" },
  units: { depth: "px", angle: "deg", textFill: "" },
  controls: [
    { kind: "range", key: "depth", label: "3D extrusion depth", min: 4, max: 24, step: 1, unit: "px" },
    { kind: "range", key: "angle", label: "extrusion angle", min: 0, max: 360, step: 15, unit: "deg" },
    { kind: "color", key: "textFill", label: "face color" },
  ],
  css: `.et-text {
  color: var(--textFill);
  text-shadow: 1px 1px 0 #9F1239, 2px 2px 0 #9F1239, 3px 3px 0 #9F1239, 4px 4px 0 #881337, 0 20px 30px rgba(0,0,0,.7);
}`,
  demo: "extruded-type",
  buildCss: (v) => {
    const d = N(v, "depth");
    const shadows = Array.from({ length: d })
      .map((_, i) => `${i + 1}px ${i + 1}px 0 #9f1239`)
      .join(", ");
    return `.extruded-3d-text {
  color: ${C(v, "textFill")};
  font-size: 64px;
  font-weight: 900;
  text-transform: uppercase;
  text-shadow: ${shadows}, 0 ${d + 10}px 25px rgba(0, 0, 0, 0.7);
}`;
  },
  buildTw: (v) =>
    `text-6xl font-black uppercase text-[${C(v, "textFill")}]\n` +
    `[text-shadow:1px_1px_0_#9F1239,2px_2px_0_#9F1239,3px_3px_0_#9F1239,0_${N(v, "depth") + 10}px_25px_rgba(0,0,0,.7)]`,
  buildInline: (v) =>
    `<h1 style="\n  color: ${C(v, "textFill")};\n  font-size: 64px;\n  font-weight: 900;\n  text-shadow: 1px 1px 0 #9F1239, 2px 2px 0 #9F1239, 3px 3px 0 #9F1239, 0 ${N(v, "depth") + 10}px 25px rgba(0,0,0,.7);\n">…</h1>`,
};

const meshGradient: Zone = {
  id: "mesh-gradient",
  idx: "28",
  category: "typography",
  name: "Aurora & Mesh Gradients",
  kicker: "Texture / Multi-Point Fluid Radial Light",
  headline: "Multi-radial color mesh with authentic film grain.",
  blurb:
    "Mesh gradients blend 4+ independent radial color emitters that swirl and morph in real time. Overlaid with an SVG film grain filter, the atmosphere feels organic, warm, and distinctly non-digital.",
  primitives: [
    { term: "multi-point radial-gradient", note: "Layered coordinates diffuse across different quadrants of the element." },
    { term: "SVG feTurbulence grain", note: "Simulates analog film grain texture directly in GPU memory." },
    { term: "color-mix() harmonious stops", note: "Calculates mathematically pleasant transition hues." },
  ],
  mode: "dark",
  accent: "#38BDF8",
  vars: { spread: 60, grain: 25, nodeA: "#38BDF8", nodeB: "#818CF8", nodeC: "#C084FC" },
  units: { spread: "%", grain: "%", nodeA: "", nodeB: "", nodeC: "" },
  controls: [
    { kind: "range", key: "spread", label: "gradient diffusion", min: 30, max: 90, step: 5, unit: "%" },
    { kind: "range", key: "grain", label: "film grain opacity", min: 5, max: 50, step: 5, unit: "%" },
    { kind: "color", key: "nodeA", label: "aurora sky" },
    { kind: "color", key: "nodeB", label: "indigo node" },
    { kind: "color", key: "nodeC", label: "purple node" },
  ],
  css: `.mg-card {
  background: radial-gradient(at 0% 0%, var(--nodeA) 0px, transparent var(--spread)),
              radial-gradient(at 100% 0%, var(--nodeB) 0px, transparent var(--spread)),
              radial-gradient(at 50% 100%, var(--nodeC) 0px, transparent var(--spread)),
              #0B0F19;
}`,
  demo: "mesh-gradient",
  buildCss: (v) => `.mesh-aurora {
  position: relative;
  padding: 36px;
  border-radius: 24px;
  background:
    radial-gradient(at 0% 0%, ${C(v, "nodeA")} 0px, transparent ${N(v, "spread")}%),
    radial-gradient(at 100% 0%, ${C(v, "nodeB")} 0px, transparent ${N(v, "spread")}%),
    radial-gradient(at 50% 100%, ${C(v, "nodeC")} 0px, transparent ${N(v, "spread")}%),
    #0b0f19;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
}`,
  buildTw: (v) =>
    `rounded-3xl bg-[radial-gradient(at_0%_0%,${C(v, "nodeA")}_0px,transparent_${N(v, "spread")}%),_radial-gradient(at_100%_0%,${C(v, "nodeB")}_0px,transparent_${N(v, "spread")}%),_radial-gradient(at_50%_100%,${C(v, "nodeC")}_0px,transparent_${N(v, "spread")}%)]\n` +
    `bg-[#0B0F19] shadow-2xl`,
  buildInline: (v) =>
    `<div style="\n  border-radius: 24px;\n  background: radial-gradient(at 0% 0%, ${C(v, "nodeA")} 0px, transparent ${N(v, "spread")}%), radial-gradient(at 100% 0%, ${C(v, "nodeB")} 0px, transparent ${N(v, "spread")}%), radial-gradient(at 50% 100%, ${C(v, "nodeC")} 0px, transparent ${N(v, "spread")}%), #0B0F19;\n  box-shadow: 0 24px 60px rgba(0,0,0,.7);\n">…</div>`,
};

/* =================================================================== 
   EXPORT ALL ZONES
=================================================================== */

export const ZONES: Zone[] = [
  // Morphisms
  glassmorphism,
  neomorphism,
  claymorphism,
  skeuomorphism,
  liquidmorphism,
  metallicmorphism,
  glowmorphism,
  holographicmorphism,
  paperism,

  // Essential & Architectural
  minimalism,
  flat,
  material,
  fluent,
  brutalism,
  neobrutalism,
  swiss,
  bauhaus,
  luxury,

  // Aesthetic Themes
  cyberpunk,
  synthwave,
  memphis,
  popArt,
  terminal,
  scandinavian,

  // Layout & Typography Labs
  bento,
  kineticTypography,
  extrudedType,
  meshGradient,
];
