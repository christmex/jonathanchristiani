"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { ArrowRight, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import PageShell from "@/app/components/PageShell";
import { useCursor } from "@/app/hooks/useCursor";

/* ─────────────────────────────────────────────────────────────────────────
   /intro  — cinematic launch reveal  (~35 s)
   Slower, readable frames · energetic 128-BPM electronic soundtrack
   ───────────────────────────────────────────────────────────────────── */

type Frame =
  | { kind: "kicker";  text: string }
  | { kind: "hero";    pre: string; main: string; accent: boolean }
  | { kind: "subhook"; text: string }
  | { kind: "menu";    num: string; total: string; label: string; desc: string }
  | { kind: "brand";   text: string; sub: string }
  | { kind: "url";     text: string; sub: string };

const TIMELINE: Array<{ at: number; frame: Frame }> = [
  { at:     0, frame: { kind: "kicker",  text: "2026 · RELAUNCH" } },
  { at:  2000, frame: { kind: "hero",    pre: "Just",    main: "released.",         accent: true  } },
  { at:  5000, frame: { kind: "hero",    pre: "A brand", main: "new portfolio.",    accent: false } },
  { at:  8000, frame: { kind: "subhook", text: "Seven sections. One story." } },
  { at: 10000, frame: { kind: "menu", num: "01", total: "07", label: "Home",     desc: "The landing — where it all begins" } },
  { at: 12500, frame: { kind: "menu", num: "02", total: "07", label: "Work",     desc: "Selected projects & case studies" } },
  { at: 15000, frame: { kind: "menu", num: "03", total: "07", label: "Services", desc: "What I build for clients" } },
  { at: 17500, frame: { kind: "menu", num: "04", total: "07", label: "Writing",  desc: "Essays on craft, code & process" } },
  { at: 20000, frame: { kind: "menu", num: "05", total: "07", label: "Slides",   desc: "Decks from talks & pitches" } },
  { at: 22500, frame: { kind: "menu", num: "06", total: "07", label: "Process",  desc: "How I work with clients" } },
  { at: 25000, frame: { kind: "menu", num: "07", total: "07", label: "Contact",  desc: "Let's build something together" } },
  { at: 27500, frame: { kind: "brand", text: "JONATHAN CHRISTIANI", sub: "Fullstack → AI Native Engineer" } },
  { at: 31500, frame: { kind: "url",   text: "jonathanchristiani.com", sub: "Explore the new site." } },
];

const DURATION = 35500;

/* ── Motion variants ──────────────────────────────────────────────── */

const charParent: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
  exit:   { transition: { staggerChildren: 0.02,  staggerDirection: -1 } },
};
const charChild: Variants = {
  hidden: { opacity: 0, y: 70,  rotateX: -90, filter: "blur(12px)" },
  show:   { opacity: 1, y: 0,   rotateX:   0, filter: "blur(0px)",
            transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, y: -28, filter: "blur(8px)",
            transition: { duration: 0.3, ease: "easeIn" } },
};

