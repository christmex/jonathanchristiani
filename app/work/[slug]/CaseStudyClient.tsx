"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  type Variants,
} from "motion/react";
import type { Project } from "@/lib/projects";
import MobileMenu from "@/app/components/MobileMenu";

export default function CaseStudyClient({ project }: { project: Project }) {
  const cs = project.caseStudy!;

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

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  const sections: { num: string; title: string; body: string }[] = [
    { num: "01", title: "Overview", body: cs.overview },
    { num: "02", title: "Background", body: cs.background },
    { num: "03", title: "My Role", body: cs.myRole },
    { num: "04", title: "Impact", body: cs.impact },
    ...(cs.learned ? [{ num: "05", title: "What I Learned", body: cs.learned }] : []),
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

      <header className="case-hero">
        <div className="container">
          <motion.div
            className="case-breadcrumb"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/work">← Back to Work</Link>
            <span className="sep">·</span>
            <span>{project.year}</span>
          </motion.div>

          <motion.h1
            className="case-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {project.title}
          </motion.h1>
          <motion.div
            className="case-role"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {project.role}
          </motion.div>
          <motion.p
            className="case-lede"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {project.desc}
          </motion.p>

          <motion.div
            className="case-meta-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="case-meta-cell">
              <div className="case-meta-label">Year</div>
              <div className="case-meta-value">{project.year}</div>
            </div>
            <div className="case-meta-cell">
              <div className="case-meta-label">Role</div>
              <div className="case-meta-value">{project.role.split("·")[1]?.trim() || project.role}</div>
            </div>
            <div className="case-meta-cell">
              <div className="case-meta-label">Stack</div>
              <div className="case-meta-value">
                {(cs.stack ?? project.tags).join(" · ")}
              </div>
            </div>
            <div className="case-meta-cell">
              <div className="case-meta-label">Links</div>
              <div className="case-meta-value case-links">
                {project.links
                  .filter((l) => l.external)
                  .map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setCursorHovering(true)}
                      onMouseLeave={() => setCursorHovering(false)}
                    >
                      {l.label} ↗
                    </a>
                  ))}
                {project.links.filter((l) => l.external).length === 0 && (
                  <span className="case-meta-muted">Internal / NDA</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {project.image && (
        <motion.div
          className="case-cover"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="container">
            <div className="case-cover-frame">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 960px) 100vw, 1240px"
                className="case-cover-img"
                priority
              />
            </div>
          </div>
        </motion.div>
      )}

      <section className="case-body">
        <div className="container">
          {sections.map((s, i) => (
            <motion.div
              key={s.num}
              className="case-section"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.05 }}
            >
              <div className="case-section-num">§ {s.num}</div>
              <div className="case-section-content">
                <h2 className="case-section-title">{s.title}</h2>
                <p className="case-section-body">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="case-next">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="case-next-label">§ — Next</div>
            <h2 className="case-next-title">
              Have something <em>similar</em> to ship?
            </h2>
            <div className="case-next-actions">
              <Link
                href="/#contact"
                className="btn btn-primary"
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                Start a Project <span className="arrow">↗</span>
              </Link>
              <Link
                href="/work"
                className="btn btn-ghost"
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                See Other Work <span className="arrow">→</span>
              </Link>
            </div>
          </motion.div>
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
  html { scroll-behavior: smooth; }
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
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
    transform-origin: 0%;
    z-index: 200;
  }

  .cursor {
    position: fixed;
    top: 0; left: 0;
    width: 12px; height: 12px;
    border-radius: 50%;
    background: var(--accent);
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transform: translate(-50%, -50%);
    transition: width 0.25s, height 0.25s, background 0.25s;
  }
  .cursor.hover {
    width: 40px; height: 40px;
    background: var(--accent-2);
  }

  .container {
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 40px;
  }

  nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 50;
    background: rgba(13, 13, 12, 0.72);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--line);
  }
  .nav-inner {
    max-width: 1320px; margin: 0 auto;
    padding: 18px 40px;
    display: flex; align-items: center; justify-content: space-between;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-weight: 700; color: var(--ink); text-decoration: none;
  }
  .nav-dot {
    width: 8px; height: 8px;
    background: var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 16px var(--accent);
    display: inline-block;
  }
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a {
    color: var(--ink-dim);
    text-decoration: none;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--ink); }
  .nav-cta {
    color: var(--ink); text-decoration: none;
    padding: 8px 16px;
    border: 1px solid var(--ink);
    border-radius: 999px;
    display: inline-block;
  }

  .case-hero {
    padding: 160px 0 60px;
    position: relative;
  }
  .case-breadcrumb {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 40px;
  }
  .case-breadcrumb a {
    color: var(--ink-dim);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  .case-breadcrumb a:hover { color: var(--accent); }
  .case-breadcrumb .sep { color: var(--ink-faint); }

  .case-title {
    font-family: var(--serif);
    font-size: clamp(48px, 8vw, 128px);
    line-height: 0.96;
    font-weight: 400;
    letter-spacing: -0.035em;
    color: var(--ink);
    margin-bottom: 24px;
    max-width: 1100px;
  }
  .case-role {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 28px;
  }
  .case-lede {
    font-family: var(--serif);
    font-size: clamp(20px, 2vw, 26px);
    line-height: 1.5;
    font-weight: 300;
    color: var(--ink-dim);
    max-width: 820px;
    margin-bottom: 64px;
  }

  .case-meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--line);
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }
  .case-meta-cell {
    background: var(--bg);
    padding: 22px 24px;
  }
  .case-meta-label {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--ink-dim);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .case-meta-value {
    font-family: var(--serif);
    font-size: 17px;
    color: var(--ink);
    line-height: 1.35;
  }
  .case-meta-muted { color: var(--ink-faint); font-size: 14px; }
  .case-links {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.05em;
  }
  .case-links a {
    color: var(--ink);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  .case-links a:hover { color: var(--accent); }

  .case-cover {
    padding: 80px 0 40px;
  }
  .case-cover-frame {
    position: relative;
    aspect-ratio: 16/9;
    border: 1px solid var(--line);
    border-radius: 2px;
    overflow: hidden;
    background: var(--bg-2);
  }
  .case-cover-img { object-fit: cover; }

  .case-body {
    padding: 60px 0 80px;
  }
  .case-section {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 40px;
    padding: 56px 0;
    border-top: 1px solid var(--line);
    align-items: start;
  }
  .case-section:last-child { border-bottom: 1px solid var(--line); }
  .case-section-num {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.2em;
    padding-top: 10px;
  }
  .case-section-title {
    font-family: var(--serif);
    font-size: clamp(28px, 3vw, 42px);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
  }
  .case-section-body {
    font-family: var(--serif);
    font-size: clamp(17px, 1.3vw, 20px);
    line-height: 1.65;
    color: var(--ink-dim);
    font-weight: 300;
    max-width: 720px;
  }

  .case-next {
    padding: 120px 0 140px;
    border-top: 1px solid var(--line);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .case-next::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 900px; height: 900px;
    margin-top: -450px; margin-left: -450px;
    background: conic-gradient(from 0deg, transparent 0%, rgba(255,92,46,0.08) 30%, transparent 60%, rgba(234,223,200,0.04) 85%, transparent 100%);
    filter: blur(60px);
    pointer-events: none;
  }
  .case-next-label {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }
  .case-next-title {
    font-family: var(--serif);
    font-size: clamp(40px, 6vw, 80px);
    line-height: 1;
    font-weight: 300;
    letter-spacing: -0.03em;
    margin-bottom: 44px;
    position: relative;
    z-index: 1;
  }
  .case-next-title em { font-style: italic; color: var(--accent); }
  .case-next-actions {
    display: inline-flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 22px;
    border-radius: 999px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    font-weight: 500;
    cursor: none;
    border: 1px solid transparent;
  }
  .btn-primary { background: var(--accent); color: var(--bg); }
  .btn-ghost { background: transparent; color: var(--ink); border-color: var(--line); }
  .arrow { display: inline-block; }

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
    .case-hero { padding: 120px 0 40px; }
    .case-meta-grid { grid-template-columns: repeat(2, 1fr); }
    .case-section { grid-template-columns: 1fr; gap: 16px; padding: 40px 0; }
    .case-cover { padding: 40px 0 20px; }
    .case-cover-frame { aspect-ratio: 4/3; }
    .case-next { padding: 80px 0 100px; }
    .btn, .nav-cta, a { cursor: pointer; }
  }
`;
