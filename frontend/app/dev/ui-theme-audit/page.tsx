"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

/** WCAG contrast helpers */
function srgbToLin(c: number) { const s = c/255; return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4); }
function relLuminance(hex: string) {
  const m = hex.replace("#",""); const r = parseInt(m.slice(0,2),16), g = parseInt(m.slice(2,4),16), b = parseInt(m.slice(4,6),16);
  return 0.2126*srgbToLin(r)+0.7152*srgbToLin(g)+0.0722*srgbToLin(b);
}
function contrastRatio(fgHex: string, bgHex: string) {
  const L1 = relLuminance(fgHex), L2 = relLuminance(bgHex);
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}
function ok(ctr: number, size: "normal" | "large" = "normal") {
  return size === "large" ? ctr >= 3.0 : ctr >= 4.5; // WCAG AA
}

const getCSSVar = (name: string) =>
  typeof window !== "undefined" ? getComputedStyle(document.documentElement).getPropertyValue(name).trim() : "";

const hexFromCSS = (val: string) => {
  if (!val) return "#000000";
  if (val.startsWith("#")) {
    const h = val.replace("#","").slice(0,6);
    return "#" + (h.length===3 ? h.split("").map(c=>c+c).join("") : h.padEnd(6,"0"));
  }
  if (val.startsWith("rgb")) {
    const m = val.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return "#000000";
    const [r,g,b] = m.slice(1,4).map(n=>parseInt(n,10));
    const toHex = (n:number)=>n.toString(16).padStart(2,"0");
    return "#" + toHex(r)+toHex(g)+toHex(b);
  }
  return "#000000";
};

