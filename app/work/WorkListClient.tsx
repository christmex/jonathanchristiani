"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "motion/react";
import { STATUS_LABEL, type Project, type ProjectStatus } from "@/lib/projects";
import MobileMenu from "@/app/components/MobileMenu";

type Filter = "all" | ProjectStatus;

export default function WorkListClient({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorXSpring = useSpring(cursorX, { stiffness: 300, damping: 30 });
  const cursorYSpring = useSpring(cursorY, { stiffness: 300, damping: 30 });
  const [cursorHovering, setCursorHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  const counts = useMemo(() => {
    const ongoing = projects.filter((p) => p.status === "ongoing").length;
    const production = projects.filter((p) => p.status === "production").length;
    const archived = projects.filter((p) => p.status === "archived").length;
    return { all: projects.length, ongoing, production, archived };
  }, [projects]);

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => p.status === filter);
  }, [filter, projects]);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "production", label: STATUS_LABEL.production },
    { key: "ongoing", label: STATUS_LABEL.ongoing },
    { key: "archived", label: STATUS_LABEL.archived },
  ];

  return (
    <div className="page">
      <style>{css}</style>

      <div className="bokeh" aria-hidden="true">
        <div className="bokeh-blob bokeh-blob-1" />
        <div className="bokeh-blob bokeh-blob-2" />
        <div className="bokeh-blob bokeh-blob-3" />
        <div className="bokeh-blob bokeh-blob-4" />
      </div>

      <motion.div className="progress-bar" style={{ scaleX: smoothScroll }} />

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
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/work">Work</Link></li>
            <li><Link href="/#services">Services</Link></li>
            <li><Link href="/writing">Writing</Link></li>
            <li><Link href="/#process">Process</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
          </ul>
          <Link
            href="/#contact"
            className="nav-cta"
            onMouseEnter={() => setCursorHovering(true)}
            onMouseLeave={() => setCursorHovering(false)}
          >
            Book a Call →
          </Link>
        </div>
      </motion.nav>

      <MobileMenu />

      <header className="list-hero">
        <div className="container">
          <motion.div
            className="list-breadcrumb"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/">← Back Home</Link>
            <span className="sep">·</span>
            <span>§ — Index</span>
          </motion.div>

          <motion.h1
            className="list-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Every project <em>on the record.</em>
          </motion.h1>

          <motion.div
            className="list-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {filters.map((f) => (
              <button
                key={f.key}
                className={`filter-btn ${filter === f.key ? "active" : ""}`}
                onClick={() => setFilter(f.key)}
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                <span>{f.label}</span>
                <span className="filter-count">{counts[f.key]}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </header>

      <section className="list-body">
        <div className="container">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.article
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="list-row"
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                <div className="list-year">{p.year}</div>
                <div className="list-info">
                  <div className="list-status-row">
                    <span className={`project-status project-status-${p.status}`}>
                      <span className="project-status-dot" />
                      {STATUS_LABEL[p.status]}
                    </span>
                  </div>
                  <h2 className="list-title-row">{p.title}</h2>
                  <div className="list-role">{p.role}</div>
                  <p className="list-desc">{p.desc}</p>
                  <div className="list-tags">
                    {p.tags.map((t) => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                  </div>
                  <div className="list-links">
                    {p.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target={l.external ? "_blank" : undefined}
                        rel={l.external ? "noopener noreferrer" : undefined}
                        className="list-link"
                      >
                        <span>{l.label}</span>
                        <span className="arrow">{l.external ? "↗" : "→"}</span>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="list-visual">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 960px) 100vw, 40vw"
                      className="list-visual-img"
                    />
                  ) : (
                    <div className="list-visual-fallback">
                      <span>{p.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="list-empty">Nothing in this bucket yet.</div>
          )}
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-inner">
            <div>© 2026 JONATHAN CHRISTIANI</div>
            <div>BATAM · INDONESIA · GMT+7</div>
            <div>
              I KNOW THAT I KNOW NOTHING · <Link href="/">↑ BACK HOME</Link>
            </div>
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
    background-image: repeating-linear-gradient(
      to bottom,
      transparent 0 2px,
      rgba(255, 255, 255, 0.012) 2px 3px
    );
  }

  .bokeh { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .bokeh-blob {
    position: absolute;
    width: 55vw; height: 55vw;
    border-radius: 50%;
    filter: blur(130px);
    opacity: 0.22;
    will-change: transform;
  }
  .bokeh-blob-1 { background: radial-gradient(circle, var(--accent) 0%, transparent 70%); top: -18%; left: -12%; animation: bokeh-float-1 32s ease-in-out infinite alternate; }
  .bokeh-blob-2 { background: radial-gradient(circle, var(--accent-2) 0%, transparent 70%); top: 28%; right: -18%; opacity: 0.14; animation: bokeh-float-2 44s ease-in-out infinite alternate; }
  .bokeh-blob-3 { background: radial-gradient(circle, #8a7ce2 0%, transparent 70%); bottom: -14%; left: 22%; opacity: 0.13; animation: bokeh-float-3 38s ease-in-out infinite alternate; }
  .bokeh-blob-4 { background: radial-gradient(circle, var(--accent) 0%, transparent 70%); top: 58%; left: 42%; width: 40vw; height: 40vw; opacity: 0.1; animation: bokeh-float-4 52s ease-in-out infinite alternate; }
  @keyframes bokeh-float-1 { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(10vw, 8vh) scale(1.12); } 100% { transform: translate(-6vw, 16vh) scale(0.9); } }
  @keyframes bokeh-float-2 { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(-13vw, 11vh) scale(1.18); } 100% { transform: translate(9vw, -9vh) scale(0.95); } }
  @keyframes bokeh-float-3 { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(16vw, -11vh) scale(1.08); } 100% { transform: translate(-9vw, -16vh) scale(1.22); } }
  @keyframes bokeh-float-4 { 0% { transform: translate(0,0) scale(0.9); } 50% { transform: translate(-12vw, -14vh) scale(1.1); } 100% { transform: translate(14vw, 12vh) scale(1); } }
  section, nav, header, footer { position: relative; z-index: 1; }
  @media (prefers-reduced-motion: reduce) { .bokeh-blob { animation: none; } }

  .progress-bar {
    position: fixed; top: 0; left: 0; right: 0;
    height: 2px; background: var(--accent);
    transform-origin: 0%; z-index: 200;
  }
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

  .container { max-width: 1320px; margin: 0 auto; padding: 0 40px; }

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
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a { color: var(--ink-dim); text-decoration: none; transition: color 0.2s; }
  .nav-links a:hover { color: var(--ink); }
  .nav-cta { color: var(--ink); text-decoration: none; padding: 8px 16px; border: 1px solid var(--ink); border-radius: 999px; display: inline-block; }

  .list-hero {
    padding: 160px 0 40px;
  }
  .list-breadcrumb {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); text-transform: uppercase;
    letter-spacing: 0.15em;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 36px;
  }
  .list-breadcrumb a { color: var(--ink-dim); text-decoration: none; transition: color 0.2s ease; }
  .list-breadcrumb a:hover { color: var(--accent); }
  .list-breadcrumb .sep { color: var(--ink-faint); }

  .list-title {
    font-family: var(--serif);
    font-size: clamp(44px, 7.2vw, 112px);
    line-height: 0.96;
    font-weight: 400;
    letter-spacing: -0.035em;
    margin-bottom: 60px;
    max-width: 1100px;
  }
  .list-title em { font-style: italic; color: var(--accent-2); }

  .list-filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    padding-top: 24px;
    border-top: 1px solid var(--line);
  }
  .filter-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px;
    border-radius: 999px;
    background: transparent;
    border: 1px solid var(--line);
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-dim);
    cursor: none;
    transition: all 0.25s ease;
  }
  .filter-btn:hover { border-color: var(--ink); color: var(--ink); }
  .filter-btn.active {
    background: var(--ink);
    color: var(--bg);
    border-color: var(--ink);
  }
  .filter-count {
    font-size: 10px;
    opacity: 0.6;
    padding: 2px 7px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
  }
  .filter-btn.active .filter-count { background: rgba(13, 13, 12, 0.15); opacity: 0.8; }

  .list-body { padding: 40px 0 120px; }

  .list-row {
    display: grid;
    grid-template-columns: 100px 1.3fr 1fr;
    gap: 48px;
    padding: 48px 0;
    border-top: 1px solid var(--line);
    align-items: start;
  }
  .list-row:last-of-type { border-bottom: 1px solid var(--line); }

  .list-year {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--ink-dim);
    padding-top: 6px;
  }

  .list-status-row {
    display: flex;
    margin-bottom: 16px;
  }
  .project-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 10px;
    border: 1px solid var(--line);
    border-radius: 999px;
    font-family: var(--mono);
    font-size: 10px;
    color: var(--ink-dim);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .project-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    display: inline-block;
  }
  .project-status-production .project-status-dot { background: #2ecc71; box-shadow: 0 0 8px #2ecc71; }
  .project-status-ongoing .project-status-dot { background: var(--accent); box-shadow: 0 0 8px var(--accent); animation: pulse 1.6s ease-in-out infinite; }
  .project-status-archived { color: var(--ink-faint); border-style: dashed; }
  .project-status-archived .project-status-dot { background: var(--ink-faint); box-shadow: none; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .list-title-row {
    font-family: var(--serif);
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
  }
  .list-role {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 16px;
  }
  .list-desc {
    color: var(--ink-dim);
    font-size: 14px;
    line-height: 1.65;
    margin-bottom: 20px;
    max-width: 520px;
  }
  .list-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 22px; }
  .chip {
    font-family: var(--mono);
    font-size: 10px;
    padding: 4px 10px;
    border: 1px solid var(--line);
    color: var(--ink-dim);
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .list-links {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding-top: 18px;
    border-top: 1px dashed var(--line);
  }
  .list-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    text-decoration: none;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: color 0.2s ease, gap 0.2s ease;
  }
  .list-link:hover { color: var(--accent); gap: 12px; }

  .list-visual {
    aspect-ratio: 4/3;
    background: var(--bg-2);
    border: 1px solid var(--line);
    position: relative;
    overflow: hidden;
    border-radius: 2px;
  }
  .list-visual-img {
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .list-row:hover .list-visual-img { transform: scale(1.03); }
  .list-visual-fallback {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--serif);
    font-size: 120px;
    color: var(--ink-faint);
    letter-spacing: -0.04em;
  }

  .list-empty {
    padding: 80px 0;
    text-align: center;
    font-family: var(--mono);
    font-size: 13px;
    color: var(--ink-faint);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  footer {
    border-top: 1px solid var(--line);
    padding: 40px 0 30px;
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
    .nav-links { display: none; }
    .list-hero { padding: 120px 0 30px; }
    .list-row { grid-template-columns: 1fr; gap: 20px; padding: 36px 0; }
    .list-year { display: none; }
    .filter-btn, .nav-cta, a, button { cursor: pointer; }
  }
`;
