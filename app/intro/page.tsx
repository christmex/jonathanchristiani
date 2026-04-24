"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { ArrowRight, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import PageShell from "@/app/components/PageShell";
import { useCursor } from "@/app/hooks/useCursor";

/* ─────────────────────────────────────────────────────────────────────────
   /intro — cinematic launch reveal
   ~24 seconds. Kinetic typography + layered SVG + synthesised soundtrack.
   Starts only after user clicks Play (autoplay policy).
   ───────────────────────────────────────────────────────────────────── */

type Frame =
  | { kind: "kicker";  text: string }
  | { kind: "hero";    pre: string;   main: string; accent: boolean }
  | { kind: "subhook"; text: string }
  | { kind: "menu";    num: string;   total: string; label: string; desc: string }
  | { kind: "brand";   text: string;  sub: string }
  | { kind: "url";     text: string;  sub: string };

const TIMELINE: Array<{ at: number; frame: Frame }> = [
  { at:    0, frame: { kind: "kicker",  text: "2026 · RELAUNCH" } },
  { at: 1200, frame: { kind: "hero",    pre: "Just",     main: "released.",         accent: true  } },
  { at: 3200, frame: { kind: "hero",    pre: "A brand",  main: "new portfolio.",    accent: false } },
  { at: 5000, frame: { kind: "subhook", text: "Seven sections. One story." } },
  { at: 6600, frame: { kind: "menu", num: "01", total: "07", label: "Home",     desc: "The landing — where it all begins" } },
  { at: 8400, frame: { kind: "menu", num: "02", total: "07", label: "Work",     desc: "Selected projects & case studies" } },
  { at:10200, frame: { kind: "menu", num: "03", total: "07", label: "Services", desc: "What I build for clients" } },
  { at:12000, frame: { kind: "menu", num: "04", total: "07", label: "Writing",  desc: "Essays on craft, code, and process" } },
  { at:13800, frame: { kind: "menu", num: "05", total: "07", label: "Slides",   desc: "Decks from talks & pitches" } },
  { at:15600, frame: { kind: "menu", num: "06", total: "07", label: "Process",  desc: "How I work with clients" } },
  { at:17400, frame: { kind: "menu", num: "07", total: "07", label: "Contact",  desc: "Let's build something together" } },
  { at:19400, frame: { kind: "brand", text: "JONATHAN CHRISTIANI", sub: "Fullstack → AI Native Engineer" } },
  { at:21800, frame: { kind: "url",   text: "jonathanchristiani.com", sub: "Explore the new site." } },
];

const DURATION = 24500;

/* ── Motion variants ────────────────────────────────────────────────── */

const charParent: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  exit:   { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
};
const charChild: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: -80, filter: "blur(10px)" },
  show:   { opacity: 1, y: 0,  rotateX: 0,  filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, y: -30, filter: "blur(8px)", transition: { duration: 0.28, ease: "easeIn" } },
};