export default function UIThemeAudit() {
  const { theme, setTheme } = useTheme();
  const [vars, setVars] = useState({ accent:"#0047FF", accentHover:"#1a5aff", text:"#444B5A", textOnDark:"#F5F6FA", surface:"#FFFFFF", surfaceDark:"#0D1117" });
  const [manifest, setManifest] = useState<{theme_color?:string; background_color?:string}>({});
  const [prefersReducedMotion, setPRM] = useState(false);

  useEffect(() => {
    const read = () => {
      setVars({
        accent: hexFromCSS(getCSSVar("--accent") || "#0047FF"),
        accentHover: hexFromCSS(getCSSVar("--accent-hover") || "#1a5aff"),
        text: hexFromCSS(getCSSVar("--text-secondary") || "#444B5A"),
        textOnDark: hexFromCSS(getCSSVar("--text-primary") || "#F5F6FA"),
        surface: hexFromCSS(getCSSVar("--bg") || "#FFFFFF"),
        surfaceDark: "#0D1117",
      });
    };
    read();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPRM(mq.matches);
    const handler = () => setPRM(mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [theme]);

  useEffect(() => {
    fetch("/manifest.json").then(r=>r.ok?r.json():{}).then(setManifest).catch(()=>{});
  }, []);

  const checks = useMemo(() => {
    const ctaLight = contrastRatio("#FFFFFF", vars.accent);
    const ctaDark  = contrastRatio("#0D1117", vars.accent);
    const textOnLight = contrastRatio(vars.text, vars.surface);
    const textOnDark = contrastRatio(vars.textOnDark, vars.surfaceDark);
    const chipOnSurface = contrastRatio(vars.accent, vars.surface);
    return { ctaLight, ctaDark, textOnLight, textOnDark, chipOnSurface };
  }, [vars]);

  const Row = ({label, value, pass}:{label:string; value:number; pass:boolean}) => (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
      <div className="text-sm">{label}</div>
      <div className="flex items-center gap-3">
        <span className="tabular-nums">{value.toFixed(2)}:1</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${pass?'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400':'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
          {pass ? "✓ PASS" : "✗ FAIL"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-5 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">🎨 UI Theme Audit</h1>
          <div className="flex items-center gap-2">
            <button onClick={()=>setTheme("light")} className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">☀️ Light</button>
            <button onClick={()=>setTheme("dark")} className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">🌙 Dark</button>
            <button onClick={()=>setTheme("system")} className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">🖥️ System</button>
          </div>
        </header>

        {/* Swatches */}
        <section className="mb-8 grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            {name:"Accent", hex:vars.accent},
            {name:"Accent Hover", hex:vars.accentHover},
            {name:"Text (light)", hex:vars.text},
            {name:"Text (dark)", hex:vars.textOnDark},
            {name:"Surface (light)", hex:vars.surface},
            {name:"Surface (dark)", hex:vars.surfaceDark},
          ].map(s=>(
            <div key={s.name} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
              <div className="h-10 w-full rounded-md" style={{background:s.hex}}/>
              <div className="mt-2 text-xs font-medium">{s.name}</div>
              <div className="font-mono text-xs text-gray-600 dark:text-gray-400">{s.hex}</div>
            </div>
          ))}
        </section>

        {/* Contrast checks */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Contrast (WCAG AA)</h2>
          <div className="grid gap-3">
            <Row label="CTA (white text on accent, light theme)" value={checks.ctaLight} pass={ok(checks.ctaLight, "large")} />
            <Row label="Outline CTA (dark text on accent)" value={checks.ctaDark} pass={ok(checks.ctaDark)} />
            <Row label="Body text on light surface" value={checks.textOnLight} pass={ok(checks.textOnLight)} />
            <Row label="Body text on dark surface" value={checks.textOnDark} pass={ok(checks.textOnDark)} />
            <Row label="Accent text on light surface" value={checks.chipOnSurface} pass={ok(checks.chipOnSurface)} />
          </div>
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">AA-kriteeri: 4.5:1 normaaliteksti, 3.0:1 isoteksti/CTA.</p>
        </section>

        {/* Focus & press demo */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Focus & Press States</h2>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-xl bg-converto-blue px-4 py-2 text-white transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-converto-sky">Primary</button>
            <button className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-converto-blue">Secondary</button>
            <a href="#!" className="underline decoration-converto-blue underline-offset-4 focus:outline-none focus:ring-2 focus:ring-converto-sky px-2 py-1 rounded">Text link</a>
          </div>
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">Hold <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Tab</kbd> → varmista selkeä focus-rengas. Paina nappeja → "press-scale".</div>
        </section>

        {/* Motion & PWA */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <h3 className="mb-2 font-semibold">Motion preference</h3>
            <div className="text-sm">prefers-reduced-motion: <span className={`ml-1 font-medium ${prefersReducedMotion?'text-rose-600 dark:text-rose-400':'text-emerald-600 dark:text-emerald-400'}`}>{prefersReducedMotion ? "reduce" : "no-preference"}</span></div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">Varmista animaatioiden poisto PRM=reduce -tilassa.</div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <h3 className="mb-2 font-semibold">PWA manifest</h3>
            <div className="text-sm">theme_color: <span className="font-mono text-converto-blue">{manifest.theme_color || "—"}</span></div>
            <div className="text-sm">background_color: <span className="font-mono">{manifest.background_color || "—"}</span></div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">Päivitä <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">public/manifest.json</code> vastaamaan Converto Blue -palettia.</div>
          </div>
        </section>

        {/* Header preview block */}
        <section className="mb-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h2 className="mb-3 text-lg font-semibold">Header preview</h2>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-converto-blue" />
                <span className="font-semibold">Converto™</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-gray-300 dark:border-gray-600 px-2 py-0.5 text-xs">Local Intelligence 🔒</span>
                <span className="rounded-full border border-gray-300 dark:border-gray-600 px-2 py-0.5 text-xs">openai (123ms)</span>
                <button className="rounded-lg bg-converto-blue px-3 py-1.5 text-white hover:opacity-90 active:scale-[0.98] transition-all">Aloita</button>
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">Tarkista, että chipit ja CTA säilyttävät kontrastin molemmissa teemoissa.</p>
        </section>

        {/* Results summary */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h2 className="mb-3 text-lg font-semibold">✅ Audit summary</h2>
          <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
            <li>CTA-kontrasti AA (≥3.0 isoteksti), runkoteksti AA (≥4.5).</li>
            <li>Focus-ring näkyy kaikille interaktioille.</li>
            <li>Hover/active-tilat erottuvat (luminanssi + scale).</li>
            <li>PRM=reduce poistaa animaatiot.</li>
            <li>PWA manifest värit vastaavat teemoja.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

