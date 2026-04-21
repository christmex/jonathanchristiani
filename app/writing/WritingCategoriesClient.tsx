"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { type Category, countByCategory } from "@/lib/posts";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

export default function WritingCategoriesClient({
  categories,
  totalPosts,
}: {
  categories: Category[];
  totalPosts: number;
}) {
  const { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering } = useCursor();

  return (
    <PageShell
      cursorXSpring={cursorXSpring}
      cursorYSpring={cursorYSpring}
      cursorHovering={cursorHovering}
    >
      <style>{css}</style>
      <SiteNav setCursorHovering={setCursorHovering} />

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
            {categories.map((cat, i) => {
              const count = countByCategory(cat.id);
              return (
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
                        <span>{count} {count === 1 ? "note" : "notes"}</span>
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
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}

const css = `
  .list-hero { padding: 160px 0 40px; }
  .list-breadcrumb {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); text-transform: uppercase;
    letter-spacing: 0.15em;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 36px; flex-wrap: wrap;
  }
  .list-breadcrumb a       { color: var(--ink-dim); text-decoration: none; transition: color 0.2s; }
  .list-breadcrumb a:hover { color: var(--accent); }
  .list-breadcrumb .sep    { color: var(--ink-faint); }

  .list-title {
    font-family: var(--serif);
    font-size: clamp(44px, 7.2vw, 112px);
    line-height: 0.96; font-weight: 400;
    letter-spacing: -0.035em;
    margin-bottom: 22px; max-width: 1100px;
  }
  .list-title em { font-style: italic; color: var(--accent-2); }

  .list-sub {
    font-size: 17px; line-height: 1.65;
    color: var(--ink-dim); max-width: 780px;
    margin-bottom: 60px;
  }
  .list-sub em { font-style: normal; color: var(--ink); font-weight: 600; }

  .cat-body { padding: 20px 0 120px; }
  .cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }

  .cat-card {
    border: 1px solid var(--line); background: var(--bg-2);
    transition: transform 0.35s ease, border-color 0.25s ease;
  }
  .cat-card:hover { transform: translateY(-6px); border-color: var(--ink); }
  .cat-card-link { display: flex; flex-direction: column; height: 100%; text-decoration: none; color: inherit; }

  .cat-media {
    position: relative; aspect-ratio: 4 / 3;
    overflow: hidden; background: var(--bg);
  }
  .cat-media-img {
    object-fit: cover; filter: saturate(0.95);
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .cat-card:hover .cat-media-img { transform: scale(1.06); }
  .cat-media-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(13,13,12,0.55) 100%);
    pointer-events: none;
  }

  .cat-info { padding: 28px 26px; display: flex; flex-direction: column; flex: 1; }
  .cat-meta {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 14px;
  }
  .cat-meta .sep { color: var(--ink-faint); }
  .cat-kicker    { color: var(--accent); font-weight: 700; }
  .cat-title  { font-family: var(--serif); font-size: clamp(26px, 2.4vw, 34px); line-height: 1.05; font-weight: 400; letter-spacing: -0.02em; margin-bottom: 10px; }
  .cat-tagline { font-family: var(--mono); font-size: 12px; color: var(--accent-2); letter-spacing: 0.06em; margin-bottom: 14px; }
  .cat-desc   { color: var(--ink-dim); font-size: 14.5px; line-height: 1.6; margin-bottom: 18px; }
  .cat-tags   { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 22px; }
  .cat-read {
    margin-top: auto;
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--mono); font-size: 11px;
    color: var(--accent); letter-spacing: 0.12em;
    text-transform: uppercase; transition: gap 0.2s ease;
  }
  .cat-card:hover .cat-read { gap: 14px; }
  .arrow { display: inline-block; transition: transform 0.25s ease; }

  @media (max-width: 960px) {
    .list-hero { padding: 120px 0 30px; }
    .list-sub  { font-size: 15px; }
    .cat-grid  { grid-template-columns: 1fr; gap: 20px; }
  }
`;
