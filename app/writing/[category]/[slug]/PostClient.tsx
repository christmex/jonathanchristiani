"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useMotionValue } from "motion/react";
import { type Post, type Category, formatPostDate } from "@/lib/posts";
import MobileMenu from "@/app/components/MobileMenu";

export default function PostClient({
  post,
  category,
  related,
}: {
  post: Post;
  category: Category;
  related: Post[];
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

      <header className="post-hero">
        <div className="container">
          <motion.div
            className="post-breadcrumb"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/writing">← All categories</Link>
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
              <Link href={`/writing/${category.id}`} className="related-all">All in {category.title} <span className="arrow">↗</span></Link>
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
                      <span className="related-read">Read note <span className="arrow">↗</span></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer>
        <div className="container">
          <div className="footer-inner">
            <div>© 2026 JONATHAN CHRISTIANI</div>
            <div>BATAM · INDONESIA · GMT+7</div>
            <div>
              I KNOW THAT I KNOW NOTHING · <Link href={`/writing/${category.id}`}>↑ BACK TO {category.kicker}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
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
  section, nav, header, footer, article { position: relative; z-index: 1; }
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

  .post-hero {
    padding: 160px 0 40px;
  }
  .post-breadcrumb {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); text-transform: uppercase;
    letter-spacing: 0.15em;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 36px;
  }
  .post-breadcrumb a { color: var(--ink-dim); text-decoration: none; transition: color 0.2s ease; }
  .post-breadcrumb a:hover { color: var(--accent); }
  .post-breadcrumb .sep { color: var(--ink-faint); }
  .post-breadcrumb .bc-cat { color: var(--accent); font-weight: 700; }
  .post-breadcrumb .bc-cat:hover { color: var(--accent-2); }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 22px;
  }
  .post-meta .sep { color: var(--ink-faint); }

  .post-title {
    font-family: var(--serif);
    font-size: clamp(40px, 6vw, 88px);
    line-height: 1.02;
    font-weight: 400;
    letter-spacing: -0.03em;
    margin-bottom: 28px;
    max-width: 980px;
  }
  .post-lede {
    font-family: var(--serif);
    font-size: clamp(18px, 1.6vw, 22px);
    line-height: 1.55;
    color: var(--ink-dim);
    max-width: 700px;
    margin-bottom: 28px;
    font-style: italic;
    font-weight: 300;
  }
  .post-tags { display: flex; gap: 6px; flex-wrap: wrap; }
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

  .post-hero-media {
    padding: 20px 0 60px;
  }
  .post-hero-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 21 / 9;
    background: var(--bg-2);
    border: 1px solid var(--line);
    overflow: hidden;
  }
  .post-hero-img { object-fit: cover; }

  .post-body {
    padding: 40px 0 120px;
  }
  .post-prose {
    max-width: 720px;
    margin: 0 auto;
  }
  .prose-p {
    font-family: var(--serif);
    font-size: 19px;
    line-height: 1.75;
    color: var(--ink);
    font-weight: 300;
    margin-bottom: 28px;
  }
  .prose-p:first-child::first-letter {
    font-size: 3.4em;
    float: left;
    line-height: 0.85;
    margin: 0.1em 0.14em 0 -0.04em;
    color: var(--accent);
    font-weight: 400;
  }
  .prose-h2 {
    font-family: var(--serif);
    font-size: clamp(26px, 2.4vw, 34px);
    font-weight: 400;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin: 48px 0 20px;
    padding-top: 20px;
    border-top: 1px solid var(--line);
    position: relative;
  }
  .prose-h2::before {
    content: '§';
    position: absolute;
    top: 18px;
    left: -28px;
    color: var(--accent);
    font-size: 16px;
    font-family: var(--mono);
    font-weight: 700;
  }
  .prose-quote {
    margin: 40px 0;
    padding: 4px 0 4px 28px;
    border-left: 2px solid var(--accent);
    font-family: var(--serif);
    font-size: clamp(22px, 2.2vw, 28px);
    line-height: 1.45;
    font-style: italic;
    color: var(--accent-2);
    position: relative;
  }
  .prose-quote-mark {
    font-family: var(--serif);
    color: var(--accent);
    margin-right: 6px;
  }
  .prose-quote-cite {
    display: block;
    margin-top: 14px;
    font-family: var(--mono);
    font-style: normal;
    font-size: 11px;
    color: var(--ink-dim);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .prose-code {
    margin: 28px 0;
    padding: 18px 20px;
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-left: 2px solid var(--accent);
    font-family: var(--mono);
    font-size: 13px;
    line-height: 1.6;
    color: var(--ink);
    overflow-x: auto;
  }
  .prose-list {
    margin: 24px 0 32px;
    padding-left: 0;
    list-style: none;
  }
  .prose-list li {
    font-family: var(--serif);
    font-size: 18px;
    line-height: 1.7;
    color: var(--ink);
    font-weight: 300;
    padding: 12px 0 12px 32px;
    position: relative;
    border-top: 1px dashed var(--line);
  }
  .prose-list li:last-child { border-bottom: 1px dashed var(--line); }
  .prose-list li::before {
    content: '→';
    position: absolute;
    left: 6px;
    top: 12px;
    color: var(--accent);
    font-family: var(--mono);
    font-size: 16px;
  }

  .post-related {
    padding: 60px 0 100px;
    border-top: 1px solid var(--line);
  }
  .related-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 40px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .related-kicker { color: var(--ink-dim); }
  .related-all { color: var(--accent); text-decoration: none; transition: gap 0.2s ease; display: inline-flex; gap: 8px; align-items: center; }
  .related-all:hover { gap: 14px; }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
  .related-card {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    text-decoration: none;
    color: inherit;
    border: 1px solid var(--line);
    background: var(--bg-2);
    overflow: hidden;
    transition: transform 0.4s ease, border-color 0.3s ease;
  }
  .related-card:hover {
    transform: translateY(-6px);
    border-color: var(--accent);
  }
  .related-media {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--bg);
  }
  .related-media-img {
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .related-card:hover .related-media-img { transform: scale(1.05); }
  .related-body {
    padding: 0 22px 26px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .related-chip {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--accent);
    letter-spacing: 0.12em;
    font-weight: 700;
  }
  .related-title {
    font-family: var(--serif);
    font-size: clamp(22px, 2vw, 28px);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  .related-desc {
    font-size: 13px;
    line-height: 1.6;
    color: var(--ink-dim);
  }
  .related-read {
    margin-top: 6px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    display: inline-flex;
    gap: 8px;
    align-items: center;
    transition: gap 0.2s ease, color 0.2s ease;
  }
  .related-card:hover .related-read { gap: 14px; color: var(--accent); }
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
    .post-hero { padding: 120px 0 30px; }
    .post-hero-media { padding: 10px 0 40px; }
    .post-hero-frame { aspect-ratio: 16 / 10; }
    .post-body { padding: 20px 0 80px; }
    .prose-p { font-size: 17px; }
    .prose-p:first-child::first-letter { font-size: 2.8em; }
    .prose-h2::before { display: none; }
    .prose-quote { padding-left: 18px; font-size: 20px; }
    .related-grid { grid-template-columns: 1fr; gap: 20px; }
    .nav-cta, a, button { cursor: pointer; }
  }
`;