function Chars({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", perspective: 1000, ...style }}
      variants={charParent}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {text.split("").map((ch, i) => (
        <motion.span key={i} variants={charChild} style={{ display: "inline-block", transformStyle: "preserve-3d" }}>
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ── Soundtrack (Web Audio) ─────────────────────────────────────────── */

type AudioHandle = {
  stop: () => void;
  setMuted: (m: boolean) => void;
};

function startSoundtrack(): AudioHandle | null {
  try {
    type WithWebkit = typeof window & { webkitAudioContext?: typeof AudioContext };
    const w = window as WithWebkit;
    const AC = window.AudioContext || w.webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.55;
    const masterFilter = ctx.createBiquadFilter();
    masterFilter.type = "lowpass";
    masterFilter.frequency.value = 4200;
    masterFilter.Q.value = 0.5;
    master.connect(masterFilter).connect(ctx.destination);

    const now = ctx.currentTime;
    const T = (seconds: number) => now + seconds;

    // ── Sub drone (A1/A1-detune) ──
    const drone = (freq: number, fadeInStart: number, peak: number) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, T(0));
      g.gain.linearRampToValueAtTime(peak, T(fadeInStart));
      g.gain.setValueAtTime(peak, T(22));
      g.gain.linearRampToValueAtTime(0, T(24.2));
      osc.connect(g).connect(master);
      osc.start(T(0));
      osc.stop(T(24.5));
    };
    drone(55, 3, 0.3);
    drone(55.4, 4, 0.18);
    drone(110, 5, 0.09);

    // ── Pad chord (A minor → A major at brand) ──
    const pad = (freq: number, start: number, end: number, peak = 0.05) => {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 900;
      f.Q.value = 1;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, T(start));
      g.gain.linearRampToValueAtTime(peak, T(start + 1.6));
      g.gain.setValueAtTime(peak, T(end - 0.6));
      g.gain.linearRampToValueAtTime(0, T(end));
      osc.connect(f).connect(g).connect(master);
      osc.start(T(start));
      osc.stop(T(end + 0.1));
    };
    // A-minor 7 pad during tour
    pad(220.00, 1,  19.2);  // A3
    pad(261.63, 2,  19.2);  // C4
    pad(329.63, 3,  19.2);  // E4
    // Shift to A major on brand reveal (C → C#)
    pad(220.00, 19.2, 24.3, 0.06);
    pad(277.18, 19.3, 24.3, 0.05);  // C#4
    pad(329.63, 19.4, 24.3, 0.05);
    pad(440.00, 19.6, 24.3, 0.035); // add A4 on top

    // ── Kicks on transitions ──
    const kick = (t: number, vol = 0.55) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      const g = ctx.createGain();
      osc.frequency.setValueAtTime(130, T(t));
      osc.frequency.exponentialRampToValueAtTime(38, T(t + 0.22));
      g.gain.setValueAtTime(vol, T(t));
      g.gain.exponentialRampToValueAtTime(0.001, T(t + 0.45));
      osc.connect(g).connect(master);
      osc.start(T(t));
      osc.stop(T(t + 0.5));
    };
    [1.2, 3.2, 5.0, 6.6, 8.4, 10.2, 12.0, 13.8, 15.6, 17.4, 19.4, 21.8].forEach((t, i) => {
      kick(t, i === 10 ? 0.75 : 0.45);
    });

    // ── Whoosh (filtered noise sweep) on big transitions ──
    const whoosh = (t: number, durSec = 0.9, vol = 0.14) => {
      const bufSize = Math.floor(ctx.sampleRate * (durSec + 0.5));
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(200, T(t));
      filter.frequency.exponentialRampToValueAtTime(3800, T(t + durSec));
      filter.Q.value = 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, T(t));
      g.gain.linearRampToValueAtTime(vol, T(t + durSec * 0.5));
      g.gain.linearRampToValueAtTime(0, T(t + durSec));
      src.connect(filter).connect(g).connect(master);
      src.start(T(t));
      src.stop(T(t + durSec + 0.1));
    };
    whoosh(0.8, 1.2, 0.12);
    whoosh(4.8, 0.8, 0.12);
    whoosh(18.4, 1.2, 0.22);   // riser into brand
    whoosh(21.3, 0.7, 0.12);

    // ── Riser (saw pitch sweep up) leading into brand ──
    {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, T(17.8));
      osc.frequency.exponentialRampToValueAtTime(1200, T(19.35));
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.setValueAtTime(350, T(17.8));
      f.frequency.exponentialRampToValueAtTime(3200, T(19.35));
      f.Q.value = 4;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, T(17.8));
      g.gain.linearRampToValueAtTime(0.12, T(19.2));
      g.gain.linearRampToValueAtTime(0, T(19.5));
      osc.connect(f).connect(g).connect(master);
      osc.start(T(17.8));
      osc.stop(T(19.6));
    }

    // ── Bell chimes on brand & URL reveals ──
    const chime = (t: number, freq: number, vol = 0.16, tailSec = 2.6) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, T(t));
      g.gain.linearRampToValueAtTime(vol, T(t + 0.02));
      g.gain.exponentialRampToValueAtTime(0.001, T(t + tailSec));
      osc.connect(g).connect(master);
      osc.start(T(t));
      osc.stop(T(t + tailSec + 0.1));
    };
    // Brand reveal: A–C#–E chord bells
    chime(19.4, 880,  0.16);
    chime(19.55, 1108.73, 0.13);
    chime(19.7, 1318.51, 0.10, 3.2);
    // URL reveal: octave + fifth
    chime(21.8, 880,  0.14);
    chime(22.0, 1318.51, 0.10, 3.0);

    let muted = false;
    return {
      stop: () => {
        try {
          master.gain.cancelScheduledValues(ctx.currentTime);
          master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
          setTimeout(() => { void ctx.close(); }, 400);
        } catch { /* noop */ }
      },
      setMuted: (m: boolean) => {
        muted = m;
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(m ? 0 : 0.55, ctx.currentTime + 0.15);
        void muted; // keep ref
      },
    };
  } catch {
    return null;
  }
}