function Chars({ text, className, style }: {
  text: string; className?: string; style?: React.CSSProperties;
}) {
  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", perspective: 1200, ...style }}
      variants={charParent}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          variants={charChild}
          style={{ display: "inline-block", transformStyle: "preserve-3d" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ── Soundtrack — energetic 128-BPM electronic ────────────────────── */

type AudioHandle = { stop: () => void; setMuted: (m: boolean) => void };

function startSoundtrack(): AudioHandle | null {
  try {
    type WithWebkit = typeof window & { webkitAudioContext?: typeof AudioContext };
    const AC = window.AudioContext || (window as WithWebkit).webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();

    /* Master bus with hard-limiter compressor */
    const master = ctx.createGain();
    master.gain.value = 0.65;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -6; comp.knee.value = 6;
    comp.ratio.value = 8; comp.attack.value = 0.003; comp.release.value = 0.08;
    master.connect(comp).connect(ctx.destination);

    const now = ctx.currentTime;
    const T   = (s: number) => now + s;

    /* Shared noise buffer — one allocation, reused by every noise source */
    const noiseLen  = Math.ceil(ctx.sampleRate * 0.6);
    const noiseBuf  = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) noiseData[i] = Math.random() * 2 - 1;

    /* ── Percussion helpers ─────────────────────────────────────── */
    const kick = (t: number, vol = 0.72) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      const g = ctx.createGain();
      osc.frequency.setValueAtTime(160, T(t));
      osc.frequency.exponentialRampToValueAtTime(36, T(t + 0.18));
      g.gain.setValueAtTime(vol, T(t));
      g.gain.exponentialRampToValueAtTime(0.001, T(t + 0.4));
      osc.connect(g).connect(master);
      osc.start(T(t)); osc.stop(T(t + 0.45));
    };

    const snare = (t: number, vol = 0.5) => {
      /* tone body */
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      const og = ctx.createGain();
      osc.frequency.setValueAtTime(220, T(t));
      osc.frequency.exponentialRampToValueAtTime(80, T(t + 0.1));
      og.gain.setValueAtTime(vol * 0.5, T(t));
      og.gain.exponentialRampToValueAtTime(0.001, T(t + 0.14));
      osc.connect(og).connect(master);
      osc.start(T(t)); osc.stop(T(t + 0.15));
      /* noise snap */
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = 3200; f.Q.value = 2;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(vol, T(t));
      ng.gain.exponentialRampToValueAtTime(0.001, T(t + 0.2));
      src.connect(f).connect(ng).connect(master);
      src.start(T(t));
    };

    const closedHat = (t: number, vol = 0.2) => {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      const f = ctx.createBiquadFilter();
      f.type = "highpass"; f.frequency.value = 9000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, T(t));
      g.gain.exponentialRampToValueAtTime(0.001, T(t + 0.04));
      src.connect(f).connect(g).connect(master);
      src.start(T(t));
    };

    const openHat = (t: number, vol = 0.12) => {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      const f = ctx.createBiquadFilter();
      f.type = "highpass"; f.frequency.value = 6500;
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, T(t));
      g.gain.exponentialRampToValueAtTime(0.001, T(t + 0.24));
      src.connect(f).connect(g).connect(master);
      src.start(T(t));
    };

    const bassNote = (t: number, freq: number, dur = 0.22) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.38, T(t));
      g.gain.exponentialRampToValueAtTime(0.001, T(t + dur));
      osc.connect(g).connect(master);
      osc.start(T(t)); osc.stop(T(t + dur + 0.05));
    };

    const stab = (t: number, freq: number, vol = 0.07) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      const f = ctx.createBiquadFilter();
      f.type = "lowpass"; f.frequency.value = freq * 2.8; f.Q.value = 4;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, T(t));
      g.gain.linearRampToValueAtTime(vol, T(t + 0.01));
      g.gain.exponentialRampToValueAtTime(0.001, T(t + 0.3));
      osc.connect(f).connect(g).connect(master);
      osc.start(T(t)); osc.stop(T(t + 0.35));
    };

    /* ── 128-BPM drum machine ────────────────────────────────────── */
    const BPM       = 128;
    const sixteenth = 60 / BPM / 4;   // ≈ 0.117 s
    const drumStart = 1.8;
    const drumEnd   = 35.0;
    const numSteps  = Math.floor((drumEnd - drumStart) / sixteenth);

    /*
      16-step pattern (1 bar of 4/4):
      Pos:    0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
      Kick:   K        k        K        k        K        k     ← 4-on-floor + synco ghost
      Snare:                 S                          S        ← beats 2 & 4
      Hat:    H     H     H     H     H     H     H     H        ← 8th-note closed
      OpenH:                        oH                       oH  ← just before snare
      Bass:   B              B     B        B              B
    */
    const K =  [1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0];  // 4-on-floor w/ syncopated ghost
    const S =  [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0];  // snare 2 & 4
    const H =  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0];  // 8th closed hats
    const OH = [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0];  // open hats
    const BF = [55,0,0,0,0,41.2,0,0,55,0,0,0,0,41.2,0,0]; // bass freqs

    for (let i = 0; i < numSteps; i++) {
      const t    = drumStart + i * sixteenth;
      const pos  = i % 16;
      const bar  = Math.floor(i / 16);
      const intro = t < 4.5;
      const build = t >= 25.0 && t < 27.5;  // riser section
      const drop  = t >= 27.5 && t < 31.5;  // brand climax

      const kv = drop ? 0.88 : intro ? 0.5 : 0.72;
      const hv = intro ? 0 : build ? 0.28 : 0.2;

      if (K[pos])  kick(t, kv);
      if (S[pos] && !intro) snare(t, drop ? 0.62 : 0.5);
      if (H[pos])  closedHat(t, hv);
      if (OH[pos] && !intro) openHat(t, drop ? 0.18 : 0.12);
      if (BF[pos] && !intro) bassNote(t, BF[pos]);

      /* Synth stab chord every 4 bars on the downbeat */
      if (pos === 0 && bar >= 3 && bar % 4 === 0 && !intro) {
        [440, 554.37, 659.25].forEach((f, fi) => stab(t + fi * 0.04, f));
      }
    }

    /* ── Ambient pad chord (texture, low in mix) ────────────────── */
    const pad = (freq: number, start: number, end: number, vol = 0.035) => {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 650; lp.Q.value = 0.7;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, T(start));
      g.gain.linearRampToValueAtTime(vol, T(start + 2));
      g.gain.setValueAtTime(vol, T(end - 0.8));
      g.gain.linearRampToValueAtTime(0, T(end));
      osc.connect(lp).connect(g).connect(master);
      osc.start(T(start)); osc.stop(T(end + 0.1));
    };
    /* A-minor pad during tour */
    pad(110, 1, 27.5, 0.04); pad(220, 2, 27.5, 0.03);
    pad(261.63, 3, 27.5, 0.025); pad(329.63, 4, 27.5, 0.02);
    /* Shift to A-major at brand reveal */
    pad(220, 27.5, 35.5, 0.045); pad(277.18, 27.5, 35.5, 0.04);
    pad(329.63, 27.5, 35.5, 0.035); pad(440, 28, 35.5, 0.025);

    /* ── Riser into brand reveal ─────────────────────────────────── */
    {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, T(25.5));
      osc.frequency.exponentialRampToValueAtTime(2000, T(27.4));
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(180, T(25.5));
      lp.frequency.exponentialRampToValueAtTime(4500, T(27.4));
      lp.Q.value = 6;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, T(25.5));
      g.gain.linearRampToValueAtTime(0.14, T(27.3));
      g.gain.linearRampToValueAtTime(0, T(27.6));
      osc.connect(lp).connect(g).connect(master);
      osc.start(T(25.5)); osc.stop(T(27.7));
    }

    /* ── Noise whoosh sweeps ─────────────────────────────────────── */
    const whoosh = (t: number, dur = 0.9, vol = 0.13) => {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.setValueAtTime(200, T(t));
      f.frequency.exponentialRampToValueAtTime(4000, T(t + dur));
      f.Q.value = 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, T(t));
      g.gain.linearRampToValueAtTime(vol, T(t + dur * 0.5));
      g.gain.linearRampToValueAtTime(0, T(t + dur));
      src.connect(f).connect(g).connect(master);
      src.start(T(t)); src.stop(T(t + dur + 0.05));
    };
    whoosh(0.6, 1.3, 0.11);
    whoosh(4.8, 0.8, 0.10);
    whoosh(9.8, 0.6, 0.10);
    whoosh(27.2, 0.5, 0.18);
    whoosh(31.2, 0.5, 0.12);

    /* ── Bell chimes on brand & URL ─────────────────────────────── */
    const chime = (t: number, freq: number, vol = 0.14, tail = 2.6) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, T(t));
      g.gain.linearRampToValueAtTime(vol, T(t + 0.02));
      g.gain.exponentialRampToValueAtTime(0.001, T(t + tail));
      osc.connect(g).connect(master);
      osc.start(T(t)); osc.stop(T(t + tail + 0.1));
    };
    chime(27.5, 880, 0.15, 3.0); chime(27.65, 1108.73, 0.12, 2.6); chime(27.8, 1318.51, 0.09, 3.3);
    chime(31.5, 880, 0.13, 2.8); chime(31.7, 1318.51, 0.09, 3.0);

    let _muted = false;
    return {
      stop: () => {
        try {
          master.gain.cancelScheduledValues(ctx.currentTime);
          master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
          setTimeout(() => { void ctx.close(); }, 350);
        } catch { /* noop */ }
      },
      setMuted: (m: boolean) => {
        _muted = m;
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(m ? 0 : 0.65, ctx.currentTime + 0.12);
      },
    };
  } catch {
    return null;
  }
}

