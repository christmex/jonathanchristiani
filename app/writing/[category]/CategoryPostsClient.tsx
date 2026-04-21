"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { type Category, type Post, formatPostDate } from "@/lib/posts";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

export default function CategoryPostsClient({
  category,
  posts,
  allCategories,
}: {
  category: Category;
  posts: Post[];
  allCategories: Category[];
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
            <Link href="/writing" className="inline-icon"><ArrowLeft size={12} strokeWidth={1.75} /> All categories</Link>
            <span className="sep">·</span>
            <span className="bc-kicker">{category.kicker}</span>
            <span className="sep">·</span>
            <span>{posts.length} {posts.length === 1 ? "note" : "notes"}</span>
          </motion.div>

          <motion.h1
            className="list-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {category.title}
            <span className="list-title-dot">.</span>
          </motion.h1>

          <motion.p
            className="list-tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38 }}
          >
            {category.tagline}
          </motion.p>

          <motion.p
            className="list-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            {category.lede}
          </motion.p>

          <motion.div
            className="cat-switcher"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            <span className="cat-switcher-label">Switch log:</span>
            <div className="cat-switcher-btns">
              {allCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/writing/${c.id}`}
                  className={`cat-switcher-btn${c.id === category.id ? " active" : ""}`}
                  onMouseEnter={() => setCursorHovering(true)}
                  onMouseLeave={() => setCursorHovering(false)}
                >
                  <span className="cat-switcher-kicker">{c.kicker}</span>
                  <span className="cat-switcher-name">{c.title}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      <section className="list-body">
        <div className="container">
          {posts.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="post-row"
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}
            >
              <Link href={`/writing/${category.id}/${p.slug}`} className="post-row-link" aria-label={p.title}>
                <div className="post-media">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 960px) 100vw, 40vw"
                    className="post-media-img"
                  />
                </div>
                <div className="post-info">
                  <div className="post-meta">
                    <span className="post-kicker">{category.kicker}</span>
                    <span className="sep">·</span>
                    <span>{formatPostDate(p.date)}</span>
                    <span className="sep">·</span>
                    <span>{p.readTime}</span>
                  </div>
                  <h2 className="post-title">{p.title}</h2>
                  <p className="post-desc">{p.desc}</p>
                  <div className="post-tags">
                    {p.tags.map((t) => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                  </div>
                  <span className="post-read">
                    Read note <span className="arrow"><ArrowUpRight size={14} strokeWidth={1.75} /></span>
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}

          {posts.length === 0 && (
            <div className="list-empty">
              No notes in this log yet. Come back soon — or{" "}
              <Link href="/writing" className="list-empty-link">browse the other logs</Link>.
            </div>
          )}
        </div>
      </section>

      <SiteFooter backHref="/writing" backLabel="ALL CATEGORIES" />
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
  .bc-kicker               { color: var(--accent); font-weight: 700; }

  .list-title {
    font-family: var(--serif);
    font-size: clamp(44px, 7.2vw, 112px);
    line-height: 0.96; font-weight: 400;
    letter-spacing: -0.035em;
    margin-bottom: 14px; max-width: 1100px;
  }
  .list-title-dot { color: var(--accent); }

  .list-tagline {
    font-family: var(--mono); font-size: 13px;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--accent-2); margin-bottom: 22px;
  }
  .list-sub {
    font-size: 17px; line-height: 1.65;
    color: var(--ink-dim); max-width: 780px;
    margin-bottom: 44px;
  }

  .cat-switcher {
    display: flex; align-items: center; gap: 18px;
    padding: 22px 0 0; border-top: 1px solid var(--line); flex-wrap: wrap;
  }
  .cat-switcher-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ink-faint); }
  .cat-switcher-btns  { display: flex; gap: 8px; flex-wrap: wrap; }
  .cat-switcher-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 10px 16px; border-radius: 999px;
    border: 1px solid var(--line);
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--ink-dim); text-decoration: none;
    transition: all 0.25s ease;
  }
  .cat-switcher-btn:hover           { border-color: var(--ink); color: var(--ink); }
  .cat-switcher-btn.active          { background: var(--ink); color: var(--bg); border-color: var(--ink); }
  .cat-switcher-kicker              { color: var(--accent); font-weight: 700; letter-spacing: 0.12em; }
  .cat-switcher-btn.active .cat-switcher-kicker { color: var(--accent); }
  .cat-switcher-name { font-family: var(--serif); text-transform: none; letter-spacing: -0.01em; font-size: 13px; }

  .list-body { padding: 40px 0 120px; }
  .post-row            { border-top: 1px solid var(--line); }
  .post-row:last-of-type { border-bottom: 1px solid var(--line); }
  .post-row-link {
    display: grid; grid-template-columns: 1.3fr 1fr;
    gap: 48px; padding: 48px 0;
    text-decoration: none; color: inherit;
    align-items: center; transition: padding 0.3s ease;
  }
  .post-row-link:hover { padding-left: 16px; padding-right: 16px; }

  .post-media {
    aspect-ratio: 4/3; background: var(--bg-2);
    border: 1px solid var(--line);
    position: relative; overflow: hidden; order: 2;
  }
  .post-media-img { object-fit: cover; transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
  .post-row-link:hover .post-media-img { transform: scale(1.03); }

  .post-info { order: 1; }
  .post-meta {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 20px; flex-wrap: wrap;
  }
  .post-meta .sep { color: var(--ink-faint); }
  .post-kicker    { color: var(--accent); font-weight: 700; }

  .post-title {
    font-family: var(--serif);
    font-size: clamp(32px, 4vw, 56px);
    font-weight: 400; line-height: 1.02;
    letter-spacing: -0.02em; margin-bottom: 18px;
  }
  .post-desc  { color: var(--ink-dim); font-size: 15px; line-height: 1.65; max-width: 540px; margin-bottom: 22px; }
  .post-tags  { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 22px; }
  .post-read {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--mono); font-size: 11px;
    color: var(--accent); letter-spacing: 0.12em;
    text-transform: uppercase; transition: gap 0.2s ease;
  }
  .post-row-link:hover .post-read { gap: 14px; }
  .arrow { display: inline-block; transition: transform 0.25s ease; }

  .list-empty {
    padding: 80px 0; text-align: center;
    font-family: var(--mono); font-size: 13px;
    color: var(--ink-faint); letter-spacing: 0.1em; text-transform: uppercase;
  }
  .list-empty-link       { color: var(--accent); text-decoration: none; }
  .list-empty-link:hover { text-decoration: underline; }

  @media (max-width: 960px) {
    .list-hero { padding: 120px 0 30px; }
    .list-sub  { font-size: 15px; }
    .post-row-link {
      grid-template-columns: 1fr; gap: 20px; padding: 36px 0;
    }
    .post-row-link:hover { padding-left: 0; padding-right: 0; }
    .post-media { order: 1; }
    .post-info  { order: 2; }
  }
`;