/* ── Scene renderers ────────────────────────────────────────────────── */

function SceneKicker({ text }: { text: string }) {
  return (
    <div className="scene scene-kicker">
      <motion.div
        className="kicker-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <Chars text={text} className="kicker-text" />
      <motion.div
        className="kicker-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function SceneHero({ pre, main, accent }: { pre: string; main: string; accent: boolean }) {
  return (
    <div className="scene scene-hero">
      <motion.div
        className="hero-pre"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="hero-bracket">⟦</span> {pre} <span className="hero-bracket">⟧</span>
      </motion.div>
      <div className={`hero-main${accent ? " hero-main-accent" : ""}`}>
        <Chars text={main} />
      </div>
      <motion.svg
        className="hero-underline"
        viewBox="0 0 600 6"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.line
          x1="0" y1="3" x2="600" y2="3"
          stroke={accent ? "var(--accent)" : "var(--ink-dim)"}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.svg>
    </div>
  );
}

function SceneSubhook({ text }: { text: string }) {
  return (
    <div className="scene scene-subhook">
      <motion.svg
        viewBox="0 0 24 24" className="subhook-asterisk"
        initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {[0, 45, 90, 135].map((a, i) => (
          <motion.line
            key={i}
            x1="12" y1="2" x2="12" y2="22"
            stroke="var(--accent)" strokeWidth="1.5"
            transform={`rotate(${a} 12 12)`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
          />
        ))}
      </motion.svg>
      <Chars text={text} className="subhook-text" />
    </div>
  );
}

function SceneMenu({ num, total, label, desc }: { num: string; total: string; label: string; desc: string }) {
  return (
    <div className="scene scene-menu">
      {/* Number badge with corner brackets */}
      <motion.div
        className="menu-badge"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg className="menu-badge-brackets" viewBox="0 0 140 44" preserveAspectRatio="none">
          {/* four corner brackets */}
          <motion.path d="M0 12 L0 0 L12 0" stroke="var(--accent)" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.1 }} />
          <motion.path d="M140 12 L140 0 L128 0" stroke="var(--accent)" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.15 }} />
          <motion.path d="M0 32 L0 44 L12 44" stroke="var(--accent)" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.2 }} />
          <motion.path d="M140 32 L140 44 L128 44" stroke="var(--accent)" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.25 }} />
        </svg>
        <span className="menu-badge-text">
          <span className="menu-badge-num">{num}</span>
          <span className="menu-badge-slash">/</span>
          <span className="menu-badge-total">{total}</span>
        </span>
      </motion.div>

      {/* Label with crosshair lines */}
      <div className="menu-label-wrap">
        <motion.div
          className="menu-crosshair menu-crosshair-l"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.5 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="menu-label">
          <Chars text={label} />
        </div>
        <motion.div
          className="menu-crosshair menu-crosshair-r"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.5 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Description */}
      <motion.div
        className="menu-desc"
        initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="menu-desc-dash">—</span> {desc}
      </motion.div>
    </div>
  );
}

function SceneBrand({ text, sub }: { text: string; sub: string }) {
  return (
    <div className="scene scene-brand">
      {/* Expanding rings */}
      <svg className="brand-rings" viewBox="-220 -220 440 440" aria-hidden="true">
        {[40, 80, 120, 160, 200].map((r, i) => (
          <motion.circle
            key={r}
            cx="0" cy="0" r={r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={i === 4 ? 0.6 : 0.9}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.35 - i * 0.04 }}
            transition={{ duration: 1.3, delay: 0.1 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "center" }}
          />
        ))}
        {/* Crosshair */}
        <motion.line
          x1="-220" y1="0" x2="220" y2="0"
          stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        />
        <motion.line
          x1="0" y1="-220" x2="0" y2="220"
          stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.35 }}
        />
      </svg>

      <motion.div
        className="brand-text"
        initial={{ opacity: 0, letterSpacing: "0.5em", filter: "blur(14px)" }}
        animate={{ opacity: 1, letterSpacing: "0.1em", filter: "blur(0px)" }}
        exit={{ opacity: 0, letterSpacing: "0.04em" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.div>

      <motion.div
        className="brand-divider"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="brand-sub"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
      >
        {sub}
      </motion.div>
    </div>
  );
}