/* ── Scene renderers ──────────────────────────────────────────────── */

function SceneKicker({ text }: { text: string }) {
  return (
    <div className="scene scene-kicker">
      <motion.div className="kicker-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
      <Chars text={text} className="kicker-text" />
      <motion.div className="kicker-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} />
    </div>
  );
}

function SceneHero({ pre, main, accent }: { pre: string; main: string; accent: boolean }) {
  return (
    <div className="scene scene-hero">
      <motion.div className="hero-pre"
        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
        <span className="hero-bracket">⟦</span>{pre}<span className="hero-bracket">⟧</span>
      </motion.div>
      <div className={`hero-main${accent ? " hero-main-accent" : ""}`}>
        <Chars text={main} />
      </div>
      <motion.svg className="hero-underline" viewBox="0 0 600 6" preserveAspectRatio="none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <motion.line x1="0" y1="3" x2="600" y2="3"
          stroke={accent ? "var(--accent)" : "var(--ink-dim)"} strokeWidth="2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} />
      </motion.svg>
    </div>
  );
}

function SceneSubhook({ text }: { text: string }) {
  return (
    <div className="scene scene-subhook">
      <motion.svg viewBox="0 0 28 28" className="subhook-asterisk"
        initial={{ opacity: 0, rotate: -180, scale: 0.4 }}
        animate={{ opacity: 1, rotate: 0,    scale: 1 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}>
        {[0, 45, 90, 135].map((a, i) => (
          <motion.line key={i} x1="14" y1="2" x2="14" y2="26"
            stroke="var(--accent)" strokeWidth="1.8"
            transform={`rotate(${a} 14 14)`}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }} />
        ))}
      </motion.svg>
      <Chars text={text} className="subhook-text" />
    </div>
  );
}

