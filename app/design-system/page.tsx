"use client";

import { motion } from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

export default function DesignSystemPage() {
  const { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering } = useCursor();

  return (
    <PageShell
      cursorXSpring={cursorXSpring}
      cursorYSpring={cursorYSpring}
      cursorHovering={cursorHovering}
    >
      <style>{css}</style>
      <SiteNav setCursorHovering={setCursorHovering} />

      <header className="ds-hero">
        <div className="container">
          <motion.div
            className="ds-breadcrumb"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span>§ — Design System</span>
            <span className="sep">·</span>
            <span>v1.0</span>
            <span className="sep">·</span>
            <span className="ds-status">LIVE</span>
          </motion.div>
          <motion.h1
            className="ds-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            The design<br /><em>language.</em>
          </motion.h1>
          <motion.p
            className="ds-lede"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            Every token, typeface, component, and motion primitive used across this site — in one place.
          </motion.p>
        </div>
      </header>

      {/* ─── COLOUR TOKENS ─── */}
      <DSSection num="01" title="Colour Tokens">
        <div className="token-grid">
          {COLOUR_TOKENS.map((t) => (
            <motion.div
              key={t.name}
              className="token-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="token-swatch" style={{ background: t.value }} />
              <div className="token-info">
                <code className="token-var">{t.name}</code>
                <span className="token-hex">{t.value}</span>
                <span className="token-role">{t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </DSSection>

      {/* ─── TYPOGRAPHY ─── */}
      <DSSection num="02" title="Typography">
        <div className="type-specimens">
          <div className="type-row">
            <div className="type-meta"><code>--serif</code> · Fraunces</div>
            <div className="type-sample type-sample-serif">The web&apos;s finest work ships <em>on time.</em></div>
          </div>
          <div className="type-row">
            <div className="type-meta"><code>--mono</code> · JetBrains Mono</div>
            <div className="type-sample type-sample-mono">01 / SHIP · 02 / INTEGRATE · 03 / RESCUE</div>
          </div>
          <div className="type-row">
            <div className="type-meta"><code>--sans</code> · Inter</div>
            <div className="type-sample type-sample-sans">Freelance full-stack developer & AI engineer based in Batam, Indonesia.</div>
          </div>
        </div>

        <div className="type-scale">
          {TYPE_SCALE.map((s) => (
            <div key={s.label} className="scale-row">
              <div className="scale-meta">
                <code>{s.label}</code>
                <span>{s.size}</span>
              </div>
              <div className="scale-sample" style={{ fontSize: s.size, fontFamily: s.family, fontWeight: s.weight, fontStyle: s.style }}>
                {s.text}
              </div>
            </div>
          ))}
        </div>
      </DSSection>

      {/* ─── SPACING / LAYOUT ─── */}
      <DSSection num="03" title="Spacing & Layout">
        <div className="ds-note">Max width: <code>1320px</code> · Gutter: <code>40px</code> desktop · <code>24px</code> mobile</div>
        <div className="spacing-row">
          {SPACING.map((s) => (
            <div key={s.label} className="spacing-item">
              <div className="spacing-bar" style={{ height: s.px }} />
              <code className="spacing-label">{s.label}</code>
              <span className="spacing-val">{s.px}px</span>
            </div>
          ))}
        </div>
      </DSSection>

      {/* ─── COMPONENTS ─── */}
      <DSSection num="04" title="Components">

        {/* Buttons */}
        <DSSubhead>Buttons</DSSubhead>
        <div className="comp-row"
          onMouseEnter={() => setCursorHovering(true)}
          onMouseLeave={() => setCursorHovering(false)}
        >
          <button className="btn btn-primary">Primary <span className="arrow"><ArrowUpRight size={14} strokeWidth={1.75} /></span></button>
          <button className="btn btn-ghost">Ghost <span className="arrow"><ArrowRight size={14} strokeWidth={1.75} /></span></button>
          <button className="btn btn-ghost" disabled style={{ opacity: 0.35 }}>Disabled</button>
        </div>

        {/* Chips */}
        <DSSubhead>Chips / Tags</DSSubhead>
        <div className="comp-row">
          {["Laravel", "Next.js", "TypeScript", "PostgreSQL", "Filament", "AI-Assisted Dev"].map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>

        {/* Nav */}
        <DSSubhead>Nav CTA</DSSubhead>
        <div className="comp-row">
          <span className="nav-cta inline-icon" style={{ cursor: "default" }}>Get in Touch <ArrowRight size={12} strokeWidth={1.75} /></span>
        </div>

        {/* Status badges */}
        <DSSubhead>Status Badges</DSSubhead>
        <div className="comp-row">
          <span className="project-status project-status-production">
            <span className="project-status-dot" />Production
          </span>
          <span className="project-status project-status-ongoing">
            <span className="project-status-dot" />Ongoing
          </span>
          <span className="project-status project-status-archived">
            <span className="project-status-dot" />Archived
          </span>
        </div>

        {/* Blockquote */}
        <DSSubhead>Blockquote</DSSubhead>
        <blockquote className="prose-quote">
          <span className="prose-quote-mark">&ldquo;</span>
          The best code is the code you don&apos;t have to write.
          <cite className="prose-quote-cite">— someone on the internet</cite>
        </blockquote>

        {/* Code block */}
        <DSSubhead>Code Block</DSSubhead>
        <pre className="prose-code"><code>{`const ship = async (project) => {
  await scope(project);
  await design(project);
  await build(project);
  return deploy(project);
};`}</code></pre>

        {/* Filter buttons */}
        <DSSubhead>Filter Buttons</DSSubhead>
        <div className="comp-row" style={{ flexWrap: "wrap" }}>
          <button className="filter-btn active">All <span className="filter-count">12</span></button>
          <button className="filter-btn">Production <span className="filter-count">8</span></button>
          <button className="filter-btn">Ongoing <span className="filter-count">3</span></button>
          <button className="filter-btn">Archived <span className="filter-count">1</span></button>
        </div>
      </DSSection>

      {/* ─── MOTION ─── */}
      <DSSection num="05" title="Motion Primitives">
        <div className="ds-note">All animations use <code>ease: [0.22, 1, 0.36, 1]</code> — an expo-out curve that feels snappy but never rushed.</div>
        <div className="motion-grid">
          {MOTION_TOKENS.map((m, i) => (
            <motion.div
              key={m.label}
              className="motion-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="motion-demo">
                <MotionDemo type={m.demo} />
              </div>
              <div className="motion-info">
                <code className="motion-label">{m.label}</code>
                <span className="motion-desc">{m.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </DSSection>

      {/* ─── BOKEH ─── */}
      <DSSection num="06" title="Atmosphere">
        <div className="ds-note">
          Four bokeh blobs, <code>blur(130px)</code>, opacity 0.1–0.22, animating on 32–52 s alternating loops.
          Reduced motion: animations are suspended via <code>@media (prefers-reduced-motion: reduce)</code>.
        </div>
        <div className="bokeh-preview">
          <div className="bp-blob bp-1" />
          <div className="bp-blob bp-2" />
          <div className="bp-blob bp-3" />
          <span className="bp-label">bokeh preview (scaled)</span>
        </div>
      </DSSection>

      <SiteFooter backHref="/" backLabel="BACK HOME" />
    </PageShell>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function DSSection({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="ds-section">
      <div className="container">
        <motion.div
          className="ds-section-head"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="ds-section-num">§ {num}</span>
          <h2 className="ds-section-title">{title}</h2>
        </motion.div>
        <div className="ds-section-body">{children}</div>
      </div>
    </section>
  );
}

function DSSubhead({ children }: { children: React.ReactNode }) {
  return <h3 className="ds-subhead">{children}</h3>;
}

function MotionDemo({ type }: { type: string }) {
  if (type === "fade-up")
    return (
      <motion.div
        className="demo-box"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    );
  if (type === "scale")
    return (
      <motion.div
        className="demo-box"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
    );
  if (type === "slide-up-text")
    return (
      <div style={{ overflow: "hidden", height: 32 }}>
        <motion.div
          className="demo-text"
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          SHIP IT.
        </motion.div>
      </div>
    );
  if (type === "hover-lift")
    return (
      <motion.div
        className="demo-box"
        whileHover={{ y: -8, borderColor: "var(--accent)" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
    );
  return <div className="demo-box" />;
}

// ─── Data ──────────────────────────────────────────────────────────────────

// needed for DSSection / DSSubhead types
import type React from "react";

const COLOUR_TOKENS = [
  { name: "--bg",        value: "#0d0d0c", role: "Page background"         },
  { name: "--bg-2",      value: "#141412", role: "Elevated surface"        },
  { name: "--ink",       value: "#ecece6", role: "Primary text"            },
  { name: "--ink-dim",   value: "#9a9a92", role: "Secondary text"          },
  { name: "--ink-faint", value: "#4a4a44", role: "Disabled / placeholder"  },
  { name: "--accent",    value: "#ff5c2e", role: "Brand orange — CTAs, highlights" },
  { name: "--accent-2",  value: "#eadfc8", role: "Warm cream — italics, quotes"    },
  { name: "--line",      value: "#2a2a26", role: "Borders & dividers"      },
];

const TYPE_SCALE = [
  { label: "Display",    size: "clamp(80px,12vw,160px)", family: "var(--serif)", weight: 400, style: "normal",  text: "Aa" },
  { label: "H1",         size: "clamp(44px,7.2vw,112px)", family: "var(--serif)", weight: 400, style: "normal",  text: "Every project on the record." },
  { label: "H2",         size: "clamp(26px,2.4vw,34px)", family: "var(--serif)", weight: 400, style: "normal",  text: "Three ways I show up for clients." },
  { label: "Lede",       size: "clamp(18px,1.6vw,22px)", family: "var(--serif)", weight: 300, style: "italic",  text: "A runtime exception bubbled all the way up." },
  { label: "Body",       size: "19px",  family: "var(--serif)", weight: 300, style: "normal", text: "Freelance full-stack developer and AI engineer based in Batam, Indonesia." },
  { label: "UI / Mono",  size: "12px",  family: "var(--mono)",  weight: 400, style: "normal", text: "§ 01 — SHIP · § 02 — INTEGRATE · § 03 — RESCUE" },
  { label: "Chip",       size: "10px",  family: "var(--mono)",  weight: 400, style: "normal", text: "LARAVEL · NEXT.JS · TYPESCRIPT · POSTGRESQL" },
];

const SPACING = [
  { label: "4",  px: 4  },
  { label: "8",  px: 8  },
  { label: "12", px: 12 },
  { label: "16", px: 16 },
  { label: "20", px: 20 },
  { label: "24", px: 24 },
  { label: "32", px: 32 },
  { label: "40", px: 40 },
  { label: "48", px: 48 },
  { label: "60", px: 60 },
  { label: "80", px: 80 },
  { label: "120", px: 120 },
];

const MOTION_TOKENS = [
  { label: "fade-up",       demo: "fade-up",       desc: "Entrance for sections and cards (whileInView)" },
  { label: "hover-scale",   demo: "scale",         desc: "Cards and images scale 1→1.06 on hover"       },
  { label: "line-reveal",   demo: "slide-up-text", desc: "Hero title text clips upward from a mask"      },
  { label: "hover-lift",    demo: "hover-lift",    desc: "Cards translate Y −6 to −8px on hover"         },
];

// ─── Styles ────────────────────────────────────────────────────────────────

const css = `
  .ds-hero { padding: 160px 0 60px; }
  .ds-breadcrumb {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); text-transform: uppercase; letter-spacing: 0.15em;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 36px;
  }
  .ds-breadcrumb .sep { color: var(--ink-faint); }
  .ds-status { color: var(--accent); font-weight: 700; }

  .ds-title {
    font-family: var(--serif);
    font-size: clamp(44px, 7.2vw, 112px);
    line-height: 0.96; font-weight: 400;
    letter-spacing: -0.035em; margin-bottom: 24px;
  }
  .ds-title em { font-style: italic; color: var(--accent-2); }
  .ds-lede { font-size: 17px; line-height: 1.65; color: var(--ink-dim); max-width: 720px; }

  /* ─── Section wrapper ─── */
  .ds-section { padding: 80px 0; border-top: 1px solid var(--line); }
  .ds-section-head {
    display: flex; align-items: baseline; gap: 20px; margin-bottom: 48px;
  }
  .ds-section-num { font-family: var(--mono); font-size: 11px; color: var(--accent); letter-spacing: 0.2em; }
  .ds-section-title {
    font-family: var(--serif);
    font-size: clamp(26px, 2.4vw, 36px);
    font-weight: 400; line-height: 1.05; letter-spacing: -0.02em;
  }
  .ds-subhead {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); text-transform: uppercase;
    letter-spacing: 0.15em; margin: 36px 0 16px;
    padding-bottom: 10px; border-bottom: 1px dashed var(--line);
  }
  .ds-subhead:first-of-type { margin-top: 0; }
  .ds-note {
    font-family: var(--mono); font-size: 12px;
    color: var(--ink-dim); line-height: 1.7;
    padding: 14px 18px; border-left: 2px solid var(--accent);
    background: var(--bg-2); margin-bottom: 32px;
  }
  .ds-note code { color: var(--accent-2); }

  /* ─── Colour tokens ─── */
  .token-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .token-card {
    border: 1px solid var(--line); background: var(--bg-2);
    overflow: hidden; border-radius: 2px;
  }
  .token-swatch { height: 80px; width: 100%; }
  .token-info { padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }
  .token-var  { font-family: var(--mono); font-size: 11px; color: var(--accent-2); }
  .token-hex  { font-family: var(--mono); font-size: 11px; color: var(--ink-dim); }
  .token-role { font-size: 12px; color: var(--ink-faint); line-height: 1.4; }

  /* ─── Typography ─── */
  .type-specimens { display: flex; flex-direction: column; gap: 0; margin-bottom: 48px; }
  .type-row {
    display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: center;
    padding: 24px 0; border-top: 1px solid var(--line);
  }
  .type-row:last-child { border-bottom: 1px solid var(--line); }
  .type-meta { font-family: var(--mono); font-size: 11px; color: var(--ink-faint); }
  .type-meta code { display: block; color: var(--accent-2); margin-bottom: 4px; }
  .type-sample-serif { font-family: var(--serif); font-size: clamp(22px, 2.8vw, 40px); font-weight: 400; color: var(--ink); }
  .type-sample-serif em { color: var(--accent-2); font-style: italic; }
  .type-sample-mono { font-family: var(--mono); font-size: clamp(12px, 1.2vw, 16px); color: var(--accent); letter-spacing: 0.1em; }
  .type-sample-sans { font-family: var(--sans); font-size: clamp(14px, 1.2vw, 18px); color: var(--ink-dim); line-height: 1.6; }

  .type-scale { display: flex; flex-direction: column; gap: 0; }
  .scale-row { display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: baseline; padding: 20px 0; border-top: 1px solid var(--line); }
  .scale-row:last-child { border-bottom: 1px solid var(--line); }
  .scale-meta { display: flex; flex-direction: column; gap: 4px; }
  .scale-meta code { font-family: var(--mono); font-size: 11px; color: var(--accent-2); }
  .scale-meta span { font-family: var(--mono); font-size: 10px; color: var(--ink-faint); }
  .scale-sample { color: var(--ink); line-height: 1.2; }

  /* ─── Spacing ─── */
  .spacing-row { display: flex; align-items: flex-end; gap: 20px; flex-wrap: wrap; padding-top: 20px; }
  .spacing-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .spacing-bar { width: 32px; background: var(--accent); opacity: 0.7; min-height: 1px; }
  .spacing-label { font-family: var(--mono); font-size: 10px; color: var(--ink-dim); }
  .spacing-val   { font-family: var(--mono); font-size: 9px; color: var(--ink-faint); }

  /* ─── Components ─── */
  .comp-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 20px 0; }

  /* project status (shared with WorkListClient) */
  .project-status {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 5px 10px; border: 1px solid var(--line); border-radius: 999px;
    font-family: var(--mono); font-size: 10px;
    color: var(--ink-dim); text-transform: uppercase; letter-spacing: 0.12em;
  }
  .project-status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
  .project-status-production .project-status-dot { background: #2ecc71; box-shadow: 0 0 8px #2ecc71; }
  .project-status-ongoing    .project-status-dot { background: var(--accent); box-shadow: 0 0 8px var(--accent); animation: pulse 1.6s ease-in-out infinite; }
  .project-status-archived   { color: var(--ink-faint); border-style: dashed; }
  .project-status-archived   .project-status-dot { background: var(--ink-faint); }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  /* prose quote */
  .prose-quote {
    margin: 0 0 20px; padding: 4px 0 4px 28px;
    border-left: 2px solid var(--accent);
    font-family: var(--serif);
    font-size: clamp(22px, 2.2vw, 28px);
    line-height: 1.45; font-style: italic; color: var(--accent-2);
  }
  .prose-quote-mark { color: var(--accent); margin-right: 6px; }
  .prose-quote-cite {
    display: block; margin-top: 14px;
    font-family: var(--mono); font-style: normal;
    font-size: 11px; color: var(--ink-dim);
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .prose-code {
    margin: 0 0 20px; padding: 18px 20px;
    background: var(--bg-2); border: 1px solid var(--line);
    border-left: 2px solid var(--accent);
    font-family: var(--mono); font-size: 13px;
    line-height: 1.6; color: var(--ink); overflow-x: auto;
  }
  .filter-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 10px 18px; border-radius: 999px;
    background: transparent; border: 1px solid var(--line);
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink-dim); cursor: none;
    transition: all 0.25s ease;
  }
  .filter-btn:hover  { border-color: var(--ink); color: var(--ink); }
  .filter-btn.active { background: var(--ink); color: var(--bg); border-color: var(--ink); }
  .filter-count {
    font-size: 10px; opacity: 0.6;
    padding: 2px 7px; border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
  }
  .filter-btn.active .filter-count { background: rgba(13, 13, 12, 0.15); opacity: 0.8; }

  /* ─── Motion demos ─── */
  .motion-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .motion-card { border: 1px solid var(--line); background: var(--bg-2); overflow: hidden; }
  .motion-demo { height: 140px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--line); }
  .demo-box {
    width: 64px; height: 64px;
    background: var(--accent); opacity: 0.75;
    border: 1px solid var(--accent);
  }
  .demo-text {
    font-family: var(--serif); font-size: 28px;
    font-weight: 900; color: var(--ink); letter-spacing: -0.03em;
  }
  .motion-info { padding: 16px; display: flex; flex-direction: column; gap: 4px; }
  .motion-label { font-family: var(--mono); font-size: 11px; color: var(--accent-2); }
  .motion-desc  { font-size: 12px; color: var(--ink-dim); line-height: 1.5; }

  /* ─── Bokeh preview ─── */
  .bokeh-preview {
    position: relative; height: 220px;
    background: var(--bg-2); border: 1px solid var(--line);
    overflow: hidden; border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
  }
  .bp-blob {
    position: absolute; border-radius: 50%;
    filter: blur(40px); pointer-events: none;
  }
  .bp-1 { width: 180px; height: 180px; background: radial-gradient(circle, var(--accent) 0%, transparent 70%); top: -20%; left: -5%; opacity: 0.35; }
  .bp-2 { width: 160px; height: 160px; background: radial-gradient(circle, var(--accent-2) 0%, transparent 70%); top: 10%; right: -5%; opacity: 0.25; }
  .bp-3 { width: 140px; height: 140px; background: radial-gradient(circle, #8a7ce2 0%, transparent 70%); bottom: -20%; left: 30%; opacity: 0.22; }
  .bp-label {
    position: relative; z-index: 1;
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-faint); letter-spacing: 0.12em; text-transform: uppercase;
  }

  /* ─── Responsive ─── */
  @media (max-width: 960px) {
    .ds-hero  { padding: 120px 0 40px; }
    .token-grid { grid-template-columns: repeat(2, 1fr); }
    .motion-grid { grid-template-columns: repeat(2, 1fr); }
    .type-row  { grid-template-columns: 1fr; gap: 8px; }
    .scale-row { grid-template-columns: 1fr; gap: 6px; }
    .ds-section-head { flex-direction: column; gap: 6px; }
    .filter-btn { cursor: pointer; }
  }
`;
