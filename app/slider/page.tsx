"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

const SLIDES = [
  {
    id: "nihon-fest-2026",
    href: "/slider/nihon-fest-2026",
    kicker: "KEYNOTE",
    title: "Answering the Challenges of Globalization in the Digital Era",
    desc: "From Fullstack Developer to AI Native Engineer. A keynote for Nihon Fest 2026.",
    event: "Nihon Fest 2026",
    date: "Apr 2026",
    tags: ["AI", "Career", "Technology"],
  },
  {
    id: "learn-from-josh",
    href: "/slider/learn-from-josh",
    kicker: "NOTES",
    title: "Learn from Josh",
    desc: "Lessons on craft, mindset, and how to work well — from a talk by Josh.",
    event: "Internal Talk",
    date: "Apr 2026",
    tags: ["Mindset", "Craft", "Process"],
  },
] as const;

export default function SliderIndexPage() {
  const { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering } = useCursor();

  return (
    <PageShell
      cursorXSpring={cursorXSpring}
      cursorYSpring={cursorYSpring}
      cursorHovering={cursorHovering}
    >
      <style>{css}</style>
      <SiteNav setCursorHovering={setCursorHovering} />

      <header className="sl-hero">
        <div className="container">
          <motion.div
            className="sl-breadcrumb"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/" className="inline-icon">
              <ArrowLeft size={12} strokeWidth={1.75} /> Back Home
            </Link>
            <span className="sep">·</span>
            <span>Slides</span>
            <span className="sep">·</span>
            <span>{SLIDES.length} presentations</span>
          </motion.div>

          <motion.h1
            className="sl-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Slide decks<span className="sl-dot">.</span>
          </motion.h1>

          <motion.p
            className="sl-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            A collection of presentations — keynotes, proposals, and technical pitches.
          </motion.p>
        </div>
      </header>

      <section className="sl-body">
        <div className="container">
          {SLIDES.map((s, i) => (
            <motion.article
              key={s.id}
              className="sl-row"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}
            >
              <Link href={s.href} className="sl-row-link" aria-label={s.title}>
                <div className="sl-meta">
                  <span className="sl-kicker">{s.kicker}</span>
                  <span className="sep">·</span>
                  <span>{s.event}</span>
                  <span className="sep">·</span>
                  <span>{s.date}</span>
                </div>
                <h2 className="sl-deck-title">{s.title}</h2>
                <p className="sl-desc">{s.desc}</p>
                <div className="sl-tags">
                  {s.tags.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
                <span className="sl-cta">
                  Open deck <span className="arrow"><ArrowUpRight size={14} strokeWidth={1.75} /></span>
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <SiteFooter backHref="/" backLabel="BACK HOME" />
    </PageShell>
  );
}

const css = `
  .sl-hero { padding: 160px 0 40px; }

  .sl-breadcrumb {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); text-transform: uppercase;
    letter-spacing: 0.15em;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 36px; flex-wrap: wrap;
  }
  .sl-breadcrumb a       { color: var(--ink-dim); text-decoration: none; transition: color 0.2s; }
  .sl-breadcrumb a:hover { color: var(--accent); }
  .sl-breadcrumb .sep    { color: var(--ink-faint); }

  .sl-title {
    font-family: var(--serif);
    font-size: clamp(44px, 7.2vw, 112px);
    line-height: 0.96; font-weight: 400;
    letter-spacing: -0.035em;
    margin-bottom: 22px;
  }
  .sl-dot { color: var(--accent); }

  .sl-sub {
    font-size: 17px; line-height: 1.65;
    color: var(--ink-dim); max-width: 600px;
    margin-bottom: 60px;
  }

  .sl-body { padding: 20px 0 120px; }

  .sl-row            { border-top: 1px solid var(--line); }
  .sl-row:last-child { border-bottom: 1px solid var(--line); }

  .sl-row-link {
    display: block; padding: 44px 0;
    text-decoration: none; color: inherit;
    transition: padding 0.3s ease;
  }
  .sl-row-link:hover { padding-left: 20px; }

  .sl-meta {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 18px;
    flex-wrap: wrap;
  }
  .sl-meta .sep { color: var(--ink-faint); }
  .sl-kicker    { color: var(--accent); font-weight: 700; }

  .sl-deck-title {
    font-family: var(--serif);
    font-size: clamp(28px, 3.6vw, 52px);
    font-weight: 400; line-height: 1.05;
    letter-spacing: -0.02em; margin-bottom: 16px;
    max-width: 860px;
  }
  .sl-desc  { color: var(--ink-dim); font-size: 15px; line-height: 1.65; max-width: 640px; margin-bottom: 20px; }
  .sl-tags  { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }

  .sl-cta {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--mono); font-size: 11px;
    color: var(--accent); letter-spacing: 0.12em;
    text-transform: uppercase; transition: gap 0.2s ease;
  }
  .sl-row-link:hover .sl-cta { gap: 14px; }
  .arrow { display: inline-flex; align-items: center; }

  @media (max-width: 960px) {
    .sl-hero { padding: 120px 0 30px; }
    .sl-sub  { font-size: 15px; }
    .sl-row-link:hover { padding-left: 0; }
  }
`;
