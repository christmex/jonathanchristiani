"use client";

import { useRef, useState, useEffect, type ReactNode, type CSSProperties, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  type Variants,
  type MotionValue,
} from "motion/react";
import { projects, STATUS_LABEL, type Project } from "@/lib/projects";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

export default function Homepage() {
  const heroRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Hero parallax
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgTextX = useTransform(heroProgress, [0, 1], ["0%", "-30%"]);
  const heroTitleY = useTransform(heroProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroAsideY = useTransform(heroProgress, [0, 1], [0, -60]);

  // Cursor
  const { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering } = useCursor();

  // Infinite ticker
  const tickerX = useMotionValue(0);
  useAnimationFrame((_t, delta) => {
    const moveBy = -((delta / 1000) * 60);
    const current = tickerX.get();
    const next = current + moveBy;
    if (next <= -1600) tickerX.set(0);
    else tickerX.set(next);
  });

  // Time in Batam
  const [now, setNow] = useState("");
  useEffect(() => {
    const update = () => {
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setNow(new Intl.DateTimeFormat("en-GB", opts).format(new Date()));
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  // Reveal variants
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  };
  const fadeRight: Variants = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  // Split text helper for bold text reveal
  const splitWords = (text: string) =>
    text.split(" ").map((w, i) => (
      <motion.span
        key={i}
        className="word"
        variants={{
          hidden: { y: "110%", opacity: 0 },
          show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
        }}
      >
        {w}&nbsp;
      </motion.span>
    ));

  const services = [
    {
      num: "01 / Ship Fast",
      title: "Full-stack product builds",
      desc: "From zero to production. Product thinking, UI, database, API, deploy. Ideal for founders who need one accountable operator, not a five-person agency retainer.",
      chips: ["Next.js", "Supabase", "Vercel"],
    },
    {
      num: "02 / AI Integrations",
      title: "Enterprise integrations",
      desc: "MCP integration, workflow automation, and AI-assisted development.",
      chips: ["Cowork", "MCP Integration", "Workflow Automation"],
    },
    {
      num: "03 / Consultation",
      title: "Audit, debug, optimize",
      desc: "Production fires, reconciliation mismatches, legacy refactors. Structured freeze–snapshot–audit–fix. You get a diagnosis, a fix, and a write-up.",
      chips: ["Code Review", "White-box Testing", "Optimization"],
    },
  ];

  const processSteps = [
    { num: "STEP 01", title: "Scope", desc: "A 30-minute call to map the real problem, not the surface one. You leave with a fixed scope, timeline, and price." },
    { num: "STEP 02", title: "MVP", desc: "I'll build a working MVP in 1-2 days using AI. You see real progress in hours. No black box, no fluff." },
    { num: "STEP 03", title: "Polish", desc: "I'll polish the MVP to production-ready quality. You get a working product that's ready to ship." },
    { num: "STEP 04", title: "Ship & Support", desc: "Deployed, documented, handed off. 3 months warranty, plus an optional retainer for the projects that keep evolving." },
  ];

  const tickerItems = ["Laravel", "Next.js", "Filament", "Sanity CMS", "Tailwind", "TypeScript", "PostgreSQL", "AI-Assisted Dev", "Livewire", "Vercel", "AlpineJs", "Mysql"];

  return (
    <PageShell
      cursorXSpring={cursorXSpring}
      cursorYSpring={cursorYSpring}
      cursorHovering={cursorHovering}
    >
      <style>{css}</style>
      <SiteNav setCursorHovering={setCursorHovering} />

      {/* HERO */}
      <motion.header ref={heroRef} className="hero">
        <motion.div className="hero-bg-text" style={{ x: heroBgTextX }}>
          SHIP IT.
        </motion.div>

        <motion.div className="container hero-grid" style={{ y: heroTitleY, opacity: heroOpacity }}>
          <motion.div initial="hidden" animate="show" variants={container}>
            <motion.div className="hero-meta" variants={fadeUp}>
              <motion.span
                className="meta-dot"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>Available · Q3 2026</span>
              <span className="sep">—</span>
              <span>Batam, ID</span>
              <span className="sep">—</span>
              <span className="time">{now} WIB</span>
            </motion.div>

            <h1 className="hero-title">
              <motion.div className="line-mask" initial="hidden" animate="show" variants={container}>
                {splitWords("I build")}
                <motion.span
                  className="underline-accent word"
                  variants={{
                    hidden: { y: "110%", opacity: 0 },
                    show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  full-stack
                </motion.span>
              </motion.div>
              <motion.div
                className="line-mask"
                initial="hidden"
                animate="show"
                variants={container}
                transition={{ delayChildren: 0.3 }}
              >
                {splitWords("web apps &")}
                <motion.span
                  className="italic word"
                  variants={{
                    hidden: { y: "110%", opacity: 0 },
                    show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  AI systems
                </motion.span>
              </motion.div>
            </h1>

            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              Freelance full-stack developer & AI engineer based in <strong>Batam, Indonesia</strong>.
              I handle product thinking, design, frontend, backend, and deployment — so you get one
              person accountable for shipping.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <motion.a
                href="#work"
                className="btn btn-primary"
                whileHover={{ y: -3, boxShadow: "0 16px 40px -10px var(--accent)" }}
                whileTap={{ scale: 0.97 }}
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                See Selected Work
                <motion.span className="arrow" whileHover={{ x: 4, y: -4 }}>↗</motion.span>
              </motion.a>
              <motion.a
                href="#contact"
                className="btn btn-ghost"
                whileHover={{ y: -3, borderColor: "var(--ink)" }}
                whileTap={{ scale: 0.97 }}
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                Start a Project
                <span className="arrow">→</span>
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.aside
            className="hero-aside"
            style={{ y: heroAsideY }}
            initial="hidden"
            animate="show"
            variants={container}
            transition={{ delayChildren: 0.6 }}
          >
            <StatCard variants={fadeRight} label="Primary Stack" value="Laravel · Next.js" sub="Filament · Sanity" />
            <StatCard variants={fadeRight} label="Shipped · Production" value="12+" smallValue="projects" desc="Anime festivals to K-12 school platforms." />
            <StatCard variants={fadeRight} label="Delivery Mode" value="End-to-end" desc="One operator. No PM tax. Direct line." />
          </motion.aside>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="scroll-line"
            animate={{ scaleY: [0, 1, 0], transformOrigin: ["top", "top", "bottom"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span>SCROLL</span>
        </motion.div>
      </motion.header>

      {/* TICKER */}
      <div className="ticker">
        <motion.div className="ticker-track" style={{ x: tickerX }}>
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="ticker-item">
              {item}
              <span className="ticker-sep">✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* MCP — HOW I SHIP FASTER */}
      <MCPBeamsSection
        onHover={() => setCursorHovering(true)}
        onLeave={() => setCursorHovering(false)}
      />

      {/* SERVICES */}
      <section id="services">
        <div className="container">
          <SectionLabel>§ 02 — What I Do</SectionLabel>
          <WhatTitle>
            Three ways I <em>show up</em> for clients — each priced, scoped, and shipped without the agency overhead.
          </WhatTitle>

          <div className="services-grid">
            {services.map((s, i) => (
              <motion.div
                key={i}
                className="service"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ backgroundColor: "var(--bg-2)" }}
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                <div className="service-num">{s.num}</div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
                <div className="service-stack">
                  {s.chips.map((c) => (
                    <span key={c} className="chip">{c}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" ref={workRef} style={{ paddingTop: 40 }}>
        <div className="container">
          <SectionLabel>§ 03 — Selected Work</SectionLabel>
          <div className="work-header">
            <WhatTitle style={{ marginBottom: 0 }}>
              Things I've <em>actually</em> shipped.
            </WhatTitle>
            <div className="work-count">
              <strong>{String(Math.min(projects.length, 5)).padStart(2, "0")}</strong> / {String(projects.length).padStart(2, "0")} shown
            </div>
          </div>

          {projects.slice(0, 5).map((p, i) => (
            <ProjectRow
              key={i}
              project={p}
              onHover={() => setCursorHovering(true)}
              onLeave={() => setCursorHovering(false)}
            />
          ))}

          <div className="work-more">
            <motion.a
              href="/work"
              className="btn btn-ghost"
              whileHover={{ y: -3, borderColor: "var(--ink)" }}
              whileTap={{ scale: 0.97 }}
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}
            >
              See All Work <span className="arrow">→</span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* QUOTE — BIG SCROLL MOMENT */}
      <QuoteSection />

      {/* PROCESS */}
      <section id="process">
        <div className="container">
          <SectionLabel>§ 04 — How I Work</SectionLabel>
          <WhatTitle>
            A four-step loop. <em>Serial, not parallel.</em>
          </WhatTitle>

          <div className="process-grid">
            {processSteps.map((s, i) => (
              <motion.div
                key={i}
                className="step"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <motion.div
                  className="step-line"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.15 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="step-num">{s.num}</div>
                <h4 className="step-title">{s.title}</h4>
                <p className="step-desc">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" ref={ctaRef} className="cta">
        <motion.div
          className="cta-glow"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <div className="container">
          <div className="cta-inner">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <SectionLabel>§ 05 — Work With Me</SectionLabel>
              <h2 className="cta-title">
                Have something<br />to <em>ship?</em>
              </h2>
              <p className="cta-desc">
                I take on a small number of projects each quarter. Tell me what you're building, what's in the way, and when it needs to go live. I'll reply within 24 hours.
              </p>
              <div className="cta-channels">
                {[
                  { label: "Email", value: "christmex@yahoo.com", href: "mailto:christmex@yahoo.com" },
                  { label: "LinkedIn", value: "/jonathanchristiani", href: "https://www.linkedin.com/in/jonathanchristiani" },
                  { label: "GitHub", value: "@christmex", href: "https://github.com/christmex" },
                ].map((c) => (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="cta-channel"
                    whileHover={{ paddingLeft: 10, color: "var(--accent)" }}
                    onMouseEnter={() => setCursorHovering(true)}
                    onMouseLeave={() => setCursorHovering(false)}
                  >
                    <span className="cta-channel-label">{c.label}</span>
                    <span className="cta-channel-value">{c.value} ↗</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <ContactForm
              onHover={() => setCursorHovering(true)}
              onLeave={() => setCursorHovering(false)}
            />
          </div>
        </div>
      </section>

      <SiteFooter backHref="#" backLabel="↑ BACK TO TOP" />
    </PageShell>
  );
}

// === SUB-COMPONENTS ===
type StatCardProps = {
  label: string;
  value: string;
  smallValue?: string;
  sub?: string;
  desc?: string;
  variants?: Variants;
};

function StatCard({ label, value, smallValue, sub, desc, variants }: StatCardProps) {
  return (
    <motion.div
      className="stat-card"
      variants={variants}
      whileHover={{ borderColor: "var(--accent)", y: -2 }}
    >
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {smallValue && <span className="stat-small"> {smallValue}</span>}
        {sub && (
          <>
            <br />
            {sub}
          </>
        )}
      </div>
      {desc && <div className="stat-desc">{desc}</div>}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="section-label"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

function WhatTitle({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <motion.h2
      className="what-title"
      style={style}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.h2>
  );
}

function ProjectRow({
  project,
  onHover,
  onLeave,
}: {
  project: Project;
  onHover: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const visualY: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const visualScale: MotionValue<number> = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  return (
    <motion.article
      ref={ref}
      className="project"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ paddingLeft: 16 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="project-year">{project.year}</div>
      <div className="project-info">
        <div className="project-status-row">
          <span className={`project-status project-status-${project.status}`}>
            <span className="project-status-dot" />
            {STATUS_LABEL[project.status]}
          </span>
        </div>
        <h3 className="project-title">{project.title}</h3>
        <div className="project-role">{project.role}</div>
        <p className="project-desc">{project.desc}</p>
        <div className="project-tags">
          {project.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
        <div className="project-links">
          {project.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="project-link"
              onMouseEnter={onHover}
              onMouseLeave={onLeave}
            >
              <span>{l.label}</span>
              <span className="arrow">{l.external ? "↗" : "→"}</span>
            </a>
          ))}
        </div>
      </div>
      <motion.div
        className={`project-visual ${project.variant}`}
        style={{ y: visualY, scale: visualScale }}
      >
        {project.image ? (
          <div className="project-photo">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 960px) 100vw, 50vw"
              className="project-photo-img"
            />
          </div>
        ) : (
          <div className="screen">
            <div className="screen-bar">
              <i />
              <i />
              <i />
            </div>
            <div className="screen-body">
              <motion.div
                className="line short"
                initial={{ width: 0 }}
                whileInView={{ width: "40%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <motion.div
                className="line mid"
                initial={{ width: 0 }}
                whileInView={{ width: "70%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.45 }}
              />
              <motion.div
                className="line accent"
                initial={{ width: 0 }}
                whileInView={{ width: "25%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
              <motion.div
                className="box"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.75 }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </motion.article>
  );
}

function QuoteSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bigMarkY = useTransform(scrollYProgress, [0, 1], [100, -200]);
  const bigMarkScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1.2, 1.5]);
  const bigMarkOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0, 0.7, 0.7, 0]);

  const words = "I don't just build things — I ask why it matters, and I iterate with purpose.".split(" ");

  return (
    <section ref={ref} className="quote-section">
      <motion.div
        className="quote-mark"
        style={{ y: bigMarkY, scale: bigMarkScale, opacity: bigMarkOpacity }}
      >
        &ldquo;
      </motion.div>
      <div className="container">
        <blockquote className="quote">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0.15 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, margin: "-40% 0px -40% 0px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              style={{ display: "inline-block", marginRight: "0.28em" }}
            >
              {w === "why" ? <em>{w}</em> : w}
            </motion.span>
          ))}
        </blockquote>
        <motion.div
          className="quote-attr"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          — Operating Principle
        </motion.div>
      </div>
    </section>
  );
}

function MCPBeamsSection({ onHover, onLeave }: { onHover: () => void; onLeave: () => void }) {
  // Tool nodes in an arc right of Claude (center 600,230 in viewBox 1200x460)
  const tools = [
    { name: "Vercel",   mark: "▲", x: "84%", y: "12%", d: "M 600 230 Q 820 140 1010 70",  delay: 0 },
    { name: "GitHub",   mark: "◯", x: "88%", y: "31%", d: "M 600 230 Q 870 195 1060 145", delay: 0.35 },
    { name: "Supabase", mark: "▣", x: "90%", y: "50%", d: "M 600 230 Q 900 230 1080 230", delay: 0.7 },
    { name: "Sentry",   mark: "✦", x: "88%", y: "69%", d: "M 600 230 Q 870 265 1060 315", delay: 1.05 },
    { name: "Notion",   mark: "◆", x: "84%", y: "88%", d: "M 600 230 Q 820 320 1010 390", delay: 1.4 },
  ];

  const steps = [
    { num: "01", text: "I ask Claude to do the thing." },
    { num: "02", text: "Claude calls the right MCP tool." },
    { num: "03", text: "Result lands in the chat, in context." },
  ];

  return (
    <section id="mcp" className="mcp-section" onMouseEnter={onHover} onMouseLeave={onLeave}>
      <div className="container mcp-container">
        <div className="mcp-copy">
          <SectionLabel>§ 01 — Toolchain</SectionLabel>
          <h2 className="mcp-title">
            Claude at the center. <em>Everything plugs in.</em>
          </h2>
          <p className="mcp-lede">
            Through <span className="mcp-mark">MCP</span> servers, my Claude reads a Vercel deploy, opens
            a GitHub PR, runs a Supabase query, or checks a Sentry issue — <em>without ever leaving the chat</em>.
          </p>
          <ol className="mcp-steps">
            {steps.map((s) => (
              <li key={s.num} className="mcp-step">
                <span className="mcp-step-num">{s.num}</span>
                <span className="mcp-step-text">{s.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <motion.div
          className="mcp-stage-wrap"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* DESKTOP: arc layout with SVG beams */}
          <div className="mcp-stage mcp-stage-desktop">
            <svg
              className="mcp-beams"
              viewBox="0 0 1200 460"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M 130 230 Q 340 230 560 230" className="mcp-beam-base" />
              {tools.map((t) => (
                <path key={`base-${t.name}`} d={t.d} className="mcp-beam-base" />
              ))}
              <path d="M 130 230 Q 340 230 560 230" className="mcp-beam" style={{ animationDelay: "0s" }} />
              {tools.map((t) => (
                <path
                  key={`beam-${t.name}`}
                  d={t.d}
                  className="mcp-beam mcp-beam-out"
                  style={{ animationDelay: `${t.delay}s` }}
                />
              ))}
            </svg>

            <div className="mcp-node mcp-node-you" style={{ left: "8%", top: "50%" }}>
              <div className="mcp-node-inner">
                <span className="mcp-node-kicker">YOU</span>
                <span className="mcp-node-label">Prompt</span>
              </div>
            </div>

            <div className="mcp-node mcp-node-claude" style={{ left: "50%", top: "50%" }}>
              <motion.div
                className="mcp-claude-ring"
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="mcp-claude-pulse"
                animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
              />
              <div className="mcp-node-inner mcp-node-inner-center">
                <span className="mcp-node-kicker">CLAUDE</span>
                <span className="mcp-node-label">MCP host</span>
              </div>
            </div>

            {tools.map((t) => (
              <div
                key={t.name}
                className="mcp-node mcp-node-tool"
                style={{ left: t.x, top: t.y }}
              >
                <span className="mcp-tool-mark">{t.mark}</span>
                <span className="mcp-tool-name">{t.name}</span>
              </div>
            ))}
          </div>

          {/* MOBILE: vertical stack */}
          <div className="mcp-stage-mobile">
            <div className="mcp-m-node mcp-m-you">
              <span className="mcp-m-kicker">YOU</span>
              <span className="mcp-m-label">Prompt</span>
            </div>
            <div className="mcp-m-beam" aria-hidden="true">
              <span className="mcp-m-beam-pulse" />
            </div>
            <div className="mcp-m-node mcp-m-claude">
              <motion.span
                className="mcp-m-claude-ring"
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
              />
              <span className="mcp-m-kicker mcp-m-kicker-accent">CLAUDE</span>
              <span className="mcp-m-label">MCP host</span>
            </div>
            <div className="mcp-m-fan" aria-hidden="true">
              <span className="mcp-m-fan-line mcp-m-fan-l" />
              <span className="mcp-m-fan-line mcp-m-fan-c" />
              <span className="mcp-m-fan-line mcp-m-fan-r" />
            </div>
            <div className="mcp-m-tools">
              {tools.map((t) => (
                <div key={t.name} className="mcp-m-tool">
                  <span className="mcp-tool-mark">{t.mark}</span>
                  <span className="mcp-tool-name">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const PROJECT_TYPES = [
  { value: "fullstack", label: "Fullstack Product Builds", sub: "end-to-end product" },
  { value: "enterprise", label: "Enterprise Integration",  sub: "API / ACL / systems" },
  { value: "consult",   label: "Consultation",             sub: "advice / audit / direction" },
] as const;

function ContactForm({ onHover, onLeave }: { onHover: () => void; onLeave: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", projectType: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire to backend — for now, show a local confirmation
    setSent(true);
  };

  const update = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <motion.form
      className="contact-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="form-header">
        <span className="form-kicker">→ Send a message</span>
        <span className="form-note">I reply within 24h</span>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            value={form.name}
            onChange={update("name")}
            disabled={sent}
          />
        </div>
        <div className="form-field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
            disabled={sent}
          />
        </div>
      </div>

      <div className="form-field">
        <label>Project type</label>
        <div className="type-picker" role="radiogroup" aria-label="Project type">
          {PROJECT_TYPES.map((opt) => {
            const active = form.projectType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                className={`type-chip ${active ? "active" : ""}`}
                onClick={() => !sent && setForm((f) => ({ ...f, projectType: opt.value }))}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                disabled={sent}
              >
                {active && (
                  <motion.span
                    layoutId="type-chip-active"
                    className="type-chip-bg"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="type-chip-body">
                  <span className="type-chip-label">{opt.label}</span>
                  <span className="type-chip-sub">{opt.sub}</span>
                </span>
                <span className="type-chip-check" aria-hidden="true">
                  {active ? "●" : "○"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          required
          placeholder="Tell me what you're building, any constraints, and when you need it live."
          value={form.message}
          onChange={update("message")}
          disabled={sent}
        />
      </div>

      <div className="form-actions">
        <motion.button
          type="submit"
          className={`btn btn-primary form-submit ${sent ? "sent" : ""}`}
          whileHover={sent ? undefined : { y: -3 }}
          whileTap={sent ? undefined : { scale: 0.97 }}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          disabled={sent}
        >
          {sent ? "Message queued — I'll be in touch" : "Send Message"}
          <span className="arrow">{sent ? "✓" : "↗"}</span>
        </motion.button>
        <span className="form-hint">
          Or email directly — <a href="mailto:christmex@yahoo.com">christmex@yahoo.com</a>
        </span>
      </div>
    </motion.form>
  );
}

// === STYLES ===
const css = `
  .hero {
    min-height: 100vh;
    padding: 140px 0 80px;
    position: relative;
    display: flex; align-items: center;
    overflow: hidden;
  }
  .hero-bg-text {
    position: absolute;
    bottom: -40px; left: -20px; right: -20px;
    font-family: var(--serif);
    font-weight: 900;
    font-size: clamp(180px, 26vw, 420px);
    line-height: 0.85;
    color: transparent;
    -webkit-text-stroke: 1px var(--ink-faint);
    letter-spacing: -0.04em;
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
    opacity: 0.45;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 80px;
    align-items: end;
    width: 100%;
    position: relative;
    z-index: 2;
  }
  .hero-meta {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 40px;
    flex-wrap: wrap;
  }
  .meta-dot { width: 6px; height: 6px; background: #2ecc71; border-radius: 50%; box-shadow: 0 0 10px #2ecc71; display: inline-block; }
  .sep { color: var(--ink-faint); }
  .time { color: var(--accent); font-variant-numeric: tabular-nums; }

  .hero-title {
    font-family: var(--serif);
    font-weight: 400;
    font-size: clamp(48px, 7.2vw, 112px);
    line-height: 0.96;
    letter-spacing: -0.035em;
    color: var(--ink);
    margin-bottom: 32px;
  }
  .line-mask {
    overflow: hidden;
    display: block;
    padding-bottom: 0.1em;
  }
  .word { display: inline-block; }
  .italic { font-style: italic; font-weight: 300; color: var(--accent-2); margin-left: 0.12em; }
  .mono-tag {
    font-family: var(--mono);
    font-weight: 500;
    font-size: 0.22em;
    vertical-align: middle;
    padding: 6px 12px;
    border: 1px solid var(--accent);
    color: var(--accent);
    border-radius: 6px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-left: 0.3em;
    transform: translateY(-0.5em);
  }
  .underline-accent {
    position: relative;
    margin-right: 0.15em;
  }
  .underline-accent::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: 0.08em;
    height: 0.12em;
    background: var(--accent);
    opacity: 0.9; z-index: -1;
  }

  .hero-sub {
    max-width: 540px;
    font-size: 17px;
    color: var(--ink-dim);
    line-height: 1.6;
    margin-bottom: 40px;
  }
  .hero-sub strong { color: var(--ink); font-weight: 600; }

  .hero-actions { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 22px;
    border-radius: 999px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    font-weight: 500;
    cursor: none;
    border: 1px solid transparent;
  }
  .btn-primary { background: var(--accent); color: var(--bg); }
  .btn-ghost { background: transparent; color: var(--ink); border-color: var(--line); }
  .arrow { display: inline-block; }

  .hero-aside {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding-bottom: 10px;
  }
  .stat-card {
    border: 1px solid var(--line);
    padding: 22px 24px;
    background: linear-gradient(135deg, rgba(255,92,46,0.04), transparent);
    border-radius: 2px;
    position: relative;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: -1px; left: -1px;
    width: 12px; height: 12px;
    border-top: 2px solid var(--accent);
    border-left: 2px solid var(--accent);
  }
  .stat-label {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--ink-dim);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 8px;
  }
  .stat-value {
    font-family: var(--serif);
    font-size: 28px;
    line-height: 1.15;
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 4px;
  }
  .stat-small { font-size: 18px; color: var(--ink-dim); }
  .stat-desc {
    font-size: 13px;
    color: var(--ink-dim);
    line-height: 1.4;
    margin-top: 6px;
  }

  .scroll-hint {
    position: absolute;
    bottom: 30px; left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    font-family: var(--mono);
    font-size: 10px;
    color: var(--ink-dim);
    letter-spacing: 0.2em;
  }
  .scroll-line {
    width: 1px; height: 40px;
    background: var(--ink);
  }

  .ticker {
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    padding: 18px 0;
    overflow: hidden;
    background: var(--bg-2);
    position: relative;
    z-index: 3;
  }
  .ticker-track {
    display: flex;
    gap: 0;
    white-space: nowrap;
    font-family: var(--mono);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--ink);
    will-change: transform;
  }
  .ticker-item {
    display: inline-flex;
    align-items: center;
    padding: 0 30px;
  }
  .ticker-sep {
    color: var(--accent);
    font-size: 10px;
    margin-left: 30px;
  }

  .section-label {
    display: flex; align-items: center; gap: 14px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 28px;
  }
  .section-label::before {
    content: '';
    width: 40px; height: 1px;
    background: var(--accent);
  }

  section { padding: 120px 0; position: relative; }

  .what-title {
    font-family: var(--serif);
    font-size: clamp(36px, 5vw, 72px);
    line-height: 1.02;
    font-weight: 300;
    letter-spacing: -0.025em;
    max-width: 1000px;
    margin-bottom: 80px;
  }
  .what-title em { font-style: italic; color: var(--accent-2); }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
  }
  .service {
    background: var(--bg);
    padding: 40px 32px;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .service-num {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.15em;
    margin-bottom: 40px;
  }
  .service-title {
    font-family: var(--serif);
    font-size: 28px;
    line-height: 1.1;
    font-weight: 400;
    margin-bottom: 16px;
  }
  .service-desc {
    color: var(--ink-dim);
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: auto;
  }
  .service-stack {
    margin-top: 28px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
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

  .work-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 60px;
    flex-wrap: wrap;
    gap: 20px;
  }
  .work-count {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--ink-dim);
    letter-spacing: 0.1em;
  }
  .work-count strong { color: var(--accent); font-weight: 700; }

  .project {
    display: grid;
    grid-template-columns: 100px 1fr 1.2fr;
    gap: 48px;
    padding: 40px 0;
    border-top: 1px solid var(--line);
    align-items: start;
    position: relative;
  }
  .project:last-of-type { border-bottom: 1px solid var(--line); }
  .project-year {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--ink-dim);
    padding-top: 6px;
  }
  .project-title {
    font-family: var(--serif);
    font-size: 38px;
    font-weight: 400;
    line-height: 1.05;
    margin-bottom: 14px;
    letter-spacing: -0.02em;
  }
  .project-role {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 18px;
  }
  .project-desc {
    color: var(--ink-dim);
    font-size: 14px;
    line-height: 1.65;
    margin-bottom: 22px;
    max-width: 420px;
  }
  .project-tags { display: flex; gap: 6px; flex-wrap: wrap; }

  .project-visual {
    aspect-ratio: 4/3;
    background: var(--bg-2);
    border: 1px solid var(--line);
    position: relative;
    overflow: hidden;
    border-radius: 2px;
  }
  .project-visual .screen {
    position: absolute;
    inset: 24px;
    background: linear-gradient(135deg, var(--bg) 0%, #1a1a18 100%);
    border: 1px solid var(--line);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }
  .screen-bar {
    height: 22px;
    background: #0a0a09;
    border-bottom: 1px solid var(--line);
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 10px;
  }
  .screen-bar i {
    width: 7px; height: 7px;
    background: var(--ink-faint);
    border-radius: 50%;
  }
  .screen-body {
    flex: 1;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
  }
  .screen-body .line {
    height: 8px;
    background: var(--ink-faint);
    border-radius: 2px;
  }
  .screen-body .line.accent { background: var(--accent); }
  .screen-body .box {
    flex: 1;
    background: linear-gradient(135deg, rgba(255,92,46,0.15), rgba(234,223,200,0.05));
    border-radius: 3px;
    border: 1px solid var(--line);
  }
  .project-visual.v2 .screen-body .box { background: linear-gradient(135deg, rgba(234,223,200,0.12), rgba(255,92,46,0.05)); }
  .project-visual.v3 .screen-body .box { background: linear-gradient(135deg, rgba(46,204,113,0.12), rgba(234,223,200,0.05)); }
  .project-visual.v4 .screen-body .box { background: linear-gradient(135deg, rgba(138,124,226,0.14), rgba(255,92,46,0.05)); }

  .project-photo {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: 2px;
  }
  .project-photo-img {
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .project:hover .project-photo-img { transform: scale(1.04); }

  .blog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
    margin-top: 40px;
  }
  .blog-card {
    background: var(--bg);
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: var(--ink);
    cursor: none;
    transition: background 0.3s ease;
  }
  .blog-card:hover { background: var(--bg-2); }
  .blog-media {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
    border-bottom: 1px solid var(--line);
    background: var(--bg-2);
  }
  .blog-media-img {
    object-fit: cover;
    filter: grayscale(1) contrast(1.05);
    transition: filter 0.5s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .blog-card:hover .blog-media-img {
    filter: grayscale(0) contrast(1);
    transform: scale(1.04);
  }
  .blog-body {
    padding: 28px 28px 32px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .blog-kicker {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.15em;
    margin-bottom: 14px;
  }
  .blog-title {
    font-family: var(--serif);
    font-size: 26px;
    line-height: 1.15;
    font-weight: 400;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }
  .blog-desc {
    font-size: 14px;
    line-height: 1.6;
    color: var(--ink-dim);
    margin-bottom: 22px;
  }
  .blog-read {
    margin-top: auto;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: color 0.25s ease;
  }
  .blog-card:hover .blog-read { color: var(--accent); }
  .blog-count { opacity: 0.7; margin-left: 2px; }

  .project-status-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .project-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 10px 5px 10px;
    border: 1px solid var(--line);
    border-radius: 999px;
    font-family: var(--mono);
    font-size: 10px;
    color: var(--ink-dim);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .project-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    display: inline-block;
  }
  .project-status-production .project-status-dot {
    background: #2ecc71;
    box-shadow: 0 0 8px #2ecc71;
  }
  .project-status-ongoing .project-status-dot {
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
    animation: pulse 1.6s ease-in-out infinite;
  }
  .project-status-archived {
    color: var(--ink-faint);
    border-style: dashed;
  }
  .project-status-archived .project-status-dot {
    background: var(--ink-faint);
    box-shadow: none;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .project-links {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px dashed var(--line);
  }
  .project-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    text-decoration: none;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: color 0.2s ease, gap 0.2s ease;
  }
  .project-link:hover { color: var(--accent); gap: 12px; }
  .project-link:hover .arrow { color: var(--accent); }

  .work-more {
    display: flex;
    justify-content: center;
    margin-top: 60px;
  }

  .quote-section {
    padding: 200px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .quote-mark {
    position: absolute;
    top: 10%; left: 50%;
    transform: translateX(-50%);
    font-family: var(--serif);
    font-size: clamp(400px, 50vw, 700px);
    color: var(--accent);
    line-height: 0.5;
    pointer-events: none;
    font-weight: 900;
    will-change: transform, opacity;
  }
  .quote {
    font-family: var(--serif);
    font-size: clamp(28px, 3.5vw, 52px);
    line-height: 1.25;
    font-weight: 300;
    letter-spacing: -0.02em;
    max-width: 960px;
    margin: 0 auto 40px;
    font-style: italic;
    color: var(--ink);
    position: relative;
    z-index: 1;
  }
  .quote em { color: var(--accent); font-style: italic; font-weight: 400; }
  .quote-attr {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    position: relative;
    z-index: 1;
  }

  .process-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-top: 40px;
  }
  .step {
    padding-top: 20px;
    position: relative;
    cursor: none;
  }
  .step-line {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
    transform-origin: left;
  }
  .step-num {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent);
    margin-bottom: 14px;
    letter-spacing: 0.1em;
  }
  .step-title {
    font-family: var(--serif);
    font-size: 22px;
    font-weight: 400;
    margin-bottom: 10px;
  }
  .step-desc {
    font-size: 13px;
    color: var(--ink-dim);
    line-height: 1.55;
  }

  .cta {
    padding: 160px 0;
    border-top: 1px solid var(--line);
    position: relative;
    overflow: hidden;
  }
  .cta-glow {
    position: absolute;
    top: 50%; left: 50%;
    width: 1200px; height: 1200px;
    margin-top: -600px; margin-left: -600px;
    background: conic-gradient(from 0deg, transparent 0%, rgba(255,92,46,0.08) 30%, transparent 60%, rgba(234,223,200,0.04) 85%, transparent 100%);
    filter: blur(60px);
    pointer-events: none;
  }
  .cta-inner {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 80px;
    align-items: start;
    position: relative;
    z-index: 1;
  }
  .cta-title {
    font-family: var(--serif);
    font-size: clamp(44px, 6vw, 88px);
    line-height: 1;
    letter-spacing: -0.03em;
    font-weight: 300;
    margin-bottom: 28px;
  }
  .cta-title em { font-style: italic; color: var(--accent); }
  .cta-desc {
    color: var(--ink-dim);
    font-size: 17px;
    line-height: 1.6;
    max-width: 480px;
    margin-bottom: 40px;
  }

  .cta-channels {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--line);
  }
  .cta-channel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 18px 0;
    border-bottom: 1px solid var(--line);
    text-decoration: none;
    color: var(--ink);
    cursor: none;
  }
  .cta-channel-label {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .cta-channel-value {
    font-family: var(--serif);
    font-size: 17px;
    font-weight: 400;
  }

  .contact-form {
    background: rgba(20, 20, 18, 0.55);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    position: relative;
  }
  .contact-form::before {
    content: '';
    position: absolute;
    top: -1px; left: -1px;
    width: 14px; height: 14px;
    border-top: 2px solid var(--accent);
    border-left: 2px solid var(--accent);
  }
  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
    padding-bottom: 4px;
    border-bottom: 1px dashed var(--line);
    font-family: var(--mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }
  .form-kicker { color: var(--accent); }
  .form-note { color: var(--ink-dim); }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .form-field label {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--ink-dim);
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .form-field input,
  .form-field textarea,
  .form-field select {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--line);
    padding: 10px 0;
    color: var(--ink);
    font-family: var(--sans);
    font-size: 15px;
    line-height: 1.5;
    outline: none;
    transition: border-color 0.25s ease;
    cursor: text;
    border-radius: 0;
  }
  .form-field select { cursor: pointer; appearance: none; -webkit-appearance: none; }
  .form-field textarea { resize: vertical; min-height: 120px; font-family: var(--sans); }
  .form-field input::placeholder,
  .form-field textarea::placeholder { color: var(--ink-faint); }
  .form-field input:focus,
  .form-field textarea:focus,
  .form-field select:focus { border-color: var(--accent); }
  .form-field input:disabled,
  .form-field textarea:disabled,
  .form-field select:disabled { opacity: 0.5; cursor: not-allowed; }

  .form-select-wrap { position: relative; }
  .form-select-arrow {
    position: absolute;
    right: 4px; top: 50%;
    transform: translateY(-50%);
    color: var(--ink-dim);
    font-size: 14px;
    pointer-events: none;
  }

  .form-actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 8px;
  }
  .form-submit {
    align-self: flex-start;
    cursor: pointer;
    border: none;
    font: inherit;
  }
  .form-submit.sent {
    background: transparent;
    color: var(--accent);
    border: 1px dashed var(--accent);
    cursor: default;
  }
  .form-submit:disabled { opacity: 0.85; }
  .form-hint {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-dim);
    letter-spacing: 0.08em;
  }
  .form-hint a { color: var(--ink); text-decoration: none; border-bottom: 1px dashed var(--line); }
  .form-hint a:hover { color: var(--accent); border-color: var(--accent); }

  /* === TYPE PICKER (custom radio chips) === */
  .type-picker {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 6px;
  }
  .type-chip {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    padding: 14px 14px 14px 14px;
    min-height: 76px;
    background: transparent;
    border: 1px solid var(--line);
    color: var(--ink-dim);
    cursor: pointer;
    text-align: left;
    overflow: hidden;
    transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
    font: inherit;
  }
  .type-chip:hover:not(:disabled) {
    color: var(--ink);
    border-color: var(--ink-dim);
    transform: translateY(-1px);
  }
  .type-chip.active {
    color: var(--bg);
    border-color: var(--accent);
  }
  .type-chip-bg {
    position: absolute;
    inset: 0;
    background: var(--accent);
    z-index: 0;
  }
  .type-chip-body {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .type-chip-label {
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .type-chip-sub {
    font-size: 11px;
    font-family: var(--mono);
    opacity: 0.75;
    line-height: 1.4;
    white-space: normal;
  }
  .type-chip-check {
    position: relative;
    z-index: 1;
    font-size: 10px;
    line-height: 1;
    opacity: 0.6;
  }
  .type-chip.active .type-chip-check { opacity: 1; }
  .type-chip:disabled { opacity: 0.5; cursor: not-allowed; }

  /* === MCP SECTION — compact 2-column desktop, stacked mobile === */
  .mcp-section {
    padding: 70px 0 80px;
    position: relative;
  }
  .mcp-container {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 56px;
    align-items: center;
  }
  .mcp-copy { min-width: 0; }
  .mcp-title {
    font-family: var(--serif);
    font-size: clamp(32px, 3.6vw, 56px);
    line-height: 1.02;
    font-weight: 400;
    letter-spacing: -0.03em;
    margin: 14px 0 18px;
  }
  .mcp-title em { font-style: italic; color: var(--accent-2); }
  .mcp-lede {
    font-family: var(--sans);
    font-size: 15px;
    line-height: 1.6;
    color: var(--ink-dim);
    max-width: 540px;
    margin-bottom: 24px;
  }
  .mcp-lede em { font-family: var(--serif); font-style: italic; color: var(--ink); font-weight: 400; }
  .mcp-mark {
    display: inline-block;
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    padding: 2px 7px;
    background: var(--accent);
    color: var(--bg);
    transform: translateY(-1px);
    margin: 0 2px;
  }

  .mcp-steps {
    list-style: none;
    padding: 18px 0 0;
    border-top: 1px dashed var(--line);
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--ink-dim);
    letter-spacing: 0.04em;
  }
  .mcp-step {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .mcp-step-num {
    color: var(--accent);
    font-weight: 700;
    font-size: 11px;
    min-width: 20px;
  }

  .mcp-stage-wrap { position: relative; min-width: 0; }

  .mcp-stage {
    position: relative;
    width: 100%;
    aspect-ratio: 1200 / 460;
    margin: 0 auto;
  }
  .mcp-stage-mobile { display: none; }
  .mcp-beams {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .mcp-beam-base {
    fill: none;
    stroke: var(--line);
    stroke-width: 1.2;
    stroke-dasharray: 4 6;
    opacity: 0.7;
    vector-effect: non-scaling-stroke;
  }
  .mcp-beam {
    fill: none;
    stroke: var(--accent);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-dasharray: 40 260;
    stroke-dashoffset: 300;
    filter: drop-shadow(0 0 6px var(--accent));
    animation: mcp-flow 3.4s linear infinite;
    vector-effect: non-scaling-stroke;
  }
  .mcp-beam-out {
    stroke: var(--accent-2);
    filter: drop-shadow(0 0 4px var(--accent-2));
    animation-duration: 4s;
  }
  @keyframes mcp-flow {
    from { stroke-dashoffset: 300; }
    to   { stroke-dashoffset: 0; }
  }

  .mcp-node {
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    background: var(--bg-2);
    border: 1px solid var(--line);
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    color: var(--ink);
    z-index: 2;
    user-select: none;
    white-space: nowrap;
  }
  .mcp-node-inner {
    display: flex;
    flex-direction: column;
    gap: 1px;
    line-height: 1.2;
  }
  .mcp-node-kicker {
    font-size: 9px;
    color: var(--ink-faint);
    text-transform: uppercase;
  }
  .mcp-node-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--ink);
    text-transform: uppercase;
  }

  .mcp-node-you { border-color: var(--ink-dim); }

  .mcp-node-claude {
    padding: 18px 22px;
    background: var(--bg);
    border: 1px solid var(--accent);
    box-shadow: 0 0 48px -8px var(--accent), inset 0 0 20px -12px var(--accent);
    z-index: 3;
  }
  .mcp-node-claude .mcp-node-kicker { color: var(--accent); }
  .mcp-node-claude .mcp-node-label { font-size: 13px; }
  .mcp-claude-ring {
    position: absolute;
    inset: -12px;
    border: 1px dashed var(--accent);
    border-radius: 50%;
    opacity: 0.35;
    pointer-events: none;
  }
  .mcp-claude-pulse {
    position: absolute;
    inset: 0;
    border: 1px solid var(--accent);
    pointer-events: none;
  }
  .mcp-node-inner-center { align-items: flex-start; }

  .mcp-node-tool { padding: 8px 12px; gap: 8px; }
  .mcp-tool-mark {
    color: var(--accent);
    font-size: 11px;
    line-height: 1;
  }
  .mcp-tool-name {
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-size: 11px;
  }

  @media (prefers-reduced-motion: reduce) {
    .mcp-beam { animation: none; stroke-dashoffset: 0; stroke-dasharray: none; opacity: 0.6; }
    .mcp-m-beam-pulse { animation: none; }
  }

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

  /* MCP mobile stage */
  .mcp-stage-mobile {
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 8px 0 0;
  }
  .mcp-m-node {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border: 1px solid var(--line);
    background: var(--panel);
    padding: 14px 22px;
    font-family: var(--mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    min-width: 140px;
  }
  .mcp-m-kicker {
    font-size: 10px;
    color: var(--ink-dim);
    letter-spacing: 0.16em;
  }
  .mcp-m-kicker-accent { color: var(--accent); }
  .mcp-m-label {
    font-size: 12px;
    color: var(--ink);
    letter-spacing: 0.06em;
    font-weight: 600;
  }
  .mcp-m-you { border-color: var(--line); }
  .mcp-m-claude {
    border-color: var(--accent);
    padding: 18px 28px;
  }
  .mcp-m-claude-ring {
    position: absolute;
    inset: -10px;
    border: 1px dashed var(--accent);
    border-radius: 50%;
    opacity: 0.4;
    pointer-events: none;
  }
  .mcp-m-beam {
    position: relative;
    width: 2px;
    height: 48px;
    background: repeating-linear-gradient(
      to bottom,
      var(--line) 0 4px,
      transparent 4px 10px
    );
    overflow: hidden;
  }
  .mcp-m-beam-pulse {
    position: absolute;
    left: -2px;
    top: -14px;
    width: 6px;
    height: 14px;
    background: var(--accent);
    animation: mcp-m-flow 1.8s linear infinite;
  }
  @keyframes mcp-m-flow {
    0% { transform: translateY(0); opacity: 0; }
    20% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(72px); opacity: 0; }
  }
  .mcp-m-fan {
    position: relative;
    height: 40px;
    width: 240px;
    margin-top: 6px;
  }
  .mcp-m-fan-line {
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    background: var(--line);
    transform-origin: top center;
  }
  .mcp-m-fan-l { transform: translateX(-50%) rotate(-28deg); }
  .mcp-m-fan-c { transform: translateX(-50%); }
  .mcp-m-fan-r { transform: translateX(-50%) rotate(28deg); }
  .mcp-m-tools {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
    margin-top: 2px;
  }
  .mcp-m-tool {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--line);
    background: var(--panel);
    padding: 10px 14px;
  }
  .mcp-m-tool:last-child:nth-child(odd) { grid-column: 1 / -1; }

  @media (max-width: 960px) {
    .hero-grid { grid-template-columns: 1fr; gap: 40px; }
    .services-grid { grid-template-columns: 1fr; }
    .blog-grid { grid-template-columns: 1fr; }
    .project { grid-template-columns: 1fr; gap: 20px; }
    .project-year { display: none; }
    .process-grid { grid-template-columns: repeat(2, 1fr); }
    .cta-inner { grid-template-columns: 1fr; gap: 50px; }
    .contact-form { padding: 22px; }
    .form-row { grid-template-columns: 1fr; }
    .type-picker { grid-template-columns: repeat(3, 1fr); }
    .mcp-section { padding: 70px 0 60px; }
    .mcp-container { grid-template-columns: 1fr; gap: 28px; }
    .mcp-stage-desktop { display: none; }
    .mcp-stage-mobile { display: flex; }
    .mcp-lede { font-size: 15px; }
    section { padding: 80px 0; }
    .hero { padding: 110px 0 60px; }
    .btn, .nav-cta, a { cursor: pointer; }
  }
  @media (max-width: 520px) {
    .process-grid { grid-template-columns: 1fr; }
    .type-picker { grid-template-columns: 1fr; }
  }
`;
