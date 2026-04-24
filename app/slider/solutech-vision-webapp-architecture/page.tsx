"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight, Check } from "lucide-react";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";

const TOTAL_SLIDES = 10;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: "easeOut" } },
};

export default function SolutechVisionPage() {
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
        href="/"
        className="deck-home"
        onMouseEnter={() => setCursorHovering(true)}
        onMouseLeave={() => setCursorHovering(false)}
      >
        <span className="inline-icon"><ArrowLeft size={14} strokeWidth={1.75} /> jonathan christiani</span>
      </Link>

      {/* Top-right event meta */}
      <div className="deck-event" aria-hidden="true">
        <span>SOLUTECH</span>
        <span className="sep">·</span>
        <span>VISION SYSTEM</span>
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

        {/* 01 — Cover */}
        <section className="slide slide-cover" data-slide={1}>
          <div className="slide-inner">
            <motion.div initial="hidden" animate="show" variants={fadeIn}>
              <motion.div className="cover-kicker" variants={fadeUp}>
                SAVE THE CHILDREN INDONESIA · VISION SYSTEM
              </motion.div>
              <motion.h1 className="cover-title" variants={fadeUp}>
                Pendekatan &amp; <em>Best Practice</em>
                <br />
                Pengembangan Sistem.
              </motion.h1>
              <motion.p className="cover-sub" variants={fadeUp}>
                Web App Architecture — <strong>April 2026</strong>
              </motion.p>
              <motion.div className="cover-hint" variants={fadeUp}>
                tekan <kbd>↓</kbd> untuk mulai
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 02 — Filosofi */}
        <section className="slide slide-philosophy" data-slide={2}>
          <div className="slide-inner slide-center">
            <div className="slide-num">§ 01 — FILOSOFI</div>
            <h2 className="philosophy-h">
              Simplicity first.
              <br />
              <em>No over-engineering.</em>
            </h2>
            <p className="philosophy-sub">
              Prinsip utama: bangun apa yang dibutuhkan, bukan apa yang keren.
              Setiap tool, plugin, dan arsitektur harus punya alasan jelas —
              bukan karena &ldquo;industry standard&rdquo; atau &ldquo;hype&rdquo;.
              Sistem yang simpel lebih mudah di-maintain, di-debug, dan di-handover.
            </p>
            <div className="philosophy-tags">
              <span className="ph-tag">MAINTAINABLE</span>
              <span className="ph-tag">TESTABLE</span>
              <span className="ph-tag">MODULAR</span>
              <span className="ph-tag">PRAGMATIC</span>
            </div>
          </div>
        </section>

        {/* 03 — Tech Stack */}
        <section className="slide" data-slide={3}>
          <div className="slide-inner">
            <div className="slide-num">§ 02 — TECH STACK INTI</div>
            <h2 className="slide-h slide-h-sm">
              Pilihan yang <em>stable, proven,</em> dan siap enterprise.
            </h2>
            <div className="stack-grid">
              <div className="stack-card">
                <div className="stack-badge">BACKEND</div>
                <div className="stack-name">Laravel 13.x</div>
                <p className="stack-desc">
                  Version terbaru, <strong>no breaking changes</strong> dari Laravel 12.
                  Dokumentasi resmi klien menyebut v12, tapi saya rekomendasikan v13 —
                  zero breaking changes dan support window yang lebih panjang.
                </p>
              </div>
              <div className="stack-card">
                <div className="stack-badge">ADMIN &amp; CRUD</div>
                <div className="stack-name">Filament v5.x</div>
                <p className="stack-desc">
                  Latest release. Menangani CRUD, form, table, dashboard
                  out-of-the-box. Memotong waktu development dashboard internal
                  hingga <strong>70%</strong> dibanding custom build.
                </p>
              </div>
              <div className="stack-card">
                <div className="stack-badge">DEPLOYMENT</div>
                <div className="stack-name">Laravel Cloud</div>
                <p className="stack-desc">
                  First-party hosting. CI/CD, auto-scaling, zero-downtime deploy — semua built-in. Tidak perlu urus server sendiri.
                </p>
              </div>
            </div>

            <div className="stack-note">
              <span className="stack-note-label">DATABASE</span>
              <strong>MySQL</strong> sebagai starting point — pragmatis, matang, widely supported di Laravel ecosystem. Kalau di tengah jalan butuh pindah ke <strong>PostgreSQL</strong> juga tidak masalah, karena Laravel mengabstraksi keduanya lewat Eloquent — tidak perlu repository pattern.
            </div>
          </div>
        </section>

        {/* 04 — Development Approach */}
        <section className="slide" data-slide={4}>
          <div className="slide-inner">
            <div className="slide-num">§ 03 — DEVELOPMENT APPROACH</div>
            <h2 className="slide-h slide-h-sm">
              Dibangun dengan <em>AI-assisted development</em> — cepat dan akurat.
            </h2>
            <div className="dev-grid">
              <div className="dev-card dev-card-lg">
                <div className="dev-icon-wrap">
                  <span className="dev-icon-txt">CC</span>
                </div>
                <div className="dev-card-body">
                  <div className="dev-badge">PRIMARY TOOL</div>
                  <h3 className="dev-title">Claude Code</h3>
                  <p className="dev-desc">
                    Agentic coding assistant dari Anthropic. Menjalankan tugas
                    development end-to-end: baca codebase, tulis fitur, jalankan test,
                    debug error. Mempercepat delivery tanpa mengurangi kualitas —
                    selama output-nya direview.
                  </p>
                </div>
              </div>
              <div className="dev-card dev-card-lg">
                <div className="dev-icon-wrap">
                  <span className="dev-icon-txt">FB</span>
                </div>
                <div className="dev-card-body">
                  <div className="dev-badge">FILAMENT EXTENSION</div>
                  <h3 className="dev-title">Filament Blueprint</h3>
                  <p className="dev-desc">
                    Premium extension dari Laravel Boost. Memberi AI agent
                    pengetahuan spesifik tentang Filament — component namespace
                    yang benar, CLI command siap pakai, config chain yang akurat.
                    <strong> Meminimalkan hallucination</strong> saat generate kode Filament.
                  </p>
                </div>
              </div>
            </div>
            <div className="dev-note">
              <span className="dev-note-label">CATATAN</span>
              AI digunakan sebagai <em>accelerator</em>, bukan pengganti engineer.
              Setiap output direview manual, di-test, dan disesuaikan konteks bisnis.
            </div>
          </div>
        </section>

        {/* 05 — UI/UX */}
        <section className="slide" data-slide={5}>
          <div className="slide-inner">
            <div className="slide-num">§ 04 — UI / UX STRATEGY</div>
            <h2 className="slide-h slide-h-sm">
              Filament panel <em>sulit dikustomisasi berat.</em> Kita punya 3 opsi.
            </h2>
            <div className="uiux-grid">
              <div className="uiux-card">
                <div className="uiux-num">01</div>
                <div className="uiux-tag uiux-tag-good">RECOMMENDED</div>
                <h3 className="uiux-title">Filament Themes Plugin</h3>
                <p className="uiux-desc">
                  Plugin resmi dari Zep Fietje — designer di balik Filament itu sendiri.
                  Memberikan tema profesional siap pakai, dark mode, multilingual,
                  dan support Filament 3/4/5. Harga €59.
                </p>
                <div className="uiux-trade">
                  <div className="tr-row"><span className="tr-plus">+</span> Dibuat oleh orang yang sama yang desain Filament</div>
                  <div className="tr-row"><span className="tr-plus">+</span> Dark mode, update berkala, tanpa perlu CSS</div>
                  <div className="tr-row"><span className="tr-minus">−</span> Biaya lisensi (€59 one-time)</div>
                </div>
              </div>
              <div className="uiux-card">
                <div className="uiux-num">02</div>
                <div className="uiux-tag">ALTERNATIVE</div>
                <h3 className="uiux-title">Flux UI + Filament</h3>
                <p className="uiux-desc">
                  Flux UI dibangun di atas Livewire — stack yang sama dengan Filament.
                  Secara teori bisa dipakai berdampingan. Namun beberapa laporan
                  dari community menyebutkan ada konflik kecil — bisa di-fix,
                  tapi sejauh mana integrasi penuhnya belum bisa dipastikan.
                </p>
                <div className="uiux-trade">
                  <div className="tr-row"><span className="tr-plus">+</span> Fleksibel untuk halaman custom</div>
                  <div className="tr-row"><span className="tr-plus">+</span> Stack konsisten (Livewire)</div>
                  <div className="tr-row"><span className="tr-minus">−</span> Potensi konflik — sejauh mana integrasi penuh belum pasti</div>
                </div>
              </div>
              <div className="uiux-card">
                <div className="uiux-num">03</div>
                <div className="uiux-tag uiux-tag-warn">IF NEEDED</div>
                <h3 className="uiux-title">Custom Development</h3>
                <p className="uiux-desc">
                  Bangun UI sendiri dari nol untuk bagian yang benar-benar butuh
                  identitas unik. Dilakukan hanya jika dua opsi di atas tidak cukup.
                </p>
                <div className="uiux-trade">
                  <div className="tr-row"><span className="tr-plus">+</span> Kontrol penuh</div>
                  <div className="tr-row"><span className="tr-minus">−</span> Waktu &amp; biaya paling besar</div>
                  <div className="tr-row"><span className="tr-minus">−</span> Maintenance beban sendiri</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 06 — Arsitektur Modular */}
        <section className="slide" data-slide={6}>
          <div className="slide-inner">
            <div className="slide-num">§ 05 — ARSITEKTUR MODULAR</div>
            <h2 className="slide-h slide-h-sm">
              Satu aplikasi. <em>Banyak panel.</em> Satu codebase.
            </h2>

            <div className="panel-row">
              <div className="panel-card">
                <div className="panel-label">PANEL</div>
                <div className="panel-name">HR</div>
                <div className="panel-desc">Karyawan, absensi, payroll</div>
              </div>
              <div className="panel-card">
                <div className="panel-label">PANEL</div>
                <div className="panel-name">Finance</div>
                <div className="panel-desc">Anggaran, pengeluaran, laporan</div>
              </div>
              <div className="panel-card panel-card-admin">
                <div className="panel-label">PANEL</div>
                <div className="panel-name">Administrator</div>
                <div className="panel-desc">User, role, system config</div>
              </div>
              <div className="panel-card panel-card-etc">
                <div className="panel-label">DAN SETERUSNYA</div>
                <div className="panel-name">etc.</div>
                <div className="panel-desc">Panel baru ditambah sesuai kebutuhan</div>
              </div>
            </div>

            <div className="pattern-grid">
              <div className="pattern-item">
                <div className="pattern-tag">EKSTERNAL</div>
                <div className="pattern-name">DTO + Service Pattern</div>
                <p className="pattern-desc">
                  Layer integrasi untuk Oracle dan API eksternal. Data masuk
                  lewat DTO (Data Transfer Object), diproses di service —
                  tidak menyentuh logika bisnis langsung.
                </p>
              </div>
              <div className="pattern-item">
                <div className="pattern-tag">INTERNAL</div>
                <div className="pattern-name">Action Pattern</div>
                <p className="pattern-desc">
                  Setiap operasi bisnis (CreateInvoice, ApproveRequest, dsb)
                  diisolasi sebagai single-purpose Action class.
                  Mudah di-test, reusable lintas controller dan job.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 07 — RBAC */}
        <section className="slide" data-slide={7}>
          <div className="slide-inner">
            <div className="slide-num">§ 06 — ACCESS CONTROL (RBAC)</div>
            <h2 className="slide-h slide-h-sm">
              Mulai <em>sederhana.</em> Naikkan kompleksitas hanya jika perlu.
            </h2>
            <div className="rbac-grid">
              <div className="rbac-card rbac-primary">
                <div className="rbac-tag">DEFAULT</div>
                <h3 className="rbac-title">ENUM Role + Panel-Based Permission</h3>
                <p className="rbac-desc">
                  Role sebagai PHP Enum sederhana (HR, Finance, Admin, Viewer).
                  Permission dikontrol <strong>per Filament panel</strong> — user
                  HR hanya bisa masuk panel HR, Finance hanya panel Finance.
                </p>
                <div className="rbac-why">
                  <div className="rbac-why-label">KENAPA PENDEKATAN INI?</div>
                  <ul className="rbac-why-list">
                    <li>Sudah cukup untuk 90% kebutuhan real-world</li>
                    <li>Tidak perlu extra database table untuk permission</li>
                    <li>Code lebih sederhana — mudah di-debug &amp; handover</li>
                    <li>Terbukti di banyak project klien lokal &amp; luar</li>
                  </ul>
                </div>
              </div>
              <div className="rbac-card rbac-secondary">
                <div className="rbac-tag rbac-tag-alt">ESCAPE HATCH</div>
                <h3 className="rbac-title">Filament Shield + Spatie Permission</h3>
                <p className="rbac-desc">
                  Hanya jika kebutuhan benar-benar butuh permission granular
                  per-resource (misal: user A boleh lihat invoice tapi tidak boleh
                  approve). Kita migrasi ke Filament Shield yang sudah terintegrasi
                  dengan Spatie Permission.
                </p>
                <div className="rbac-when">
                  <span className="rbac-when-label">KAPAN DIPAKAI:</span>
                  ketika requirement muncul — bukan di awal.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 08 — Quality & Plugins */}
        <section className="slide" data-slide={8}>
          <div className="slide-inner">
            <div className="slide-num">§ 07 — QUALITY &amp; DEVELOPMENT</div>
            <h2 className="slide-h slide-h-sm">
              <em>TDD</em> sebagai fondasi.
            </h2>

            <div className="tdd-block">
              <div className="tdd-label">METODOLOGI</div>
              <div className="tdd-title">Test-Driven Development (TDD)</div>
              <p className="tdd-desc">
                Setiap fitur yang ada harus memiliki feature testing.
              </p>
            </div>

            <div className="plugin-groups">
              <div className="plugin-group">
                <div className="plugin-group-label">CODE QUALITY</div>
                <div className="plugin-list">
                  <div className="plugin-item"><span className="plugin-name">Laravel Pint</span><span className="plugin-role">Code formatter</span></div>
                  <div className="plugin-item"><span className="plugin-name">Larastan</span><span className="plugin-role">Static analysis</span></div>
                  <div className="plugin-item"><span className="plugin-name">Laravel IDE Helper</span><span className="plugin-role">Autocomplete</span></div>
                </div>
              </div>
              <div className="plugin-group">
                <div className="plugin-group-label">TESTING &amp; DEBUG</div>
                <div className="plugin-list">
                  <div className="plugin-item"><span className="plugin-name">Pest</span><span className="plugin-role">Testing framework</span></div>
                  <div className="plugin-item"><span className="plugin-name">Laravel Ray</span><span className="plugin-role">Runtime debugging</span></div>
                  <div className="plugin-item"><span className="plugin-name">Laravel Debugbar</span><span className="plugin-role">Dev profiling</span></div>
                </div>
              </div>
              <div className="plugin-group">
                <div className="plugin-group-label">API &amp; DATA</div>
                <div className="plugin-list">
                  <div className="plugin-item"><span className="plugin-name">Dedoc Scramble</span><span className="plugin-role">Auto API docs</span></div>
                  <div className="plugin-item"><span className="plugin-name">Spatie Query Builder</span><span className="plugin-role">API filter/sort</span></div>
                  <div className="plugin-item"><span className="plugin-name">Laravel Boost</span><span className="plugin-role">AI toolkit</span></div>
                </div>
              </div>
              <div className="plugin-group">
                <div className="plugin-group-label">FILAMENT EXTRA</div>
                <div className="plugin-list">
                  <div className="plugin-item"><span className="plugin-name">Filament Currency</span><span className="plugin-role">Format mata uang</span></div>
                  <div className="plugin-item"><span className="plugin-name">Filament Shield</span><span className="plugin-role">RBAC (if needed)</span></div>
                  <div className="plugin-item"><span className="plugin-name">Filament Blueprint</span><span className="plugin-role">AI-assisted dev</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 09 — Enterprise Considerations */}
        <section className="slide" data-slide={9}>
          <div className="slide-inner">
            <div className="slide-num">§ 08 — ENTERPRISE CONSIDERATIONS</div>
            <h2 className="slide-h slide-h-sm">
              Hal-hal yang <em>sering terlewat</em> tapi penting untuk sistem serius.
            </h2>
            <div className="ent-grid">
              <div className="ent-cell">
                <div className="ent-label">OPERATIONAL</div>
                <ul className="ent-list">
                  <li><strong>Environment strategy:</strong> dev / staging / production terpisah</li>
                  <li><strong>Queue system:</strong> untuk export PDF/Excel &amp; sync Oracle (non-blocking)</li>
                  <li><strong>Cache layer:</strong> Redis untuk session &amp; dashboard performance</li>
                  <li><strong>Backup &amp; restore drill:</strong> otomatis harian + simulasi restore berkala</li>
                </ul>
              </div>
              <div className="ent-cell">
                <div className="ent-label">SECURITY</div>
                <ul className="ent-list">
                  <li><strong>2FA</strong> untuk admin panel (built-in Filament)</li>
                  <li><strong>Rate limiting</strong> per-user per-endpoint</li>
                  <li><strong>Session timeout</strong> + logout across devices</li>
                  <li><strong>Audit trail</strong> (activity logging) untuk compliance</li>
                </ul>
              </div>
              <div className="ent-cell">
                <div className="ent-label">OBSERVABILITY</div>
                <ul className="ent-list">
                  <li><strong>Laravel Nightwatch</strong> — first-party monitoring dari tim Laravel: exception tracking, slow queries, job failures, Artisan commands, semua dalam satu dashboard</li>
                  <li><strong>Laravel Pulse</strong> untuk real-time performance metrics</li>
                  <li><strong>Health check endpoint</strong> untuk uptime monitoring</li>
                  <li><strong>Centralized logging</strong> — searchable &amp; retention policy</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 10 — Closing */}
        <section className="slide slide-final" data-slide={10}>
          <div className="slide-inner slide-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="final-h">
                <em>Simple.</em> Solid.
                <br />
                Siap dikembangkan.
              </h2>
              <p className="final-sub">
                Terima kasih.
              </p>

              <div className="final-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => goTo(1)}
                  onMouseEnter={() => setCursorHovering(true)}
                  onMouseLeave={() => setCursorHovering(false)}
                >
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
  /* ── Base deck ───────────────────────────────────────────── */
  .deck { scroll-snap-type: y mandatory; overflow-y: auto; height: 100dvh; }
  .slide {
    scroll-snap-align: start;
    min-height: 100dvh;
    display: flex; flex-direction: column;
    position: relative;
  }
  .slide-inner {
    flex: 1; display: flex; flex-direction: column;
    justify-content: center;
    padding: 120px 60px 80px;
    max-width: 1400px; margin: 0 auto; width: 100%;
    box-sizing: border-box;
  }
  .slide-center { align-items: center; text-align: center; }

  /* ── Chrome UI ───────────────────────────────────────────── */
  .deck-home {
    position: fixed; top: 28px; left: 32px; z-index: 50;
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--ink-dim); text-decoration: none;
    transition: color 0.2s ease;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .deck-home:hover { color: var(--accent); }

  .deck-event {
    position: fixed; top: 28px; right: 32px; z-index: 50;
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--ink-faint);
    display: flex; align-items: center; gap: 10px;
  }
  .deck-event .sep { color: var(--line); }

  .deck-chrome {
    position: fixed; bottom: 32px; right: 32px; z-index: 50;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .deck-arrow {
    width: 36px; height: 36px;
    border: 1px solid var(--line); background: var(--bg-2);
    color: var(--ink-dim); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, color 0.2s;
  }
  .deck-arrow:hover { border-color: var(--ink); color: var(--ink); }
  .deck-counter {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-faint); letter-spacing: 0.1em;
    display: flex; align-items: center; gap: 4px;
  }
  .deck-counter-cur { color: var(--ink); }
  .deck-counter-sep { color: var(--line); }

  .deck-dots {
    position: fixed; bottom: 50%; right: 16px;
    transform: translateY(50%); z-index: 50;
    display: flex; flex-direction: column; gap: 6px;
  }
  .deck-dot {
    width: 5px; height: 5px; border-radius: 999px;
    background: var(--line); border: none; cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    padding: 0;
  }
  .deck-dot.active { background: var(--accent); transform: scale(1.6); }
  .deck-dot:hover  { background: var(--ink-dim); }

  /* ── Shared type ─────────────────────────────────────────── */
  .slide-num {
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 28px;
  }
  .slide-h {
    font-family: var(--serif);
    font-size: clamp(40px, 5.5vw, 80px);
    line-height: 1.02; font-weight: 400;
    letter-spacing: -0.03em; margin-bottom: 44px;
  }
  .slide-h em  { font-style: italic; color: var(--accent); }
  .slide-h-sm  { font-size: clamp(30px, 3.4vw, 52px); margin-bottom: 36px; }

  /* ── Cover ───────────────────────────────────────────────── */
  .cover-kicker {
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 28px;
  }
  .cover-title {
    font-family: var(--serif);
    font-size: clamp(48px, 7vw, 110px);
    line-height: 0.96; font-weight: 400;
    letter-spacing: -0.04em; margin-bottom: 28px;
  }
  .cover-title em { font-style: italic; color: var(--accent); }
  .cover-sub {
    font-family: var(--mono); font-size: 14px;
    letter-spacing: 0.08em; color: var(--ink-dim);
    margin-bottom: 60px;
  }
  .cover-hint {
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--ink-faint);
  }
  .cover-hint kbd {
    display: inline-block; padding: 2px 7px;
    border: 1px solid var(--line); font-family: var(--mono);
    font-size: 10px; color: var(--ink-dim); border-radius: 3px;
  }

  /* ── Philosophy (02) ─────────────────────────────────────── */
  .philosophy-h {
    font-family: var(--serif);
    font-size: clamp(44px, 6vw, 92px);
    line-height: 1; font-weight: 400;
    letter-spacing: -0.035em;
    margin-bottom: 36px; max-width: 1100px;
  }
  .philosophy-h em { font-style: italic; color: var(--accent); }
  .philosophy-sub {
    font-size: 17px; line-height: 1.7;
    color: var(--ink-dim); max-width: 680px;
    margin: 0 auto 44px;
  }
  .philosophy-tags {
    display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;
  }
  .ph-tag {
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--accent); padding: 8px 14px;
    border: 1px solid var(--line); border-radius: 2px;
  }

  /* ── Stack grid (03) ─────────────────────────────────────── */
  .stack-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; }
  .stack-card {
    padding: 32px 28px; border: 1px solid var(--line);
    background: var(--bg-2);
    transition: border-color 0.25s;
  }
  .stack-card:hover { border-color: var(--ink); }
  .stack-badge {
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 12px;
  }
  .stack-name {
    font-family: var(--serif); font-size: clamp(24px, 2.2vw, 32px);
    font-weight: 400; letter-spacing: -0.02em;
    margin-bottom: 14px; line-height: 1.1;
  }
  .stack-desc { font-size: 14px; line-height: 1.65; color: var(--ink-dim); }
  .stack-desc strong { color: var(--ink); font-weight: 600; }
  .stack-note {
    margin-top: 20px; padding: 18px 22px;
    border-left: 2px solid var(--accent); background: var(--bg-2);
    font-size: 13.5px; line-height: 1.65; color: var(--ink-dim);
  }
  .stack-note strong { color: var(--ink); font-weight: 600; }
  .stack-note-label {
    display: inline-block; font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--accent); margin-right: 10px;
  }

  /* ── Dev approach (04) ───────────────────────────────────── */
  .dev-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-bottom: 28px; }
  .dev-card {
    display: flex; gap: 24px;
    padding: 32px 28px; border: 1px solid var(--line);
    background: var(--bg-2);
  }
  .dev-icon-wrap {
    flex-shrink: 0; width: 60px; height: 60px;
    border: 1px solid var(--accent); background: var(--bg);
    display: flex; align-items: center; justify-content: center;
  }
  .dev-icon-txt {
    font-family: var(--mono); font-size: 16px;
    font-weight: 700; color: var(--accent);
    letter-spacing: 0.05em;
  }
  .dev-badge {
    font-family: var(--mono); font-size: 9px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 10px;
  }
  .dev-title {
    font-family: var(--serif); font-size: clamp(22px, 2vw, 28px);
    font-weight: 400; letter-spacing: -0.02em;
    margin-bottom: 12px; line-height: 1.1;
  }
  .dev-desc { font-size: 14px; line-height: 1.65; color: var(--ink-dim); }
  .dev-desc strong { color: var(--ink); font-weight: 600; }
  .dev-note {
    font-size: 13px; line-height: 1.6; color: var(--ink-dim);
    padding: 16px 20px; border-left: 2px solid var(--accent);
    background: var(--bg-2);
  }
  .dev-note em { font-style: normal; color: var(--ink); font-weight: 600; }
  .dev-note-label {
    display: inline-block; font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.2em; color: var(--accent);
    margin-right: 10px;
  }

  /* ── UI/UX grid (05) ─────────────────────────────────────── */
  .uiux-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
  .uiux-card {
    padding: 28px 24px; border: 1px solid var(--line);
    background: var(--bg-2); display: flex; flex-direction: column;
  }
  .uiux-num {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-faint); letter-spacing: 0.15em;
    margin-bottom: 8px;
  }
  .uiux-tag {
    display: inline-block; font-family: var(--mono); font-size: 9px;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--ink-dim); border: 1px solid var(--line);
    padding: 3px 8px; margin-bottom: 14px; align-self: flex-start;
  }
  .uiux-tag-good { color: var(--bg); background: var(--accent); border-color: var(--accent); }
  .uiux-tag-warn { color: var(--ink-faint); }
  .uiux-title {
    font-family: var(--serif); font-size: clamp(19px, 1.6vw, 24px);
    font-weight: 400; letter-spacing: -0.02em;
    margin-bottom: 14px; line-height: 1.15;
  }
  .uiux-desc { font-size: 13.5px; line-height: 1.6; color: var(--ink-dim); margin-bottom: 18px; }
  .uiux-trade {
    margin-top: auto; border-top: 1px solid var(--line);
    padding-top: 14px; display: flex; flex-direction: column; gap: 6px;
  }
  .tr-row { font-size: 13px; color: var(--ink-dim); display: flex; gap: 8px; }
  .tr-plus  { color: var(--accent); font-weight: 700; width: 12px; flex-shrink: 0; }
  .tr-minus { color: var(--ink-faint); font-weight: 700; width: 12px; flex-shrink: 0; }

  /* ── Modular panels (06) ─────────────────────────────────── */
  .panel-row {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px;
    margin-bottom: 40px;
  }
  .panel-card {
    padding: 20px 20px; border: 1px solid var(--line);
    background: var(--bg-2);
  }
  .panel-card-admin { background: var(--bg); border-color: var(--accent); }
  .panel-card-etc { background: var(--bg-2); border-style: dashed; border-color: var(--ink-faint); }
  .panel-card-etc .panel-label { color: var(--ink-faint); }
  .panel-card-etc .panel-name { color: var(--ink-faint); font-style: italic; }
  .panel-label {
    font-family: var(--mono); font-size: 9px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 8px;
  }
  .panel-name {
    font-family: var(--serif); font-size: clamp(22px, 2vw, 28px);
    font-weight: 400; letter-spacing: -0.02em;
    margin-bottom: 6px; line-height: 1.1;
  }
  .panel-desc { font-size: 12px; color: var(--ink-dim); line-height: 1.5; }

  .pattern-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; }
  .pattern-item {
    padding: 24px 24px; border: 1px solid var(--line);
    background: var(--bg-2);
  }
  .pattern-tag {
    font-family: var(--mono); font-size: 9px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 8px;
  }
  .pattern-name {
    font-family: var(--serif); font-size: clamp(20px, 1.8vw, 24px);
    font-weight: 400; letter-spacing: -0.02em;
    margin-bottom: 10px; line-height: 1.1;
  }
  .pattern-desc { font-size: 13.5px; line-height: 1.65; color: var(--ink-dim); }

  /* ── RBAC (07) ───────────────────────────────────────────── */
  .rbac-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 2px; }
  .rbac-card {
    padding: 32px 28px; border: 1px solid var(--line);
    background: var(--bg-2);
  }
  .rbac-primary { border-color: var(--accent); }
  .rbac-secondary { background: var(--bg); }
  .rbac-tag {
    display: inline-block; font-family: var(--mono); font-size: 9px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--bg); background: var(--accent);
    padding: 4px 10px; margin-bottom: 16px;
  }
  .rbac-tag-alt { color: var(--ink-dim); background: transparent; border: 1px solid var(--line); }
  .rbac-title {
    font-family: var(--serif); font-size: clamp(20px, 1.8vw, 26px);
    font-weight: 400; letter-spacing: -0.02em;
    margin-bottom: 14px; line-height: 1.15;
  }
  .rbac-desc { font-size: 14px; line-height: 1.65; color: var(--ink-dim); margin-bottom: 18px; }
  .rbac-desc strong { color: var(--ink); font-weight: 600; }
  .rbac-why {
    padding-top: 14px; border-top: 1px solid var(--line);
  }
  .rbac-why-label {
    font-family: var(--mono); font-size: 9px;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 10px;
  }
  .rbac-why-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .rbac-why-list li {
    font-size: 13px; line-height: 1.55; color: var(--ink-dim);
    padding-left: 16px; position: relative;
  }
  .rbac-why-list li::before {
    content: '✦'; position: absolute; left: 0;
    color: var(--accent); font-size: 9px; top: 3px;
  }
  .rbac-when { font-size: 13px; color: var(--ink-dim); line-height: 1.6; margin-top: 10px; }
  .rbac-when-label {
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--accent); margin-right: 8px;
  }

  /* ── TDD + Plugins (08) ──────────────────────────────────── */
  .tdd-block {
    padding: 22px 24px; border: 1px solid var(--accent);
    background: var(--bg-2); margin-bottom: 24px;
  }
  .tdd-label {
    font-family: var(--mono); font-size: 9px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 8px;
  }
  .tdd-title {
    font-family: var(--serif); font-size: clamp(22px, 2vw, 28px);
    font-weight: 400; letter-spacing: -0.02em;
    margin-bottom: 10px; line-height: 1.1;
  }
  .tdd-desc { font-size: 13.5px; line-height: 1.65; color: var(--ink-dim); }

  .plugin-groups { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; }
  .plugin-group {
    padding: 20px 18px; border: 1px solid var(--line);
    background: var(--bg-2);
  }
  .plugin-group-label {
    font-family: var(--mono); font-size: 9px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 14px;
    padding-bottom: 10px; border-bottom: 1px solid var(--line);
  }
  .plugin-list { display: flex; flex-direction: column; gap: 10px; }
  .plugin-item { display: flex; flex-direction: column; gap: 2px; }
  .plugin-name { font-family: var(--serif); font-size: 14px; color: var(--ink); letter-spacing: -0.01em; }
  .plugin-role { font-family: var(--mono); font-size: 10px; color: var(--ink-faint); letter-spacing: 0.05em; }

  /* ── Enterprise (09) ─────────────────────────────────────── */
  .ent-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px;
  }
  .ent-cell {
    padding: 22px 24px; border: 1px solid var(--line);
    background: var(--bg-2);
  }
  .ent-cell-wide { grid-column: 1 / -1; background: var(--bg); border-color: var(--accent); }
  .ent-label {
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 14px;
    padding-bottom: 10px; border-bottom: 1px solid var(--line);
  }
  .ent-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .ent-list li {
    font-size: 13.5px; line-height: 1.55; color: var(--ink-dim);
    padding-left: 16px; position: relative;
  }
  .ent-list li::before {
    content: '—'; position: absolute; left: 0;
    color: var(--ink-faint); font-size: 12px;
  }
  .ent-list li strong { color: var(--ink); font-weight: 600; }
  .ent-list-inline { flex-direction: row; gap: 28px; flex-wrap: wrap; }
  .ent-list-inline li { flex: 1; min-width: 240px; }

  /* ── Final (10) ──────────────────────────────────────────── */
  .final-label {
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 28px;
  }
  .final-h {
    font-family: var(--serif);
    font-size: clamp(40px, 5.5vw, 84px);
    line-height: 1.02; font-weight: 400;
    letter-spacing: -0.04em; margin-bottom: 22px;
  }
  .final-h em { font-style: italic; color: var(--accent); }
  .final-sub {
    font-size: 16px; line-height: 1.7; color: var(--ink-dim);
    margin-bottom: 44px; max-width: 600px; margin-left: auto; margin-right: auto;
  }
  .final-sub em { font-style: normal; color: var(--ink); font-weight: 600; }

  .final-check-list {
    display: flex; flex-direction: column; gap: 8px;
    margin: 0 auto 44px; max-width: 520px;
    text-align: left; padding: 20px 24px;
    border: 1px solid var(--line); background: var(--bg-2);
  }
  .fc-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; color: var(--ink-dim);
  }
  .fc-item svg { color: var(--accent); flex-shrink: 0; }

  .final-actions { margin-bottom: 16px; }

  /* ── Responsive ──────────────────────────────────────────── */
  @media (max-width: 960px) {
    .deck-home  { top: 20px; left: 20px; }
    .deck-event { display: none; }
    .deck-chrome { bottom: 20px; right: 16px; }
    .deck-dots { display: none; }
    .slide-inner { padding: 100px 24px 60px; box-sizing: border-box; }
    .stack-grid,
    .uiux-grid,
    .plugin-groups,
    .ent-grid,
    .panel-row,
    .pattern-grid,
    .dev-grid,
    .rbac-grid { grid-template-columns: 1fr; }
    .ent-list-inline { flex-direction: column; gap: 10px; }
    .slide-h   { margin-bottom: 28px; }
    .final-h   { font-size: clamp(32px, 9vw, 56px); }
    .dev-card  { flex-direction: column; gap: 16px; }
  }
`;