function SceneMenu({ num, total, label, desc }: {
  num: string; total: string; label: string; desc: string;
}) {
  return (
    <div className="scene scene-menu">
      <motion.div className="menu-badge"
        initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
        <svg className="menu-badge-brackets" viewBox="0 0 140 44" preserveAspectRatio="none">
          {[
            "M0 12 L0 0 L12 0",
            "M140 12 L140 0 L128 0",
            "M0 32 L0 44 L12 44",
            "M140 32 L140 44 L128 44",
          ].map((d, i) => (
            <motion.path key={i} d={d} stroke="var(--accent)" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }} />
          ))}
        </svg>
        <span className="menu-badge-text">
          <span className="menu-badge-num">{num}</span>
          <span className="menu-badge-slash">/</span>
          <span className="menu-badge-tot">{total}</span>
        </span>
      </motion.div>

      <div className="menu-label-row">
        <motion.div className="menu-crosshair"
          initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 0.55 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
        <div className="menu-label"><Chars text={label} /></div>
        <motion.div className="menu-crosshair"
          initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 0.55 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
      </div>

      <motion.div className="menu-desc"
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}>
        <span className="menu-desc-dash">—</span>{desc}
      </motion.div>
    </div>
  );
}

function SceneBrand({ text, sub }: { text: string; sub: string }) {
  return (
    <div className="scene scene-brand">
      <svg className="brand-rings" viewBox="-240 -240 480 480" aria-hidden="true">
        {[40, 80, 120, 165, 210].map((r, i) => (
          <motion.circle key={r} cx="0" cy="0" r={r} fill="none"
            stroke="var(--accent)" strokeWidth={i < 2 ? 1.2 : 0.7}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 - i * 0.05 }}
            transition={{ duration: 1.4, delay: 0.12 + i * 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "center" }} />
        ))}
        <motion.line x1="-240" y1="0" x2="240" y2="0"
          stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.25 }} />
        <motion.line x1="0" y1="-240" x2="0" y2="240"
          stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }} />
      </svg>
      <motion.div className="brand-text"
        initial={{ opacity: 0, letterSpacing: "0.55em", filter: "blur(16px)" }}
        animate={{ opacity: 1, letterSpacing: "0.1em",  filter: "blur(0px)" }}
        exit={{ opacity: 0, letterSpacing: "0.04em" }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}>
        {text}
      </motion.div>
      <motion.div className="brand-divider"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }} />
      <motion.div className="brand-sub"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}>
        {sub}
      </motion.div>
    </div>
  );
}

