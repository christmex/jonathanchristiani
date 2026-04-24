"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowLeft, ArrowUp, ArrowDown, Check } from "lucide-react";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";

const TOTAL_SLIDES = 9;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: "easeOut" } },
};

export default function LearnFromJoshPage() {
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
        e.preventDefault(); goTo(current + 1);
      } else if (["ArrowUp", "PageUp", "ArrowLeft"].includes(e.key)) {
        e.preventDefault(); goTo(current - 1);
      } else if (e.key === "Home") {
        e.preventDefault(); goTo(1);
      } else if (e.key === "End") {
        e.preventDefault(); goTo(TOTAL_SLIDES);
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
        let best: IntersectionObserverEntry | null = null;
        entries.forEach((e) => {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
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
    <PageShell cursorXSpring={cursorXSpring} cursorYSpring={cursorYSpring} cursorHovering={cursorHovering} blobs={3}>
      <style>{css}</style>

      <Link href="/slider" className="deck-home" onMouseEnter={() => setCursorHovering(true)} onMouseLeave={() => setCursorHovering(false)}>
        <span className="inline-icon"><ArrowLeft size={14} strokeWidth={1.75} /> slides</span>
      </Link>

      <div className="deck-event" aria-hidden="true">
        <span>LEARN FROM JOSH</span>
        <span className="sep">·</span>
        <span>NOTES</span>
      </div>

      <div className="deck-chrome" aria-hidden="true">
        <button type="button" className="deck-arrow" onClick={() => goTo(current - 1)} onMouseEnter={() => setCursorHovering(true)} onMouseLeave={() => setCursorHovering(false)} aria-label="Previous slide">
          <ArrowUp size={16} strokeWidth={1.75} />
        </button>
        <div className="deck-counter">
          <span className="deck-counter-cur">{String(current).padStart(2, "0")}</span>
          <span className="deck-counter-sep">/</span>
          <span className="deck-counter-tot">{String(TOTAL_SLIDES).padStart(2, "0")}</span>
        </div>
        <button type="button" className="deck-arrow" onClick={() => goTo(current + 1)} onMouseEnter={() => setCursorHovering(true)} onMouseLeave={() => setCursorHovering(false)} aria-label="Next slide">
          <ArrowDown size={16} strokeWidth={1.75} />
        </button>
      </div>

      <div className="deck-dots" aria-hidden="true">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button key={i} type="button" className={`deck-dot${i + 1 === current ? " active" : ""}`} onClick={() => goTo(i + 1)} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>

      <div className="deck" ref={scrollerRef}>

        {/* 01 — Cover */}
        <section className="slide slide-cover" data-slide={1}>
          <div className="slide-inner">
            <motion.div initial="hidden" animate="show" variants={fadeIn}>
              <motion.div className="cover-kicker" variants={fadeUp}>CATATAN DARI SEBUAH PERCAKAPAN</motion.div>
              <motion.h1 className="cover-title" variants={fadeUp}>
                Learn from<br /><em>Josh.</em>
              </motion.h1>
              <motion.p className="cover-sub" variants={fadeUp}>
                Lessons on craft, mindset, and how to work well.
              </motion.p>
              <motion.div className="cover-hint" variants={fadeUp}>tekan <kbd>↓</kbd> untuk mulai</motion.div>
            </motion.div>
          </div>
        </section>

        {/* 02 — Always Simplify */}
        <section className="slide" data-slide={2}>
          <div className="slide-inner slide-center">
            <div className="slide-num">§ 01 — SIMPLIFY</div>
            <h2 className="principle-h">
              Always simplify<br />
              <em>complex problems</em><br />
              into simple solutions.
            </h2>
            <p className="principle-sub">
              Kerumitan bukan tanda keahlian. Solusi paling elegan adalah
              yang paling mudah dipahami — oleh siapa pun, kapan pun.
            </p>
          </div>
        </section>

        {/* 03 — Attention to Detail */}
        <section className="slide" data-slide={3}>
          <div className="slide-inner">
            <div className="slide-num">§ 02 — CRAFT</div>
            <h2 className="slide-h slide-h-sm">Detail kecil <em>mencerminkan profesionalisme.</em></h2>
            <div className="craft-grid">
              <div className="craft-card">
                <div className="craft-num">01</div>
                <h3 className="craft-title">Attention to Detail</h3>
                <p className="craft-desc">
                  Selalu perhatikan hal-hal kecil — margin, padding, konsistensi
                  desain. Detail yang terlewat adalah yang pertama kali dilihat klien.
                  Justru karena kecil, itulah yang paling mudah diperbaiki.
                </p>
              </div>
              <div className="craft-card craft-card-accent">
                <div className="craft-num">02</div>
                <h3 className="craft-title">Client-Ready Mindset</h3>
                <p className="craft-desc">
                  Bangun fitur dan solusi yang stabil, polished, dan siap ditunjukkan
                  ke klien. Tujuannya: hasilkan sesuatu yang bisa kita banggakan
                  dan klien anggap profesional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 04 — DONE */}
        <section className="slide slide-done" data-slide={4}>
          <div className="slide-inner slide-center">
            <div className="slide-num">§ 03 — DEFINITION OF DONE</div>
            <div className="done-word">DONE.</div>
            <p className="done-sub">
              Hanya sebut sesuatu <em>"selesai"</em> ketika kamu benar-benar yakin
              hasilnya solid, stabil, dan bebas bug —
              sesuatu yang tidak mudah rusak oleh siapa pun.
            </p>
            <div className="done-rule">
              <Check size={14} strokeWidth={2} />
              Solid &amp; stable
              <Check size={14} strokeWidth={2} />
              Bug-free
              <Check size={14} strokeWidth={2} />
              Nobody can easily break it
            </div>
          </div>
        </section>

        {/* 05 — What How What */}
        <section className="slide" data-slide={5}>
          <div className="slide-inner">
            <div className="slide-num">§ 04 — CLIENT FRAMEWORK</div>
            <h2 className="slide-h slide-h-sm">
              Tiga pertanyaan yang selalu <em>harus dijawab</em> bersama klien.
            </h2>
            <div className="whw-row">
              <div className="whw-item">
                <div className="whw-num">01</div>
                <div className="whw-q">What</div>
                <div className="whw-label">does the client want?</div>
                <p className="whw-desc">
                  Pahami kebutuhan, bukan hanya permintaan.
                  Apa masalah sebenarnya yang ingin diselesaikan?
                </p>
              </div>
              <div className="whw-divider" />
              <div className="whw-item">
                <div className="whw-num">02</div>
                <div className="whw-q">How</div>
                <div className="whw-label">will we build it?</div>
                <p className="whw-desc">
                  Tentukan pendekatan, tools, dan batasan sebelum mulai.
                  Satu halaman rencana lebih baik dari seminggu asumsi.
                </p>
              </div>
              <div className="whw-divider" />
              <div className="whw-item">
                <div className="whw-num">03</div>
                <div className="whw-q">What</div>
                <div className="whw-label">did we actually build?</div>
                <p className="whw-desc">
                  Verifikasi bahwa hasil akhir menjawab pertanyaan pertama.
                  Tutup loop — jangan biarkan klien menebak sendiri.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 06 — Prioritization */}
        <section className="slide" data-slide={6}>
          <div className="slide-inner">
            <div className="slide-num">§ 05 — PRIORITIZATION</div>
            <h2 className="slide-h slide-h-sm">
              <em>Must-have</em> dulu. Nice-to-have belakangan.
            </h2>
            <div className="prio-grid">
              <div className="prio-card prio-must">
                <div className="prio-tag">MUST-HAVE</div>
                <h3 className="prio-title">Kerjakan ini dulu.</h3>
                <p className="prio-desc">
                  Fitur yang jika tidak ada, produk tidak bisa berfungsi
                  atau klien tidak bisa menerima delivery. Ini yang dikerjakan
                  pertama, tanpa kompromi.
                </p>
                <div className="prio-examples">
                  <span>Core functionality</span>
                  <span>Auth &amp; access control</span>
                  <span>Data integrity</span>
                </div>
              </div>
              <div className="prio-card prio-nice">
                <div className="prio-tag prio-tag-dim">NICE-TO-HAVE</div>
                <h3 className="prio-title">Kerjakan jika ada waktu.</h3>
                <p className="prio-desc">
                  Fitur yang menambah nilai tapi bukan blocker. Bisa dikerjakan
                  setelah must-have selesai — atau dijadwal di iterasi berikutnya.
                </p>
                <div className="prio-examples prio-examples-dim">
                  <span>UI polish</span>
                  <span>Advanced filters</span>
                  <span>Export format tambahan</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 07 — Value × Efficiency Matrix */}
        <section className="slide" data-slide={7}>
          <div className="slide-inner">
            <div className="slide-num">§ 06 — DECISION MATRIX</div>
            <h2 className="slide-h slide-h-sm">
              Bangun yang <em>high value + high efficient</em> terlebih dahulu.
            </h2>
            <div className="matrix-wrap">
              <div className="matrix">
                {/* Axis labels */}
                <div className="matrix-label matrix-top">High Value</div>
                <div className="matrix-label matrix-bottom">Low Value</div>
                <div className="matrix-label matrix-left">Low Efficient</div>
                <div className="matrix-label matrix-right">High Efficient</div>

                {/* Quadrants */}
                <div className="matrix-grid">
                  <div className="quadrant q-tl">
                    <div className="q-title">Penting, tapi lambat</div>
                    <div className="q-desc">Plan carefully — jangan skip, tapi cari cara lebih efisien</div>
                  </div>
                  <div className="quadrant q-tr quadrant-star">
                    <div className="q-star">★</div>
                    <div className="q-title">Prioritas utama</div>
                    <div className="q-desc">High value + high efficiency — kerjakan ini lebih dulu, selalu</div>
                  </div>
                  <div className="quadrant q-bl">
                    <div className="q-title">Hindari</div>
                    <div className="q-desc">Buang waktu, tidak menghasilkan nilai nyata</div>
                  </div>
                  <div className="quadrant q-br">
                    <div className="q-title">Quick wins</div>
                    <div className="q-desc">Cepat dikerjakan tapi nilai rendah — kerjakan jika ada sisa waktu</div>
                  </div>
                </div>

                {/* Cross lines */}
                <div className="matrix-hline" />
                <div className="matrix-vline" />
              </div>
            </div>
          </div>
        </section>

        {/* 08 — Work-Life Balance */}
        <section className="slide" data-slide={8}>
          <div className="slide-inner">
            <div className="slide-num">§ 07 — SUSTAINABILITY</div>
            <h2 className="slide-h slide-h-sm">
              Hasil terbaik datang dari orang yang <em>benar-benar istirahat.</em>
            </h2>
            <div className="wlb-list">
              <div className="wlb-item">
                <div className="wlb-icon">○</div>
                <div className="wlb-content">
                  <div className="wlb-title">No weekends</div>
                  <div className="wlb-desc">Hindari kerja di akhir pekan. Burnout tidak pernah menghasilkan kerja yang bagus.</div>
                </div>
              </div>
              <div className="wlb-item">
                <div className="wlb-icon">○</div>
                <div className="wlb-content">
                  <div className="wlb-title">Shift your mindset</div>
                  <div className="wlb-desc">Dari &ldquo;I can&rsquo;t&rdquo; ke &ldquo;Of course I can do it.&rdquo; — dan dari &ldquo;I don&rsquo;t know&rdquo; ke &ldquo;I will eventually learn.&rdquo;</div>
                </div>
              </div>
              <div className="wlb-item">
                <div className="wlb-icon">○</div>
                <div className="wlb-content">
                  <div className="wlb-title">Sleep well</div>
                  <div className="wlb-desc">Tidur yang cukup adalah investasi untuk tetap tajam, sehat, dan produktif esok hari.</div>
                </div>
              </div>
              <div className="wlb-item">
                <div className="wlb-icon">○</div>
                <div className="wlb-content">
                  <div className="wlb-title">Stay positive</div>
                  <div className="wlb-desc">Yang tidak kamu tahu hari ini — suatu saat kamu pasti bisa pelajari. Proses itu bagian dari pekerjaannya.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 09 — Closing / Credits */}
        <section className="slide slide-final" data-slide={9}>
          <div className="slide-inner slide-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="final-label">TERIMA KASIH</div>
              <h2 className="final-h">
                Thank you,<br /><em>Josh.</em>
              </h2>
              <p className="final-sub">
                For the lessons, the framework, and the reminder
                that doing good work starts with <em>thinking clearly.</em>
              </p>
              <div className="final-actions">
                <button type="button" className="btn btn-primary" onClick={() => goTo(1)} onMouseEnter={() => setCursorHovering(true)} onMouseLeave={() => setCursorHovering(false)}>
                  <span className="inline-icon"><ArrowUp size={14} strokeWidth={1.75} /> Kembali ke Awal</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </PageShell>
  );
}

