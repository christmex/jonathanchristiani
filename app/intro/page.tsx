"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { ArrowRight, RotateCcw } from "lucide-react";
import PageShell from "@/app/components/PageShell";
import { useCursor } from "@/app/hooks/useCursor";

/* ── Timeline ─────────────────────────────────────────────────────────────
   10-second kinetic-typography reveal introducing the new site and walking
   through every top-level menu.

   Total: 10s + a beat for the end state.
   ────────────────────────────────────────────────────────────────────── */

type Frame =
  | { kind: "hero";  pre: string;  main: string;  emphasis?: boolean }
  | { kind: "menu";  num: string;  label: string; desc: string }
  | { kind: "brand"; text: string; sub: string }
  | { kind: "url";   text: string; sub: string };

const TIMELINE: Array<{ at: number; frame: Frame }> = [
  { at:    0, frame: { kind: "hero",  pre: "Just",      main: "released.",                emphasis: true } },
  { at: 1200, frame: { kind: "hero",  pre: "A brand",   main: "new portfolio."                           } },
  { at: 2400, frame: { kind: "menu",  num: "01", label: "Home",     desc: "where it all begins"         } },
  { at: 3200, frame: { kind: "menu",  num: "02", label: "Work",     desc: "selected case studies"       } },
  { at: 4000, frame: { kind: "menu",  num: "03", label: "Services", desc: "what I build for clients"    } },
  { at: 4800, frame: { kind: "menu",  num: "04", label: "Writing",  desc: "essays on craft & process"   } },
  { at: 5600, frame: { kind: "menu",  num: "05", label: "Slides",   desc: "decks from talks & pitches"  } },
  { at: 6400, frame: { kind: "menu",  num: "06", label: "Process",  desc: "how I work with clients"     } },
  { at: 7200, frame: { kind: "menu",  num: "07", label: "Contact",  desc: "let's build something"       } },
  { at: 8000, frame: { kind: "brand", text: "JONATHAN CHRISTIANI",  sub: "Fullstack → AI Native Engineer" } },
  { at: 9000, frame: { kind: "url",   text: "jonathanchristiani.com", sub: "Explore the new site." } },
];

const DURATION = 10000;

const wordParent: Variants = {
  hidden: { transition: { staggerChildren: 0.05 } },
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  exit:   { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const wordChild: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, y: -16, filter: "blur(6px)", transition: { duration: 0.25, ease: "easeIn" } },
};

