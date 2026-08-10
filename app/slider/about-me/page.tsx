"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowLeft, ArrowUp, ArrowDown, ArrowUpRight } from "lucide-react";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";

const TOTAL_SLIDES = 9;

const PROFILE = {
  firstName: "Jonathan",
  lastName: "Christiani",
  role: "AI Native Engineer & FullStack Engineer",
  photo: "/images/jonathan-speaking-nihon-fest-2026.jpg",
  photoCaption: "Nihon : Nagoya Fest 2026 — Batam",
  statement:
    "I help clients build and maintain reliable, production-ready applications that are simple, clean, fast, and easy to scale.",
  ownership: "I take ownership of the outcome.",
} as const;

const EXPERIENCE_TIMELINE = [
  {
    period: "2026 — Present",
    role: "Co-Founder",
    company: "PT. NihonNoMise Global Overseas",
    location: "Batam, Kepulauan Riau",
    summary: "Leading software development end to end, from planning to deployment.",
  },
  {
    period: "2025",
    role: "Sr. Filament Developer",
    company: "CMD Software",
    location: "Australia — Remote",
    summary: "Built and hardened Filament applications on modern Laravel and Livewire.",
  },
  {
    period: "2021 — Present",
    role: "Full-Stack Engineer & IT Manager",
    company: "BASIC Christian School",
    location: "Batam, Kepulauan Riau",
    summary: "Sole tech lead for internal systems across two school branches.",
  },
  {
    period: "2019 — 2020",
    role: "WordPress Developer",
    company: "Terkini ID",
    location: "Makassar, South Sulawesi",
    summary: "Custom themes, performance work, and internal web applications.",
  },
] as const;

const CURRENT_ROLES = [
  {
    number: "01",
    role: "Co-Founder",
    company: "PT. NihonNoMise Global Overseas",
    period: "March 2026 — Present",
    responsibilities: [
      "Lead and manage software development from planning to deployment.",
      "Leverage AI tools to optimize daily development workflows.",
      "Manage the NihonNoMise event website from end to end.",
      "Lead the development of the NihonNoMise SaaS product.",
    ],
  },
  {
    number: "02",
    role: "Full-Stack Engineer & IT Manager",
    company: "BASIC Christian School",
    period: "2021 — Present",
    responsibilities: [
      "Lead internal systems across two branches — 80% better operational efficiency.",
      "Design and deploy full-stack applications using Filament and NextJS.",
      "Establish centralized IT infrastructure and standardized SOPs.",
      "Integrate AI into business and operational workflows.",
    ],
  },
] as const;

const SKILL_GROUPS = [
  { label: "Backend", items: ["Laravel", "Livewire", "Filament", "AlpineJS"] },
  { label: "Frontend", items: ["ReactJS", "NextJS", "Vue", "NuxtJS", "Tailwind CSS", "Bootstrap", "Vanilla CSS"] },
  { label: "Data", items: ["PostgreSQL", "MySQL", "Supabase", "Sanity"] },
  { label: "Platform", items: ["Vercel", "Linux", "Git"] },
  { label: "Dev Tools", items: ["Figma", "Claude Code", "Claude Cowork", "Claude Design", "Cursor", "Ace", "Termius"] },
] as const;

const AWARDS = [
  {
    year: "2019",
    issuer: "Institut Teknologi Bandung",
    title: "2nd place — Best Project, Coding Class",
    detail: "Arkavidia Festival, Bandung.",
  },
  {
    year: "2018",
    issuer: "Ministry of Education and Culture",
    title: "3rd place — Web Design & Laravel",
    detail: "City-level competition, Semarang.",
  },
] as const;

const EDUCATION = {
  school: "SMK Bagimu Negeriku",
  location: "Semarang, Central Java",
  year: "Graduated 2019",
} as const;

const MEDIUM_BLOG = {
  label: "christmex.medium.com",
  href: "https://christmex.medium.com",
} as const;

const SECURITY_INTEREST = {
  headline: "Cyber security is the other half.",
  body:
    "Besides building software, I dig into cyber security — how systems break, how they get defended — and I write what I learn on Medium.",
} as const;

const PUBLICATIONS = [
  { ...MEDIUM_BLOG, note: "Cyber security writing" },
  {
    label: "jonathanchristiani.vercel.app",
    href: "https://jonathanchristiani.vercel.app",
    note: "Portfolio & case studies",
  },
] as const;

