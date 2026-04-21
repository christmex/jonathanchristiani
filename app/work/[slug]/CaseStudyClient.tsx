"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import type { Project } from "@/lib/projects";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

export default function CaseStudyClient({ project }: { project: Project }) {
  const cs = project.caseStudy!;
  const { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering } = useCursor();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  const sections: { num: string; title: string; body: string }[] = [
    { num: "01", title: "Overview",        body: cs.overview   },
    { num: "02", title: "Background",      body: cs.background },
    { num: "03", title: "My Role",         body: cs.myRole     },
    { num: "04", title: "Impact",          body: cs.impact     },
    ...(cs.learned ? [{ num: "05", title: "What I Learned", body: cs.learned }] : []),
  ];

  return (
    <PageShell
      cursorXSpring={cursorXSpring}
      cursorYSpring={cursorYSpring}
      cursorHovering={cursorHovering}
    >
      <style>{css}</style>
      <SiteNav setCursorHovering={setCursorHovering} />

      <header className="case-hero">
        <div className="container">
          <motion.div
            className="case-breadcrumb"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/work">← Back to Work</Link>
            <span className="sep">·</span>
            <span>{project.year}</span>
          </motion.div>

          <motion.h1
            className="case-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {project.title}
          </motion.h1>

          <motion.div
            className="case-role"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {project.role}
          </motion.div>

          <motion.p
            className="case-lede"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {project.desc}
          </motion.p>

          <motion.div
            className="case-meta-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="case-meta-cell">
              <div className="case-meta-label">Year</div>
              <div className="case-meta-value">{project.year}</div>
            </div>
            <div className="case-meta-cell">
              <div className="case-meta-label">Role</div>
              <div className="case-meta-value">{project.role.split("·")[1]?.trim() || project.role}</div>
            </div>
            <div className="case-meta-cell">
              <div className="case-meta-label">Stack</div>
              <div className="case-meta-value">{(cs.stack ?? project.tags).join(" · ")}</div>
            </div>
            <div className="case-meta-cell">
              <div className="case-meta-label">Links</div>
              <div className="case-meta-value case-links">
                {project.links
                  .filter((l) => l.external)
                  .map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setCursorHovering(true)}
                      onMouseLeave={() => setCursorHovering(false)}
                    >
                      {l.label} ↗
                    </a>
                  ))}
                {project.links.filter((l) => l.external).length === 0 && (
                  <span className="case-meta-muted">Internal / NDA</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {project.image && (
        <motion.div
          className="case-cover"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="container">
            <div className="case-cover-frame">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 960px) 100vw, 1240px"
                className="case-cover-img"
                priority
              />
            </div>
          </div>
        </motion.div>
      )}

      <section className="case-body">
        <div className="container">
          {sections.map((s, i) => (
            <motion.div
              key={s.num}
              className="case-section"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.05 }}
            >
              <div className="case-section-num">§ {s.num}</div>
              <div className="case-section-content">
                <h2 className="case-section-title">{s.title}</h2>
                <p className="case-section-body">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="case-next">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="case-next-label">§ — Next</div>
            <h2 className="case-next-title">
              Have something <em>similar</em> to ship?
            </h2>
            <div className="case-next-actions">
              <Link
                href="/#contact"
                className="btn btn-primary"
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                Start a Project <span className="arrow">↗</span>
              </Link>
              <Link
                href="/work"
                className="btn btn-ghost"
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                See Other Work <span className="arrow">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter backHref="/work" backLabel="↑ BACK TO WORK" />
    </PageShell>
  );
}