function SceneUrl({ text, sub }: { text: string; sub: string }) {
  const [base, ext] = [text.replace(".com", ""), ".com"];
  return (
    <div className="scene scene-url">
      <motion.div className="url-sub"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        {sub}
      </motion.div>
      <motion.div className="url-text"
        initial={{ opacity: 0, scale: 0.88, filter: "blur(14px)" }}
        animate={{ opacity: 1, scale: 1,    filter: "blur(0px)" }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
        {base}<span className="url-dot">.</span>com
        <span style={{ display: "none" }}>{ext}</span>
      </motion.div>
      <motion.svg viewBox="0 0 400 4" className="url-underline" preserveAspectRatio="none">
        <motion.line x1="0" y1="2" x2="400" y2="2"
          stroke="var(--accent)" strokeWidth="2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.3, delay: 0.8, ease: [0.22, 1, 0.36, 1] }} />
      </motion.svg>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────── */

export default function IntroPage() {
  const { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering } = useCursor();
  const [started, setStarted] = useState(false);
  const [idx, setIdx]         = useState(0);
  const [done, setDone]       = useState(false);
  const [muted, setMuted]     = useState(false);
  const [runKey, setRunKey]   = useState(0);
  const audioRef = useRef<AudioHandle | null>(null);

  const launch = () => {
    setIdx(0); setDone(false); setStarted(true);
    setRunKey((k) => k + 1);
    audioRef.current?.stop();
    audioRef.current = startSoundtrack();
    if (muted) audioRef.current?.setMuted(true);
  };

  const replay = () => {
    audioRef.current?.stop(); audioRef.current = null;
    setDone(false); setIdx(0); setRunKey((k) => k + 1);
    requestAnimationFrame(() => {
      audioRef.current = startSoundtrack();
      if (muted) audioRef.current?.setMuted(true);
    });
  };

  useEffect(() => {
    if (!started) return;
    const ids: ReturnType<typeof setTimeout>[] = [];
    TIMELINE.forEach((step, i) => { ids.push(setTimeout(() => setIdx(i), step.at)); });
    ids.push(setTimeout(() => setDone(true), DURATION));
    return () => ids.forEach(clearTimeout);
  }, [started, runKey]);

  useEffect(() => () => { audioRef.current?.stop(); }, []);

  const toggleMute = () => {
    const next = !muted; setMuted(next);
    audioRef.current?.setMuted(next);
  };

  const current = TIMELINE[idx]?.frame;

  return (
    <PageShell cursorXSpring={cursorXSpring} cursorYSpring={cursorYSpring}
      cursorHovering={cursorHovering} blobs={3}>
      <style>{css}</style>

      {/* Top-right chrome */}
      <div className="intro-tr">
        {started && (
          <button type="button" className="intro-icon-btn" onClick={toggleMute}
            onMouseEnter={() => setCursorHovering(true)}
            onMouseLeave={() => setCursorHovering(false)}
            aria-label={muted ? "Unmute" : "Mute"}>
            {muted
              ? <VolumeX size={14} strokeWidth={1.75} />
              : <Volume2 size={14} strokeWidth={1.75} />}
          </button>
        )}
        <Link href="/" className="intro-skip"
          onMouseEnter={() => setCursorHovering(true)}
          onMouseLeave={() => setCursorHovering(false)}>
          skip →
        </Link>
      </div>

      {/* Permanent corner brackets */}
      <svg className="intro-corners" aria-hidden="true">
        {[
          { d: "M24 56 L24 24 L56 24",              style: {} },
          { d: "M-56 24 L-24 24 L-24 56",           style: { transform: "translateX(100%)" } },
          { d: "M24 -56 L24 -24 L56 -24",           style: { transform: "translateY(100%)" } },
          { d: "M-56 -24 L-24 -24 L-24 -56",        style: { transform: "translate(100%,100%)" } },
        ].map(({ d, style }, i) => (
          <motion.path key={i} d={d} stroke="var(--ink-faint)" strokeWidth="1" fill="none"
            style={style}
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 + i * 0.08 }} />
        ))}
      </svg>

      {/* ── Splash ── */}
      <AnimatePresence>
        {!started && (
          <motion.div className="intro-splash"
            initial={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}>
            <motion.div className="splash-dot"
              animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
            <div className="splash-copy">
              <p className="splash-eyebrow">JONATHAN CHRISTIANI · 2026 RELAUNCH</p>
              <h1>A new site<br /><em>is live.</em></h1>
              <p className="splash-hint">
                35-second cinematic tour of the site.<br />
                Sound on — it goes hard.
              </p>
            </div>
            <motion.button type="button" className="splash-btn"
              onClick={launch}
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Play size={16} strokeWidth={1.75} fill="currentColor" />
              Play intro
            </motion.button>
            <button type="button" className="splash-mute"
              onClick={() => setMuted(!muted)}
              onMouseEnter={() => setCursorHovering(true)}
              onMouseLeave={() => setCursorHovering(false)}>
              {muted
                ? <><VolumeX size={11} strokeWidth={1.75} /> start muted</>
                : <><Volume2 size={11} strokeWidth={1.75} /> sound on</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stage ── */}
      {started && (
        <div className="intro-stage">
          <AnimatePresence mode="wait">
            {current && (
              <motion.div key={`${runKey}-${idx}`} className="intro-frame"
                initial={{ opacity: 0, scale: 0.984, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1,     filter: "blur(0px)" }}
                exit={{    opacity: 0, scale: 1.016, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
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
              <motion.div className="intro-cta-row"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
                <Link href="/" className="cta-primary"
                  onMouseEnter={() => setCursorHovering(true)}
                  onMouseLeave={() => setCursorHovering(false)}>
                  Enter the site <ArrowRight size={14} strokeWidth={1.75} />
                </Link>
                <button type="button" className="cta-ghost"
                  onClick={replay}
                  onMouseEnter={() => setCursorHovering(true)}
                  onMouseLeave={() => setCursorHovering(false)}>
                  <RotateCcw size={12} strokeWidth={1.75} /> replay
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Progress bar */}
      {started && (
        <div className="intro-prog">
          <motion.div key={`p-${runKey}`} className="intro-prog-fill"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: DURATION / 1000, ease: "linear" }} />
        </div>
      )}

      {/* Ambient corner captions */}
      <div className="intro-cap cap-bl" aria-hidden="true">
        <span>REC</span><span className="rec-dot" />
        <span className="sep">·</span><span>2026 / RELAUNCH</span>
      </div>
      <div className="intro-cap cap-br" aria-hidden="true">
        <span>FRAME</span>
        <span className="cap-num">{String(idx + 1).padStart(2, "0")}</span>
        <span className="sep">/</span>
        <span>{String(TIMELINE.length).padStart(2, "0")}</span>
      </div>
    </PageShell>
  );
}

/* ── CSS ──────────────────────────────────────────────────────────── */

const css = `
  .intro-stage {
    min-height: 100dvh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 40px;
    position: relative; z-index: 2;
  }
  .intro-frame {
    width: 100%; max-width: 1300px;
    text-align: center; will-change: transform, opacity;
  }
  .scene { display: flex; flex-direction: column; align-items: center; gap: 20px; }

  /* ── Top-right chrome ─────────────────────── */
  .intro-tr {
    position: fixed; top: 22px; right: 26px; z-index: 60;
    display: flex; align-items: center; gap: 14px;
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.14em; text-transform: uppercase;
  }
  .intro-icon-btn {
    background: transparent; border: 1px solid var(--line);
    color: var(--ink-dim); width: 30px; height: 30px; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    transition: color .2s, border-color .2s;
  }
  .intro-icon-btn:hover { color: var(--ink); border-color: var(--ink-dim); }
  .intro-skip { color: var(--ink-faint); text-decoration: none; transition: color .2s; }
  .intro-skip:hover { color: var(--accent); }

  /* ── Splash ────────────────────────────────── */
  .intro-splash {
    position: fixed; inset: 0; z-index: 40;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 36px; padding: 60px 24px;
    background: rgba(13,13,12,0.85);
    backdrop-filter: blur(8px);
  }
  .splash-dot {
    width: 16px; height: 16px; border-radius: 50%; background: var(--accent);
    box-shadow: 0 0 48px rgba(255,92,46,0.65);
  }
  .splash-copy { text-align: center; max-width: 580px; }
  .splash-eyebrow {
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.26em;
    color: var(--ink-faint); margin-bottom: 22px; display: block;
    text-transform: uppercase;
  }
  .splash-copy h1 {
    font-family: var(--serif); font-weight: 400;
    font-size: clamp(44px, 6.5vw, 76px);
    line-height: 1.02; letter-spacing: -0.035em; margin-bottom: 22px;
  }
  .splash-copy h1 em { color: var(--accent); font-style: italic; }
  .splash-hint {
    font-family: var(--mono); font-size: 12px;
    letter-spacing: 0.08em; color: var(--ink-dim); line-height: 1.9;
  }
  .splash-btn {
    display: inline-flex; align-items: center; gap: 12px;
    background: var(--accent); color: var(--bg); border: none; cursor: pointer;
    font-family: var(--mono); font-size: 13px;
    letter-spacing: 0.2em; text-transform: uppercase;
    padding: 18px 30px;
  }
  .splash-mute {
    background: transparent; border: none; cursor: pointer;
    color: var(--ink-faint); font-family: var(--mono);
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 6px;
    transition: color .2s;
  }
  .splash-mute:hover { color: var(--ink-dim); }

  /* ── Kicker ─────────────────────────────────── */
  .scene-kicker { gap: 24px; }
  .kicker-line { width: 80px; height: 1px; background: var(--accent); transform-origin: center; }
  .kicker-text {
    font-family: var(--mono); font-size: clamp(14px, 1.6vw, 22px);
    letter-spacing: 0.36em; color: var(--accent); font-weight: 700;
  }

  /* ── Hero ───────────────────────────────────── */
  .scene-hero { gap: 18px; }
  .hero-pre {
    font-family: var(--serif); font-style: italic;
    font-size: clamp(26px, 3.4vw, 50px);
    color: var(--ink-dim); letter-spacing: -0.02em;
    display: inline-flex; align-items: center; gap: 16px;
  }
  .hero-bracket { color: var(--accent); font-style: normal; opacity: 0.45; font-family: var(--mono); font-size: 0.7em; }
  .hero-main {
    font-family: var(--serif); font-weight: 400;
    font-size: clamp(66px, 11vw, 172px);
    letter-spacing: -0.045em; line-height: 0.94; color: var(--ink);
  }
  .hero-main-accent { color: var(--accent); }
  .hero-underline { width: min(460px, 74vw); height: 6px; margin-top: 4px; }

  /* ── Subhook ─────────────────────────────────── */
  .scene-subhook { gap: 24px; }
  .subhook-asterisk { width: 30px; height: 30px; }
  .subhook-text {
    font-family: var(--serif); font-style: italic;
    font-size: clamp(32px, 4.4vw, 62px);
    color: var(--ink); letter-spacing: -0.02em; line-height: 1.1;
  }

  /* ── Menu ────────────────────────────────────── */
  .scene-menu { gap: 28px; }
  .menu-badge {
    position: relative; width: 140px; height: 44px;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .menu-badge-brackets { position: absolute; inset: 0; width: 100%; height: 100%; }
  .menu-badge-text {
    font-family: var(--mono); font-size: 14px; letter-spacing: 0.2em;
    color: var(--accent); font-weight: 700;
    display: inline-flex; align-items: baseline; gap: 5px;
  }
  .menu-badge-slash, .menu-badge-tot { color: var(--ink-faint); font-weight: 400; }

  .menu-label-row {
    display: flex; align-items: center; justify-content: center;
    gap: 24px; width: 100%;
  }
  .menu-crosshair {
    flex: 1; max-width: 200px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    transform-origin: center;
  }
  .menu-label {
    font-family: var(--serif); font-style: italic; font-weight: 400;
    font-size: clamp(82px, 14vw, 230px);
    letter-spacing: -0.055em; line-height: 0.92; color: var(--ink);
    white-space: nowrap;
  }
  .menu-desc {
    font-family: var(--mono); font-size: clamp(13px, 1.5vw, 19px);
    letter-spacing: 0.06em; color: var(--ink-dim); max-width: 640px;
  }
  .menu-desc-dash { color: var(--accent); margin-right: 10px; }

  /* ── Brand ───────────────────────────────────── */
  .scene-brand { position: relative; gap: 24px; padding: 40px 0; }
  .brand-rings {
    position: absolute;
    inset: 50% auto auto 50%;
    width: 760px; height: 760px;
    transform: translate(-50%, -50%);
    pointer-events: none; z-index: 0;
    max-width: 100vw; max-height: 100vh;
  }
  .brand-text {
    position: relative; z-index: 1;
    font-family: var(--mono); font-weight: 700;
    font-size: clamp(28px, 5vw, 76px);
    color: var(--ink);
  }
  .brand-divider {
    position: relative; z-index: 1;
    width: min(280px, 50vw); height: 1px;
    background: var(--accent); transform-origin: center;
  }
  .brand-sub {
    position: relative; z-index: 1;
    font-family: var(--serif); font-style: italic;
    font-size: clamp(18px, 2.4vw, 32px);
    color: var(--accent);
  }

  /* ── URL ─────────────────────────────────────── */
  .scene-url { gap: 24px; }
  .url-sub {
    font-family: var(--mono); font-size: clamp(11px, 1.2vw, 14px);
    letter-spacing: 0.26em; text-transform: uppercase; color: var(--ink-dim);
  }
  .url-text {
    font-family: var(--serif); font-weight: 400;
    font-size: clamp(40px, 7.5vw, 120px);
    letter-spacing: -0.035em; color: var(--ink); line-height: 1;
  }
  .url-dot { color: var(--accent); }
  .url-underline { width: min(400px, 72vw); height: 4px; margin-top: 4px; }

  /* ── End CTAs ────────────────────────────────── */
  .intro-cta-row {
    position: absolute; bottom: 96px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 14px; align-items: center;
  }
  .cta-primary, .cta-ghost {
    font-family: var(--mono); font-size: 12px;
    letter-spacing: 0.14em; text-transform: uppercase;
    padding: 14px 22px; text-decoration: none; cursor: pointer; border: none;
    display: inline-flex; align-items: center; gap: 8px;
    transition: transform .2s, background .2s, color .2s;
  }
  .cta-primary { background: var(--accent); color: var(--bg); }
  .cta-primary:hover { transform: translateY(-2px); }
  .cta-ghost {
    background: transparent; color: var(--ink-dim); border: 1px solid var(--line);
  }
  .cta-ghost:hover { color: var(--ink); border-color: var(--ink-dim); }

  /* ── Progress bar ────────────────────────────── */
  .intro-prog {
    position: fixed; left: 0; right: 0; bottom: 0;
    height: 2px; background: var(--line); z-index: 55;
  }
  .intro-prog-fill { height: 100%; background: var(--accent); transform-origin: left center; }

  /* ── Captions ────────────────────────────────── */
  .intro-cap {
    position: fixed; z-index: 40;
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 0.26em; text-transform: uppercase;
    color: var(--ink-faint); display: flex; align-items: center; gap: 8px;
  }
  .intro-cap .sep { color: var(--line); }
  .cap-bl { bottom: 18px; left: 24px; }
  .cap-br { bottom: 18px; right: 24px; }
  .cap-num { color: var(--accent); }
  .rec-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent); display: inline-block;
    animation: blink 1.1s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{ opacity:1; } 50%{ opacity:0.2; } }

  /* ── Corner brackets ─────────────────────────── */
  .intro-corners {
    position: fixed; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 5;
  }

  /* ── Mobile ──────────────────────────────────── */
  @media (max-width: 760px) {
    .intro-stage { padding: 60px 20px; }
    .intro-cta-row { bottom: 64px; flex-direction: column; gap: 10px; }
    .cap-bl { left: 14px; bottom: 10px; font-size: 9px; }
    .cap-br { right: 14px; bottom: 10px; font-size: 9px; }
    .menu-crosshair { max-width: 50px; }
    .menu-label-row { gap: 10px; }
    .brand-rings { width: 480px; height: 480px; }
  }
`;
