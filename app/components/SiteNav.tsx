"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Work",     href: "/work" },
  { label: "Services", href: "/#services" },
  { label: "Writing",  href: "/writing" },
  { label: "Slides",   href: "/slider" },
  { label: "Process",  href: "/#process" },
  { label: "Contact",  href: "/#contact" },
] as const;

/**
 * Sitewide navigation bar.
 * Pass setCursorHovering so interactive elements scale the custom cursor.
 */
export default function SiteNav({
  setCursorHovering,
}: {
  setCursorHovering: (v: boolean) => void;
}) {
  return (
    <>
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
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>

          <Link
            href="/#contact"
            className="nav-cta inline-icon"
            onMouseEnter={() => setCursorHovering(true)}
            onMouseLeave={() => setCursorHovering(false)}
          >
            Get in Touch <ArrowRight size={12} strokeWidth={1.75} />
          </Link>
        </div>
      </motion.nav>

      {/* Hamburger — visible on mobile only, fixed-positioned */}
      <MobileMenu />
    </>
  );
}
