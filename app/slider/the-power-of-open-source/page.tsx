"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowLeft, ArrowUp, ArrowDown, ArrowUpRight } from "lucide-react";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";
import { PROFILE } from "@/lib/profile";

const TOTAL_SLIDES = 15;
const FIRST_TIP_SLIDE = 10;

const DECK_TITLE = "The Power of Open Source";

const SPEAKER_ROLE = "Software Engineer & Cyber Security Enthusiast";

const GITHUB_ACCOUNT = { handle: "/christmex", href: "https://github.com/christmex" } as const;
const INSTAGRAM_ACCOUNT = { handle: "/jonathan.christiani", href: "https://www.instagram.com/jonathan.christiani" } as const;
const MEDIUM_ACCOUNT = { handle: "christmex.medium.com", href: "https://christmex.medium.com/" } as const;

const SOCIAL_ACCOUNTS = [
  { platform: "GitHub", Icon: GithubIcon, ...GITHUB_ACCOUNT },
  { platform: "Instagram", Icon: InstagramIcon, ...INSTAGRAM_ACCOUNT },
] as const;

const SHARING_CHANNELS = [
  {
    platform: "Instagram",
    Icon: InstagramIcon,
    href: INSTAGRAM_ACCOUNT.href,
    displayLink: "instagram.com/jonathan.christiani",
    topic: "Programming, especially",
    highlight: "Laravel",
    description: "Tips, tricks, and everyday lessons from building real apps, mostly with Laravel.",
  },
  {
    platform: "Medium",
    Icon: MediumIcon,
    href: MEDIUM_ACCOUNT.href,
    displayLink: MEDIUM_ACCOUNT.handle,
    topic: "Writing about",
    highlight: "Cyber Security",
    description: "How systems break and how they get defended, written down as I learn.",
  },
] as const;

const FILAMENT_PACKAGES = [
  { number: "01", name: "Resources", description: "Full CRUD screens for an Eloquent model: list, create, edit, and view." },
  { number: "02", name: "Forms", description: "Inputs, validation, and dynamic fields declared in PHP." },
  { number: "03", name: "Tables", description: "Search, sort, filter, paginate, and run bulk actions on any query." },
  { number: "04", name: "Actions", description: "Buttons that open modals, confirm, and run logic anywhere." },
  { number: "05", name: "Schemas", description: "One layout system for building any interface out of components." },
  { number: "06", name: "Infolists", description: "Views that present a record's details cleanly, without a form." },
  { number: "07", name: "Notifications", description: "Flash toasts and persistent database notifications." },
  { number: "08", name: "Widgets", description: "Stats, charts, and dashboard blocks out of the box." },
] as const;

const TALL_STACK = [
  { letter: "T", name: "Tailwind CSS" },
  { letter: "A", name: "Alpine.js" },
  { letter: "L", name: "Laravel" },
  { letter: "L", name: "Livewire" },
] as const;

const LETS_BUILD_STEPS = [
  { number: "01", title: "Install Laravel and Filament", points: ["Setup .env", "Database", "Super admin user"] },
  { number: "02", title: "Create your first resource", points: ["List", "Create", "Edit", "Delete"] },
  { number: "03", title: "Add some table magic", points: ["Pagination", "Search", "Filter"] },
] as const;

const CRUD_COMPARISON = [
  { label: "From scratch", value: "Hours of work", isHighlighted: false },
  { label: "With FilamentPHP", value: "Under 1 minute", isHighlighted: true },
] as const;

const CRUD_INCLUDED_FEATURES = ["Pagination", "Search", "Filter"] as const;

const AI_TIPS = [
  {
    number: "01",
    title: "Grill Me",
    credit: "by Matt Pocock",
    points: ["AI interviews you before it writes code", "Your context becomes AI's context", "Open source"],
  },
  {
    number: "02",
    title: "Use Skills",
    credit: "skills.sh",
    points: ["Best practice rules AI can follow", "Browse skills at skills.sh", "Laravel project? Use Laravel Boost"],
  },
  {
    number: "03",
    title: "Use MCP",
    credit: "Model Context Protocol",
    points: ["Seamless link between AI and outside platforms", "AI understands context from outside", "Open protocol"],
  },
  {
    number: "04",
    title: "Clean Codebase",
    credit: "since day one",
    points: ["AI follows the patterns it sees", "Messy code in, messy code out", "Keep it clean from day one"],
  },
  {
    number: "05",
    title: "Context Under 80%",
    credit: "smart zone vs dumb zone",
    points: ["Keep the context window under 80%", "Clear session and write a handoff", "Instead of compacting the conversation"],
  },
] as const;