const CONTACTS = [
  { label: "Email", value: "christmex@yahoo.com", href: "mailto:christmex@yahoo.com" },
  { label: "Github", value: "@christmex", href: "https://github.com/christmex" },
  { label: "LinkedIn", value: "@jonathanchristiani", href: "https://linkedin.com/in/jonathanchristiani" },
] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: "easeOut" } },
};

export default function AboutMePage() {
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
        <span>ABOUT ME</span>
        <span className="sep">·</span>
        <span>{PROFILE.firstName} {PROFILE.lastName}</span>
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
          <div className="slide-inner cover-split">
            <motion.div className="cover-copy" initial="hidden" animate="show" variants={fadeIn}>
              <motion.div className="cover-kicker" variants={fadeUp}>ABOUT ME</motion.div>
              <motion.h1 className="cover-title" variants={fadeUp}>
                {PROFILE.firstName}<br /><em>{PROFILE.lastName}.</em>
              </motion.h1>
              <motion.p className="cover-sub" variants={fadeUp}>{PROFILE.role}</motion.p>
              <motion.div className="cover-hint" variants={fadeUp}>press <kbd>↓</kbd> to begin</motion.div>
            </motion.div>

            <motion.figure
              className="cover-photo"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <div className="cover-photo-frame">
                <Image
                  src={PROFILE.photo}
                  alt={`${PROFILE.firstName} ${PROFILE.lastName} speaking on stage`}
                  fill
                  sizes="(max-width: 960px) 100vw, 620px"
                  className="cover-photo-img"
                  priority
                />
              </div>
              <figcaption className="cover-photo-caption">{PROFILE.photoCaption}</figcaption>
            </motion.figure>
          </div>
        </section>

        {/* 02 — Statement */}
        <section className="slide" data-slide={2}>
          <div className="slide-inner slide-center">
            <div className="slide-num">01 — WHAT I DO</div>
            <h2 className="statement-h">{PROFILE.statement}</h2>
            <p className="statement-sub">{PROFILE.ownership}</p>
            <div className="statement-rule">
              <span>Simple</span>
              <span className="sep">·</span>
              <span>Clean</span>
              <span className="sep">·</span>
              <span>Fast</span>
              <span className="sep">·</span>
              <span>Easy to scale</span>
            </div>
          </div>
        </section>

        {/* 03 — Experience timeline */}
        <section className="slide" data-slide={3}>
          <div className="slide-inner">
            <div className="slide-num">02 — EXPERIENCE</div>
            <h2 className="slide-h slide-h-sm">Seven years of <em>shipping real systems.</em></h2>
            <div className="timeline">
              {EXPERIENCE_TIMELINE.map((entry) => (
                <div className="timeline-item" key={`${entry.company}-${entry.period}`}>
                  <div className="timeline-period">{entry.period}</div>
                  <div className="timeline-content">
                    <div className="timeline-role">{entry.role}</div>
                    <div className="timeline-company">
                      {entry.company} <span className="timeline-location">· {entry.location}</span>
                    </div>
                    <p className="timeline-summary">{entry.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 04 — What I own now */}
        <section className="slide" data-slide={4}>
          <div className="slide-inner">
            <div className="slide-num">03 — WHAT I OWN NOW</div>
            <h2 className="slide-h slide-h-sm">Two seats. <em>One standard.</em></h2>
            <div className="role-grid">
              {CURRENT_ROLES.map((role) => (
                <div className="role-card" key={role.company}>
                  <div className="role-num">{role.number}</div>
                  <h3 className="role-title">{role.role}</h3>
                  <div className="role-company">{role.company}</div>
                  <div className="role-period">{role.period}</div>
                  <ul className="role-list">
                    {role.responsibilities.map((responsibility) => (
                      <li key={responsibility}>{responsibility}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 05 — Past roles */}
        <section className="slide" data-slide={5}>
          <div className="slide-inner">
            <div className="slide-num">04 — BEFORE THAT</div>
            <h2 className="slide-h slide-h-sm">Where the <em>craft</em> was built.</h2>
            <div className="past-grid">
              <div className="past-card past-card-accent">
                <div className="past-tag">2025 · REMOTE — AUSTRALIA</div>
                <h3 className="past-title">Sr. Filament Developer</h3>
                <div className="past-company">CMD Software</div>
                <ul className="role-list">
                  <li>Wrote and maintained automated tests to keep releases reliable.</li>
                  <li>Debugged deeply and optimized Eloquent queries, relationships, and performance.</li>
                  <li>Ran code reviews and issue tracking with the Technical Director via GitHub and Linear.</li>
                  <li>Translated complex business logic into simple, clean, elegant solutions.</li>
                </ul>
              </div>
              <div className="past-card">
                <div className="past-tag past-tag-dim">2019 — 2020 · MAKASSAR</div>
                <h3 className="past-title">WordPress Developer</h3>
                <div className="past-company">Terkini ID</div>
                <ul className="role-list">
                  <li>Developed a custom WordPress theme for Terkini ID.</li>
                  <li>Optimized performance — significantly faster loading and better experience.</li>
                  <li>Built internal web applications supporting operational workflows.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 06 — Skills */}
        <section className="slide" data-slide={6}>
          <div className="slide-inner">
            <div className="slide-num">05 — TOOLKIT</div>
            <h2 className="slide-h slide-h-sm">The stack I <em>reach for.</em></h2>
            <div className="skill-grid">
              {SKILL_GROUPS.map((group) => (
                <div className="skill-group" key={group.label}>
                  <div className="skill-label">{group.label}</div>
                  <div className="skill-items">
                    {group.items.map((item) => (
                      <span className="skill-chip" key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 07 — AI native */}
        <section className="slide slide-ai" data-slide={7}>
          <div className="slide-inner slide-center">
            <div className="slide-num">06 — FOCUS</div>
            <div className="ai-word">AI NATIVE.</div>
            <p className="ai-sub">
              I focus on leveraging AI inside <em>daily workflows</em> — helping businesses
              adapt and integrate AI to optimize their operational processes,
              not just to demo it.
            </p>

            <div className="focus-aside">
              <div className="focus-aside-label">ALSO</div>
              <h3 className="focus-aside-title">{SECURITY_INTEREST.headline}</h3>
              <p className="focus-aside-body">{SECURITY_INTEREST.body}</p>
              <a
                href={MEDIUM_BLOG.href}
                target="_blank"
                rel="noreferrer"
                className="focus-aside-link"
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                {MEDIUM_BLOG.label}
                <ArrowUpRight size={13} strokeWidth={1.75} />
              </a>
            </div>
          </div>
        </section>

        {/* 08 — Education & Awards */}
        <section className="slide" data-slide={8}>
          <div className="slide-inner">
            <div className="slide-num">07 — EDUCATION & AWARDS</div>
            <h2 className="slide-h slide-h-sm">Where it <em>started.</em></h2>
            <div className="credential-grid">
              <div className="credential-card">
                <div className="credential-year">{EDUCATION.year}</div>
                <h3 className="credential-title">{EDUCATION.school}</h3>
                <p className="credential-detail">{EDUCATION.location}</p>
              </div>
              {AWARDS.map((award) => (
                <div className="credential-card" key={award.title}>
                  <div className="credential-year">{award.issuer} · {award.year}</div>
                  <h3 className="credential-title">{award.title}</h3>
                  <p className="credential-detail">{award.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 09 — Closing / contact */}
        <section className="slide slide-final" data-slide={9}>
          <div className="slide-inner slide-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="final-label">LET&rsquo;S TALK</div>
              <h2 className="final-h">
                Build it<br /><em>simple.</em>
              </h2>

              <div className="publication-row">
                {PUBLICATIONS.map((publication) => (
                  <a
                    key={publication.href}
                    href={publication.href}
                    target="_blank"
                    rel="noreferrer"
                    className="publication-link"
                    onMouseEnter={() => setCursorHovering(true)}
                    onMouseLeave={() => setCursorHovering(false)}
                  >
                    <span className="publication-label">
                      {publication.label}
                      <ArrowUpRight size={13} strokeWidth={1.75} />
                    </span>
                    <span className="publication-note">{publication.note}</span>
                  </a>
                ))}
              </div>

              <div className="contact-grid">
                {CONTACTS.map((contact) => (
                  <a
                    key={contact.href}
                    href={contact.href}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-item"
                    onMouseEnter={() => setCursorHovering(true)}
                    onMouseLeave={() => setCursorHovering(false)}
                  >
                    <span className="contact-label">{contact.label}</span>
                    <span className="contact-value">{contact.value}</span>
                  </a>
                ))}
              </div>

              <div className="final-actions">
                <button type="button" className="btn btn-primary" onClick={() => goTo(1)} onMouseEnter={() => setCursorHovering(true)} onMouseLeave={() => setCursorHovering(false)}>
                  <span className="inline-icon"><ArrowUp size={14} strokeWidth={1.75} /> Back to Start</span>
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
  .deck { scroll-snap-type: y mandatory; overflow-y: auto; height: 100dvh; scrollbar-width: none; }
  .deck::-webkit-scrollbar { display: none; }
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

  /* ── Cover (01) ───────────────────────────── */
  .cover-split {
    display: grid; grid-template-columns: 1fr 0.9fr;
    gap: 64px; align-items: center;
  }
  .cover-kicker { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 28px; }
  .cover-title { font-family: var(--serif); font-size: clamp(52px, 7.4vw, 116px); line-height: 0.96; font-weight: 400; letter-spacing: -0.04em; margin-bottom: 24px; }
  .cover-title em { font-style: italic; color: var(--accent); }
  .cover-sub { font-family: var(--mono); font-size: 13px; letter-spacing: 0.08em; color: var(--ink-dim); margin-bottom: 48px; }
  .cover-hint { font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }
  .cover-hint kbd { display: inline-block; padding: 2px 7px; border: 1px solid var(--line); font-family: var(--mono); font-size: 10px; color: var(--ink-dim); border-radius: 3px; }

  .cover-photo { margin: 0; }
  .cover-photo-frame {
    position: relative; width: 100%; aspect-ratio: 3 / 2;
    border: 1px solid var(--line); background: var(--bg-2); overflow: hidden;
  }
  .cover-photo-img { object-fit: cover; filter: saturate(0.92) contrast(1.04); }
  .cover-photo-caption {
    margin-top: 14px; font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-faint);
  }

  /* ── Statement (02) ───────────────────────── */
  .statement-h {
    font-family: var(--serif); font-size: clamp(30px, 4.2vw, 62px);
    line-height: 1.12; font-weight: 400; letter-spacing: -0.03em;
    max-width: 1000px; margin-bottom: 32px;
  }
  .statement-sub {
    font-family: var(--serif); font-style: italic;
    font-size: clamp(22px, 2.6vw, 38px); color: var(--accent);
    letter-spacing: -0.02em; margin-bottom: 44px;
  }
  .statement-rule {
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap; justify-content: center;
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--ink-dim);
  }
  .statement-rule .sep { color: var(--ink-faint); }

  /* ── Timeline (03) ────────────────────────── */
  .timeline { display: flex; flex-direction: column; gap: 2px; }
  .timeline-item {
    display: grid; grid-template-columns: 190px 1fr; gap: 28px;
    padding: 22px 28px; border: 1px solid var(--line); background: var(--bg-2);
  }
  .timeline-period { font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); padding-top: 6px; }
  .timeline-role { font-family: var(--serif); font-size: clamp(20px, 1.9vw, 28px); font-weight: 400; letter-spacing: -0.01em; margin-bottom: 5px; }
  .timeline-company { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-dim); margin-bottom: 10px; }
  .timeline-location { color: var(--ink-faint); }
  .timeline-summary { font-size: 14px; line-height: 1.6; color: var(--ink-dim); }

  /* ── Current roles (04) ───────────────────── */
  .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .role-card { padding: 34px 32px; border: 1px solid var(--accent); background: var(--bg-2); }
  .role-num { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; color: var(--accent); margin-bottom: 14px; }
  .role-title { font-family: var(--serif); font-size: clamp(24px, 2.3vw, 34px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 10px; }
  .role-company { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-dim); margin-bottom: 4px; }
  .role-period { font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 22px; }
  .role-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 11px; }
  .role-list li { position: relative; padding-left: 20px; font-size: 14px; line-height: 1.6; color: var(--ink-dim); }
  .role-list li::before { content: "—"; position: absolute; left: 0; color: var(--accent); }

  /* ── Past roles (05) ──────────────────────── */
  .past-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .past-card { padding: 34px 32px; border: 1px solid var(--line); background: var(--bg-2); }
  .past-card-accent { border-color: var(--accent); }
  .past-tag { font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; display: inline-block; background: rgba(255,92,46,0.1); padding: 4px 10px; }
  .past-tag-dim { color: var(--ink-faint); background: transparent; border: 1px solid var(--line); }
  .past-title { font-family: var(--serif); font-size: clamp(24px, 2.2vw, 32px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 8px; }
  .past-company { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-dim); margin-bottom: 22px; }

  /* ── Skills (06) ──────────────────────────── */
  .skill-grid { display: flex; flex-direction: column; gap: 2px; }
  .skill-group {
    display: grid; grid-template-columns: 190px 1fr; gap: 28px; align-items: center;
    padding: 24px 28px; border: 1px solid var(--line); background: var(--bg-2);
  }
  .skill-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); }
  .skill-items { display: flex; gap: 8px; flex-wrap: wrap; }
  .skill-chip {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em;
    color: var(--ink); padding: 7px 14px; border: 1px solid var(--line);
  }

  /* ── AI focus (07) ────────────────────────── */
  .ai-word {
    font-family: var(--serif); font-size: clamp(48px, 9vw, 132px);
    line-height: 0.9; font-weight: 400; letter-spacing: -0.04em;
    color: var(--accent); margin-bottom: 30px;
  }
  .ai-sub { font-size: 18px; line-height: 1.75; color: var(--ink-dim); max-width: 700px; margin: 0 auto; }
  .ai-sub em { font-style: normal; color: var(--ink); font-weight: 600; }

  .focus-aside {
    margin: 44px auto 0; max-width: 700px; text-align: left;
    padding: 26px 30px; border: 1px solid var(--line); background: var(--bg-2);
  }
  .focus-aside-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
  .focus-aside-title { font-family: var(--serif); font-size: clamp(22px, 2.1vw, 30px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 12px; }
  .focus-aside-body { font-size: 14.5px; line-height: 1.7; color: var(--ink-dim); margin-bottom: 18px; }
  .focus-aside-link {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
    color: var(--ink); text-decoration: none;
    border-bottom: 1px solid var(--line); padding-bottom: 4px;
    transition: color 0.2s, border-color 0.2s;
  }
  .focus-aside-link:hover { color: var(--accent); border-color: var(--accent); }

  /* ── Education & awards (08) ──────────────── */
  .credential-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
  .credential-card { padding: 32px 28px; border: 1px solid var(--line); background: var(--bg-2); }
  .credential-year { font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
  .credential-title { font-family: var(--serif); font-size: clamp(20px, 1.9vw, 27px); font-weight: 400; letter-spacing: -0.01em; line-height: 1.15; margin-bottom: 10px; }
  .credential-detail { font-size: 14px; line-height: 1.6; color: var(--ink-dim); }

  /* ── Final (09) ───────────────────────────── */
  .final-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 28px; }
  .final-h { font-family: var(--serif); font-size: clamp(56px, 8.4vw, 120px); line-height: 0.96; font-weight: 400; letter-spacing: -0.04em; margin-bottom: 40px; }
  .final-h em { font-style: italic; color: var(--accent); }

  .publication-row { display: flex; gap: 32px; flex-wrap: wrap; justify-content: center; margin-bottom: 40px; }
  .publication-link {
    display: inline-flex; flex-direction: column; align-items: center; gap: 6px;
    text-decoration: none; border-bottom: 1px solid var(--line);
    padding-bottom: 8px; transition: border-color 0.2s;
  }
  .publication-label {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
    color: var(--ink); transition: color 0.2s;
  }
  .publication-note {
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--ink-faint);
  }
  .publication-link:hover { border-color: var(--accent); }
  .publication-link:hover .publication-label { color: var(--accent); }

  .contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-bottom: 44px; max-width: 780px; margin-left: auto; margin-right: auto; }
  .contact-item {
    display: flex; flex-direction: column; gap: 8px; text-align: left;
    padding: 20px 22px; border: 1px solid var(--line); background: var(--bg-2);
    text-decoration: none; transition: border-color 0.2s;
  }
  .contact-item:hover { border-color: var(--accent); }
  .contact-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); }
  .contact-value { font-family: var(--mono); font-size: 12px; color: var(--ink-dim); word-break: break-all; }
  .contact-item:hover .contact-value { color: var(--ink); }

  .final-actions { margin-bottom: 16px; }

  /* ── Responsive ───────────────────────────── */
  @media (max-width: 960px) {
    .deck-home { top: 20px; left: 20px; }
    .deck-event { display: none; }
    .deck-chrome { bottom: 20px; right: 16px; }
    .deck-dots { display: none; }
    .slide-inner { padding: 100px 24px 60px; }

    .cover-split { grid-template-columns: 1fr; gap: 32px; }
    .cover-photo { order: -1; }
    .cover-sub { margin-bottom: 28px; }

    .timeline-item, .skill-group { grid-template-columns: 1fr; gap: 10px; }
    .timeline-period { padding-top: 0; }
    .role-grid, .past-grid { grid-template-columns: 1fr; }
    .credential-grid { grid-template-columns: 1fr; }
    .contact-grid { grid-template-columns: 1fr; }
    .ai-word { font-size: clamp(40px, 14vw, 76px); }
    .ai-sub { font-size: 15px; }
    .focus-aside { margin-top: 28px; padding: 20px 22px; }
    .statement-h { font-size: clamp(26px, 7vw, 40px); }
  }
`;