function SceneUrl({ text, sub }: { text: string; sub: string }) {
  return (
    <div className="scene scene-url">
      <motion.div
        className="url-sub"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {sub}
      </motion.div>
      <motion.div
        className="url-text"
        initial={{ opacity: 0, scale: 0.88, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {text.replace(".com", "")}<span className="url-dot">.</span>com
      </motion.div>
      <motion.svg viewBox="0 0 400 4" className="url-underline" preserveAspectRatio="none">
        <motion.line
          x1="0" y1="2" x2="400" y2="2"
          stroke="var(--accent)" strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.svg>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */

export default function IntroPage() {
  const { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering } = useCursor();
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const audioRef = useRef<AudioHandle | null>(null);

  const start = () => {
    setIdx(0);
    setDone(false);
    setStarted(true);
    setRunKey((k) => k + 1);
    audioRef.current?.stop();
    audioRef.current = startSoundtrack();
    if (muted) audioRef.current?.setMuted(true);
  };

  const replay = () => {
    audioRef.current?.stop();
    audioRef.current = null;
    setDone(false);
    setIdx(0);
    setRunKey((k) => k + 1);
    requestAnimationFrame(() => {
      audioRef.current = startSoundtrack();
      if (muted) audioRef.current?.setMuted(true);
    });
  };

  // schedule frame advances whenever we start a run
  useEffect(() => {
    if (!started) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    TIMELINE.forEach((step, i) => {
      timeouts.push(setTimeout(() => setIdx(i), step.at));
    });
    timeouts.push(setTimeout(() => setDone(true), DURATION));
    return () => timeouts.forEach(clearTimeout);
  }, [started, runKey]);

  // stop audio on unmount
  useEffect(() => {
    return () => { audioRef.current?.stop(); };
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    audioRef.current?.setMuted(next);
  };

  const current = TIMELINE[idx]?.frame;

  return (
    <PageShell
      cursorXSpring={cursorXSpring}
      cursorYSpring={cursorYSpring}
      cursorHovering={cursorHovering}
      blobs={3}
    >
      <style>{css}</style>

      {/* Static chrome */}
      <div className="intro-top-right">
        {started && (
          <button
            type="button"
            className="intro-icon-btn"
            onClick={toggleMute}
            onMouseEnter={() => setCursorHovering(true)}
            onMouseLeave={() => setCursorHovering(false)}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={14} strokeWidth={1.75} /> : <Volume2 size={14} strokeWidth={1.75} />}
          </button>
        )}
        <Link
          href="/"
          className="intro-skip"
          onMouseEnter={() => setCursorHovering(true)}
          onMouseLeave={() => setCursorHovering(false)}
        >
          skip →
        </Link>
      </div>

      {/* Ambient corner brackets */}
      <CornerBrackets />

      {/* Splash — press play */}
      <AnimatePresence>
        {!started && (
          <motion.div
            className="intro-splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="splash-dot"
              animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="splash-title">
              <span className="splash-kicker">JONATHAN CHRISTIANI · 2026</span>
              <h1>A new site<br /><em>is live.</em></h1>
              <p>Press play for the 24-second tour.<br />Sound on — headphones recommended.</p>
            </div>
            <motion.button
              type="button"
              className="splash-btn"
              onClick={start}
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Play size={16} strokeWidth={1.75} fill="currentColor" />
              <span>Play intro</span>
            </motion.button>
            <button
              type="button"
              className="splash-mute-toggle"
              onClick={() => setMuted(!muted)}
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}
            >
              {muted ? <VolumeX size={12} strokeWidth={1.75} /> : <Volume2 size={12} strokeWidth={1.75} />}
              {muted ? " sound off" : " sound on"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main stage */}
      {started && (
        <div className="intro-stage">
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={`${runKey}-${idx}`}
                className="intro-frame"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.015 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {current.kind === "kicker"  && <SceneKicker  text={current.text} />}
                {current.kind === "hero"    && <SceneHero    pre={current.pre} main={current.main} accent={current.accent} />}
                {current.kind === "subhook" && <SceneSubhook text={current.text} />}
                {current.kind === "menu"    && <SceneMenu    num={current.num} total={current.total} label={current.label} desc={current.desc} />}
                {current.kind === "brand"   && <SceneBrand   text={current.text} sub={current.sub} />}
                {current.kind === "url"     && <SceneUrl     text={current.text} sub={current.sub} />}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {done && (
              <motion.div
                className="intro-cta-row"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href="/"
                  className="intro-cta intro-cta-primary"
                  onMouseEnter={() => setCursorHovering(true)}
                  onMouseLeave={() => setCursorHovering(false)}
                >
                  <span className="inline-icon">Enter the site <ArrowRight size={14} strokeWidth={1.75} /></span>
                </Link>
                <button
                  type="button"
                  className="intro-cta intro-cta-ghost"
                  onClick={replay}
                  onMouseEnter={() => setCursorHovering(true)}
                  onMouseLeave={() => setCursorHovering(false)}
                >
                  <span className="inline-icon"><RotateCcw size={12} strokeWidth={1.75} /> replay</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Progress bar */}
      {started && (
        <div className="intro-progress">
          <motion.div
            key={`p-${runKey}`}
            className="intro-progress-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: DURATION / 1000, ease: "linear" }}
          />
        </div>
      )}

      {/* Ambient captions */}
      <div className="intro-caption intro-caption-bl" aria-hidden="true">
        <span>REC</span>
        <span className="rec-dot" />
        <span className="sep">·</span>
        <span>2026 / RELAUNCH</span>
      </div>
      <div className="intro-caption intro-caption-br" aria-hidden="true">
        <span>FRAME</span>
        <span className="caption-num">{String(idx + 1).padStart(2, "0")}</span>
        <span className="sep">/</span>
        <span>{String(TIMELINE.length).padStart(2, "0")}</span>
      </div>
    </PageShell>
  );
}

function CornerBrackets() {
  const bracketStroke = { stroke: "var(--ink-faint)", strokeWidth: 1, fill: "none" as const };
  return (
    <svg className="intro-corners" aria-hidden="true">
      {/* four corners */}
      <motion.path d="M24 60 L24 24 L60 24" {...bracketStroke}
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }} />
      <motion.path d="M-60 24 L-24 24 L-24 60" {...bracketStroke}
        style={{ transform: "translateX(100%)" }}
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.25 }} />
      <motion.path d="M24 -60 L24 -24 L60 -24" {...bracketStroke}
        style={{ transform: "translateY(100%)" }}
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }} />
      <motion.path d="M-60 -24 L-24 -24 L-24 -60" {...bracketStroke}
        style={{ transform: "translate(100%, 100%)" }}
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.35 }} />
    </svg>
  );
}

