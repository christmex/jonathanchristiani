"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorXSpring = useSpring(cursorX, { stiffness: 300, damping: 30 });
  const cursorYSpring = useSpring(cursorY, { stiffness: 300, damping: 30 });
  const [cursorHovering, setCursorHovering] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.error("Caught by app/error.tsx:", error);
    }
  }, [error]);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  const shortMsg = error?.message?.length > 260 ? error.message.slice(0, 260) + "…" : error?.message || "No message";

  return (
    <div className="page">
      <style>{css}</style>

      <div className="bokeh" aria-hidden="true">
        <div className="bokeh-blob bokeh-blob-1" />
        <div className="bokeh-blob bokeh-blob-2" />
      </div>

      <motion.div
        className={`cursor ${cursorHovering ? "hover" : ""}`}
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />

      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <motion.span
              className="nav-dot"
              animate={{ scale: [1, 0.85, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            JONATHAN CHRISTIANI
          </Link>
          <Link
            href="/#contact"
            className="nav-cta"
            onMouseEnter={() => setCursorHovering(true)}
            onMouseLeave={() => setCursorHovering(false)}
          >
            Get in Touch →
          </Link>
        </div>
      </motion.nav>

      <main className="err-main">
        <div className="container">
          <motion.div
            className="err-breadcrumb"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="err-status">STATUS</span>
            <span className="sep">·</span>
            <span className="err-code">500</span>
            <span className="sep">·</span>
            <span>UNCAUGHT_EXCEPTION</span>
            {error?.digest && (
              <>
                <span className="sep">·</span>
                <span>DIGEST {error.digest}</span>
              </>
            )}
          </motion.div>

          <motion.div
            className="err-number-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="err-number">500</span>
            <motion.span
              className="err-number-ghost"
              aria-hidden="true"
              animate={{ opacity: [0.12, 0.3, 0.12], x: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              500
            </motion.span>
          </motion.div>

          <motion.h1
            className="err-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            Something <em>threw.</em>
          </motion.h1>

          <motion.p
            className="err-lede"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            A runtime exception bubbled all the way up. That&apos;s on me, not you.
            You can retry, head home, or ping me with the digest below so I can attach a debugger.
          </motion.p>

          <motion.div
            className="err-log"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            aria-hidden="true"
          >
            <div className="err-log-line"><span className="err-log-prompt">$</span> render(page)</div>
            <div className="err-log-line err-log-err">→ throw {shortMsg}</div>
            <div className="err-log-line"><span className="err-log-prompt">$</span> suggest(next_move)</div>
            <div className="err-log-line err-log-ok">→ try again or head home</div>
          </motion.div>

          <motion.div
            className="err-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => reset()}
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}
            >
              ↻ Retry
            </button>
            <Link
              href="/"
              className="btn btn-ghost"
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}
            >
              ← Back Home
            </Link>
            <Link
              href="/#contact"
              className="btn btn-ghost"
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}
            >
              Report a Bug <span className="arrow">↗</span>
            </Link>
          </motion.div>
        </div>
      </main>

      <footer>
        <div className="container">
          <div className="footer-inner">
            <div>© 2026 JONATHAN CHRISTIANI</div>
            <div>BATAM · INDONESIA · GMT+7</div>
            <div>I KNOW THAT I KNOW NOTHING · <Link href="/">↑ BACK HOME</Link></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const css = `
  :root {
    --bg: #0d0d0c;
    --bg-2: #141412;
    --ink: #ecece6;
    --ink-dim: #9a9a92;
    --ink-faint: #4a4a44;
    --accent: #ff5c2e;
    --accent-2: #eadfc8;
    --line: #2a2a26;
    --mono: 'JetBrains Mono', ui-monospace, monospace;
    --serif: 'Fraunces', 'Times New Roman', serif;
    --sans: 'Inter', -apple-system, system-ui, sans-serif;
  }
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,900&family=Inter:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); }

  .page {
    background: var(--bg);
    color: var(--ink);
    font-family: var(--sans);
    font-size: 15px;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    position: relative;
    cursor: none;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .page::before {
    content: '';
    position: fixed; inset: 0;
    pointer-events: none; z-index: 100;
    opacity: 0.35; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  }
  .page::after {
    content: '';
    position: fixed; inset: 0;
    pointer-events: none; z-index: 99;
    opacity: 0.45;
    background-image: repeating-linear-gradient(to bottom, transparent 0 2px, rgba(255, 255, 255, 0.012) 2px 3px);
  }

  .bokeh { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .bokeh-blob {
    position: absolute;
    width: 55vw; height: 55vw;
    border-radius: 50%;
    filter: blur(130px);
    opacity: 0.24;
    will-change: transform;
  }
  .bokeh-blob-1 { background: radial-gradient(circle, var(--accent) 0%, transparent 70%); top: -22%; left: -14%; animation: bokeh-float-1 28s ease-in-out infinite alternate; }
  .bokeh-blob-2 { background: radial-gradient(circle, #c44d22 0%, transparent 70%); bottom: -22%; right: -18%; opacity: 0.2; animation: bokeh-float-2 36s ease-in-out infinite alternate; }
  @keyframes bokeh-float-1 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-6vw, 16vh) scale(0.9); } }
  @keyframes bokeh-float-2 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(9vw, -9vh) scale(1.12); } }
  @media (prefers-reduced-motion: reduce) { .bokeh-blob { animation: none; } }

  nav, main, footer { position: relative; z-index: 1; }

  .cursor {
    position: fixed; top: 0; left: 0;
    width: 12px; height: 12px;
    border-radius: 50%;
    background: var(--accent);
    pointer-events: none; z-index: 9999;
    mix-blend-mode: difference;
    transform: translate(-50%, -50%);
    transition: width 0.25s, height 0.25s, background 0.25s;
  }
  .cursor.hover { width: 40px; height: 40px; background: var(--accent-2); }

  .container { max-width: 1320px; margin: 0 auto; padding: 0 40px; width: 100%; }

  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    background: rgba(13, 13, 12, 0.72);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--line);
  }
  .nav-inner {
    max-width: 1320px; margin: 0 auto; padding: 18px 40px;
    display: flex; align-items: center; justify-content: space-between;
    font-family: var(--mono); font-size: 12px;
    letter-spacing: 0.05em; text-transform: uppercase;
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; font-weight: 700; color: var(--ink); text-decoration: none; }
  .nav-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 16px var(--accent); display: inline-block; }
  .nav-cta { color: var(--ink); text-decoration: none; padding: 8px 16px; border: 1px solid var(--ink); border-radius: 999px; display: inline-block; }

  .err-main {
    flex: 1;
    padding: 180px 0 100px;
    display: flex;
    align-items: center;
  }
  .err-breadcrumb {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }
  .err-breadcrumb .sep { color: var(--ink-faint); }
  .err-status { color: var(--ink-faint); }
  .err-code { color: var(--accent); font-weight: 700; }

  .err-number-wrap {
    position: relative;
    line-height: 0.85;
    margin-bottom: 12px;
  }
  .err-number, .err-number-ghost {
    font-family: var(--serif);
    font-weight: 900;
    font-size: clamp(120px, 22vw, 280px);
    letter-spacing: -0.04em;
    color: var(--ink);
    display: inline-block;
  }
  .err-number-ghost {
    position: absolute;
    top: 0; left: 0;
    color: transparent;
    -webkit-text-stroke: 1px var(--accent);
    text-stroke: 1px var(--accent);
    pointer-events: none;
  }

  .err-title {
    font-family: var(--serif);
    font-size: clamp(36px, 5.4vw, 76px);
    line-height: 1.02;
    font-weight: 400;
    letter-spacing: -0.03em;
    margin-bottom: 24px;
    max-width: 900px;
  }
  .err-title em { font-style: italic; color: var(--accent-2); }

  .err-lede {
    font-size: 17px;
    line-height: 1.65;
    color: var(--ink-dim);
    max-width: 620px;
    margin-bottom: 40px;
  }

  .err-log {
    font-family: var(--mono);
    font-size: 13px;
    line-height: 1.9;
    color: var(--ink-dim);
    border: 1px solid var(--line);
    background: var(--bg-2);
    padding: 22px 26px;
    margin-bottom: 44px;
    max-width: 720px;
    word-break: break-word;
  }
  .err-log-line { display: block; }
  .err-log-prompt { color: var(--ink-faint); margin-right: 10px; }
  .err-log-err { color: var(--accent); }
  .err-log-ok { color: var(--accent-2); }

  .err-actions {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 22px;
    border-radius: 999px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    border: 1px solid var(--line);
    transition: all 0.25s ease;
    cursor: none;
    background: transparent;
    color: inherit;
    font-weight: inherit;
  }
  .btn-primary {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--bg);
  }
  .btn-primary:hover { background: var(--accent-2); border-color: var(--accent-2); }
  .btn-ghost {
    color: var(--ink);
    border-color: var(--line);
  }
  .btn-ghost:hover { border-color: var(--ink); color: var(--accent-2); }
  .arrow { display: inline-block; transition: transform 0.25s ease; }
  .btn:hover .arrow { transform: translate(3px, -3px); }

  footer {
    border-top: 1px solid var(--line);
    padding: 30px 0 24px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    letter-spacing: 0.08em;
  }
  .footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  .footer-inner a { color: var(--ink-dim); text-decoration: none; }

  @media (max-width: 960px) {
    .page { cursor: auto; }
    .cursor { display: none; }
    .container { padding: 0 24px; }
    .nav-inner { padding: 16px 24px; }
    .err-main { padding: 130px 0 60px; }
    .err-actions .btn { flex: 1 1 auto; justify-content: center; }
    .nav-cta, a, button { cursor: pointer; }
  }
`;
