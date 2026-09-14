import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

type Tok = { t: string; c: string };

/* ------------------------------------------------------------------
   A dependency-free CSS tokenizer. Walks the string once, emitting
   typed spans — never round-trips through innerHTML string building.
   ------------------------------------------------------------------ */

const isNum = (ch: string) => ch >= "0" && ch <= "9";
const isIdentStart = (ch: string) => /[A-Za-z_$]/.test(ch);
const isIdent = (ch: string) => /[A-Za-z0-9_%-]/.test(ch);

function tokenizeCss(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const ch = src[i];

    if (ch === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i);
      const stop = end === -1 ? n : end + 2;
      out.push({ t: "com", c: src.slice(i, stop) });
      i = stop;
      continue;
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && src[j] !== ch) {
        if (src[j] === "\\") j++;
        j++;
      }
      out.push({ t: "str", c: src.slice(i, Math.min(j + 1, n)) });
      i = j + 1;
      continue;
    }
    if (ch === "#" && /[0-9a-fA-F]/.test(src[i + 1] || "")) {
      let j = i + 1;
      while (j < n && /[0-9a-fA-F]/.test(src[j])) j++;
      out.push({ t: "hex", c: src.slice(i, j) });
      i = j;
      continue;
    }
    if (isNum(ch) || (ch === "-" && isNum(src[i + 1] || ""))) {
      let j = i + 1;
      while (j < n && /[0-9.]/.test(src[j])) j++;
      let k = j;
      while (k < n && /[a-z%]/.test(src[k])) k++;
      out.push({ t: "num", c: src.slice(i, k) });
      i = k;
      continue;
    }
    if (isIdentStart(ch) || ch === "-") {
      let j = i;
      while (j < n && isIdent(src[j])) j++;
      const word = src.slice(i, j);
      let k = j;
      while (k < n && /\s/.test(src[k])) k++;
      if (!word.startsWith("--") && src[k] === ":" && src[k + 1] !== ":") {
        out.push({ t: "prop", c: word });
      } else if (/^(rgba|rgb|hsl|hsla|url|calc|var|color-mix|linear-gradient|radial-gradient|blur|saturate|inset|translate|translateY|drop-shadow)$/.test(word)) {
        out.push({ t: "fn", c: word });
      } else if (word.startsWith("--")) {
        out.push({ t: "var", c: word });
      } else {
        out.push({ t: "word", c: word });
      }
      i = j;
      continue;
    }
    if (/[{}():;,.>*\[\]=@]/.test(ch)) {
      out.push({ t: "pun", c: ch });
      i++;
      continue;
    }
    out.push({ t: "txt", c: ch });
    i++;
  }

  /* promote identifiers directly before a block opener into selectors */
  for (let a = 0; a < out.length; a++) {
    if (out[a].t !== "word" && out[a].t !== "fn") continue;
    let b = a + 1;
    while (b < out.length && out[b].t === "txt") b++;
    if (out[b]?.c === "{") out[a].t = "sel";
  }
  return out;
}

function tokenizeHtml(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    if (src.startsWith("<!--", i)) {
      const end = src.indexOf("-->", i);
      const stop = end === -1 ? n : end + 3;
      out.push({ t: "com", c: src.slice(i, stop) });
      i = stop;
      continue;
    }
    if (src[i] === "<") {
      const end = src.indexOf(">", i);
      const stop = end === -1 ? n : end + 1;
      out.push({ t: "tag", c: src.slice(i, stop) });
      i = stop;
      continue;
    }
    const next = src.indexOf("<", i);
    const chunk = src.slice(i, next === -1 ? n : next);
    if (chunk) out.push({ t: "txt", c: chunk });
    i = next === -1 ? n : next;
  }
  return out;
}

const CLASS: Record<string, string> = {
  com: "text-[#4B5A6B] italic",
  str: "text-[#A8D8A0]",
  hex: "text-[#FF9FB0]",
  num: "text-[#C6F24E]",
  prop: "text-[#7FD3F7]",
  fn: "text-[#8FA8FF]",
  var: "text-[#F2C97A]",
  sel: "text-[#E8EDF2] font-medium",
  word: "text-[#93A3B4]",
  pun: "text-[#5C6B7C]",
  tag: "text-[#C6F24E]",
  txt: "text-[#93A3B4]",
};

function Highlight({ code, lang }: { code: string; lang: "css" | "html" }) {
  const toks = useMemo(
    () => (lang === "css" ? tokenizeCss(code) : tokenizeHtml(code)),
    [code, lang],
  );
  return (
    <code className="block whitespace-pre">
      {toks.map((tk, i) => (
        <span key={i} className={CLASS[tk.t] ?? CLASS.txt}>
          {tk.c}
        </span>
      ))}
    </code>
  );
}

/* ------------------------------------------------------------------ */

const TABS = ["css", "tailwind", "inline", "html"] as const;
export type TabKey = (typeof TABS)[number];

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* clipboard unavailable — silent */
      }
      ta.remove();
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 1400);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label} to clipboard`}
      className="copy-btn micro inline-flex shrink-0 items-center gap-1.5 rounded-sm px-2.5 py-1.5"
      style={{
        border: "1px solid var(--zhair)",
        color: done ? "var(--accent)" : "var(--zmuted)",
        borderColor: done ? "var(--accent)" : "var(--zhair)",
      }}
    >
      {done ? <Check size={11} strokeWidth={3} /> : <Copy size={11} strokeWidth={2.5} />}
      {done ? "Copied" : label}
    </button>
  );
}

export function CodeTray({
  code,
  accent,
}: {
  code: Record<TabKey, string>;
  accent: string;
}) {
  const [tab, setTab] = useState<TabKey>("css");
  const body = code[tab];
  const lang: "css" | "html" = tab === "html" ? "html" : "css";

  return (
    <div
      className="overflow-hidden rounded-[inherit]"
      style={{ borderTop: "1px solid var(--zhair)", background: "color-mix(in srgb, var(--surface) 70%, transparent)" }}
    >
      <div className="flex items-stretch justify-between gap-2" style={{ borderBottom: "1px solid var(--zhair)" }}>
        <div className="flex min-w-0 items-stretch overflow-x-auto">
          {TABS.map((t) => {
            const on = t === tab;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                aria-pressed={on}
                className="micro relative shrink-0 px-3 py-2.5 transition-colors duration-200"
                style={{ color: on ? "var(--zink)" : "var(--zmuted)" }}
              >
                {t === "inline" ? "inline style" : t}
                <span
                  className="pointer-events-none absolute inset-x-2 bottom-0 h-[2px] origin-left transition-transform duration-200"
                  style={{
                    background: accent,
                    transform: `scaleX(${on ? 1 : 0})`,
                  }}
                />
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 pr-2.5">
          <span className="numeral hidden text-[10px] sm:inline" style={{ color: "var(--zmuted)" }}>
            {body.split("\n").length} ln
          </span>
          <CopyButton text={body} />
        </div>
      </div>

      <div className="relative max-h-[22rem] overflow-auto" data-lenis-prevent>
        <pre className="min-w-full p-4 text-[11.5px] leading-[1.75] sm:p-5 sm:text-[12.5px]">
          <style>{`.pre-code,.pre-code *{font-family:var(--font-mono);tab-size:2}`}</style>
          <span className="pre-code">
            <Highlight code={body} lang={lang} />
          </span>
        </pre>
      </div>
    </div>
  );
}
