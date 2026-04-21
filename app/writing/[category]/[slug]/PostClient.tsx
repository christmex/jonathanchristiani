"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { type Post, type Category, formatPostDate } from "@/lib/posts";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

export default function PostClient({
  post,
  category,
  related,
}: {
  post: Post;
  category: Category;
  related: Post[];
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

      <header className="post-hero">
        <div className="container">
          <motion.div
            className="post-breadcrumb"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/writing" className="inline-icon"><ArrowLeft size={12} strokeWidth={1.75} /> All categories</Link>
            <span className="sep">·</span>
            <Link href={`/writing/${category.id}`} className="bc-cat">{category.kicker}</Link>
            <span className="sep">·</span>
            <span>{category.title}</span>
          </motion.div>

          <motion.div
            className="post-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span>{formatPostDate(post.date)}</span>
            <span className="sep">·</span>
            <span>{post.readTime}</span>
          </motion.div>

          <motion.h1
            className="post-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {post.title}
          </motion.h1>

          <motion.p
            className="post-lede"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {post.desc}
          </motion.p>

          <motion.div
            className="post-tags"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {post.tags.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </motion.div>
        </div>
      </header>

      <motion.div
        className="post-hero-media"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container">
          <div className="post-hero-frame">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 960px) 100vw, 1200px"
              className="post-hero-img"
              priority
            />
          </div>
        </div>
      </motion.div>

      <article className="post-body">
        <div className="container">
          <div className="post-prose">
            {post.body.map((block, i) => (
              <PostBlockRenderer key={i} block={block} />
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="post-related">
          <div className="container">
            <div className="related-head">
              <span className="related-kicker">§ — More in {category.kicker}</span>
              <Link href={`/writing/${category.id}`} className="related-all">
                All in {category.title} <span className="arrow"><ArrowUpRight size={14} strokeWidth={1.75} /></span>
              </Link>
            </div>
            <div className="related-grid">
              {related.map((p, i) => (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={`/writing/${p.category}/${p.slug}`}
                    className="related-card"
                    onMouseEnter={() => setCursorHovering(true)}
                    onMouseLeave={() => setCursorHovering(false)}
                  >
                    <div className="related-media">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 960px) 100vw, 50vw"
                        className="related-media-img"
                      />
                    </div>
                    <div className="related-body">
                      <span className="related-chip">{category.kicker}</span>
                      <h3 className="related-title">{p.title}</h3>
                      <p className="related-desc">{p.desc}</p>
                      <span className="related-read">Read note <span className="arrow"><ArrowUpRight size={14} strokeWidth={1.75} /></span></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter
        backHref={`/writing/${category.id}`}
        backLabel={`BACK TO ${category.kicker}`}
      />
    </PageShell>
  );
}

function PostBlockRenderer({ block }: { block: Post["body"][number] }) {
  switch (block.type) {
    case "p":
      return <p className="prose-p">{block.content}</p>;
    case "h2":
      return <h2 className="prose-h2">{block.content}</h2>;
    case "quote":
      return (
        <blockquote className="prose-quote">
          <span className="prose-quote-mark">&ldquo;</span>
          {block.content}
          {block.cite && <cite className="prose-quote-cite">— {block.cite}</cite>}
        </blockquote>
      );
    case "code":
      return (
        <pre className="prose-code">
          <code>{block.content}</code>
        </pre>
      );
    case "list":
      return (
        <ul className="prose-list">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
  }
}

const css = `
  .post-hero { padding: 160px 0 40px; }
  .post-breadcrumb {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); text-transform: uppercase;
    letter-spacing: 0.15em;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 36px;
  }
  .post-breadcrumb a         { color: var(--ink-dim); text-decoration: none; transition: color 0.2s; }
  .post-breadcrumb a:hover   { color: var(--accent); }
  .post-breadcrumb .sep      { color: var(--ink-faint); }
  .post-breadcrumb .bc-cat   { color: var(--accent); font-weight: 700; }

  .post-meta {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--mono); font-size: 11px;
    color: var(--accent); letter-spacing: 0.15em;
    text-transform: uppercase; margin-bottom: 22px;
  }
  .post-meta .sep { color: var(--ink-faint); }

  .post-title {
    font-family: var(--serif);
    font-size: clamp(40px, 6vw, 88px);
    line-height: 1.02; font-weight: 400;
    letter-spacing: -0.03em;
    margin-bottom: 28px; max-width: 980px;
  }
  .post-lede {
    font-family: var(--serif);
    font-size: clamp(18px, 1.6vw, 22px);
    line-height: 1.55; color: var(--ink-dim);
    max-width: 700px; margin-bottom: 28px;
    font-style: italic; font-weight: 300;
  }
  .post-tags { display: flex; gap: 6px; flex-wrap: wrap; }

  .post-hero-media { padding: 20px 0 60px; }
  .post-hero-frame {
    position: relative; width: 100%;
    aspect-ratio: 21 / 9;
    background: var(--bg-2); border: 1px solid var(--line); overflow: hidden;
  }
  .post-hero-img { object-fit: cover; }

  .post-body  { padding: 40px 0 120px; }
  .post-prose { max-width: 720px; margin: 0 auto; }

  .prose-p {
    font-family: var(--serif); font-size: 19px;
    line-height: 1.75; color: var(--ink);
    font-weight: 300; margin-bottom: 28px;
  }
  .prose-p:first-child::first-letter {
    font-size: 3.4em; float: left; line-height: 0.85;
    margin: 0.1em 0.14em 0 -0.04em;
    color: var(--accent); font-weight: 400;
  }
  .prose-h2 {
    font-family: var(--serif);
    font-size: clamp(26px, 2.4vw, 34px);
    font-weight: 400; letter-spacing: -0.02em;
    color: var(--ink); margin: 48px 0 20px;
    padding-top: 20px; border-top: 1px solid var(--line);
    position: relative;
  }
  .prose-h2::before {
    content: '§';
    position: absolute; top: 18px; left: -28px;
    color: var(--accent); font-size: 16px;
    font-family: var(--mono); font-weight: 700;
  }
  .prose-quote {
    margin: 40px 0; padding: 4px 0 4px 28px;
    border-left: 2px solid var(--accent);
    font-family: var(--serif);
    font-size: clamp(22px, 2.2vw, 28px);
    line-height: 1.45; font-style: italic; color: var(--accent-2);
  }
  .prose-quote-mark  { color: var(--accent); margin-right: 6px; }
  .prose-quote-cite {
    display: block; margin-top: 14px;
    font-family: var(--mono); font-style: normal;
    font-size: 11px; color: var(--ink-dim);
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .prose-code {
    margin: 28px 0; padding: 18px 20px;
    background: var(--bg-2); border: 1px solid var(--line);
    border-left: 2px solid var(--accent);
    font-family: var(--mono); font-size: 13px;
    line-height: 1.6; color: var(--ink); overflow-x: auto;
  }
  .prose-list { margin: 24px 0 32px; padding-left: 0; list-style: none; }
  .prose-list li {
    font-family: var(--serif); font-size: 18px;
    line-height: 1.7; color: var(--ink); font-weight: 300;
    padding: 12px 0 12px 32px; position: relative;
    border-top: 1px dashed var(--line);
  }
  .prose-list li:last-child { border-bottom: 1px dashed var(--line); }
  .prose-list li::before {
    content: '→'; position: absolute; left: 6px; top: 12px;
    color: var(--accent); font-family: var(--mono); font-size: 16px;
  }

  .post-related { padding: 60px 0 100px; border-top: 1px solid var(--line); }
  .related-head {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 40px; font-family: var(--mono);
    font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;
  }
  .related-kicker { color: var(--ink-dim); }
  .related-all {
    color: var(--accent); text-decoration: none;
    display: inline-flex; gap: 8px; align-items: center; transition: gap 0.2s ease;
  }
  .related-all:hover { gap: 14px; }
  .related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
  .related-card {
    display: grid; grid-template-columns: 1fr; gap: 20px;
    text-decoration: none; color: inherit;
    border: 1px solid var(--line); background: var(--bg-2);
    overflow: hidden;
    transition: transform 0.4s ease, border-color 0.3s ease;
  }
  .related-card:hover { transform: translateY(-6px); border-color: var(--accent); }
  .related-media {
    position: relative; aspect-ratio: 16 / 9;
    overflow: hidden; background: var(--bg);
  }
  .related-media-img {
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
  }
  .related-card:hover .related-media-img { transform: scale(1.05); }
  .related-body { padding: 0 22px 26px; display: flex; flex-direction: column; gap: 10px; }
  .related-chip  { font-family: var(--mono); font-size: 10px; color: var(--accent); letter-spacing: 0.12em; font-weight: 700; }
  .related-title { font-family: var(--serif); font-size: clamp(22px, 2vw, 28px); font-weight: 400; line-height: 1.1; letter-spacing: -0.02em; }
  .related-desc  { font-size: 13px; line-height: 1.6; color: var(--ink-dim); }
  .related-read {
    margin-top: 6px; font-family: var(--mono); font-size: 11px;
    color: var(--ink); letter-spacing: 0.12em; text-transform: uppercase;
    display: inline-flex; gap: 8px; align-items: center;
    transition: gap 0.2s ease, color 0.2s ease;
  }
  .related-card:hover .related-read { gap: 14px; color: var(--accent); }
  .arrow { display: inline-block; }

  @media (max-width: 960px) {
    .post-hero        { padding: 120px 0 30px; }
    .post-hero-media  { padding: 10px 0 40px; }
    .post-hero-frame  { aspect-ratio: 16 / 10; }
    .post-body        { padding: 20px 0 80px; }
    .prose-p          { font-size: 17px; }
    .prose-p:first-child::first-letter { font-size: 2.8em; }
    .prose-h2::before { display: none; }
    .prose-quote      { padding-left: 18px; font-size: 20px; }
    .related-grid     { grid-template-columns: 1fr; gap: 20px; }
  }
`;
