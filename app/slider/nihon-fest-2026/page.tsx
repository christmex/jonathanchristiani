"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowUpRight, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Check } from "lucide-react";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";

const TOTAL_SLIDES = 8;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: "easeOut" } },
};

export default function NihonFest2026Page() {
  const { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering } = useCursor();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);

  const goTo = (n: number) => {
    const idx = Math.max(1, Math.min(TOTAL_SLIDES, n));
    const el = scrollerRef.current?.querySelector<HTMLElement>(`[data-slide="${idx}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        goTo(current + 1);
      } else if (["ArrowUp", "PageUp", "ArrowLeft"].includes(e.key)) {
        e.preventDefault();
        goTo(current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(1);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(TOTAL_SLIDES);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slides = scroller.querySelectorAll<HTMLElement>("[data-slide]");
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry most visible in the viewport
        let best: IntersectionObserverEntry | null = null;
        entries.forEach((e) => {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) {
            best = e;
          }
        });
        if (best) {
          const n = Number((best as IntersectionObserverEntry).target.getAttribute("data-slide"));
          if (n) setCurrent(n);
        }
      },
      { root: null, threshold: [0.3, 0.55, 0.75] }
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <PageShell
      cursorXSpring={cursorXSpring}
      cursorYSpring={cursorYSpring}
      cursorHovering={cursorHovering}
      blobs={3}
    >
      <style>{css}</style>

      {/* Top-left back link */}
      <Link
        href="/slider"
        className="deck-home"
        onMouseEnter={() => setCursorHovering(true)}
        onMouseLeave={() => setCursorHovering(false)}
      >
        <span className="inline-icon"><ArrowLeft size={14} strokeWidth={1.75} /> slides</span>
      </Link>

      {/* Top-right event meta (persistent across all slides) */}
      <div className="deck-event" aria-hidden="true">
        <span>NIHON FEST 2026</span>
        <span className="sep">·</span>
        <span>KEYNOTE</span>
      </div>

      {/* Slide counter + controls */}
      <div className="deck-chrome" aria-hidden="true">
        <button
          type="button"
          className="deck-arrow"
          onClick={() => goTo(current - 1)}
          onMouseEnter={() => setCursorHovering(true)}
          onMouseLeave={() => setCursorHovering(false)}
          aria-label="Previous slide"
        >
          <ArrowUp size={16} strokeWidth={1.75} />
        </button>
        <div className="deck-counter">
          <span className="deck-counter-cur">{String(current).padStart(2, "0")}</span>
          <span className="deck-counter-sep">/</span>
          <span className="deck-counter-tot">{String(TOTAL_SLIDES).padStart(2, "0")}</span>
        </div>
        <button
          type="button"
          className="deck-arrow"
          onClick={() => goTo(current + 1)}
          onMouseEnter={() => setCursorHovering(true)}
          onMouseLeave={() => setCursorHovering(false)}
          aria-label="Next slide"
        >
          <ArrowDown size={16} strokeWidth={1.75} />
        </button>
      </div>

      {/* Progress dots */}
      <div className="deck-dots" aria-hidden="true">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`deck-dot${i + 1 === current ? " active" : ""}`}
            onClick={() => goTo(i + 1)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="deck" ref={scrollerRef}>
        {/* 01 — QR Scan */}
        <section className="slide slide-qr" data-slide={1}>
          <div className="slide-inner slide-center">
            <motion.div initial="hidden" animate="show" variants={fadeIn}>
              <motion.div className="qr-label" variants={fadeUp}>
                SCAN · IKUTI DI PONSEL
              </motion.div>

              <motion.div className="qr-big-card" variants={fadeUp}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/qr-nihon-fest-2026.svg"
                  alt="QR: https://jonathanchristiani-beta.vercel.app/nihon-fest-2026"
                />
              </motion.div>

              <motion.div className="qr-url-big" variants={fadeUp}>
                jonathanchristiani-beta.vercel.app/nihon-fest-2026
              </motion.div>

              <motion.div className="cover-hint" variants={fadeUp}>
                tekan <kbd>↓</kbd> untuk mulai
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 02 — Title */}
        <section className="slide slide-cover" data-slide={2}>
          <div className="slide-inner">
            <motion.div initial="hidden" animate="show" variants={fadeIn}>
              <motion.h1 className="cover-title" variants={fadeUp}>
                Menjawab Tantangan <em>Globalisasi</em>
                <br />
                di Era Digital.
              </motion.h1>
              <motion.p className="cover-sub" variants={fadeUp}>
                Dari Fullstack Developer <span className="arrow-seq"><ArrowRight size={20} strokeWidth={1.75} /></span>{" "}
                <strong>AI Native Engineer</strong>
              </motion.p>
              <motion.div className="cover-hint" variants={fadeUp}>
                tekan <kbd>↓</kbd> untuk lanjut
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 03 — Speaker Profile */}
        <section className="slide slide-profile" data-slide={3}>
          <div className="slide-inner">
            <motion.div className="profile-grid" initial="hidden" animate="show" variants={fadeIn}>

              <motion.div className="profile-photo-wrap" variants={fadeUp}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Jonathan.png"
                  alt="Jonathan Christiani"
                  className="profile-photo"
                />
              </motion.div>

              <div className="profile-content">
                <motion.div className="profile-eyebrow" variants={fadeUp}>
                  SPEAKER
                </motion.div>
                <motion.h2 className="profile-name" variants={fadeUp}>
                  Jonathan <em>Christiani.</em>
                </motion.h2>
                <motion.p className="profile-role" variants={fadeUp}>
                  AI Native Engineer · Cyber Security Enthusiast
                </motion.p>
                <motion.div className="profile-links" variants={fadeUp}>
                  <a
                    href="https://www.instagram.com/christmex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                    onMouseEnter={() => setCursorHovering(true)}
                    onMouseLeave={() => setCursorHovering(false)}
                  >
                    <span className="profile-link-platform">Instagram</span>
                    <span className="profile-link-handle">
                      @christmex <ArrowUpRight size={12} strokeWidth={1.75} />
                    </span>
                  </a>
                  <a
                    href="https://christmex.medium.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                    onMouseEnter={() => setCursorHovering(true)}
                    onMouseLeave={() => setCursorHovering(false)}
                  >
                    <span className="profile-link-platform">Medium</span>
                    <span className="profile-link-handle">
                      christmex.medium.com <ArrowUpRight size={12} strokeWidth={1.75} />
                    </span>
                  </a>
                </motion.div>
              </div>

            </motion.div>
          </div>
        </section>

        {/* 04 — Opening */}
        <section className="slide" data-slide={4}>
          <div className="slide-inner">
            <div className="slide-num">§ 01 — OPENING</div>
            <h2 className="slide-h">
              Kita sedang hidup di <em>momen paling transformatif</em>
              <br />
              dalam sejarah teknologi.
            </h2>
            <p className="slide-lede">
              Perubahan yang dulu butuh puluhan tahun, sekarang terjadi dalam hitungan bulan.
              Dan kecepatannya masih terus meningkat.
            </p>
            <blockquote className="slide-quote">
              <p>
                &ldquo;The pace of progress in artificial intelligence is incredibly fast.
                It&rsquo;s doubling roughly every six months.&rdquo;
              </p>
              <cite>— Elon Musk, interview with Kevin Rose</cite>
              <span className="quote-id">
                &ldquo;Laju perkembangan AI luar biasa cepat — kira-kira dua kali lipat setiap enam bulan.&rdquo;
              </span>
            </blockquote>
          </div>
        </section>

        {/* 03 — AI Tooling Trend (Claude Code focus) */}
        <section className="slide" data-slide={5}>
          <div className="slide-inner">
            <div className="slide-num">§ 02 — TREN AI TOOLS</div>
            <h2 className="slide-h slide-h-sm">
              Dari autocomplete ke <em>partner kerja.</em>
            </h2>

            <div className="timeline">
              <div className="tl-step">
                <div className="tl-year">2021</div>
                <div className="tl-tool">GitHub Copilot</div>
                <div className="tl-era">Era autocomplete</div>
              </div>
              <div className="tl-arrow"><ArrowRight size={22} strokeWidth={1.5} /></div>
              <div className="tl-step">
                <div className="tl-year">2023</div>
                <div className="tl-tool">ChatGPT</div>
                <div className="tl-era">Era prompting</div>
              </div>
              <div className="tl-arrow"><ArrowRight size={22} strokeWidth={1.5} /></div>
              <div className="tl-step">
                <div className="tl-year">2024–25</div>
                <div className="tl-tool">Cursor · Claude Code CLI</div>
                <div className="tl-era">Agentic editor / CLI</div>
              </div>
              <div className="tl-arrow"><ArrowRight size={22} strokeWidth={1.5} /></div>
              <div className="tl-step tl-step-now">
                <div className="tl-year">April 2026</div>
                <div className="tl-tool">Opus 4.7 + Routines</div>
                <div className="tl-era">Agentic cloud platform</div>
              </div>
            </div>

            <div className="cc-panel">
              <div className="cc-panel-left">
                <div className="cc-label">POSISI HARI INI · APRIL 2026</div>
                <div className="cc-name">Claude Code</div>
                <div className="cc-meta">
                  CLI + Desktop app · Opus 4.7 (16 Apr 2026)
                  <br />
                  Routines research preview (14 Apr 2026)
                </div>
              </div>
              <div className="cc-panel-right">
                <ul className="cc-list">
                  <li>
                    <span className="cc-check"><Check size={14} strokeWidth={2} /></span>
                    Baca seluruh codebase sekaligus — bukan cuma snippet
                  </li>
                  <li>
                    <span className="cc-check"><Check size={14} strokeWidth={2} /></span>
                    Nulis kode, jalanin test, bikin PR otomatis
                  </li>
                  <li>
                    <span className="cc-check"><Check size={14} strokeWidth={2} /></span>
                    <strong>Routines</strong>: automation terjadwal di cloud — laptop nggak perlu nyala
                  </li>
                  <li>
                    <span className="cc-check"><Check size={14} strokeWidth={2} /></span>
                    MCP Integration
                  </li>
                  <li>
                    <span className="cc-check"><Check size={14} strokeWidth={2} /></span>
                    <em>Partner kerja</em> — bukan sekadar autocomplete
                  </li>
                </ul>
              </div>
            </div>

            <p className="slide-lede slide-lede-center cc-closing">
              Kita ga akan bahas tools-nya tapi kita akan bahas
              <em> cara berpikir</em> yang bikin kita tetap relevan di tengah tren ini.
            </p>
          </div>
        </section>

        {/* 05 — Transformation */}
        <section className="slide" data-slide={6}>
          <div className="slide-inner">
            <div className="slide-num">§ 03 — New Era</div>
            <h2 className="slide-h slide-h-sm">
              From <em>writing code</em>, to <em>orchestrating systems</em>.
            </h2>

            <div className="split-grid">
              <div className="split-col split-before">
                <div className="split-tag">DULU</div>
                <h3 className="split-title">Fullstack Developer</h3>
                <ul className="split-list">
                  <li>Menulis setiap baris kode manual</li>
                  <li>Debugging trial & error berjam-jam</li>
                  <li>Fokus pada implementasi teknis</li>
                  <li>1 fitur = berhari-hari</li>
                </ul>
              </div>
              <div className="split-arrow" aria-hidden="true"><ArrowRight size={28} strokeWidth={1.5} /></div>
              <div className="split-col split-after">
                <div className="split-tag">SEKARANG</div>
                <h3 className="split-title">AI Native Engineer</h3>
                <ul className="split-list">
                  <li>Mengorkestrasi AI untuk menulis kode</li>
                  <li>Validasi, review, dan arsitektur</li>
                  <li>Fokus pada problem-solving & nilai bisnis</li>
                  <li>1 fitur = hitungan jam</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 06 — Showcase */}
        <section className="slide" data-slide={7}>
          <div className="slide-inner">
            <div className="slide-num">§ 04 — Showcase</div>
            <h2 className="slide-h slide-h-sm">
              5 projects. <em>Less than 1 month.</em> One person.
            </h2>

            <div className="showcase-grid">
              {[
                { idx: "01", name: "Suryawedding",          tag: "Wedding Invitation Platform", href: "https://surya-wedding.vercel.app/" },
                { idx: "02", name: "jonathanchristiani.com", tag: "Personal Portfolio · website ini", href: "https://jonathanchristiani-beta.vercel.app/" },
                { idx: "03", name: "Elegant Gorden",         tag: "Curtain E-commerce · SEO", href: "https://elegantgorden.vercel.app/" },
                { idx: "04", name: "Sekolah BASIC",          tag: "School Management System", href: "https://sekolahbasic-fe.vercel.app/" },
                { idx: "05", name: "Nihon Rent",             tag: "Rental Platform", href: "https://nihonrent.vercel.app/" },
              ].map((p) => (
                <a
                  key={p.idx}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="showcase-cell"
                  onMouseEnter={() => setCursorHovering(true)}
                  onMouseLeave={() => setCursorHovering(false)}
                >
                  <div className="showcase-idx">
                    {p.idx}
                    <span className="showcase-ext" aria-hidden="true"><ArrowUpRight size={14} strokeWidth={1.75} /></span>
                  </div>
                  <div className="showcase-name">{p.name}</div>
                  <div className="showcase-tag">{p.tag}</div>
                </a>
              ))}
            </div>

            <div className="math-row">
              <div className="math-cell">
                <div className="math-label">NORMALNYA</div>
                <div className="math-value">3–5 orang × 3–6 bulan</div>
              </div>
              <div className="math-op">=</div>
              <div className="math-cell math-cell-accent">
                <div className="math-label">PRODUKTIVITAS</div>
                <div className="math-value math-big">900–4500%</div>
              </div>
            </div>
          </div>
        </section>

        {/* 08 — Final */}
        <section className="slide slide-final" data-slide={8}>
          <div className="slide-inner slide-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="final-label">The end</div>
              <h2 className="final-h">
                Latih <em>First Principle Thinking</em>,
                <br />
                <em>System Thinking</em>, dan <em>Critical Thinking</em>
                <br />
                sedini mungkin.
              </h2>
              <p className="final-sub">
                Karena di era globalisasi digital,
                <br />
                yang bertahan bukan yang paling pintar 
                <br />
                tapi yang paling <em>cepat beradaptasi</em>.
              </p>

              <div className="final-sign">
                <div className="final-sign-name">Jonathan Christiani</div>
                <div className="final-sign-role">AI Native Engineer - Nihon Fest 2026</div>
              </div>

              <div className="final-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => goTo(1)}
                  onMouseEnter={() => setCursorHovering(true)}
                  onMouseLeave={() => setCursorHovering(false)}
                >
                  <span className="inline-icon"><ArrowUp size={14} strokeWidth={1.75} /> Kembali ke Slide Pertama</span>
                </button>
              </div>

              <div className="final-kbd">
                atau tekan <kbd>Home</kbd> untuk kembali ke awal
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

const css = `
  /* Hide page-level scroll; slides handle their own scroll-snap */
  html, body { overflow: hidden; height: 100%; }
  .page { overflow: hidden; }

  .deck {
    position: fixed; inset: 0;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
  }
  .deck::-webkit-scrollbar { display: none; }

  .slide {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-height: 100vh; height: auto;
    display: flex; align-items: center;
    position: relative;
    padding: 100px 0;
  }
  .slide-inner {
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 80px;
    position: relative; z-index: 2;
  }
  .slide-center { text-align: center; }

  .slide-num {
    font-family: var(--mono);
    font-size: clamp(12px, 1vw, 14px);
    color: var(--accent); letter-spacing: 0.22em;
    text-transform: uppercase; font-weight: 600;
    margin-bottom: 36px;
    display: inline-flex; align-items: center; gap: 14px;
    padding: 8px 14px 8px 0;
    position: relative;
  }
  .slide-num::before {
    content: ''; display: inline-block;
    width: 32px; height: 1px;
    background: var(--accent);
  }
  .slide-h {
    font-family: var(--serif);
    font-size: clamp(48px, 7vw, 96px);
    line-height: 1.02; font-weight: 400;
    letter-spacing: -0.035em; color: var(--ink);
    margin-bottom: 40px; max-width: 1100px;
  }
  .slide-h-sm { font-size: clamp(40px, 5.4vw, 72px); }
  .slide-h em, .cover-title em, .pull-text em, .question-h em,
  .conclusion-h em, .final-h em, .pillar-quote em {
    font-style: italic; color: var(--accent);
  }
  .slide-lede {
    font-family: var(--serif);
    font-size: clamp(18px, 1.6vw, 22px);
    line-height: 1.6; color: var(--ink-dim);
    font-weight: 300; max-width: 780px;
  }
  .slide-lede-center { margin: 40px auto 0; text-align: center; }

  /* Deck chrome */
  .deck-home {
    position: fixed; top: 28px; left: 32px; z-index: 100;
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--ink-dim); text-decoration: none;
    transition: color 0.2s ease;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .deck-home:hover { color: var(--accent); }

  .deck-event {
    position: fixed; top: 28px; right: 32px; z-index: 100;
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--accent); font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    padding: 6px 12px;
    border: 1px solid var(--accent);
    background: rgba(255,92,46,0.06);
  }
  .deck-event .sep { color: var(--ink-dim); font-weight: 400; }

  .deck-chrome {
    position: fixed; bottom: 28px; right: 32px; z-index: 100;
    display: flex; align-items: center; gap: 14px;
    font-family: var(--mono);
  }
  .deck-arrow {
    width: 36px; height: 36px;
    border: 1px solid var(--line); background: transparent;
    color: var(--ink-dim); font-size: 14px;
    display: inline-flex; align-items: center; justify-content: center;
    cursor: none; transition: all 0.2s ease;
  }
  .deck-arrow:hover { border-color: var(--accent); color: var(--accent); }
  .deck-counter {
    display: inline-flex; gap: 6px; font-size: 12px;
    letter-spacing: 0.12em; min-width: 64px; justify-content: center;
  }
  .deck-counter-cur { color: var(--accent); font-weight: 700; }
  .deck-counter-sep { color: var(--ink-faint); }
  .deck-counter-tot { color: var(--ink-dim); }

  .deck-dots {
    position: fixed; top: 50%; right: 24px; z-index: 100;
    transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 10px;
  }
  .deck-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--line); border: 0; padding: 0;
    cursor: none; transition: all 0.3s ease;
  }
  .deck-dot.active { background: var(--accent); transform: scale(1.6); }
  .deck-dot:hover { background: var(--accent-2); }

  /* 01 Cover */
  .slide-cover { justify-content: center; }
  .deck-meta {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); letter-spacing: 0.2em;
    text-transform: uppercase;
    display: flex; gap: 12px; flex-wrap: wrap;
    margin-bottom: 56px;
  }
  .deck-meta .sep { color: var(--ink-faint); }
  .cover-title {
    font-family: var(--serif);
    font-size: clamp(64px, 10vw, 160px);
    line-height: 0.94; font-weight: 400;
    letter-spacing: -0.04em; color: var(--ink);
    margin-bottom: 36px;
  }
  .cover-sub {
    font-family: var(--serif);
    font-size: clamp(22px, 2.4vw, 34px);
    color: var(--ink-dim); font-weight: 300;
    line-height: 1.3; margin-bottom: 80px;
  }
  .cover-sub strong {
    color: var(--accent-2); font-weight: 500;
    font-style: italic;
  }
  .arrow-seq { color: var(--accent); margin: 0 4px; }
  .cover-hint {
    font-family: var(--mono); font-size: 12px;
    color: var(--ink-faint); letter-spacing: 0.12em;
  }
  /* 03 Profile slide */
  .profile-grid {
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 80px; align-items: center;
  }
  .profile-photo-wrap {
    position: relative;
    border: 1px solid var(--line);
    overflow: hidden;
    background: var(--bg-2);
  }
  .profile-photo {
    width: 100%; height: 100%;
    object-fit: cover; object-position: top center;
    display: block;
    filter: grayscale(100%) contrast(1.05);
    transition: filter 0.5s ease;
  }
  .profile-photo-wrap:hover .profile-photo { filter: grayscale(0%) contrast(1); }
  .profile-content { display: flex; flex-direction: column; }
  .profile-eyebrow {
    font-family: var(--mono); font-size: 12px;
    letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--accent); font-weight: 600;
    margin-bottom: 28px;
  }
  .profile-name {
    font-family: var(--serif);
    font-size: clamp(52px, 6.5vw, 96px);
    line-height: 0.96; font-weight: 400;
    letter-spacing: -0.04em; color: var(--ink);
    margin-bottom: 22px;
  }
  .profile-name em { font-style: italic; color: var(--accent); }
  .profile-role {
    font-family: var(--mono); font-size: clamp(11px, 1.1vw, 14px);
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink-dim); margin-bottom: 44px;
  }
  .profile-links {
    display: flex; gap: 12px; flex-wrap: wrap;
  }
  .profile-link {
    display: flex; flex-direction: column; align-items: flex-start; gap: 6px;
    padding: 18px 24px; border: 1px solid var(--line);
    background: var(--bg-2); text-decoration: none;
    transition: border-color 0.25s ease, transform 0.25s ease;
    min-width: 180px;
  }
  .profile-link:hover { border-color: var(--ink); transform: translateY(-4px); }
  .profile-link-platform {
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--ink-faint);
  }
  .profile-link-handle {
    font-family: var(--serif); font-size: clamp(14px, 1.4vw, 18px);
    color: var(--ink); letter-spacing: -0.01em;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .profile-link:hover .profile-link-handle { color: var(--accent); }

  /* 01 QR scan slide */
  .slide-qr { justify-content: center; }
  .qr-meta { justify-content: center; margin-bottom: 56px; }
  .qr-label {
    font-family: var(--mono);
    font-size: clamp(13px, 1.4vw, 18px);
    letter-spacing: 0.28em; color: var(--accent);
    text-transform: uppercase; font-weight: 600;
    margin-bottom: 28px;
  }
  .qr-big-card {
    display: inline-block;
    background: #fff;
    padding: 28px;
    border-radius: 6px;
    border: 1px solid var(--line);
    box-shadow: 0 20px 80px rgba(0,0,0,0.45);
    line-height: 0;
    margin-bottom: 32px;
  }
  .qr-big-card img {
    width: clamp(280px, 32vw, 440px);
    height: clamp(280px, 32vw, 440px);
    display: block;
  }
  .qr-url-big {
    font-family: var(--mono);
    font-size: clamp(13px, 1.2vw, 17px);
    color: var(--ink); letter-spacing: 0.04em;
    margin-bottom: 22px; word-break: break-all;
  }
  .qr-note {
    font-family: var(--serif);
    font-size: clamp(15px, 1.2vw, 18px);
    color: var(--ink-dim); line-height: 1.5;
    font-weight: 300; max-width: 540px;
    margin: 0 auto 40px;
  }

  /* Final slide actions */
  .final-actions {
    display: flex; justify-content: center;
    margin: 36px 0 20px;
  }

  .cover-hint kbd, .final-kbd kbd {
    font-family: var(--mono); font-size: 10px;
    border: 1px solid var(--line); padding: 2px 6px;
    color: var(--ink-dim); margin: 0 2px;
  }

  /* 02 Opening quote */
  .slide-quote {
    margin-top: 48px; padding: 28px 32px;
    border-left: 2px solid var(--accent);
    max-width: 720px;
  }
  .slide-quote p {
    font-family: var(--serif); font-size: clamp(20px, 1.8vw, 26px);
    line-height: 1.5; color: var(--ink); font-style: italic;
    font-weight: 300; margin-bottom: 14px;
  }
  .slide-quote cite {
    font-family: var(--mono); font-size: 11px;
    font-style: normal; color: var(--ink-dim);
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .quote-id {
    display: block; margin-top: 14px;
    font-family: var(--serif); font-size: 14px;
    line-height: 1.55; color: var(--ink-faint);
    font-style: italic; font-weight: 300;
    padding-left: 14px; border-left: 1px solid var(--line);
  }
  .quote-id::before {
    content: 'ID · ';
    font-family: var(--mono); font-style: normal;
    font-size: 10px; letter-spacing: 0.15em;
    color: var(--accent); margin-right: 4px;
  }

  /* 03 Timeline (AI tooling trend) */
  .timeline {
    display: grid;
    grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
    gap: 18px; align-items: start;
    margin: 32px 0 28px;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    padding: 24px 0;
  }
  .tl-step { padding: 0 4px; }
  .tl-year {
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.15em; color: var(--accent);
    margin-bottom: 8px;
  }
  .tl-tool {
    font-family: var(--serif); font-size: 20px;
    color: var(--ink); letter-spacing: -0.015em;
    margin-bottom: 6px;
  }
  .tl-era {
    font-family: var(--mono); font-size: 10px;
    color: var(--ink-dim); letter-spacing: 0.06em;
  }
  .tl-arrow {
    font-family: var(--serif); font-size: 24px;
    color: var(--ink-faint);
    padding-top: 2px;
  }
  .tl-step-now .tl-tool {
    color: var(--accent); font-weight: 500;
  }
  .tl-step-now .tl-year { color: var(--accent-2); }

  .cc-panel {
    display: grid; grid-template-columns: 1fr 1.6fr;
    gap: 1px; background: var(--line);
    border: 1px solid var(--accent);
    margin-bottom: 24px;
  }
  .cc-panel-left, .cc-panel-right {
    background: var(--bg-2); padding: 24px 26px;
  }
  .cc-panel-left {
    background: linear-gradient(180deg, rgba(255,92,46,0.08), var(--bg-2));
  }
  .cc-label {
    font-family: var(--mono); font-size: 10px;
    color: var(--accent); letter-spacing: 0.2em;
    text-transform: uppercase; margin-bottom: 12px;
  }
  .cc-name {
    font-family: var(--serif); font-size: clamp(28px, 3vw, 38px);
    color: var(--ink); letter-spacing: -0.02em;
    line-height: 1.05; margin-bottom: 10px;
  }
  .cc-meta {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); letter-spacing: 0.06em;
    line-height: 1.5;
  }
  .cc-list {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 10px;
  }
  .cc-list li {
    font-family: var(--serif); font-size: 15px;
    line-height: 1.45; color: var(--ink-dim);
    display: flex; gap: 10px; align-items: baseline;
  }
  .cc-list li em { color: var(--accent); font-style: italic; }
  .cc-list li strong {
    color: var(--accent-2); font-weight: 600;
    font-style: normal;
  }
  .cc-check {
    flex: 0 0 20px;
    color: var(--accent); font-family: var(--mono);
    font-size: 12px; line-height: 1.5;
  }
  .cc-closing { margin-top: 8px; text-align: left; }

  /* 04 Statistics */
  .stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--line);
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    margin-top: 32px;
  }
  .stat-cell {
    background: var(--bg); padding: 32px 28px;
    display: flex; flex-direction: column; justify-content: flex-start;
  }
  .stat-cell-wide { grid-column: span 4; }
  .stat-big {
    font-family: var(--serif); font-weight: 400;
    font-size: clamp(48px, 5vw, 72px);
    line-height: 1; letter-spacing: -0.03em;
    color: var(--accent); margin-bottom: 14px;
  }
  .stat-unit {
    font-family: var(--mono); font-size: 14px;
    color: var(--ink-dim); margin-left: 6px;
    letter-spacing: 0.06em; font-weight: 400;
  }
  .stat-label {
    font-family: var(--serif); font-size: 16px;
    color: var(--ink); line-height: 1.35;
    margin-bottom: 10px;
  }
  .stat-sub {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-faint); letter-spacing: 0.06em;
    line-height: 1.6;
  }

  /* 04 Pullquote */
  .slide-pull::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at center, rgba(255,92,46,0.08), transparent 60%);
    pointer-events: none;
  }
  .pull-text {
    font-family: var(--serif);
    font-size: clamp(40px, 6vw, 88px);
    line-height: 1.08; font-weight: 300;
    letter-spacing: -0.03em; color: var(--ink);
    max-width: 1100px; margin: 0 auto 32px;
  }
  .pull-sub {
    font-family: var(--mono); font-size: 13px;
    color: var(--ink-dim); letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  /* 05 Transformation */
  .split-grid {
    display: grid; grid-template-columns: 1fr auto 1fr;
    gap: 32px; align-items: stretch; margin-top: 40px;
  }
  .split-col {
    border: 1px solid var(--line); padding: 32px 32px;
    background: var(--bg-2);
  }
  .split-after {
    border-color: var(--accent);
    background: linear-gradient(180deg, rgba(255,92,46,0.06), transparent);
  }
  .split-tag {
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--ink-faint); margin-bottom: 14px;
  }
  .split-after .split-tag { color: var(--accent); }
  .split-title {
    font-family: var(--serif); font-size: clamp(22px, 2vw, 30px);
    font-weight: 400; color: var(--ink);
    letter-spacing: -0.015em; margin-bottom: 22px;
  }
  .split-list {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 10px;
  }
  .split-list li {
    font-family: var(--serif); font-size: 16px;
    line-height: 1.5; color: var(--ink-dim);
    padding-left: 18px; position: relative;
  }
  .split-list li::before {
    content: '·'; position: absolute; left: 4px;
    color: var(--ink-faint);
  }
  .split-after .split-list li::before { color: var(--accent); }
  .split-arrow {
    font-family: var(--serif); font-size: 48px;
    color: var(--accent); align-self: center;
  }

  /* 06 Showcase grid */
  .showcase-grid {
    display: grid; grid-template-columns: repeat(5, 1fr);
    gap: 1px; background: var(--line);
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    margin: 24px 0 32px;
  }
  .showcase-cell {
    background: var(--bg); padding: 24px 22px;
    display: flex; flex-direction: column; gap: 10px;
    text-decoration: none; color: inherit;
    transition: background 0.25s ease, transform 0.25s ease;
    position: relative;
  }
  .showcase-cell::after {
    content: ''; position: absolute;
    left: 0; right: 0; bottom: 0; height: 2px;
    background: var(--accent);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s ease;
  }
  .showcase-cell:hover { background: var(--bg-2); }
  .showcase-cell:hover::after { transform: scaleX(1); }
  .showcase-idx {
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.18em; color: var(--accent);
    display: flex; justify-content: space-between; align-items: center;
  }
  .showcase-ext {
    font-size: 13px; color: var(--ink-faint);
    transition: transform 0.25s ease, color 0.25s ease;
  }
  .showcase-cell:hover .showcase-ext {
    color: var(--accent);
    transform: translate(2px, -2px);
  }
  .showcase-name {
    font-family: var(--serif); font-size: 18px;
    color: var(--ink); line-height: 1.25;
    letter-spacing: -0.01em;
    transition: color 0.25s ease;
  }
  .showcase-cell:hover .showcase-name { color: var(--accent-2); }
  .showcase-tag {
    font-family: var(--mono); font-size: 10px;
    color: var(--ink-dim); letter-spacing: 0.06em;
    line-height: 1.5; margin-top: auto;
  }

  /* 06 Math */
  .math-row {
    display: flex; align-items: center; justify-content: flex-start;
    gap: 28px; margin-top: 40px; flex-wrap: wrap;
  }
  .math-cell {
    border: 1px solid var(--line);
    background: var(--bg-2);
    padding: 28px 32px; min-width: 280px;
  }
  .math-cell-accent {
    border-color: var(--accent);
    background: linear-gradient(180deg, rgba(255,92,46,0.08), transparent);
  }
  .math-label {
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--ink-dim); margin-bottom: 12px;
  }
  .math-value {
    font-family: var(--serif); font-size: clamp(22px, 2vw, 30px);
    color: var(--ink); letter-spacing: -0.015em;
  }
  .math-big {
    font-size: clamp(38px, 5vw, 64px); color: var(--accent);
    font-weight: 500;
  }
  .math-op {
    font-family: var(--serif); font-size: 40px;
    color: var(--ink-faint);
  }

  /* 07 Big question */
  .slide-question::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(234,223,200,0.06), transparent 55%);
    pointer-events: none;
  }
  .question-h {
    font-family: var(--serif);
    font-size: clamp(42px, 6vw, 88px);
    line-height: 1.08; font-weight: 300;
    letter-spacing: -0.03em; color: var(--ink);
    max-width: 1100px; margin: 0 auto;
  }

  /* 08 Pillars */
  .pillars {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px; background: var(--line);
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    margin-top: 40px;
  }
  .pillar {
    background: var(--bg); padding: 44px 32px;
    display: flex; flex-direction: column; gap: 16px;
    transition: background 0.3s ease;
  }
  .pillar:hover { background: var(--bg-2); }
  .pillar-num {
    font-family: var(--serif); font-size: 64px;
    font-weight: 300; color: var(--accent);
    line-height: 1; letter-spacing: -0.02em;
  }
  .pillar-name {
    font-family: var(--serif); font-size: clamp(22px, 1.8vw, 28px);
    color: var(--ink); line-height: 1.2;
    letter-spacing: -0.015em;
  }
  .pillar-who {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* 09/10/11 Pillar detail pages */
  .slide-pillar { padding: 60px 0; }
  .slide-pillar .slide-inner { max-width: 1240px; }
  .pillar-header { margin-bottom: 32px; }
  .pillar-badge {
    display: inline-block; font-family: var(--mono);
    font-size: 10px; letter-spacing: 0.22em;
    color: var(--accent); border: 1px solid var(--accent);
    padding: 6px 10px; margin-bottom: 18px;
  }
  .pillar-h {
    font-family: var(--serif);
    font-size: clamp(40px, 5vw, 68px);
    line-height: 1.02; font-weight: 400;
    letter-spacing: -0.03em; margin-bottom: 14px;
  }
  .pillar-tag {
    font-family: var(--serif); font-size: clamp(17px, 1.4vw, 22px);
    color: var(--ink-dim); font-weight: 300;
    font-style: italic; max-width: 820px;
  }
  .pillar-body { display: grid; gap: 28px; }
  .pillar-lineage {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 24px; align-items: start;
  }
  .pillar-lineage:has(.lineage-step:nth-child(5)) {
    grid-template-columns: 1fr auto 1fr auto 1fr;
  }
  .lineage-step {
    border-top: 1px solid var(--line);
    padding-top: 16px;
  }
  .lineage-year {
    font-family: var(--mono); font-size: 11px;
    color: var(--accent); letter-spacing: 0.15em;
    margin-bottom: 8px;
  }
  .lineage-name {
    font-family: var(--serif); font-size: 20px;
    color: var(--ink); margin-bottom: 10px;
    letter-spacing: -0.015em;
  }
  .lineage-note {
    font-family: var(--serif); font-size: 14px;
    line-height: 1.55; color: var(--ink-dim);
    font-weight: 300;
  }
  .lineage-note em { color: var(--accent-2); font-style: italic; }
  .lineage-id {
    display: block; margin: 6px 0 8px;
    font-size: 12px; color: var(--ink-faint);
    font-style: italic;
  }
  .lineage-id::before {
    content: 'ID · '; font-family: var(--mono);
    font-style: normal; font-size: 9px;
    letter-spacing: 0.15em; color: var(--accent);
    margin-right: 4px;
  }
  .lineage-arrow {
    font-family: var(--serif); font-size: 28px;
    color: var(--accent); align-self: center;
    padding-top: 12px;
  }
  .pillar-quote {
    border-left: 2px solid var(--accent);
    padding: 18px 28px; max-width: 940px;
  }
  .pillar-quote p {
    font-family: var(--serif); font-size: clamp(17px, 1.4vw, 21px);
    line-height: 1.5; color: var(--ink);
    font-style: italic; font-weight: 300; margin-bottom: 10px;
  }
  .pillar-quote cite {
    font-family: var(--mono); font-size: 10px;
    font-style: normal; color: var(--ink-dim);
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .pillar-apply {
    font-family: var(--serif); font-size: 16px;
    line-height: 1.6; color: var(--ink-dim);
    padding: 18px 22px; background: var(--bg-2);
    border: 1px solid var(--line); max-width: 940px;
  }
  .pillar-apply strong {
    color: var(--accent); font-weight: 600;
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.14em; text-transform: uppercase;
    margin-right: 10px;
  }
  .pillar-stat {
    border: 1px solid var(--line); background: var(--bg-2);
    padding: 22px 26px; max-width: 560px;
    display: grid; gap: 8px;
  }
  .pillar-stat-big {
    font-family: var(--serif); font-size: 52px;
    font-weight: 400; color: var(--accent);
    line-height: 1; letter-spacing: -0.03em;
  }
  .pillar-stat-label {
    font-family: var(--serif); font-size: 15px;
    color: var(--ink); line-height: 1.4;
  }
  .pillar-stat-src { color: var(--ink-faint); font-family: var(--mono); font-size: 11px; }
  .pillar-stat-note {
    font-family: var(--serif); font-size: 14px;
    color: var(--ink-dim); font-style: italic;
  }

  /* 12 Conclusion */
  .slide-conclusion::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(255,92,46,0.12), transparent 60%);
    pointer-events: none;
  }
  .conclusion-h {
    font-family: var(--serif);
    font-size: clamp(36px, 5.5vw, 78px);
    line-height: 1.18; font-weight: 300;
    letter-spacing: -0.025em; color: var(--ink-dim);
    display: flex; flex-direction: column; gap: 18px;
    max-width: 1200px; margin: 0 auto;
  }
  .conclusion-line { display: block; }
  .conclusion-emph { color: var(--ink); }

  /* 13 Final */
  .slide-final::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 30%, rgba(234,223,200,0.08), transparent 55%);
    pointer-events: none;
  }
  .final-label {
    font-family: var(--mono); font-size: 11px;
    color: var(--accent); letter-spacing: 0.22em;
    text-transform: uppercase; margin-bottom: 32px;
  }
  .final-h {
    font-family: var(--serif);
    font-size: clamp(40px, 6vw, 84px);
    line-height: 1.04; font-weight: 400;
    letter-spacing: -0.035em; color: var(--ink);
    margin-bottom: 40px; max-width: 1100px; margin-inline: auto;
  }
  .final-sub {
    font-family: var(--serif); font-size: clamp(18px, 1.6vw, 24px);
    line-height: 1.55; color: var(--ink-dim);
    font-weight: 300; max-width: 700px;
    margin: 0 auto 56px;
  }
  .final-sub em { color: var(--accent); font-style: italic; }
  .final-sign {
    display: inline-block; border-top: 1px solid var(--line);
    padding-top: 20px;
  }
  .final-sign-name {
    font-family: var(--serif); font-size: 20px;
    color: var(--ink); margin-bottom: 6px;
  }
  .final-sign-role {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .final-kbd {
    margin-top: 40px; font-family: var(--mono);
    font-size: 11px; color: var(--ink-faint);
    letter-spacing: 0.1em;
  }

  /* Tablet */
  @media (max-width: 1100px) {
    .showcase-grid { grid-template-columns: repeat(3, 1fr); }
    .slide-inner { padding: 0 48px; }
    .timeline {
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }
    .tl-arrow { display: none; }
    .cc-panel { grid-template-columns: 1fr; }
  }

  /* Mobile */
  @media (max-width: 760px) {
    html, body { overflow: auto; height: auto; }
    .page { overflow: visible; }
    .deck { position: static; inset: auto; height: auto; overflow: visible; }

    .slide {
      min-height: 100svh; height: auto;
      padding: 96px 0 96px;
      scroll-snap-stop: normal;
    }
    .slide-inner { padding: 0 22px; max-width: 100%; }

    /* Chrome */
    .deck-home {
      top: 16px; left: 16px; font-size: 10px;
      background: var(--bg);
      padding: 6px 10px; border: 1px solid var(--line);
    }
    .deck-event {
      top: 16px; right: 16px;
      font-size: 9px; padding: 6px 10px; gap: 6px;
      letter-spacing: 0.12em;
      background: var(--bg);
    }
    .deck-chrome {
      bottom: 16px; right: 16px; gap: 8px;
      background: var(--bg);
      padding: 6px 8px; border: 1px solid var(--line);
    }
    .deck-arrow { width: 30px; height: 30px; font-size: 12px; }
    .deck-counter { font-size: 11px; min-width: 56px; }
    .deck-dots { display: none; }

    /* Section labels — stronger on mobile */
    .slide-num {
      margin-bottom: 24px;
      padding: 6px 10px 6px 0;
      font-size: 11px;
    }
    .slide-num::before { width: 22px; }

    /* Typography scale down */
    .slide-h   { font-size: clamp(30px, 9vw, 48px); margin-bottom: 24px; }
    .slide-h-sm { font-size: clamp(28px, 8vw, 40px); }
    .slide-lede { font-size: 15px; }

    /* Profile */
    .profile-grid { grid-template-columns: 1fr; gap: 32px; }
    .profile-photo-wrap { max-height: 300px; }
    .profile-name { font-size: clamp(40px, 11vw, 64px); margin-bottom: 14px; }
    .profile-role { font-size: 11px; margin-bottom: 28px; }
    .profile-links { gap: 10px; }
    .profile-link { padding: 14px 20px; min-width: 0; flex: 1; }

    /* Cover */
    .deck-meta { margin-bottom: 32px; font-size: 10px; gap: 8px; }
    .cover-title { font-size: clamp(40px, 12vw, 64px); margin-bottom: 24px; }
    .cover-sub   { font-size: clamp(18px, 5vw, 24px); margin-bottom: 40px; }
    /* QR scan slide */
    .qr-meta { margin-bottom: 32px; flex-direction: column; gap: 4px; }
    .qr-meta .sep { display: none; }
    .qr-label { font-size: 11px; letter-spacing: 0.22em; margin-bottom: 20px; }
    .qr-big-card { padding: 18px; margin-bottom: 22px; }
    .qr-big-card img { width: 240px; height: 240px; }
    .qr-url-big { font-size: 11px; margin-bottom: 18px; }
    .qr-note { font-size: 14px; margin-bottom: 28px; }

    /* Final actions */
    .final-actions { margin: 28px 0 16px; }
    .final-actions .btn { width: 100%; justify-content: center; }

    /* Stats */
    .stats-grid { grid-template-columns: 1fr; }
    .stat-cell, .stat-cell-wide { grid-column: auto; padding: 22px 20px; }
    .stat-big { font-size: clamp(36px, 10vw, 52px); margin-bottom: 10px; }

    /* Quotes */
    .slide-quote { padding: 18px 20px; margin-top: 28px; }
    .slide-quote p { font-size: 17px; }
    .quote-id { font-size: 13px; }

    /* Pullquote */
    .pull-text { font-size: clamp(28px, 8vw, 44px); }
    .question-h { font-size: clamp(28px, 7.5vw, 44px); }

    /* Transformation split */
    .split-grid { grid-template-columns: 1fr; gap: 14px; margin-top: 28px; }
    .split-col { padding: 22px 20px; }
    .split-title { font-size: 22px; margin-bottom: 14px; }
    .split-list li { font-size: 14px; }
    .split-arrow {
      transform: rotate(90deg); padding: 4px 0;
      font-size: 32px; justify-self: center;
    }

    /* Timeline + Claude Code panel */
    .timeline {
      grid-template-columns: 1fr 1fr;
      gap: 18px 14px; padding: 20px 0; margin: 24px 0 20px;
    }
    .tl-arrow { display: none; }
    .tl-tool { font-size: 17px; }
    .cc-panel { grid-template-columns: 1fr; margin-bottom: 20px; }
    .cc-panel-left, .cc-panel-right { padding: 20px 18px; }
    .cc-name { font-size: 24px; }
    .cc-list li { font-size: 14px; gap: 8px; }
    .cc-list .cc-check { flex: 0 0 16px; }

    /* Showcase */
    .showcase-grid { grid-template-columns: repeat(2, 1fr); margin: 20px 0 28px; }
    .showcase-cell { padding: 18px 16px; }
    .showcase-cell:last-child { grid-column: span 2; }
    .showcase-name { font-size: 15px; }

    /* Math */
    .math-row { flex-direction: column; align-items: stretch; gap: 14px; margin-top: 28px; }
    .math-cell { padding: 20px 22px; min-width: 0; }
    .math-op { align-self: center; font-size: 28px; }
    .math-big { font-size: clamp(32px, 10vw, 48px); }

    /* Pillars overview */
    .pillars { grid-template-columns: 1fr; margin-top: 28px; }
    .pillar { padding: 28px 22px; gap: 10px; }
    .pillar-num { font-size: 44px; }
    .pillar-name { font-size: 20px; }

    /* Pillar detail */
    .slide-pillar { padding: 80px 0; }
    .pillar-header { margin-bottom: 24px; }
    .pillar-badge { font-size: 9px; padding: 5px 9px; margin-bottom: 14px; }
    .pillar-h { font-size: clamp(28px, 8vw, 44px); }
    .pillar-tag { font-size: 15px; }
    .pillar-body { gap: 20px; }
    .pillar-lineage,
    .pillar-lineage:has(.lineage-step:nth-child(5)) {
      grid-template-columns: 1fr; gap: 16px;
    }
    .lineage-step { padding-top: 14px; }
    .lineage-name { font-size: 17px; margin-bottom: 8px; }
    .lineage-note { font-size: 13px; }
    .lineage-arrow {
      transform: rotate(90deg); padding: 0;
      font-size: 22px; justify-self: start;
    }
    .pillar-quote { padding: 14px 20px; }
    .pillar-quote p { font-size: 15px; }
    .pillar-apply { padding: 16px 18px; font-size: 14px; }
    .pillar-apply strong { display: block; margin-bottom: 6px; margin-right: 0; }
    .pillar-stat { padding: 18px 20px; }
    .pillar-stat-big { font-size: 40px; }
    .pillar-stat-label { font-size: 13px; }

    /* Conclusion */
    .conclusion-h { font-size: clamp(26px, 7.5vw, 44px); gap: 12px; }

    /* Final */
    .final-h { font-size: clamp(30px, 8vw, 52px); }
    .final-sub { font-size: 16px; margin-bottom: 40px; }
    .final-sign-name { font-size: 17px; }
    .final-kbd { margin-top: 28px; font-size: 10px; }
  }

  @media (max-width: 420px) {
    .showcase-grid { grid-template-columns: 1fr; }
    .showcase-cell:last-child { grid-column: auto; }
    .slide-inner { padding: 0 18px; }
  }
`;