const css = `
  .case-hero { padding: 160px 0 60px; }
  .case-breadcrumb {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); text-transform: uppercase;
    letter-spacing: 0.15em;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 40px;
  }
  .case-breadcrumb a       { color: var(--ink-dim); text-decoration: none; transition: color 0.2s ease; }
  .case-breadcrumb a:hover { color: var(--accent); }
  .case-breadcrumb .sep    { color: var(--ink-faint); }

  .case-title {
    font-family: var(--serif);
    font-size: clamp(48px, 8vw, 128px);
    line-height: 0.96; font-weight: 400;
    letter-spacing: -0.035em; color: var(--ink);
    margin-bottom: 24px; max-width: 1100px;
  }
  .case-role { font-family: var(--mono); font-size: 12px; color: var(--accent); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 28px; }
  .case-lede {
    font-family: var(--serif);
    font-size: clamp(20px, 2vw, 26px);
    line-height: 1.5; font-weight: 300; color: var(--ink-dim);
    max-width: 820px; margin-bottom: 64px;
  }

  .case-meta-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--line);
    border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
  }
  .case-meta-cell  { background: var(--bg); padding: 22px 24px; }
  .case-meta-label { font-family: var(--mono); font-size: 10px; color: var(--ink-dim); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 10px; }
  .case-meta-value { font-family: var(--serif); font-size: 17px; color: var(--ink); line-height: 1.35; }
  .case-meta-muted { color: var(--ink-faint); font-size: 14px; }
  .case-links { display: flex; flex-direction: column; gap: 6px; font-family: var(--mono); font-size: 12px; letter-spacing: 0.05em; }
  .case-links a       { color: var(--ink); text-decoration: none; transition: color 0.2s ease; }
  .case-links a:hover { color: var(--accent); }

  .case-cover { padding: 80px 0 40px; }
  .case-cover-frame {
    position: relative; aspect-ratio: 16/9;
    border: 1px solid var(--line); border-radius: 2px;
    overflow: hidden; background: var(--bg-2);
  }
  .case-cover-img { object-fit: cover; }

  .case-body { padding: 60px 0 80px; }
  .case-section {
    display: grid; grid-template-columns: 180px 1fr;
    gap: 40px; padding: 56px 0;
    border-top: 1px solid var(--line); align-items: start;
  }
  .case-section:last-child { border-bottom: 1px solid var(--line); }
  .case-section-num   { font-family: var(--mono); font-size: 11px; color: var(--accent); letter-spacing: 0.2em; padding-top: 10px; }
  .case-section-title { font-family: var(--serif); font-size: clamp(28px, 3vw, 42px); font-weight: 400; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px; }
  .case-section-body  { font-family: var(--serif); font-size: clamp(17px, 1.3vw, 20px); line-height: 1.65; color: var(--ink-dim); font-weight: 300; max-width: 720px; }

  .case-next {
    padding: 120px 0 140px; border-top: 1px solid var(--line);
    text-align: center; position: relative; overflow: hidden;
  }
  .case-next::before {
    content: ''; position: absolute;
    top: 50%; left: 50%; width: 900px; height: 900px;
    margin-top: -450px; margin-left: -450px;
    background: conic-gradient(from 0deg, transparent 0%, rgba(255,92,46,0.08) 30%, transparent 60%, rgba(234,223,200,0.04) 85%, transparent 100%);
    filter: blur(60px); pointer-events: none;
  }
  .case-next-label   { font-family: var(--mono); font-size: 11px; color: var(--ink-dim); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px; position: relative; z-index: 1; }
  .case-next-title   { font-family: var(--serif); font-size: clamp(40px, 6vw, 80px); line-height: 1; font-weight: 300; letter-spacing: -0.03em; margin-bottom: 44px; position: relative; z-index: 1; }
  .case-next-title em { font-style: italic; color: var(--accent); }
  .case-next-actions { display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }
  .arrow { display: inline-block; }

  @media (max-width: 960px) {
    .case-hero         { padding: 120px 0 40px; }
    .case-meta-grid    { grid-template-columns: repeat(2, 1fr); }
    .case-section      { grid-template-columns: 1fr; gap: 16px; padding: 40px 0; }
    .case-cover        { padding: 40px 0 20px; }
    .case-cover-frame  { aspect-ratio: 4/3; }
    .case-next         { padding: 80px 0 100px; }
  }
`;
