import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { ArrowUp, Github, Check } from "lucide-react";
import Header from "./components/Header";
import Rail from "./components/Rail";
import Hero from "./components/Hero";
import ZoneSection from "./components/ZoneSection";
import ErrorBoundary from "./components/ErrorBoundary";
import { sceneState } from "./lib/scene";
import { type CategoryKey, ZONES } from "./lib/zones";

/* Three.js hydrates in the background — the 2D shell paints first. */
const Scene = lazy(() => import("./three/Scene"));

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [benchLight, setBenchLight] = useState(false);
  const [reduced, setReduced] = useState<boolean>(prefersReduced);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");

  const activeRef = useRef<string | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);

  const displayedZones = useMemo(() => {
    if (selectedCategory === "all") return ZONES;
    return ZONES.filter((z) => z.category === selectedCategory);
  }, [selectedCategory]);

  const activeIdx = useMemo(
    () => displayedZones.findIndex((z) => z.id === activeId),
    [displayedZones, activeId],
  );
  const activeZone = activeIdx >= 0 ? displayedZones[activeIdx] : null;

  /* sync before children mount so the first 3D frame respects the fallback */
  sceneState.reduced = reduced;

  /* ------------------------------------------------ scroll engine */

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
    sceneState.reduced = reduced;

    if (reduced) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  /* measurement loop: writes --scroll + sceneState, flips active zone only
     when it actually changes (so React state stays cheap) */
  useEffect(() => {
    let id = 0;
    let marks: { id: string; top: number }[] = [];
    let needsMeasure = true;

    const measure = () => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-zone-sec]"),
      );
      const sy = window.scrollY || document.documentElement.scrollTop || 0;
      marks = nodes
        .filter((n) => n.dataset.zoneSec !== "hero")
        .map((n) => ({ id: n.dataset.zoneSec!, top: n.getBoundingClientRect().top + sy }));
      needsMeasure = false;
    };

    const onResize = () => {
      needsMeasure = true;
    };

    const tick = () => {
      if (needsMeasure) measure();

      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const y = window.scrollY || doc.scrollTop || 0;
      const p = Math.max(0, Math.min(1, y / max));
      doc.style.setProperty("--scroll", p.toFixed(4));

      sceneState.progress = p;

      const anchor = window.innerHeight * 0.38;
      let found: string | null = null;
      for (const m of marks) {
        if (m.top <= anchor) found = m.id;
      }
      if (found !== activeRef.current) {
        activeRef.current = found;
        setActiveId(found);
      }

      id = requestAnimationFrame(tick);
    };

    id = requestAnimationFrame(tick);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    const ro = window.ResizeObserver ? new ResizeObserver(onResize) : null;
    if (ro && document.body) ro.observe(document.body);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      ro?.disconnect();
    };
  }, [displayedZones]);

  /* mouse parallax → 3D camera */
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      sceneState.mx = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.my = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  /* zone → 3D lighting + shell palette */
  useEffect(() => {
    const shell = shellRef.current;
    if (shell) {
      shell.dataset.zone = activeId ?? "hero";
      shell.dataset.bench = benchLight ? "light" : "dark";
      shell.dataset.mode = activeZone?.mode ?? "dark";
    }
    if (activeZone) {
      sceneState.accentTarget.set(activeZone.accent);
      const flat = activeZone.id === "neo-brutalism" || activeZone.id === "swiss" || activeZone.id === "brutalism" || activeZone.id === "minimalism";
      sceneState.flatTarget = flat ? 1 : 0;
      sceneState.lightTarget = activeZone.mode === "light" ? 1 : 0;
    } else {
      sceneState.accentTarget.set("#C6F24E");
      sceneState.flatTarget = 0;
      sceneState.lightTarget = benchLight ? 1 : 0;
    }
  }, [activeId, activeZone, benchLight]);

  /* ------------------------------------------------------ navigation */

  const go = useCallback(
    (id: string) => {
      const top =
        id === "hero"
          ? 0
          : (document.getElementById(id)?.getBoundingClientRect().top ?? 0) +
            (window.scrollY || document.documentElement.scrollTop || 0) -
            62;
      const l = lenisRef.current;
      if (l) l.scrollTo(top, { duration: 1.15, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
      else window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  const handleSelectCategory = useCallback(
    (cat: CategoryKey) => {
      setSelectedCategory(cat);
      if (cat !== "all") {
        const first = ZONES.find((z) => z.category === cat);
        if (first) {
          setTimeout(() => go(first.id), 50);
        }
      }
    },
    [go],
  );

  /* ----------------------------------------------------------- render */

  return (
    <div
      ref={shellRef}
      className="shell relative min-h-screen"
      data-zone="hero"
      data-bench={benchLight ? "light" : "dark"}
      data-mode="dark"
    >
      {/* fixed 3D canvas — hydrates behind the 2D shell */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{ opacity: reduced ? 0.5 : 1 }}
      >
        {/* optical-bench plate — fades out as travel begins */}
        <div
          className="absolute inset-0"
          style={{ opacity: "clamp(0, calc(1 - var(--scroll, 0) * 5), 1)" }}
        >
          <img
            src="/images/hero.webp"
            alt=""
            className="h-full w-full object-cover opacity-60"
            style={{
              maskImage: "radial-gradient(120% 92% at 50% 45%, #000 18%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(120% 92% at 50% 45%, #000 18%, transparent 80%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(88% 68% at 50% 42%, transparent 28%, var(--surface) 92%)" }}
          />
        </div>
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <Scene reduced={reduced} />
          </Suspense>
        </ErrorBoundary>
      </div>

      <Header
        zone={activeZone}
        activeId={activeId}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        benchLight={benchLight}
        reduced={reduced}
        onToggleBench={() => setBenchLight((v) => !v)}
        onToggleReduced={() => setReduced((v) => !v)}
        onGo={go}
      />

      <Rail zone={activeZone} activeIdx={activeIdx} onGo={go} />

      <main className="relative z-10 lg:pr-14 xl:pr-16">
        <Hero onGo={go} onSelectCategory={handleSelectCategory} />
        {displayedZones.map((z, i) => (
          <ZoneSection key={z.id} zone={z} index={i} onEnter={go} />
        ))}
        <Footer onGo={go} />
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Footer({ onGo }: { onGo: (id: string) => void }) {
  const specs = [
    ["Catalogue", "28 Canonical Design Paradigms"],
    ["Engine", "React 19 · Three.js · R3F"],
    ["Scroll", "Lenis inertia + custom rAF"],
    ["Theming", "Zero-latency CSS custom properties"],
    ["Playground", "Live CSS, Tailwind & Inline generators"],
    ["Fallback", "prefers-reduced-motion & ErrorBoundary"],
  ];

  return (
    <footer className="relative" style={{ borderTop: "1px solid var(--zhair)" }}>
      <div className="mx-auto w-full max-w-[1600px] px-5 py-16 sm:px-8 lg:px-14 xl:pl-24 xl:pr-24">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <p className="micro pb-5" style={{ color: "var(--accent)" }}>
              Design System Spec
            </p>
            <h2
              className="font-[family-name:var(--font-display)] font-bold tracking-[-0.033em]"
              style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)", lineHeight: 1.05 }}
            >
              28 design languages.
              <br />
              Rebuilt from first
              <br />
              principles in pure CSS.
            </h2>
            <p className="max-w-[46ch] pt-6 text-[14.5px] leading-[1.7]" style={{ color: "var(--zmuted)" }}>
              Morphisms, architectural movements, subculture aesthetics, and layout labs.
              Every surface is mathematically derived with live parameter controls and 1-click code exports.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-7">
            <p className="micro pb-4" style={{ color: "var(--zmuted)" }}>
              Specifications
            </p>
            <dl>
              {specs.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-4 py-3"
                  style={{ borderTop: "1px solid var(--zhair)" }}
                >
                  <dt className="micro shrink-0" style={{ color: "var(--zmuted)" }}>
                    {k}
                  </dt>
                  <dd className="numeral min-w-0 truncate text-right text-[11px]" style={{ color: "var(--zink)" }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-12 lg:col-span-2 lg:col-start-11">
            <p className="micro pb-4" style={{ color: "var(--zmuted)" }}>
              Popular Jumps
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-col">
              {ZONES.slice(0, 8).map((z) => (
                <li key={z.id}>
                  <button
                    type="button"
                    onClick={() => onGo(z.id)}
                    className="micro transition-colors duration-200 hover:text-[color:var(--accent)]"
                    style={{ color: "var(--zmuted)" }}
                  >
                    <span className="numeral pr-1.5" style={{ color: z.accent }}>
                      {z.idx}
                    </span>
                    {z.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-16 flex flex-col items-start justify-between gap-5 pt-7 sm:flex-row sm:items-center"
          style={{ borderTop: "1px solid var(--zhair)" }}
        >
          <p className="micro" style={{ color: "var(--zmuted)" }}>
            Stylus3D — The Ultimate 3D CSS Design System &amp; Generator
          </p>
          <div className="flex items-center gap-3">
            <span className="micro inline-flex items-center gap-1.5" style={{ color: "var(--zmuted)" }}>
              <Check size={11} strokeWidth={3} style={{ color: "var(--accent)" }} />
              28 interactive paradigms
            </span>
            <button
              type="button"
              onClick={() => onGo("hero")}
              className="ghost-btn micro inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5"
              aria-label="Back to top"
            >
              <ArrowUp size={11} strokeWidth={2.5} />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
