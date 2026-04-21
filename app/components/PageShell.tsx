"use client";

import { motion, useScroll, useSpring, type MotionValue } from "motion/react";
import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  cursorXSpring: MotionValue<number>;
  cursorYSpring: MotionValue<number>;
  cursorHovering: boolean;
  /** Number of bokeh blobs to render (default 4). */
  blobs?: 2 | 3 | 4;
}

/**
 * Page-level wrapper that renders:
 * - scroll progress bar
 * - custom cursor dot
 * - bokeh background blobs
 * CSS for all of these lives in globals.css — no inline styles here.
 */
export default function PageShell({
  children,
  cursorXSpring,
  cursorYSpring,
  cursorHovering,
  blobs = 4,
}: PageShellProps) {
  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <div className="page">
      {/* Bokeh */}
      <div className="bokeh" aria-hidden="true">
        <div className="bokeh-blob bokeh-blob-1" />
        <div className="bokeh-blob bokeh-blob-2" />
        {blobs >= 3 && <div className="bokeh-blob bokeh-blob-3" />}
        {blobs >= 4 && <div className="bokeh-blob bokeh-blob-4" />}
      </div>

      {/* Progress bar */}
      <motion.div className="progress-bar" style={{ scaleX: smoothScroll }} />

      {/* Custom cursor */}
      <motion.div
        className={`cursor${cursorHovering ? " hover" : ""}`}
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />

      {children}
    </div>
  );
}