/* ── Styles ─────────────────────────────────────────────────────────── */

const css = `
  .intro-stage {
    min-height: 100dvh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 40px;
    position: relative; z-index: 2;
  }
  .intro-frame {
    width: 100%; max-width: 1280px;
    text-align: center;
    will-change: transform, opacity;
  }
  .scene {
    display: flex; flex-direction: column; align-items: center;
    gap: 18px;
  }

  .intro-top-right {
    position: fixed; top: 22px; right: 26px; z-index: 60;
    display: flex; align-items: center; gap: 14px;
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.14em; text-transform: uppercase;
  }
  .intro-icon-btn {
    background: transparent; border: 1px solid var(--line);
    color: var(--ink-dim); width: 30px; height: 30px; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    transition: color 0.2s, border-color 0.2s;
  }
  .intro-icon-btn:hover { color: var(--ink); border-color: var(--ink-dim); }
  .intro-skip { color: var(--ink-faint); text-decoration: none; transition: color 0.2s; }
  .intro-skip:hover { color: var(--accent); }

  /* ── Splash ─────────────────────────────────── */
  .intro-splash {
    position: fixed; inset: 0; z-index: 40;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 32px; padding: 60px 24px;
    background: rgba(13,13,12,0.82);
    backdrop-filter: blur(6px);
  }
  .splash-dot {
    width: 14px; height: 14px; border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 40px rgba(255,92,46,0.6);
  }
  .splash-title { text-align: center; max-width: 560px; }
  .splash-kicker {
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.22em; color: var(--ink-faint);
    display: block; margin-bottom: 22px;
  }
  .splash-title h1 {
    font-family: var(--serif); font-weight: 400;
    font-size: clamp(42px, 6vw, 72px);
    line-height: 1.02; letter-spacing: -0.035em;
    margin-bottom: 24px;
  }
  .splash-title h1 em { color: var(--accent); font-style: italic; }
  .splash-title p {
    font-family: var(--mono); font-size: 12px;
    letter-spacing: 0.08em; color: var(--ink-dim);
    line-height: 1.8;
  }
  .splash-btn {
    display: inline-flex; align-items: center; gap: 12px;
    background: var(--accent); color: var(--bg);
    border: none; cursor: pointer;
    font-family: var(--mono); font-size: 13px;
    letter-spacing: 0.18em; text-transform: uppercase;
    padding: 16px 28px;
  }
  .splash-mute-toggle {
    background: transparent; border: none; cursor: pointer;
    color: var(--ink-faint); font-family: var(--mono);
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 6px;
    transition: color 0.2s;
  }
  .splash-mute-toggle:hover { color: var(--ink-dim); }

  /* ── Kicker scene ───────────────────────────── */
  .scene-kicker { gap: 22px; }
  .kicker-line {
    width: 80px; height: 1px; background: var(--accent);
    transform-origin: center;
  }
  .kicker-text {
    font-family: var(--mono); font-size: clamp(14px, 1.6vw, 20px);
    letter-spacing: 0.34em; color: var(--accent);
    font-weight: 700;
  }

  /* ── Hero scene ────────────────────────────── */
  .scene-hero { gap: 18px; }
  .hero-pre {
    font-family: var(--serif); font-style: italic;
    font-size: clamp(26px, 3.2vw, 48px);
    color: var(--ink-dim); letter-spacing: -0.02em;
    display: inline-flex; align-items: center; gap: 14px;
  }
  .hero-bracket { color: var(--accent); font-style: normal; opacity: 0.5; font-family: var(--mono); font-size: 0.7em; }
  .hero-main {
    font-family: var(--serif); font-weight: 400;
    font-size: clamp(62px, 10.5vw, 168px);
    letter-spacing: -0.045em; line-height: 0.94;
    color: var(--ink);
  }
  .hero-main-accent { color: var(--accent); }
  .hero-underline {
    width: min(440px, 70vw); height: 6px;
    margin-top: 6px;
  }

  /* ── Subhook scene ─────────────────────────── */
  .scene-subhook { gap: 22px; }
  .subhook-asterisk { width: 28px; height: 28px; transform-origin: center; }
  .subhook-text {
    font-family: var(--serif); font-style: italic;
    font-size: clamp(30px, 4.2vw, 58px);
    color: var(--ink); letter-spacing: -0.02em; line-height: 1.1;
  }

  /* ── Menu scene ────────────────────────────── */
  .scene-menu { gap: 26px; }
  .menu-badge {
    position: relative;
    width: 140px; height: 44px;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .menu-badge-brackets { position: absolute; inset: 0; width: 100%; height: 100%; }
  .menu-badge-text {
    font-family: var(--mono); font-size: 13px; letter-spacing: 0.22em;
    color: var(--accent); font-weight: 700;
    display: inline-flex; gap: 6px;
  }
  .menu-badge-total, .menu-badge-slash { color: var(--ink-faint); font-weight: 400; }

  .menu-label-wrap {
    display: flex; align-items: center; justify-content: center; gap: 28px;
    width: 100%;
  }
  .menu-crosshair {
    flex: 1; max-width: 180px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    transform-origin: center;
  }
  .menu-label {
    font-family: var(--serif); font-style: italic; font-weight: 400;
    font-size: clamp(80px, 13.5vw, 220px);
    letter-spacing: -0.055em; line-height: 0.92;
    color: var(--ink); white-space: nowrap;
  }

  .menu-desc {
    font-family: var(--mono); font-size: clamp(13px, 1.5vw, 18px);
    letter-spacing: 0.06em; color: var(--ink-dim);
    max-width: 620px; line-height: 1.55;
  }
  .menu-desc-dash { color: var(--accent); margin-right: 10px; }

  /* ── Brand scene ───────────────────────────── */
  .scene-brand { position: relative; gap: 24px; padding: 40px 0; }
  .brand-rings {
    position: absolute; inset: 50% auto auto 50%;
    width: 720px; height: 720px;
    transform: translate(-50%, -50%);
    pointer-events: none; z-index: 0;
    max-width: 100vw; max-height: 100vh;
  }
  .brand-text {
    position: relative; z-index: 1;
    font-family: var(--mono); font-weight: 700;
    font-size: clamp(30px, 5.2vw, 78px);
    color: var(--ink);
  }
  .brand-divider {
    position: relative; z-index: 1;
    width: min(260px, 50vw); height: 1px;
    background: var(--accent);
    transform-origin: center;
  }
  .brand-sub {
    position: relative; z-index: 1;
    font-family: var(--serif); font-style: italic;
    font-size: clamp(18px, 2.2vw, 30px);
    color: var(--accent);
  }

  /* ── URL scene ─────────────────────────────── */
  .scene-url { gap: 24px; }
  .url-sub {
    font-family: var(--mono); font-size: clamp(11px, 1.2vw, 14px);
    letter-spacing: 0.24em; text-transform: uppercase; color: var(--ink-dim);
  }
  .url-text {
    font-family: var(--serif); font-weight: 400;
    font-size: clamp(42px, 7.8vw, 124px);
    letter-spacing: -0.035em; color: var(--ink); line-height: 1;
  }
  .url-dot { color: var(--accent); }
  .url-underline { width: min(380px, 70vw); height: 4px; margin-top: 4px; }

  /* ── End CTAs ──────────────────────────────── */
  .intro-cta-row {
    position: absolute; bottom: 96px; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 14px; align-items: center;
  }
  .intro-cta {
    font-family: var(--mono); font-size: 12px;
    letter-spacing: 0.14em; text-transform: uppercase;
    padding: 14px 22px; text-decoration: none;
    cursor: pointer; border: none;
    transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
  }
  .intro-cta-primary { background: var(--accent); color: var(--bg); }
  .intro-cta-primary:hover { transform: translateY(-2px); }
  .intro-cta-ghost {
    background: transparent; color: var(--ink-dim);
    border: 1px solid var(--line);
  }
  .intro-cta-ghost:hover { color: var(--ink); border-color: var(--ink-dim); }

  /* ── Progress bar ──────────────────────────── */
  .intro-progress {
    position: fixed; left: 0; right: 0; bottom: 0;
    height: 2px; background: var(--line); z-index: 55;
  }
  .intro-progress-fill { height: 100%; background: var(--accent); transform-origin: left center; }

  /* ── Captions ──────────────────────────────── */
  .intro-caption {
    position: fixed; z-index: 40;
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.24em; text-transform: uppercase;
    color: var(--ink-faint);
    display: flex; align-items: center; gap: 8px;
  }
  .intro-caption .sep { color: var(--line); }
  .intro-caption-bl { bottom: 18px; left: 24px; }
  .intro-caption-br { bottom: 18px; right: 24px; }
  .caption-num { color: var(--accent); }
  .rec-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent); display: inline-block;
    animation: pulse 1.2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.25; }
  }

  /* ── Corner brackets ───────────────────────── */
  .intro-corners {
    position: fixed; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 5;
  }

  @media (max-width: 760px) {
    .intro-stage { padding: 60px 20px; }
    .intro-cta-row { bottom: 64px; flex-direction: column; }
    .intro-caption-bl { left: 14px; bottom: 10px; font-size: 9px; }
    .intro-caption-br { right: 14px; bottom: 10px; font-size: 9px; }
    .menu-crosshair { max-width: 60px; }
    .menu-label-wrap { gap: 12px; }
    .brand-rings { width: 480px; height: 480px; }
  }
`;
