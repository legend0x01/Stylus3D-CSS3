import { motion } from "framer-motion";
import { CATEGORIES, type CategoryKey, ZONES } from "../lib/zones";

const ease = [0.2, 0.8, 0.2, 1] as const;

interface Props {
  onGo: (id: string) => void;
  onSelectCategory: (cat: CategoryKey) => void;
}

export default function Hero({ onGo, onSelectCategory }: Props) {
  return (
    <section
      id="hero"
      data-zone-sec="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
      style={{ paddingLeft: "max(1rem, env(safe-area-inset-left))" }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-14 xl:pl-24 xl:pr-24">
        <div className="grid grid-cols-12 gap-y-10">
          {/* left-anchored, columns 1–8 */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease }}
              className="flex items-center gap-3 pb-6"
            >
              <span className="h-px w-8" style={{ background: "var(--accent)" }} />
              <span className="micro" style={{ color: "var(--accent)" }}>
                3D CSS Design System Encyclopedia · 28 Paradigms
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.72, delay: 0.35, ease }}
              className="font-[family-name:var(--font-display)] font-bold tracking-[-0.035em]"
              style={{
                fontSize: "clamp(2.6rem, 7.4vw, 6.2rem)",
                lineHeight: 0.94,
                textShadow: "0 0 60px color-mix(in srgb, var(--accent) 26%, transparent)",
              }}
            >
              CSS artistry,
              <br />
              <span style={{ color: "var(--accent)" }}>in three</span>
              <br />
              dimensions.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.62, ease }}
              className="max-w-[54ch] pt-7 text-[15px] leading-[1.7] sm:text-[16.5px]"
              style={{ color: "var(--zmuted)" }}
            >
              28 canonical design languages — Glassmorphism, Neumorphism, Claymorphism, Chromemorphism,
              Cyberpunk, Synthwave, Memphis, Swiss, Bauhaus, Bento grids, and Kinetic type.
              Every surface has zero-latency interactive controls and generates copy-ready CSS and Tailwind.
            </motion.p>

            {/* Category Quick Filters */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.72, ease }}
              className="flex flex-wrap gap-2 pt-7"
            >
              {CATEGORIES.slice(1).map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => onSelectCategory(cat.key)}
                  className="micro flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  style={{ border: "1px solid var(--zhair)", background: "color-mix(in srgb, var(--surface) 40%, transparent)" }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85, ease }}
              className="flex flex-wrap items-center gap-3 pt-8"
            >
              <button
                type="button"
                onClick={() => onGo("glassmorphism")}
                className="micro group inline-flex items-center gap-2.5 px-5 py-3.5 transition-transform duration-200 hover:-translate-y-0.5"
                style={{
                  background: "var(--accent)",
                  color: "#07090C",
                  boxShadow: "0 0 34px -10px var(--accent)",
                }}
              >
                Enter the catalogue
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
              <button
                type="button"
                onClick={() => onGo("cyberpunk")}
                className="micro inline-flex items-center gap-2.5 px-5 py-3.5 transition-colors duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                style={{ border: "1px solid var(--zhair)" }}
              >
                Explore Cyberpunk HUD
              </button>
            </motion.div>
          </div>

          {/* engraved index — columns 10–12 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.95 }}
            className="col-span-12 hidden lg:col-span-3 lg:col-start-10 lg:block max-h-[70vh] overflow-auto"
            data-lenis-prevent
          >
            <div className="pt-2">
              <p className="micro pb-3" style={{ color: "var(--zmuted)" }}>
                Index · 28 Styles
              </p>
              <ul>
                {ZONES.map((z) => (
                  <li key={z.id}>
                    <button
                      type="button"
                      onClick={() => onGo(z.id)}
                      className="group flex w-full items-center gap-2.5 py-[6px] text-left"
                      style={{ borderBottom: "1px solid var(--zhair)" }}
                    >
                      <span className="numeral w-5 shrink-0 text-[10px]" style={{ color: z.accent }}>
                        {z.idx}
                      </span>
                      <span
                        className="flex-1 truncate text-[12px] transition-colors duration-200"
                        style={{ color: "var(--zmuted)" }}
                      >
                        <span className="transition-colors duration-200 group-hover:text-[color:var(--zink)]">
                          {z.name}
                        </span>
                      </span>
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full opacity-40 transition-opacity duration-200 group-hover:opacity-100"
                        style={{ background: z.accent }}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.15 }}
        className="pointer-events-none absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2"
      >
        <div
          className="relative h-8 w-[20px] rounded-full"
          style={{ border: "1.5px solid var(--zmuted)", opacity: 0.7 }}
          aria-hidden="true"
        >
          <motion.span
            animate={{ y: [0, 9, 0], opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-[5px] h-[5px] w-[2px] -translate-x-1/2 rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </div>
        <span className="micro" style={{ color: "var(--zmuted)", fontSize: 8 }}>
          scroll to travel
        </span>
      </motion.div>
    </section>
  );
}
