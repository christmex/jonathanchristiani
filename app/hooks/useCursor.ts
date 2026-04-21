"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useSpring } from "motion/react";

/**
 * Centralised custom-cursor logic.
 * Returns spring-animated x/y values for the cursor dot,
 * plus a setter to toggle the hover-expanded state.
 */
export function useCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const cursorXSpring = useSpring(cursorX, { stiffness: 300, damping: 30 });
  const cursorYSpring = useSpring(cursorY, { stiffness: 300, damping: 30 });

  const [cursorHovering, setCursorHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  return { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering };
}