function Words({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span className={className} variants={wordParent} initial="hidden" animate="show" exit="exit">
      {text.split(" ").map((w, i) => (
        <motion.span key={`${w}-${i}`} variants={wordChild} style={{ display: "inline-block", marginRight: "0.22em" }}>
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function IntroPage() {
  const { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering } = useCursor();
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [tick, setTick] = useState(0); // bump to replay

  useEffect(() => {
    setIdx(0);
    setDone(false);
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    TIMELINE.forEach((step, i) => {
      timeouts.push(setTimeout(() => setIdx(i), step.at));
    });
    timeouts.push(setTimeout(() => setDone(true), DURATION));
    return () => timeouts.forEach(clearTimeout);
  }, [tick]);

  // progress bar (0 → 1) across the full 10s
  const progressKey = `progress-${tick}`;

  const current = TIMELINE[idx].frame;

  return (
    <PageShell
      cursorXSpring={cursorXSpring}
      cursorYSpring={cursorYSpring}
      cursorHovering={cursorHovering}
      blobs={3}
    >
      <style>{css}</style>

      {/* skip link */}
      <div className="intro-top">
        <Link
          href="/"
          className="intro-skip"
          onMouseEnter={() => setCursorHovering(true)}
          onMouseLeave={() => setCursorHovering(false)}
        >
          skip intro →
        </Link>
      </div>

      {/* main stage */}
      <div className="intro-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${tick}-${idx}`}
            className="intro-frame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {current.kind === "hero" && (
              <div className="intro-hero">
                <Words text={current.pre} className="intro-hero-pre" />
                <br />
                <Words
                  text={current.main}
                  className={`intro-hero-main${current.emphasis ? " intro-hero-accent" : ""}`}
                />
              </div>
            )}

            {current.kind === "menu" && (
              <div className="intro-menu">
                <motion.div
                  className="intro-menu-num"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {current.num} / 07
                </motion.div>
                <Words text={current.label} className="intro-menu-label" />
                <motion.div
                  className="intro-menu-desc"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  — {current.desc}
                </motion.div>
              </div>
            )}

            {current.kind === "brand" && (
              <div className="intro-brand">
                <motion.div
                  className="intro-brand-text"
                  initial={{ letterSpacing: "0.4em", opacity: 0 }}
                  animate={{ letterSpacing: "0.08em", opacity: 1 }}
                  exit={{ letterSpacing: "0.02em", opacity: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  {current.text}
                </motion.div>
                <motion.div
                  className="intro-brand-sub"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  {current.sub}
                </motion.div>
              </div>
            )}

            {current.kind === "url" && (
              <div className="intro-url">
                <motion.div
                  className="intro-url-sub"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {current.sub}
                </motion.div>
                <motion.div
                  className="intro-url-text"
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  jonathanchristiani<span className="intro-url-dot">.</span>com
                </motion.div>
                <motion.div
                  className="intro-url-line"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* end-state CTAs (appear after the 10s) */}
        <AnimatePresence>
          {done && (
            <motion.div
              className="intro-cta-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/"
                className="intro-cta intro-cta-primary"
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                <span className="inline-icon">Enter the site <ArrowRight size={14} strokeWidth={1.75} /></span>
              </Link>
              <button
                type="button"
                className="intro-cta intro-cta-ghost"
                onClick={() => setTick((t) => t + 1)}
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                <span className="inline-icon"><RotateCcw size={12} strokeWidth={1.75} /> replay</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* progress bar */}
      <div className="intro-progress">
        <motion.div
          key={progressKey}
          className="intro-progress-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: done ? 1 : 1 }}
          transition={{ duration: DURATION / 1000, ease: "linear" }}
        />
      </div>

      {/* corner captions */}
      <div className="intro-caption intro-caption-bl" aria-hidden="true">
        <span>JONATHAN CHRISTIANI</span>
        <span className="sep">·</span>
        <span>2026 RELAUNCH</span>
      </div>
      <div className="intro-caption intro-caption-br" aria-hidden="true">
        <span>◉</span>
        <span>RUNNING</span>
      </div>
    </PageShell>
  );
}

const css = `
  .intro-stage {
    min-height: 100dvh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 40px;
    position: relative; z-index: 2;
  }

  .intro-frame {
    width: 100%; max-width: 1200px;
    text-align: center;
  }

  .intro-top {
    position: fixed; top: 28px; right: 32px; z-index: 50;
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.14em; text-transform: uppercase;
  }
  .intro-skip {
    color: var(--ink-faint); text-decoration: none;
    transition: color 0.2s ease;
  }
  .intro-skip:hover { color: var(--accent); }

  /* ── Hero frames ─────────────────────────────── */
  .intro-hero {
    font-family: var(--serif);
    font-weight: 400; letter-spacing: -0.035em;
    line-height: 0.98;
  }
  .intro-hero-pre {
    display: inline-block;
    font-size: clamp(30px, 4vw, 60px);
    color: var(--ink-dim); font-style: italic;
    margin-bottom: 10px;
  }
  .intro-hero-main {
    display: inline-block;
    font-size: clamp(60px, 10vw, 160px);
    color: var(--ink);
  }
  .intro-hero-accent { color: var(--accent); }

  /* ── Menu frames ────────────────────────────── */
  .intro-menu { display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .intro-menu-num {
    font-family: var(--mono); font-size: 12px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--accent); padding: 6px 14px;
    border: 1px solid var(--accent); background: rgba(255,92,46,0.06);
  }
  .intro-menu-label {
    display: inline-block;
    font-family: var(--serif); font-weight: 400;
    font-size: clamp(72px, 13vw, 220px);
    letter-spacing: -0.05em; line-height: 0.92;
    color: var(--ink);
    font-style: italic;
  }
  .intro-menu-desc {
    font-family: var(--mono); font-size: clamp(14px, 1.6vw, 20px);
    letter-spacing: 0.06em; color: var(--ink-dim);
    max-width: 620px;
  }

  /* ── Brand frame ────────────────────────────── */
  .intro-brand { display: flex; flex-direction: column; align-items: center; gap: 24px; }
  .intro-brand-text {
    font-family: var(--mono); font-weight: 700;
    font-size: clamp(32px, 5.2vw, 78px);
    color: var(--ink);
  }
  .intro-brand-sub {
    font-family: var(--serif); font-style: italic;
    font-size: clamp(18px, 2.2vw, 30px);
    color: var(--accent);
  }

  /* ── URL frame ───────────────────────────── */
  .intro-url { display: flex; flex-direction: column; align-items: center; gap: 24px; }
  .intro-url-sub {
    font-family: var(--mono); font-size: clamp(12px, 1.2vw, 14px);
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--ink-dim);
  }
  .intro-url-text {
    font-family: var(--serif); font-weight: 400;
    font-size: clamp(40px, 7.5vw, 120px);
    letter-spacing: -0.035em; color: var(--ink);
  }
  .intro-url-dot { color: var(--accent); }
  .intro-url-line {
    width: 120px; height: 2px; background: var(--accent);
    transform-origin: left center;
  }

  /* ── End CTA row ──────────────────────────── */
  .intro-cta-row {
    position: absolute; bottom: 96px; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 14px; align-items: center;
  }
  .intro-cta {
    font-family: var(--mono); font-size: 12px;
    letter-spacing: 0.14em; text-transform: uppercase;
    padding: 14px 22px; text-decoration: none;
    cursor: pointer; border: none;
    transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
  }
  .intro-cta-primary {
    background: var(--accent); color: var(--bg);
  }
  .intro-cta-primary:hover { transform: translateY(-2px); }
  .intro-cta-ghost {
    background: transparent; color: var(--ink-dim);
    border: 1px solid var(--line);
  }
  .intro-cta-ghost:hover { color: var(--ink); border-color: var(--ink-dim); }

  /* ── Progress bar ─────────────────────────── */
  .intro-progress {
    position: fixed; left: 0; right: 0; bottom: 0;
    height: 2px; background: var(--line); z-index: 50;
  }
  .intro-progress-fill {
    height: 100%; background: var(--accent);
    transform-origin: left center;
  }

  /* ── Corner captions ──────────────────────── */
  .intro-caption {
    position: fixed; z-index: 50;
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--ink-faint);
    display: flex; align-items: center; gap: 8px;
  }
  .intro-caption .sep { color: var(--line); }
  .intro-caption-bl { bottom: 20px; left: 24px; }
  .intro-caption-br { bottom: 20px; right: 24px; }
  .intro-caption-br > span:first-child { color: var(--accent); animation: pulse 1.6s ease-in-out infinite; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.3; }
  }

  @media (max-width: 760px) {
    .intro-stage { padding: 60px 20px; }
    .intro-cta-row { bottom: 64px; flex-direction: column; }
    .intro-caption-bl { left: 16px; bottom: 12px; font-size: 9px; }
    .intro-caption-br { right: 16px; bottom: 12px; font-size: 9px; }
  }
`;
