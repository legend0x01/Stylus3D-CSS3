import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Sun, Moon, Zap, Menu, X, Filter } from "lucide-react";
import { CATEGORIES, type CategoryKey, type Zone, ZONES } from "../lib/zones";

interface Props {
  zone: Zone | null;
  activeId: string | null;
  selectedCategory: CategoryKey;
  onSelectCategory: (cat: CategoryKey) => void;
  benchLight: boolean;
  reduced: boolean;
  onToggleBench: () => void;
  onToggleReduced: () => void;
  onGo: (id: string) => void;
}

export default function Header({
  zone,
  activeId,
  selectedCategory,
  onSelectCategory,
  benchLight,
  reduced,
  onToggleBench,
  onToggleReduced,
  onGo,
}: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const zid = zone?.id ?? "hero";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        window.setTimeout(() => inputRef.current?.focus(), 30);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ZONES;
    return ZONES.filter(
      (z) =>
        z.name.toLowerCase().includes(s) ||
        z.kicker.toLowerCase().includes(s) ||
        z.category.toLowerCase().includes(s) ||
        z.primitives.some((p) => p.term.toLowerCase().includes(s)),
    );
  }, [q]);

  const go = (id: string) => {
    setOpen(false);
    setMenu(false);
    setQ("");
    onGo(id);
  };

  return (
    <header
      className="hdr fixed inset-x-0 top-0 z-50"
      data-z={zid}
      data-bench={benchLight ? "light" : "dark"}
      data-mode={zone?.mode ?? "dark"}
    >
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6 lg:px-10">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onGo("hero")}
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Stylus3D — back to top"
        >
          <span
            className="relative grid h-8 w-8 place-items-center transition-transform duration-300 group-hover:rotate-[30deg] group-hover:scale-110"
            style={{
              border: `2px solid ${zone?.accent ?? "var(--accent)"}`,
              borderRadius: zid === "neo-brutalism" ? 0 : 7,
            }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M12 2.6 21 7.6v9L12 21.6 3 16.6v-9z"
                stroke={zone?.accent ?? "var(--accent)"}
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="2.4" fill={zone?.accent ?? "var(--accent)"} />
            </svg>
          </span>
          <span className="hidden leading-none sm:block">
            <span className="block font-[family-name:var(--font-display)] text-[15px] font-bold tracking-[-0.02em]">
              Stylus<span style={{ color: zone?.accent ?? "var(--accent)" }}>3D</span>
            </span>
            <span className="micro block pt-[3px] opacity-60" style={{ fontSize: 8.5 }}>
              3D design system · 28 styles
            </span>
          </span>
        </button>

        <span className="hidden h-6 w-px shrink-0 xl:block" style={{ background: "currentColor", opacity: 0.16 }} />

        {/* Category Pills (Desktop) */}
        <nav className="hidden min-w-0 items-center gap-1.5 xl:flex" aria-label="Style Categories">
          {CATEGORIES.map((cat) => {
            const isSel = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => onSelectCategory(cat.key)}
                className="micro flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all"
                style={{
                  background: isSel ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent",
                  color: isSel ? "var(--accent)" : "var(--zmuted)",
                  border: isSel ? "1px solid var(--accent)" : "1px solid transparent",
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Search button */}
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            window.setTimeout(() => inputRef.current?.focus(), 30);
          }}
          className="hdr-chip micro flex items-center gap-2 rounded-sm px-2.5 py-2"
          aria-label="Search all 28 design styles"
          data-on={open}
        >
          <Search size={12} strokeWidth={2.5} />
          <span className="hidden md:inline">Search styles</span>
          <span className="numeral hidden opacity-50 md:inline">⌘K</span>
        </button>

        {/* Bench lighting */}
        <button
          type="button"
          onClick={onToggleBench}
          className="hdr-chip grid h-8 w-8 place-items-center rounded-sm"
          aria-label={benchLight ? "Switch to dark bench" : "Switch to lit bench"}
          title={benchLight ? "Bench dark" : "Bench light"}
        >
          {benchLight ? <Moon size={13} strokeWidth={2.5} /> : <Sun size={13} strokeWidth={2.5} />}
        </button>

        {/* Reduced motion */}
        <button
          type="button"
          onClick={onToggleReduced}
          className="hdr-chip hidden h-8 items-center gap-1.5 rounded-sm px-2.5 sm:flex"
          aria-pressed={reduced}
          aria-label="Toggle reduced motion"
          title="Reduced motion"
          data-on={reduced}
          style={reduced ? { color: zone?.accent ?? "var(--accent)", borderColor: zone?.accent ?? "var(--accent)" } : undefined}
        >
          <Zap size={12} strokeWidth={2.5} />
          <span className="micro">still</span>
        </button>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMenu((v) => !v)}
          className="hdr-chip grid h-8 w-8 place-items-center rounded-sm xl:hidden"
          aria-label="Browse all categories & styles"
          aria-expanded={menu}
        >
          {menu ? <X size={14} strokeWidth={2.5} /> : <Menu size={14} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Quick Search Palette (Cmd+K) */}
      {open && (
        <div
          className="absolute inset-x-0 top-full px-4 pb-4 sm:px-6 lg:px-10 shadow-2xl"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--zhair)" }}
        >
          <div className="mx-auto max-w-[1600px]">
            <div
              className="flex items-center gap-3 px-3 rounded-md"
              style={{ border: "1px solid var(--zhair)", background: "var(--panel)" }}
            >
              <Search size={14} strokeWidth={2.5} style={{ color: zone?.accent ?? "var(--accent)" }} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results[0]) go(results[0].id);
                }}
                placeholder="Search styles (glass, cyberpunk, brutalism, bento, neumorphism...)"
                className="min-w-0 flex-1 bg-transparent py-3 text-[14px] outline-none"
                style={{ color: "var(--zink)" }}
                aria-label="Search design styles"
              />
              <span className="numeral shrink-0 text-[10px]" style={{ color: "var(--zmuted)" }}>
                {results.length}/{ZONES.length}
              </span>
            </div>

            <div className="mt-2 max-h-[52vh] overflow-auto divide-y divide-[var(--zhair)]" data-lenis-prevent>
              {results.length === 0 && (
                <p className="micro px-2 py-6 text-center" style={{ color: "var(--zmuted)" }}>
                  No style matching “{q}”
                </p>
              )}
              {results.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => go(z.id)}
                  className="group flex w-full items-center gap-4 px-2 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <span className="numeral w-7 shrink-0 text-[11px]" style={{ color: z.accent }}>
                    {z.idx}
                  </span>
                  <span className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="block truncate text-[14px] font-medium">{z.name}</span>
                      <span className="micro text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-[var(--zmuted)]">
                        {z.category}
                      </span>
                    </div>
                    <span className="micro block truncate pt-0.5" style={{ color: "var(--zmuted)" }}>
                      {z.kicker}
                    </span>
                  </span>
                  <span className="numeral shrink-0 text-[11px] opacity-0 transition-opacity group-hover:opacity-100" style={{ color: z.accent }}>
                    Enter →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {menu && (
        <div
          className="absolute inset-x-0 top-full max-h-[75vh] overflow-auto px-5 py-4 xl:hidden shadow-2xl"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--zhair)" }}
        >
          <p className="micro pb-2.5" style={{ color: "var(--zmuted)" }}>
            Filter Categories
          </p>
          <div className="flex flex-wrap gap-2 pb-5 mb-4 border-b border-[var(--zhair)]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  onSelectCategory(cat.key);
                  setMenu(false);
                }}
                className="micro flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{
                  background: selectedCategory === cat.key ? "var(--accent)" : "var(--panel)",
                  color: selectedCategory === cat.key ? "#000" : "var(--zink)",
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <p className="micro pb-2.5" style={{ color: "var(--zmuted)" }}>
            Jump to Style
          </p>
          <div className="grid gap-1">
            {ZONES.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => go(z.id)}
                className="flex w-full items-center gap-3 py-2 text-left"
                style={{ opacity: activeId === z.id ? 1 : 0.7 }}
              >
                <span className="numeral w-7 shrink-0 text-[11px]" style={{ color: z.accent }}>
                  {z.idx}
                </span>
                <span className="flex-1 truncate text-[13.5px]">{z.name}</span>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: z.accent }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
