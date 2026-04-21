"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

export default function NotFoundClient() {
  const { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering } = useCursor();

  return (
    <PageShell
      cursorXSpring={cursorXSpring}
      cursorYSpring={cursorYSpring}
      cursorHovering={cursorHovering}
      blobs={3}
    >
      <style>{css}</style>
      <SiteNav setCursorHovering={setCursorHovering} />

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
            <span className="err-code">404</span>
            <span className="sep">·</span>
            <span>NO_SUCH_ROUTE</span>
          </motion.div>

          <motion.div
            className="err-number-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="err-number">404</span>
            <motion.span
              className="err-number-ghost"
              aria-hidden="true"
              animate={{ opacity: [0.12, 0.25, 0.12], x: [-2, 2, -2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              404
            </motion.span>
          </motion.div>

          <motion.h1
            className="err-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            This route <em>returned null.</em>
          </motion.h1>

          <motion.p
            className="err-lede"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            Either the link is stale, the slug is wrong, or I refactored something without a redirect.
            The debugger says: nothing here. Let&apos;s get you back to somewhere real.
          </motion.p>

          <motion.div
            className="err-log"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            aria-hidden="true"
          >
            <div className="err-log-line"><span className="err-log-prompt">$</span> fetch(requested_path)</div>
            <div className="err-log-line err-log-err">→ null</div>
            <div className="err-log-line"><span className="err-log-prompt">$</span> suggest(next_move)</div>
            <div className="err-log-line err-log-ok">→ head home</div>
          </motion.div>

          <motion.div
            className="err-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
          >
            <Link
              href="/"
              className="btn btn-primary"
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}
            >
              <ArrowLeft size={14} strokeWidth={1.75} /> Back Home
            </Link>
            <Link
              href="/writing"
              className="btn btn-ghost"
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}
            >
              Read Notes <span className="arrow"><ArrowUpRight size={14} strokeWidth={1.75} /></span>
            </Link>
            <Link
              href="/#contact"
              className="btn btn-ghost"
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}
            >
              Report a Bug <span className="arrow"><ArrowUpRight size={14} strokeWidth={1.75} /></span>
            </Link>
          </motion.div>
        </div>
      </main>

      <SiteFooter />
    </PageShell>
  );
}

const css = `
  /* Full-height layout so footer sticks to bottom */
  .page { display: flex; flex-direction: column; }

  .err-main {
    flex: 1; padding: 180px 0 100px;
    display: flex; align-items: center;
  }
  .err-breadcrumb {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); text-transform: uppercase;
    letter-spacing: 0.18em;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 30px; flex-wrap: wrap;
  }
  .err-breadcrumb .sep { color: var(--ink-faint); }
  .err-status { color: var(--ink-faint); }
  .err-code   { color: var(--accent); font-weight: 700; }

  .err-number-wrap { position: relative; line-height: 0.85; margin-bottom: 12px; }
  .err-number, .err-number-ghost {
    font-family: var(--serif); font-weight: 900;
    font-size: clamp(120px, 22vw, 280px);
    letter-spacing: -0.04em; color: var(--ink); display: inline-block;
  }
  .err-number-ghost {
    position: absolute; top: 0; left: 0;
    color: transparent;
    -webkit-text-stroke: 1px var(--accent);
    text-stroke: 1px var(--accent);
    pointer-events: none;
  }

  .err-title {
    font-family: var(--serif);
    font-size: clamp(36px, 5.4vw, 76px);
    line-height: 1.02; font-weight: 400;
    letter-spacing: -0.03em;
    margin-bottom: 24px; max-width: 900px;
  }
  .err-title em { font-style: italic; color: var(--accent-2); }

  .err-lede { font-size: 17px; line-height: 1.65; color: var(--ink-dim); max-width: 620px; margin-bottom: 40px; }

  .err-log {
    font-family: var(--mono); font-size: 13px; line-height: 1.9;
    color: var(--ink-dim); border: 1px solid var(--line);
    background: var(--bg-2); padding: 22px 26px;
    margin-bottom: 44px; max-width: 620px;
  }
  .err-log-line   { display: block; }
  .err-log-prompt { color: var(--ink-faint); margin-right: 10px; }
  .err-log-err    { color: var(--accent); }
  .err-log-ok     { color: var(--accent-2); }

  .err-actions { display: flex; gap: 14px; flex-wrap: wrap; }
  .arrow { display: inline-block; transition: transform 0.25s ease; }
  .btn:hover .arrow { transform: translate(3px, -3px); }

  @media (max-width: 960px) {
    .err-main { padding: 130px 0 60px; }
    .err-actions .btn { flex: 1 1 auto; justify-content: center; }
  }
`;
