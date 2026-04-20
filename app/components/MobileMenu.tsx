"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const links = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/#services" },
  { label: "Writing", href: "/writing" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/#contact" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        className="mm-btn"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`mm-burger ${open ? "is-open" : ""}`}>
          <span />
          <span />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mm-overlay"
            className="mm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mm-grain" aria-hidden="true" />

            <div className="mm-head">
              <span className="mm-kicker">§ — MENU</span>
              <span className="mm-close-label">ESC · CLOSE</span>
            </div>

            <nav className="mm-nav">
              <ul>
                {links.map((l, i) => (
                  <motion.li
                    key={l.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.12 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link href={l.href} onClick={() => setOpen(false)}>
                      <span className="mm-idx">
                        0{i + 1}
                      </span>
                      <span className="mm-lbl">{l.label}</span>
                      <span className="mm-arr">→</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="mm-foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <span>© 2026 JONATHAN CHRISTIANI</span>
              <a href="mailto:christmex@yahoo.com">christmex@yahoo.com</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{css}</style>
    </>
  );
}

const css = `
  .mm-btn {
    display: none;
    position: fixed;
    top: 14px;
    right: 20px;
    z-index: 120;
    width: 44px;
    height: 44px;
    padding: 0;
    align-items: center;
    justify-content: center;
    background: rgba(10, 10, 10, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--ink);
    cursor: pointer;
  }
  .mm-burger {
    position: relative;
    width: 18px;
    height: 12px;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .mm-burger span {
    display: block;
    width: 100%;
    height: 1.5px;
    background: var(--ink);
    border-radius: 2px;
    transform-origin: center;
    transition: transform 0.28s ease, opacity 0.28s ease;
  }
  .mm-burger.is-open span:nth-child(1) { transform: translateY(5.25px) rotate(45deg); }
  .mm-burger.is-open span:nth-child(2) { transform: translateY(-5.25px) rotate(-45deg); }

  .mm-overlay {
    position: fixed;
    inset: 0;
    z-index: 110;
    background: var(--bg, #0a0a0a);
    display: flex;
    flex-direction: column;
    padding: 72px 24px 28px;
    overflow: hidden;
  }
  .mm-grain {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.06;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
  }
  .mm-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-dim);
    position: relative;
  }
  .mm-kicker { color: var(--accent); }

  .mm-nav {
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
  }
  .mm-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  .mm-nav li {
    border-top: 1px solid var(--line);
  }
  .mm-nav li:last-child {
    border-bottom: 1px solid var(--line);
  }
  .mm-nav a {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: baseline;
    gap: 18px;
    padding: 22px 4px;
    color: var(--ink);
    text-decoration: none;
    transition: color 0.2s ease, padding 0.25s ease;
  }
  .mm-nav a:hover { padding-left: 10px; }
  .mm-nav a:hover .mm-arr { color: var(--accent); transform: translateX(4px); }
  .mm-idx {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    color: var(--ink-dim);
  }
  .mm-lbl {
    font-family: var(--serif);
    font-size: 40px;
    line-height: 1;
    letter-spacing: -0.01em;
  }
  .mm-arr {
    font-family: var(--mono);
    font-size: 18px;
    color: var(--ink-dim);
    transition: color 0.2s ease, transform 0.25s ease;
  }

  .mm-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid var(--line);
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink-dim);
    position: relative;
  }
  .mm-foot a { color: var(--ink-dim); text-decoration: none; text-transform: none; letter-spacing: 0; }

  @media (max-width: 960px) {
    .mm-btn { display: inline-flex; }
    .nav-cta { display: none !important; }
  }

  @media (max-width: 480px) {
    .mm-lbl { font-size: 34px; }
  }
`;