const CONTEXT_SMART_ZONE_PERCENT = 80;

const OPEN_SOURCE_TOOLS = ["FilamentPHP", "TALL Stack", "Grill Me", "Skills", "Laravel Boost", "MCP"] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: "easeOut", staggerChildren: 0.08 } },
};

const NEXT_SLIDE_KEYS = ["ArrowDown", "PageDown", " ", "ArrowRight"];
const PREVIOUS_SLIDE_KEYS = ["ArrowUp", "PageUp", "ArrowLeft"];

export default function ThePowerOfOpenSourcePage() {
  const { cursorXSpring, cursorYSpring, cursorHovering, setCursorHovering } = useCursor();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(1);

  const goToSlide = (slideNumber: number) => {
    const clampedSlideNumber = Math.max(1, Math.min(TOTAL_SLIDES, slideNumber));
    const slideElement = scrollerRef.current?.querySelector<HTMLElement>(`[data-slide="${clampedSlideNumber}"]`);
    slideElement?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (NEXT_SLIDE_KEYS.includes(event.key)) {
        event.preventDefault(); goToSlide(currentSlide + 1);
      } else if (PREVIOUS_SLIDE_KEYS.includes(event.key)) {
        event.preventDefault(); goToSlide(currentSlide - 1);
      } else if (event.key === "Home") {
        event.preventDefault(); goToSlide(1);
      } else if (event.key === "End") {
        event.preventDefault(); goToSlide(TOTAL_SLIDES);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slideElements = scroller.querySelectorAll<HTMLElement>("[data-slide]");
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
        if (!mostVisibleEntry) return;
        const slideNumber = Number(mostVisibleEntry.target.getAttribute("data-slide"));
        if (slideNumber) setCurrentSlide(slideNumber);
      },
      { root: null, threshold: [0.3, 0.55, 0.75] }
    );
    slideElements.forEach((slideElement) => observer.observe(slideElement));
    return () => observer.disconnect();
  }, []);

  const hoverHandlers = {
    onMouseEnter: () => setCursorHovering(true),
    onMouseLeave: () => setCursorHovering(false),
  };

  return (
    <PageShell cursorXSpring={cursorXSpring} cursorYSpring={cursorYSpring} cursorHovering={cursorHovering} blobs={3}>
      <style>{css}</style>

      <Link href="/slider" className="deck-home" {...hoverHandlers}>
        <span className="inline-icon"><ArrowLeft size={14} strokeWidth={1.75} /> slides</span>
      </Link>

      <div className="deck-event" aria-hidden="true">
        <span>OPEN SOURCE</span>
        <span className="sep">/</span>
        <span>{PROFILE.firstName} {PROFILE.lastName}</span>
      </div>

      <div className="deck-chrome" aria-hidden="true">
        <button type="button" className="deck-arrow" onClick={() => goToSlide(currentSlide - 1)} {...hoverHandlers} aria-label="Previous slide">
          <ArrowUp size={16} strokeWidth={1.75} />
        </button>
        <div className="deck-counter">
          <span className="deck-counter-cur">{String(currentSlide).padStart(2, "0")}</span>
          <span className="deck-counter-sep">/</span>
          <span className="deck-counter-tot">{String(TOTAL_SLIDES).padStart(2, "0")}</span>
        </div>
        <button type="button" className="deck-arrow" onClick={() => goToSlide(currentSlide + 1)} {...hoverHandlers} aria-label="Next slide">
          <ArrowDown size={16} strokeWidth={1.75} />
        </button>
      </div>

      <div className="deck-dots" aria-hidden="true">
        {Array.from({ length: TOTAL_SLIDES }).map((_, slideIndex) => (
          <button
            key={slideIndex}
            type="button"
            className={`deck-dot${slideIndex + 1 === currentSlide ? " active" : ""}`}
            onClick={() => goToSlide(slideIndex + 1)}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>

      <div className="deck" ref={scrollerRef}>

        {/* 01 About me */}
        <section className="slide" data-slide={1}>
          <div className="slide-inner cover-split">
            <motion.div initial="hidden" animate="show" variants={fadeIn}>
              <motion.div className="slide-num" variants={fadeUp}>ABOUT ME</motion.div>
              <motion.h1 className="cover-title" variants={fadeUp}>
                {PROFILE.firstName}<br /><em>{PROFILE.lastName}.</em>
              </motion.h1>
              <motion.p className="cover-sub" variants={fadeUp}>{SPEAKER_ROLE}</motion.p>
              <motion.div className="social-row" variants={fadeUp}>
                {SOCIAL_ACCOUNTS.map(({ platform, Icon, handle, href }) => (
                  <a key={platform} href={href} target="_blank" rel="noreferrer" className="social-link" aria-label={`${platform} ${handle}`} {...hoverHandlers}>
                    <Icon />
                    <span>{handle}</span>
                  </a>
                ))}
              </motion.div>
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
            </motion.figure>
          </div>
        </section>

        {/* 02 In my free time */}
        <section className="slide" data-slide={2}>
          <motion.div
            className="slide-inner"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeIn}
          >
            <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
              In my <em>free time.</em>
            </motion.h2>
            <div className="channel-grid">
              {SHARING_CHANNELS.map(({ platform, Icon, href, displayLink, topic, highlight, description }) => (
                <motion.a
                  key={platform}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="channel-card"
                  variants={fadeUp}
                  {...hoverHandlers}
                >
                  <div className="channel-platform">
                    <Icon />
                    <span>{platform}</span>
                  </div>
                  <h3 className="channel-topic">{topic} <em>{highlight}</em></h3>
                  <p className="channel-description">{description}</p>
                  <span className="channel-handle">
                    {displayLink}
                    <ArrowUpRight size={13} strokeWidth={1.75} />
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 03 Title */}
        <section className="slide" data-slide={3}>
          <motion.div
            className="slide-inner slide-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn}
          >
            <motion.div className="slide-num" variants={fadeUp}>THE TALK</motion.div>
            <motion.h2 className="title-h" variants={fadeUp}>
              {DECK_TITLE}<span className="title-dot">.</span>
            </motion.h2>
            <motion.div className="title-tagline" variants={fadeUp}>
              <span>Build fast.</span>
              <em>Ship fast.</em>
            </motion.div>
          </motion.div>
        </section>

        {/* 04 Introducing FilamentPHP */}
        <section className="slide" data-slide={4}>
          <motion.div
            className="slide-inner"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <motion.div className="slide-num" variants={fadeUp}>INTRODUCING</motion.div>
            <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
              Filament<em>PHP.</em>
            </motion.h2>

            <div className="package-grid">
              {FILAMENT_PACKAGES.map((filamentPackage) => (
                <motion.div className="package-card" key={filamentPackage.name} variants={fadeUp}>
                  <div className="package-number">{filamentPackage.number}</div>
                  <h3 className="package-name">{filamentPackage.name}</h3>
                  <p className="package-description">{filamentPackage.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div className="stack-band" variants={fadeUp}>
              <div className="stack-label">Built from the TALL stack</div>
              <div className="stack-items">
                {TALL_STACK.map((stackItem) => (
                  <div className="stack-item" key={stackItem.name}>
                    <span className="stack-letter">{stackItem.letter}</span>
                    <span className="stack-name">{stackItem.name}</span>
                  </div>
                ))}
              </div>
              <div className="stack-open-source">All of them are <em>open source.</em></div>
            </motion.div>
          </motion.div>
        </section>

        {/* 05 Let's build */}
        <RevealSlide slideNumber={5}>
          <motion.div className="slide-num" variants={fadeUp}>LIVE DEMO</motion.div>
          <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
            Let&rsquo;s <em>build.</em>
          </motion.h2>
          <div className="step-list">
            {LETS_BUILD_STEPS.map((step) => (
              <motion.div className="step-item" key={step.number} variants={fadeUp}>
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <div className="step-points">
                  {step.points.map((point) => (
                    <span className="step-point" key={point}>{point}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </RevealSlide>

        {/* 06 The result */}
        <RevealSlide slideNumber={6}>
          <motion.div className="slide-num" variants={fadeUp}>THE RESULT</motion.div>
          <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
            A full CRUD in <em>under 1 minute.</em>
          </motion.h2>
          <div className="comparison-grid">
            {CRUD_COMPARISON.map((comparison) => (
              <motion.div
                className={`comparison-card${comparison.isHighlighted ? " comparison-card-highlighted" : ""}`}
                key={comparison.label}
                variants={fadeUp}
              >
                <div className="comparison-label">{comparison.label}</div>
                <div className="comparison-value">{comparison.value}</div>
              </motion.div>
            ))}
          </div>
          <motion.div className="included-row" variants={fadeUp}>
            <span className="included-label">Included</span>
            {CRUD_INCLUDED_FEATURES.map((feature) => (
              <span className="included-chip" key={feature}>{feature}</span>
            ))}
          </motion.div>
        </RevealSlide>

        {/* 07 Even more */}
        <RevealSlide slideNumber={7} isCentered>
          <motion.div className="slide-num" variants={fadeUp}>WHAT&rsquo;S NEXT</motion.div>
          <motion.h2 className="title-h title-h-md" variants={fadeUp}>
            But how can we do <em>even more?</em>
          </motion.h2>
          <motion.div className="equation" variants={fadeUp}>
            <span className="equation-term">FilamentPHP</span>
            <span className="equation-operator">+</span>
            <span className="equation-term">AI</span>
            <span className="equation-operator">=</span>
            <span className="equation-term equation-result">Ship even faster</span>
          </motion.div>
        </RevealSlide>

        {/* 08 The problem */}
        <RevealSlide slideNumber={8} isCentered>
          <motion.div className="slide-num" variants={fadeUp}>THE PROBLEM</motion.div>
          <motion.div className="problem-word" variants={fadeUp}>AI hallucinates.</motion.div>
          <motion.p className="problem-question" variants={fadeUp}>
            How do we avoid it and still get <em>good code?</em>
          </motion.p>
        </RevealSlide>

        {/* 09 Why it happens */}
        <RevealSlide slideNumber={9}>
          <motion.div className="slide-num" variants={fadeUp}>WHY IT HAPPENS</motion.div>
          <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
            Context is <em>everything.</em>
          </motion.h2>
          <div className="context-compare">
            <motion.div className="context-card" variants={fadeUp}>
              <div className="context-label">Your head</div>
              <div className="context-value">The full picture</div>
            </motion.div>
            <motion.div className="context-not-equal" variants={fadeUp}>&ne;</motion.div>
            <motion.div className="context-card context-card-dim" variants={fadeUp}>
              <div className="context-label">AI&rsquo;s head</div>
              <div className="context-value">Only what you give it</div>
            </motion.div>
          </div>
        </RevealSlide>

        {/* 10 to 14 Tips */}
        {AI_TIPS.map((tip, tipIndex) => (
          <RevealSlide slideNumber={FIRST_TIP_SLIDE + tipIndex} key={tip.number}>
            <motion.div className="slide-num" variants={fadeUp}>TIP {tip.number} OF {String(AI_TIPS.length).padStart(2, "0")}</motion.div>
            <motion.h2 className="tip-title" variants={fadeUp}>{tip.title}</motion.h2>
            <motion.div className="tip-credit" variants={fadeUp}>{tip.credit}</motion.div>
            <ul className="tip-points">
              {tip.points.map((point) => (
                <motion.li key={point} variants={fadeUp}>{point}</motion.li>
              ))}
            </ul>
            {tip.number === "05" && (
              <motion.div className="context-meter" variants={fadeUp}>
                <div className="context-meter-bar">
                  <div className="context-meter-smart" style={{ width: `${CONTEXT_SMART_ZONE_PERCENT}%` }}>Smart zone</div>
                  <div className="context-meter-dumb">Dumb zone</div>
                </div>
                <div className="context-meter-scale">
                  <span>0%</span>
                  <span style={{ left: `${CONTEXT_SMART_ZONE_PERCENT}%` }}>{CONTEXT_SMART_ZONE_PERCENT}%</span>
                  <span>100%</span>
                </div>
              </motion.div>
            )}
          </RevealSlide>
        ))}

        {/* 15 Closing */}
        <RevealSlide slideNumber={TOTAL_SLIDES} isCentered>
          <motion.div className="slide-num" variants={fadeUp}>ALL OF IT IS OPEN SOURCE</motion.div>
          <motion.div className="closing-tools" variants={fadeUp}>
            {OPEN_SOURCE_TOOLS.map((tool) => (
              <span className="closing-tool" key={tool}>{tool}</span>
            ))}
          </motion.div>
          <motion.h2 className="title-h" variants={fadeUp}>
            Thank you<span className="title-dot">.</span>
          </motion.h2>
          <motion.div className="social-row social-row-centered" variants={fadeUp}>
            {SOCIAL_ACCOUNTS.map(({ platform, Icon, handle, href }) => (
              <a key={platform} href={href} target="_blank" rel="noreferrer" className="social-link" aria-label={`${platform} ${handle}`} {...hoverHandlers}>
                <Icon />
                <span>{handle}</span>
              </a>
            ))}
          </motion.div>
        </RevealSlide>

      </div>
    </PageShell>
  );
}

function RevealSlide({ slideNumber, isCentered = false, children }: { slideNumber: number; isCentered?: boolean; children: ReactNode }) {
  return (
    <section className="slide" data-slide={slideNumber}>
      <motion.div
        className={`slide-inner${isCentered ? " slide-center" : ""}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeIn}
      >
        {children}
      </motion.div>
    </section>
  );
}

function GithubIcon() {
  return (
    <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MediumIcon() {
  return (
    <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
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
  .slide-h-sm { font-size: clamp(34px, 4vw, 60px); margin-bottom: 32px; }

  /* ── About me (01) ────────────────────────── */
  .cover-split { display: grid; grid-template-columns: 1fr 0.9fr; gap: 64px; align-items: center; }
  .cover-title { font-family: var(--serif); font-size: clamp(52px, 7.4vw, 116px); line-height: 0.96; font-weight: 400; letter-spacing: -0.04em; margin-bottom: 24px; }
  .cover-title em { font-style: italic; color: var(--accent); }
  .cover-sub { font-family: var(--mono); font-size: 13px; letter-spacing: 0.08em; color: var(--ink-dim); margin-bottom: 24px; }
  .cover-hint { font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }
  .cover-hint kbd { display: inline-block; padding: 2px 7px; border: 1px solid var(--line); font-family: var(--mono); font-size: 10px; color: var(--ink-dim); border-radius: 3px; }
  .cover-photo { margin: 0; }
  .cover-photo-frame { position: relative; width: 100%; aspect-ratio: 3 / 2; border: 1px solid var(--line); background: var(--bg-2); overflow: hidden; }
  .cover-photo-img { object-fit: cover; filter: saturate(0.92) contrast(1.04); }

  .social-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 36px; }
  .social-link {
    display: inline-flex; align-items: center; gap: 10px; padding: 9px 16px;
    border: 1px solid var(--line); color: var(--ink); text-decoration: none;
    font-family: var(--mono); font-size: 12px; letter-spacing: 0.06em;
    transition: border-color 0.2s, color 0.2s;
  }
  .social-link:hover { border-color: var(--accent); color: var(--accent); }
  .brand-icon { width: 16px; height: 16px; flex-shrink: 0; }

  /* ── Where I share (02) ───────────────────── */
  .channel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .channel-card {
    display: flex; flex-direction: column; padding: 36px 34px;
    border: 1px solid var(--line); background: var(--bg-2);
    color: inherit; text-decoration: none; transition: border-color 0.2s;
  }
  .channel-card:hover { border-color: var(--accent); }
  .channel-platform {
    display: inline-flex; align-items: center; gap: 10px; margin-bottom: 22px;
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent);
  }
  .channel-platform .brand-icon { width: 20px; height: 20px; }
  .channel-topic { font-family: var(--serif); font-size: clamp(28px, 2.8vw, 42px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 14px; }
  .channel-topic em { font-style: italic; color: var(--accent); }
  .channel-description { font-size: 15px; line-height: 1.65; color: var(--ink-dim); margin-bottom: 28px; }
  .channel-handle {
    margin-top: auto; display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; color: var(--ink);
    transition: color 0.2s;
  }
  .channel-card:hover .channel-handle { color: var(--accent); }

  /* ── Title (03) ───────────────────────────── */
  .title-h {
    font-family: var(--serif); font-size: clamp(52px, 8.6vw, 136px);
    line-height: 0.96; font-weight: 400; letter-spacing: -0.04em;
    max-width: 1200px; margin-bottom: 44px;
  }
  .title-dot { color: var(--accent); }
  .title-tagline {
    display: flex; align-items: center; gap: 18px; flex-wrap: wrap; justify-content: center;
    font-family: var(--serif); font-size: clamp(24px, 3vw, 44px); letter-spacing: -0.02em; color: var(--ink-dim);
  }
  .title-tagline em { font-style: italic; color: var(--accent); }
  .title-tagline .sep { color: var(--ink-faint); }

  /* ── Introducing FilamentPHP (04) ─────────── */
  .package-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-bottom: 2px; }
  .package-card { padding: 24px 24px 26px; border: 1px solid var(--line); background: var(--bg-2); transition: border-color 0.2s; }
  .package-card:hover { border-color: var(--accent); }
  .package-number { font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em; color: var(--accent); margin-bottom: 12px; }
  .package-name { font-family: var(--serif); font-size: clamp(22px, 2vw, 30px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 10px; }
  .package-description { font-size: 13.5px; line-height: 1.6; color: var(--ink-dim); }

  .stack-band {
    display: grid; grid-template-columns: auto 1fr auto; gap: 32px; align-items: center;
    padding: 22px 28px; border: 1px solid var(--accent); background: var(--bg-2);
  }
  .stack-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); }
  .stack-items { display: flex; gap: 10px; flex-wrap: wrap; }
  .stack-item { display: inline-flex; align-items: center; gap: 10px; padding: 7px 14px 7px 7px; border: 1px solid var(--line); }
  .stack-letter {
    width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 12px; font-weight: 700; color: var(--bg); background: var(--accent);
  }
  .stack-name { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; color: var(--ink); }
  .stack-open-source { font-family: var(--serif); font-size: clamp(20px, 1.9vw, 28px); letter-spacing: -0.02em; white-space: nowrap; }
  .stack-open-source em { font-style: italic; color: var(--accent); }

  /* ── Let's build (05) ─────────────────────── */
  .step-list { display: flex; flex-direction: column; gap: 2px; }
  .step-item {
    display: grid; grid-template-columns: 80px 1fr auto; gap: 28px; align-items: center;
    padding: 28px 32px; border: 1px solid var(--line); background: var(--bg-2);
  }
  .step-number { font-family: var(--serif); font-size: 44px; line-height: 1; color: var(--accent); letter-spacing: -0.03em; }
  .step-title { font-family: var(--serif); font-size: clamp(24px, 2.4vw, 36px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.1; }
  .step-points { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
  .step-point { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; color: var(--ink); padding: 7px 14px; border: 1px solid var(--line); }

  /* ── The result (06) ──────────────────────── */
  .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-bottom: 28px; }
  .comparison-card { padding: 36px 34px; border: 1px solid var(--line); background: var(--bg-2); }
  .comparison-card-highlighted { border-color: var(--accent); }
  .comparison-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 16px; }
  .comparison-card-highlighted .comparison-label { color: var(--accent); }
  .comparison-value { font-family: var(--serif); font-size: clamp(32px, 3.6vw, 56px); letter-spacing: -0.03em; line-height: 1; color: var(--ink-dim); }
  .comparison-card-highlighted .comparison-value { color: var(--ink); font-style: italic; }
  .included-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .included-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-right: 8px; }
  .included-chip { font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; color: var(--ink); padding: 8px 16px; border: 1px solid var(--accent); background: rgba(255,92,46,0.08); }

  /* ── Even more (07) ───────────────────────── */
  .title-h-md { font-size: clamp(44px, 6.4vw, 100px); max-width: 1100px; }
  .title-h em { font-style: italic; color: var(--accent); }
  .equation { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; justify-content: center; }
  .equation-term { font-family: var(--mono); font-size: 14px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink); padding: 12px 20px; border: 1px solid var(--line); }
  .equation-operator { font-family: var(--serif); font-size: 32px; color: var(--ink-faint); }
  .equation-result { border-color: var(--accent); color: var(--accent); }

  /* ── The problem (08) ─────────────────────── */
  .problem-word {
    font-family: var(--serif); font-style: italic; font-size: clamp(56px, 11vw, 176px);
    line-height: 0.9; letter-spacing: -0.045em; color: var(--accent); margin-bottom: 40px;
  }
  .problem-question { font-family: var(--serif); font-size: clamp(22px, 2.6vw, 38px); letter-spacing: -0.02em; color: var(--ink-dim); }
  .problem-question em { font-style: italic; color: var(--ink); }

  /* ── Why it happens (09) ──────────────────── */
  .context-compare { display: grid; grid-template-columns: 1fr auto 1fr; gap: 28px; align-items: center; }
  .context-card { padding: 40px 36px; border: 1px solid var(--accent); background: var(--bg-2); }
  .context-card-dim { border-color: var(--line); }
  .context-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
  .context-card-dim .context-label { color: var(--ink-faint); }
  .context-value { font-family: var(--serif); font-size: clamp(28px, 3vw, 46px); letter-spacing: -0.03em; line-height: 1.05; }
  .context-card-dim .context-value { color: var(--ink-dim); }
  .context-not-equal { font-family: var(--serif); font-size: clamp(48px, 5vw, 80px); color: var(--accent); line-height: 1; }

  /* ── Tips (10 to 14) ──────────────────────── */
  .tip-title { font-family: var(--serif); font-size: clamp(52px, 8vw, 128px); line-height: 0.95; font-weight: 400; letter-spacing: -0.04em; margin-bottom: 18px; }
  .tip-credit { font-family: var(--mono); font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 48px; }
  .tip-points { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; max-width: 900px; }
  .tip-points li {
    position: relative; padding: 20px 28px 20px 56px; border: 1px solid var(--line); background: var(--bg-2);
    font-family: var(--serif); font-size: clamp(20px, 2vw, 30px); letter-spacing: -0.01em; line-height: 1.2;
  }
  .tip-points li::before {
    content: ""; position: absolute; left: 28px; top: 50%; width: 10px; height: 10px;
    transform: translateY(-50%); background: var(--accent);
  }

  .context-meter { margin-top: 36px; max-width: 900px; }
  .context-meter-bar { display: flex; height: 52px; border: 1px solid var(--line); }
  .context-meter-smart, .context-meter-dumb {
    display: flex; align-items: center; padding: 0 18px;
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  }
  .context-meter-smart { background: rgba(255,92,46,0.14); color: var(--accent); border-right: 2px solid var(--accent); }
  .context-meter-dumb { flex: 1; color: var(--ink-dim); background: repeating-linear-gradient(135deg, transparent 0 8px, rgba(127,127,127,0.12) 8px 16px); }
  .context-meter-scale { position: relative; height: 24px; margin-top: 10px; font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; color: var(--ink-faint); }
  .context-meter-scale span { position: absolute; top: 0; }
  .context-meter-scale span:first-child { left: 0; }
  .context-meter-scale span:nth-child(2) { transform: translateX(-50%); color: var(--accent); }
  .context-meter-scale span:last-child { right: 0; }

  /* ── Closing (15) ─────────────────────────── */
  .closing-tools { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; max-width: 820px; margin: 0 auto 48px; }
  .closing-tool { font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; color: var(--ink); padding: 9px 16px; border: 1px solid var(--accent); }
  .social-row-centered { justify-content: center; margin-bottom: 0; }

  /* ── Responsive ───────────────────────────── */
  @media (max-width: 1200px) {
    .stack-band { grid-template-columns: 1fr; gap: 16px; }
  }
  @media (max-width: 960px) {
    .deck-home { top: 20px; left: 20px; }
    .deck-event { display: none; }
    .deck-chrome { bottom: 20px; right: 16px; }
    .deck-dots { display: none; }
    .slide-inner { padding: 100px 24px 60px; }

    .cover-split { grid-template-columns: 1fr; gap: 32px; }
    .cover-photo { order: -1; }

    .package-grid { grid-template-columns: 1fr 1fr; }
    .channel-grid { grid-template-columns: 1fr; }
    .step-item { grid-template-columns: 1fr; gap: 12px; padding: 22px 24px; }
    .step-points { justify-content: flex-start; }
    .comparison-grid { grid-template-columns: 1fr; }
    .context-compare { grid-template-columns: 1fr; gap: 12px; text-align: center; }
    .tip-credit { margin-bottom: 28px; }
    .tip-points li { padding: 16px 20px 16px 44px; }
    .tip-points li::before { left: 20px; }
    .channel-card { padding: 26px 24px; }
    .stack-open-source { white-space: normal; }
  }
  @media (max-width: 560px) {
    .package-grid { grid-template-columns: 1fr; }
  }
`;