const css = `
  /* ── Base deck ─────────────────────────────── */
  .deck { scroll-snap-type: y mandatory; overflow-y: auto; height: 100dvh; }
  .slide { scroll-snap-align: start; min-height: 100dvh; display: flex; flex-direction: column; position: relative; }
  .slide-inner {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    padding: 120px 60px 80px;
    max-width: 1400px; margin: 0 auto; width: 100%; box-sizing: border-box;
  }
  .slide-center { align-items: center; text-align: center; }

  /* ── Chrome ─────────────────────────────────── */
  .deck-home {
    position: fixed; top: 28px; left: 32px; z-index: 50;
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--ink-dim); text-decoration: none; transition: color 0.2s ease;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .deck-home:hover { color: var(--accent); }
  .deck-event {
    position: fixed; top: 28px; right: 32px; z-index: 50;
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--ink-faint); display: flex; align-items: center; gap: 10px;
  }
  .deck-event .sep { color: var(--line); }
  .deck-chrome {
    position: fixed; bottom: 28px; right: 32px; z-index: 100;
    display: flex; align-items: center; gap: 14px; font-family: var(--mono);
  }
  .deck-arrow {
    width: 36px; height: 36px; border: 1px solid var(--line); background: transparent;
    color: var(--ink-dim); cursor: pointer; font-size: 14px;
    display: inline-flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, color 0.2s;
  }
  .deck-arrow:hover { border-color: var(--ink); color: var(--ink); }
  .deck-counter { font-family: var(--mono); font-size: 11px; color: var(--ink-faint); letter-spacing: 0.1em; display: flex; align-items: center; gap: 4px; }
  .deck-counter-cur { color: var(--accent); }
  .deck-counter-sep { color: var(--line); }
  .deck-dots {
    position: fixed; bottom: 50%; right: 16px; transform: translateY(50%); z-index: 50;
    display: flex; flex-direction: column; gap: 6px;
  }
  .deck-dot { width: 5px; height: 5px; border-radius: 999px; background: var(--line); border: none; cursor: pointer; transition: background 0.2s, transform 0.2s; padding: 0; }
  .deck-dot.active { background: var(--accent); transform: scale(1.6); }
  .deck-dot:hover  { background: var(--ink-dim); }

  /* ── Shared type ──────────────────────────── */
  .slide-num { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 28px; }
  .slide-h { font-family: var(--serif); font-size: clamp(40px, 5.5vw, 80px); line-height: 1.02; font-weight: 400; letter-spacing: -0.03em; margin-bottom: 44px; }
  .slide-h em { font-style: italic; color: var(--accent); }
  .slide-h-sm { font-size: clamp(30px, 3.4vw, 52px); margin-bottom: 36px; }

  /* ── Cover ────────────────────────────────── */
  .cover-kicker { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 28px; }
  .cover-title { font-family: var(--serif); font-size: clamp(60px, 9vw, 130px); line-height: 0.96; font-weight: 400; letter-spacing: -0.04em; margin-bottom: 28px; }
  .cover-title em { font-style: italic; color: var(--accent); }
  .cover-sub { font-family: var(--mono); font-size: 14px; letter-spacing: 0.08em; color: var(--ink-dim); margin-bottom: 60px; }
  .cover-hint { font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }
  .cover-hint kbd { display: inline-block; padding: 2px 7px; border: 1px solid var(--line); font-family: var(--mono); font-size: 10px; color: var(--ink-dim); border-radius: 3px; }

  /* ── Principle (02) ───────────────────────── */
  .principle-h { font-family: var(--serif); font-size: clamp(44px, 6.5vw, 100px); line-height: 1.0; font-weight: 400; letter-spacing: -0.035em; margin-bottom: 36px; }
  .principle-h em { font-style: italic; color: var(--accent); }
  .principle-sub { font-size: 17px; line-height: 1.7; color: var(--ink-dim); max-width: 640px; }

  /* ── Craft (03) ───────────────────────────── */
  .craft-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .craft-card { padding: 36px 32px; border: 1px solid var(--line); background: var(--bg-2); }
  .craft-card-accent { border-color: var(--accent); }
  .craft-num { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; color: var(--accent); margin-bottom: 14px; }
  .craft-title { font-family: var(--serif); font-size: clamp(26px, 2.4vw, 34px); font-weight: 400; letter-spacing: -0.02em; margin-bottom: 16px; line-height: 1.1; }
  .craft-desc { font-size: 15px; line-height: 1.7; color: var(--ink-dim); }

  /* ── DONE (04) ────────────────────────────── */
  .done-word {
    font-family: var(--serif); font-size: clamp(80px, 14vw, 200px);
    line-height: 0.9; font-weight: 400; letter-spacing: -0.04em;
    color: var(--accent); margin-bottom: 40px;
  }
  .done-sub { font-size: 18px; line-height: 1.7; color: var(--ink-dim); max-width: 680px; margin: 0 auto 40px; }
  .done-sub em { font-style: normal; color: var(--ink); font-weight: 600; }
  .done-rule {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center;
    font-family: var(--mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--ink-dim);
  }
  .done-rule svg { color: var(--accent); }

  /* ── What–How–What (05) ───────────────────── */
  .whw-row { display: flex; gap: 0; align-items: stretch; }
  .whw-item { flex: 1; padding: 32px 28px; border: 1px solid var(--line); background: var(--bg-2); }
  .whw-item + .whw-item { border-left: none; }
  .whw-divider { display: none; }
  .whw-num { font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em; color: var(--ink-faint); margin-bottom: 10px; }
  .whw-q { font-family: var(--serif); font-size: clamp(40px, 5vw, 72px); font-weight: 400; letter-spacing: -0.03em; color: var(--accent); line-height: 1; margin-bottom: 8px; font-style: italic; }
  .whw-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-dim); margin-bottom: 18px; }
  .whw-desc { font-size: 14px; line-height: 1.65; color: var(--ink-dim); }

  /* ── Prioritization (06) ─────────────────── */
  .prio-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .prio-card { padding: 36px 32px; border: 1px solid var(--line); background: var(--bg-2); }
  .prio-must { border-color: var(--accent); }
  .prio-tag { font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 14px; display: inline-block; background: rgba(255,82,44,0.1); padding: 4px 10px; }
  .prio-tag-dim { color: var(--ink-faint); background: transparent; }
  .prio-title { font-family: var(--serif); font-size: clamp(24px, 2.2vw, 32px); font-weight: 400; letter-spacing: -0.02em; margin-bottom: 14px; line-height: 1.1; }
  .prio-desc { font-size: 14.5px; line-height: 1.65; color: var(--ink-dim); margin-bottom: 24px; }
  .prio-examples { display: flex; gap: 8px; flex-wrap: wrap; }
  .prio-examples span { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); padding: 5px 10px; border: 1px solid var(--accent); }
  .prio-examples-dim span { color: var(--ink-faint); border-color: var(--line); }

  /* ── Matrix (07) ────────────────────────── */
  .matrix-wrap { flex: 1; display: flex; align-items: center; }
  .matrix {
    position: relative; width: 100%; max-width: 820px;
    aspect-ratio: 4/2.6; margin: 0 auto;
  }
  .matrix-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    width: 100%; height: 100%; position: relative; z-index: 1;
  }
  .quadrant {
    padding: 24px 28px; display: flex; flex-direction: column; justify-content: center;
  }
  .q-tl { border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .q-tr { border-bottom: 1px solid var(--line); background: rgba(255,82,44,0.06); border: 1px solid var(--accent); }
  .q-bl { border-right: 1px solid var(--line); }
  .q-br {}
  .quadrant-star { position: relative; }
  .q-star { font-size: 22px; color: var(--accent); margin-bottom: 8px; line-height: 1; }
  .q-title { font-family: var(--serif); font-size: clamp(16px, 1.6vw, 22px); font-weight: 400; letter-spacing: -0.01em; margin-bottom: 6px; }
  .q-tr .q-title { color: var(--accent); }
  .q-desc { font-size: 12px; line-height: 1.55; color: var(--ink-dim); }

  .matrix-label {
    position: absolute; font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-faint);
  }
  .matrix-top    { top: -28px; left: 50%; transform: translateX(-50%); }
  .matrix-bottom { bottom: -28px; left: 50%; transform: translateX(-50%); }
  .matrix-left   { left: -90px; top: 50%; transform: translateY(-50%); }
  .matrix-right  { right: -90px; top: 50%; transform: translateY(-50%); }
  .matrix-hline, .matrix-vline { display: none; }

  /* ── Work-Life Balance (08) ─────────────── */
  .wlb-list { display: flex; flex-direction: column; gap: 2px; }
  .wlb-item { display: flex; gap: 24px; align-items: flex-start; padding: 24px 28px; border: 1px solid var(--line); background: var(--bg-2); }
  .wlb-icon { font-family: var(--mono); font-size: 14px; color: var(--accent); flex-shrink: 0; margin-top: 3px; }
  .wlb-title { font-family: var(--serif); font-size: clamp(20px, 1.8vw, 26px); font-weight: 400; letter-spacing: -0.01em; margin-bottom: 6px; }
  .wlb-desc { font-size: 14px; line-height: 1.6; color: var(--ink-dim); }

  /* ── Final (09) ─────────────────────────── */
  .final-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 28px; }
  .final-h { font-family: var(--serif); font-size: clamp(60px, 9vw, 130px); line-height: 0.96; font-weight: 400; letter-spacing: -0.04em; margin-bottom: 28px; }
  .final-h em { font-style: italic; color: var(--accent); }
  .final-sub { font-size: 16px; line-height: 1.7; color: var(--ink-dim); margin-bottom: 48px; max-width: 540px; margin-left: auto; margin-right: auto; }
  .final-sub em { font-style: normal; color: var(--ink); font-weight: 600; }
  .final-actions { margin-bottom: 16px; }

  /* ── Responsive ─────────────────────────── */
  @media (max-width: 960px) {
    .deck-home { top: 20px; left: 20px; }
    .deck-event { display: none; }
    .deck-chrome { bottom: 20px; right: 16px; }
    .deck-dots { display: none; }
    .slide-inner { padding: 100px 24px 60px; }
    .craft-grid, .prio-grid { grid-template-columns: 1fr; }
    .whw-row { flex-direction: column; }
    .whw-item + .whw-item { border-left: 1px solid var(--line); border-top: none; }
    .matrix-label { font-size: 9px; letter-spacing: 0.1em; }
    .matrix-left  { left: -72px; }
    .matrix-right { right: -72px; }
    .quadrant { padding: 16px; }
    .q-title { font-size: 14px; }
    .q-desc { font-size: 11px; }
    .done-word { font-size: clamp(60px, 20vw, 100px); }
    .principle-h { font-size: clamp(36px, 10vw, 64px); }
  }
`;
