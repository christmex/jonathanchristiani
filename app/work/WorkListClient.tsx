"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ArrowRight, ArrowLeft } from "lucide-react";
import { STATUS_LABEL, type Project, type ProjectStatus } from "@/lib/projects";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

type Filter = "all" | ProjectStatus;

export default function WorkListClient({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering } = useCursor();

  const counts = useMemo(() => {
    const ongoing    = projects.filter((p) => p.status === "ongoing").length;
    const production = projects.filter((p) => p.status === "production").length;
    const archived   = projects.filter((p) => p.status === "archived").length;
    return { all: projects.length, ongoing, production, archived };
  }, [projects]);

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => p.status === filter);
  }, [filter, projects]);

  const filters: { key: Filter; label: string }[] = [
    { key: "all",        label: "All" },
    { key: "production", label: STATUS_LABEL.production },
    { key: "ongoing",    label: STATUS_LABEL.ongoing },
    { key: "archived",   label: STATUS_LABEL.archived },
  ];

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
            <Link href="/" className="inline-icon"><ArrowLeft size={12} strokeWidth={1.75} /> Back Home</Link>
            <span className="sep">·</span>
            <span>§ — Index</span>
          </motion.div>

          <motion.h1
            className="list-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Every project <em>on the record.</em>
          </motion.h1>

          <motion.div
            className="list-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {filters.map((f) => (
              <button
                key={f.key}
                className={`filter-btn${filter === f.key ? " active" : ""}`}
                onClick={() => setFilter(f.key)}
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                <span>{f.label}</span>
                <span className="filter-count">{counts[f.key]}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </header>

      <section className="list-body">
        <div className="container">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.article
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="list-row"
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
              >
                <div className="list-year">{p.year}</div>
                <div className="list-info">
                  <div className="list-status-row">
                    <span className={`project-status project-status-${p.status}`}>
                      <span className="project-status-dot" />
                      {STATUS_LABEL[p.status]}
                    </span>
                  </div>
                  <h2 className="list-title-row">{p.title}</h2>
                  <div className="list-role">{p.role}</div>
                  <p className="list-desc">{p.desc}</p>
                  <div className="list-tags">
                    {p.tags.map((t) => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                  </div>
                  <div className="list-links">
                    {p.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target={l.external ? "_blank" : undefined}
                        rel={l.external ? "noopener noreferrer" : undefined}
                        className="list-link"
                      >
                        <span>{l.label}</span>
                        <span className="arrow">{l.external ? <ArrowUpRight size={14} strokeWidth={1.75} /> : <ArrowRight size={14} strokeWidth={1.75} />}</span>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="list-visual">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 960px) 100vw, 40vw"
                      className="list-visual-img"
                    />
                  ) : (
                    <div className="list-visual-fallback">
                      <span>{p.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="list-empty">Nothing in this bucket yet.</div>
          )}
        </div>
      </section>

      <SiteFooter backHref="/" backLabel="BACK HOME" />
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
    margin-bottom: 36px;
  }
  .list-breadcrumb a       { color: var(--ink-dim); text-decoration: none; transition: color 0.2s ease; }
  .list-breadcrumb a:hover { color: var(--accent); }
  .list-breadcrumb .sep    { color: var(--ink-faint); }

  .list-title {
    font-family: var(--serif);
    font-size: clamp(44px, 7.2vw, 112px);
    line-height: 0.96; font-weight: 400;
    letter-spacing: -0.035em;
    margin-bottom: 60px; max-width: 1100px;
  }
  .list-title em { font-style: italic; color: var(--accent-2); }

  .list-filters {
    display: flex; gap: 8px; flex-wrap: wrap;
    padding-top: 24px; border-top: 1px solid var(--line);
  }
  .filter-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 10px 18px; border-radius: 999px;
    background: transparent; border: 1px solid var(--line);
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink-dim); cursor: none;
    transition: all 0.25s ease;
  }
  .filter-btn:hover  { border-color: var(--ink); color: var(--ink); }
  .filter-btn.active { background: var(--ink); color: var(--bg); border-color: var(--ink); }
  .filter-count {
    font-size: 10px; opacity: 0.6;
    padding: 2px 7px; border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
  }
  .filter-btn.active .filter-count { background: rgba(13, 13, 12, 0.15); opacity: 0.8; }

  .list-body { padding: 40px 0 120px; }
  .list-row {
    display: grid; grid-template-columns: 100px 1.3fr 1fr;
    gap: 48px; padding: 48px 0;
    border-top: 1px solid var(--line); align-items: start;
  }
  .list-row:last-of-type { border-bottom: 1px solid var(--line); }

  .list-year { font-family: var(--mono); font-size: 12px; color: var(--ink-dim); padding-top: 6px; }

  .list-status-row { display: flex; margin-bottom: 16px; }
  .project-status {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 5px 10px; border: 1px solid var(--line); border-radius: 999px;
    font-family: var(--mono); font-size: 10px;
    color: var(--ink-dim); text-transform: uppercase; letter-spacing: 0.12em;
  }
  .project-status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
  .project-status-production .project-status-dot { background: #2ecc71; box-shadow: 0 0 8px #2ecc71; }
  .project-status-ongoing    .project-status-dot { background: var(--accent); box-shadow: 0 0 8px var(--accent); animation: pulse 1.6s ease-in-out infinite; }
  .project-status-archived   { color: var(--ink-faint); border-style: dashed; }
  .project-status-archived   .project-status-dot { background: var(--ink-faint); box-shadow: none; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .list-title-row {
    font-family: var(--serif); font-size: clamp(28px, 3vw, 40px);
    font-weight: 400; line-height: 1.05;
    letter-spacing: -0.02em; margin-bottom: 12px;
  }
  .list-role { font-family: var(--mono); font-size: 11px; color: var(--accent); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 16px; }
  .list-desc { color: var(--ink-dim); font-size: 14px; line-height: 1.65; margin-bottom: 20px; max-width: 520px; }
  .list-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 22px; }

  .list-links {
    display: flex; flex-wrap: wrap; gap: 20px;
    padding-top: 18px; border-top: 1px dashed var(--line);
  }
  .list-link {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); text-decoration: none;
    letter-spacing: 0.1em; text-transform: uppercase;
    transition: color 0.2s ease, gap 0.2s ease;
  }
  .list-link:hover { color: var(--accent); gap: 12px; }
  .arrow { display: inline-block; }

  .list-visual {
    aspect-ratio: 4/3; background: var(--bg-2);
    border: 1px solid var(--line);
    position: relative; overflow: hidden; border-radius: 2px;
  }
  .list-visual-img { object-fit: cover; transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
  .list-row:hover .list-visual-img { transform: scale(1.03); }
  .list-visual-fallback {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--serif); font-size: 120px;
    color: var(--ink-faint); letter-spacing: -0.04em;
  }

  .list-empty {
    padding: 80px 0; text-align: center;
    font-family: var(--mono); font-size: 13px;
    color: var(--ink-faint); letter-spacing: 0.15em; text-transform: uppercase;
  }

  @media (max-width: 960px) {
    .list-hero { padding: 120px 0 30px; }
    .list-row  { grid-template-columns: 1fr; gap: 20px; padding: 36px 0; }
    .list-year { display: none; }
    .filter-btn { cursor: pointer; }
  }
`;
