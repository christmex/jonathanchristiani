"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useMotionValue } from "motion/react";
import { type Category, countByCategory } from "@/lib/posts";
import MobileMenu from "@/app/components/MobileMenu";

export default function WritingCategoriesClient({
  categories,
  totalPosts,
}: {
  categories: Category[];
  totalPosts: number;
}) {
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
            Get in Touch →
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
            <span>§ — Writing</span>
            <span className="sep">·</span>
            <span>{totalPosts} notes / {categories.length} categories</span>
          </motion.div>

          <motion.h1
            className="list-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Three logs I keep <em>running.</em>
          </motion.h1>

          <motion.p
            className="list-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Pick a log to enter. <em>Why</em> is the philosophy desk — first principles and questions I keep coming back to.
            {" "}<em>Life&apos;s</em> is the tech workbench — research problems, approaches, and the lessons I only paid for once.
            {" "}<em>Important</em> is the drawer of notes to future-me — failures, patterns, reminders.
          </motion.p>
        </div>
      </header>

      <section className="cat-body">
        <div className="container">
          <div className="cat-grid">
            {categories.map((cat, i) => (
              <motion.article
                key={cat.id}
                className="cat-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                <Link href={`/writing/${cat.id}`} className="cat-card-link" aria-label={cat.title}>
                  <div className="cat-media">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 960px) 100vw, 33vw"
                      className="cat-media-img"
                    />
                    <div className="cat-media-overlay" aria-hidden="true" />
                  </div>
                  <div className="cat-info">
                    <div className="cat-meta">
                      <span className="cat-kicker">{cat.kicker}</span>
                      <span className="sep">·</span>
                      <span>{countByCategory(cat.id)} {countByCategory(cat.id) === 1 ? "note" : "notes"}</span>
                    </div>
                    <h2 className="cat-title">{cat.title}</h2>
                    <p className="cat-tagline">{cat.tagline}</p>
                    <p className="cat-desc">{cat.desc}</p>
                    <div className="cat-tags">
                      {cat.tags.map((t) => (
                        <span key={t} className="chip">{t}</span>
                      ))}
                    </div>
                    <span className="cat-read">
                      Enter category <span className="arrow">↗</span>
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
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
    background-image: repeating-linear-gradient(to bottom, transparent 0 2px, rgba(255, 255, 255, 0.012) 2px 3px);
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

  .list-hero { padding: 160px 0 40px; }
  .list-breadcrumb {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); text-transform: uppercase;
    letter-spacing: 0.15em;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 36px;
    flex-wrap: wrap;
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
    margin-bottom: 22px;
    max-width: 1100px;
  }
  .list-title em { font-style: italic; color: var(--accent-2); }

  .list-sub {
    font-size: 17px;
    line-height: 1.65;
    color: var(--ink-dim);
    max-width: 780px;
    margin-bottom: 60px;
  }
  .list-sub em { font-style: normal; color: var(--ink); font-weight: 600; }

  .cat-body { padding: 20px 0 120px; }
  .cat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  .cat-card {
    border: 1px solid var(--line);
    background: var(--bg-2);
    transition: transform 0.35s ease, border-color 0.25s ease;
  }
  .cat-card:hover {
    transform: translateY(-6px);
    border-color: var(--ink);
  }
  .cat-card-link {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }
  .cat-media {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--bg);
  }
  .cat-media-img {
    object-fit: cover;
    filter: saturate(0.95);
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .cat-card:hover .cat-media-img { transform: scale(1.06); }
  .cat-media-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(13, 13, 12, 0.55) 100%);
    pointer-events: none;
  }

  .cat-info {
    padding: 28px 26px 28px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .cat-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .cat-meta .sep { color: var(--ink-faint); }
  .cat-kicker {
    color: var(--accent);
    font-weight: 700;
  }
  .cat-title {
    font-family: var(--serif);
    font-size: clamp(26px, 2.4vw, 34px);
    line-height: 1.05;
    font-weight: 400;
    letter-spacing: -0.02em;
    margin-bottom: 10px;
  }
  .cat-tagline {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--accent-2);
    letter-spacing: 0.06em;
    margin-bottom: 14px;
  }
  .cat-desc {
    color: var(--ink-dim);
    font-size: 14.5px;
    line-height: 1.6;
    margin-bottom: 18px;
  }
  .cat-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 22px;
  }
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
  .cat-read {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: gap 0.2s ease;
  }
  .cat-card:hover .cat-read { gap: 14px; }
  .arrow { display: inline-block; transition: transform 0.25s ease; }

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
    .list-sub { font-size: 15px; }
    .cat-grid { grid-template-columns: 1fr; gap: 20px; }
    .nav-cta, a, button { cursor: pointer; }
  }
`;
