"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowLeft, ArrowUp, ArrowDown, ArrowUpRight } from "lucide-react";
import { useCursor } from "@/app/hooks/useCursor";
import PageShell from "@/app/components/PageShell";
import { PROFILE } from "@/lib/profile";

const TOTAL_SLIDES = 12;

const DECK_TITLE = "Basic Web Hacking";
const DECK_SUBTITLE = "From IDOR to Account Takeover";
const SPEAKER_ROLE = "Co-Founder PT. NihonNoMise Global Overseas";
const NIHONNOMISE_LOGO = { src: "/images/nihonnomise-logo.png", alt: "NihonNoMise logo", width: 312, height: 388 } as const;

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

const SECURITY_ASPECTS: { letter: string; name: string; meaning: string }[] = [
  { letter: "C", name: "Confidentiality", meaning: "Only the right people can read the data." },
  { letter: "I", name: "Integrity", meaning: "Data cannot be changed by the wrong people." },
  { letter: "A", name: "Availability", meaning: "The service stays up when people need it." },
  { letter: "A", name: "Authenticity", meaning: "You really are who you claim to be." },
];

const IDOR_EXAMPLE_STEPS: { label: string; value: string; note: string; isHighlighted?: boolean }[] = [
  { label: "Normal request", value: "GET /api/profile/1023", note: "Your own account." },
  { label: "Change the id", value: "GET /api/profile/1024", note: "Another user's account." },
  { label: "The server never checks", value: "200 OK", note: "It returns the data anyway.", isHighlighted: true },
] as const;

const IDOR_REQUESTS = [
  {
    id: "1023",
    stolen: false,
    user: { id: "1023", name: "You", email: "you@mail.com", role: "user", resetToken: "a91f0c7e22b4d8" },
  },
  {
    id: "1024",
    stolen: true,
    user: { id: "1024", name: "Sarah Tan", email: "sarah@mail.com", role: "admin", resetToken: "7bc3f0a2e9d16c" },
  },
] as const;


const IDOR_DANGER_POINTS = [
  "No exploit tool needed, just change a number",
  "Easy to miss in code review and in tests",
  "One endpoint can leak every user's data",
] as const;

const ATO_CAUSES = [
  "An IDOR on the change email or change password endpoint",
  "A password reset token tied to a guessable id",
  "Updating another user's account because the id is trusted",
] as const;

const ATO_CHAIN: { code: string; note: string; owned?: boolean }[] = [
  { code: `"reset_token": "7bc3..."`, note: "Pulled straight from the leaked user response." },
  { code: "POST /reset-password", note: "Send the stolen token with a new password." },
  { code: "200 OK", note: "The server trusts the token and sets the password." },
  { code: "POST /login", note: "Log in as her. The account is yours.", owned: true },
];

const DEFENSE_POINTS = [
  { title: "Authorize every request", detail: "Check that the logged-in user owns the record, on the server, every time." },
  { title: "Do not trust the id from the client", detail: "Scope queries to the current user, for example where user_id = auth id." },
  { title: "Use non-guessable ids", detail: "Prefer UUID or ULID over sequential numbers, as defense in depth." },
  { title: "Log and rate-limit", detail: "Watch for one account walking through many ids in a row." },
  { title: "Return only the fields you need", detail: "Never ship secrets like a reset token in a user response. Send what the screen needs, nothing more." },
] as const;

const LEARN_GROUPS = [
  { label: "Practice labs", items: [
    { name: "HackTheBox", href: "https://www.hackthebox.com/" },
    { name: "TryHackMe", href: "https://tryhackme.com/" },
    { name: "PortSwigger Academy", href: "https://portswigger.net/web-security" },
  ] },
  { label: "Knowledge base", items: [
    { name: "hacktricks.wiki", href: "https://hacktricks.wiki/" },
    { name: "PayloadsAllTheThings", href: "https://github.com/swisskyrepo/PayloadsAllTheThings" },
    { name: "christmex.medium.com", href: "https://christmex.medium.com/" },
  ] },
  { label: "Events", items: [
    { name: "CTFtime", href: "https://ctftime.org/" },
  ] },
  { label: "YouTube", items: [
    { name: "John Hammond", href: "https://www.youtube.com/@_JohnHammond" },
    { name: "LiveOverflow", href: "https://www.youtube.com/@LiveOverflow" },
    { name: "NetworkChuck", href: "https://www.youtube.com/@NetworkChuck" },
    { name: "David Bombal", href: "https://www.youtube.com/@davidbombal" },
  ] },
] as const;

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

export default function BasicWebHackingPage() {
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

  const socialRow = (
    <motion.div className="social-row social-row-centered" variants={fadeUp}>
      {SOCIAL_ACCOUNTS.map(({ platform, Icon, handle, href }) => (
        <a key={platform} href={href} target="_blank" rel="noreferrer" className="social-link" aria-label={`${platform} ${handle}`} {...hoverHandlers}>
          <Icon />
          <span>{handle}</span>
        </a>
      ))}
    </motion.div>
  );

  return (
    <PageShell cursorXSpring={cursorXSpring} cursorYSpring={cursorYSpring} cursorHovering={cursorHovering} blobs={3}>
      <style>{css}</style>

      <Link href="/slider" className="deck-home" {...hoverHandlers}>
        <span className="inline-icon"><ArrowLeft size={14} strokeWidth={1.75} /> slides</span>
      </Link>

      <div className="deck-event" aria-hidden="true">
        <span>WEB HACKING</span>
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

        {/* 01 Cover */}
        <RevealSlide slideNumber={1} isCentered>
          <motion.div className="slide-num" variants={fadeUp}>TALK</motion.div>
          <motion.h1 className="title-h" variants={fadeUp}>
            {DECK_TITLE}<span className="title-dot">.</span>
          </motion.h1>
          <motion.div className="title-tagline" variants={fadeUp}>
            From IDOR to <em>Account Takeover</em>
          </motion.div>
          <motion.div className="cover-speaker" variants={fadeUp}>
            <span className="cover-name">{PROFILE.firstName} {PROFILE.lastName}</span>
            <span className="cover-role-with-logo">
              <Image src={NIHONNOMISE_LOGO.src} alt={NIHONNOMISE_LOGO.alt} width={NIHONNOMISE_LOGO.width} height={NIHONNOMISE_LOGO.height} className="cover-role-logo" loading="eager" />
              <span className="cover-role-line">{SPEAKER_ROLE}</span>
            </span>
          </motion.div>
          {socialRow}
        </RevealSlide>

        {/* 02 In my free time */}
        <RevealSlide slideNumber={2}>
          <motion.div className="slide-num" variants={fadeUp}>WHO I AM</motion.div>
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
        </RevealSlide>

        {/* 03 The 4 aspects */}
        <RevealSlide slideNumber={3}>
          <motion.div className="slide-num" variants={fadeUp}>THE BASICS</motion.div>
          <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
            Four aspects an attacker <em>goes after.</em>
          </motion.h2>
          <div className="aspect-grid">
            {SECURITY_ASPECTS.map((aspect) => (
              <motion.div
                className="aspect-card"
                key={aspect.name}
                variants={fadeUp}
              >
                <span className="aspect-letter">{aspect.letter}</span>
                <h3 className="aspect-name">{aspect.name}</h3>
                <p className="aspect-meaning">{aspect.meaning}</p>
              </motion.div>
            ))}
          </div>
          <motion.p className="aspect-footnote" variants={fadeUp}>
            C-I-A is the classic triad.
          </motion.p>
        </RevealSlide>

        {/* 04 What is IDOR */}
        <RevealSlide slideNumber={4}>
          <motion.div className="slide-num" variants={fadeUp}>THE VULNERABILITY</motion.div>
          <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
            What is <em>IDOR?</em>
          </motion.h2>
          <motion.p className="lede" variants={fadeUp}>
            Insecure Direct Object Reference: the app exposes an id and trusts whatever id the client sends,
            without checking who is allowed to see it.
          </motion.p>
          <div className="code-steps">
            {IDOR_EXAMPLE_STEPS.map((step) => (
              <motion.div className={`code-step${step.isHighlighted ? " code-step-highlighted" : ""}`} key={step.value} variants={fadeUp}>
                <div className="code-step-label">{step.label}</div>
                <code className="code-step-value">{step.value}</code>
                <div className="code-step-note">{step.note}</div>
              </motion.div>
            ))}
          </div>
        </RevealSlide>

        {/* 05 How IDOR works (animated) */}
        <RevealSlide slideNumber={5}>
          <motion.div className="slide-num" variants={fadeUp}>IN MOTION</motion.div>
          <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
            Same endpoint. <em>One number.</em>
          </motion.h2>
          <motion.p className="lede" variants={fadeUp}>
            The response is JSON: profile fields plus a password reset token. Change the id, and the server hands you another user&rsquo;s token.
          </motion.p>
          <motion.div variants={fadeUp}>
            <IdorFlow />
          </motion.div>
        </RevealSlide>

        {/* 06 Why IDOR is dangerous */}
        <RevealSlide slideNumber={6}>
          <motion.div className="slide-num" variants={fadeUp}>WHY IT MATTERS</motion.div>
          <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
            Small bug, <em>big blast radius.</em>
          </motion.h2>
          <ul className="point-list">
            {IDOR_DANGER_POINTS.map((point) => (
              <motion.li key={point} variants={fadeUp}>{point}</motion.li>
            ))}
          </ul>
          <motion.div className="aspect-hit" variants={fadeUp}>
            <span className="aspect-hit-label">Aspect attacked</span>
            <span className="aspect-hit-value">Confidentiality</span>
            <span className="aspect-hit-plus">+ Integrity, if you can also change it</span>
          </motion.div>
        </RevealSlide>

        {/* 07 From IDOR to Account Takeover */}
        <RevealSlide slideNumber={7}>
          <motion.div className="slide-num" variants={fadeUp}>THE ESCALATION</motion.div>
          <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
            From IDOR to <em>Account Takeover.</em>
          </motion.h2>
          <motion.p className="lede" variants={fadeUp}>
            Account Takeover (ATO): the attacker ends up controlling an account that is not theirs,
            able to log in and act as that user.
          </motion.p>
          <div className="cause-block">
            <div className="cause-label">What usually causes it</div>
            <ul className="point-list point-list-tight">
              {ATO_CAUSES.map((cause) => (
                <motion.li key={cause} variants={fadeUp}>{cause}</motion.li>
              ))}
            </ul>
          </div>
          <motion.div className="aspect-hit" variants={fadeUp}>
            <span className="aspect-hit-label">Aspect attacked</span>
            <span className="aspect-hit-value">Authenticity</span>
            <span className="aspect-hit-plus">the attacker is now you</span>
          </motion.div>
        </RevealSlide>

        {/* 08 The takeover chain */}
        <RevealSlide slideNumber={8}>
          <motion.div className="slide-num" variants={fadeUp}>THE CHAIN</motion.div>
          <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
            One token, <em>four steps.</em>
          </motion.h2>
          <motion.p className="lede" variants={fadeUp}>
            That leaked reset token is all it takes. No password needed.
          </motion.p>
          <div className="ato-chain">
            {ATO_CHAIN.map((step, stepIndex) => (
              <motion.div className={`ato-step${step.owned ? " is-owned" : ""}`} key={step.code} variants={fadeUp}>
                <span className="ato-step-num">{String(stepIndex + 1).padStart(2, "0")}</span>
                <code className="ato-step-code">{step.code}</code>
                <span className="ato-step-note">{step.note}</span>
              </motion.div>
            ))}
          </div>
        </RevealSlide>


        {/* 09 Live demo */}
        <RevealSlide slideNumber={9} isCentered>
          <motion.div className="slide-num" variants={fadeUp}>HANDS ON</motion.div>
          <motion.h2 className="title-h title-h-md" variants={fadeUp}>
            Live <em>demo.</em>
          </motion.h2>
          <motion.p className="demo-sub" variants={fadeUp}>
            The hacking lab is ready. Let&rsquo;s walk an IDOR all the way to a full account takeover,
            then patch it.
          </motion.p>
          <motion.div className="demo-endpoints" variants={fadeUp}>
            <div className="demo-endpoint">
              <span className="demo-endpoint-label">User API</span>
              <code className="demo-endpoint-code">GET /api/profile/1</code>
            </div>
            <div className="demo-endpoint">
              <span className="demo-endpoint-label">Reset password</span>
              <code className="demo-endpoint-code">/reset-password/[token]?email=victim@example.com</code>
            </div>
          </motion.div>
          <motion.div className="demo-badge" variants={fadeUp}>Lab environment, authorized target</motion.div>
        </RevealSlide>

        {/* 10 How to defend */}
        <RevealSlide slideNumber={10}>
          <motion.div className="slide-num" variants={fadeUp}>THE FIX</motion.div>
          <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
            How we <em>close the gap.</em>
          </motion.h2>
          <div className="defense-grid">
            {DEFENSE_POINTS.map((defense, defenseIndex) => (
              <motion.div className="defense-card" key={defense.title} variants={fadeUp}>
                <div className="defense-number">{String(defenseIndex + 1).padStart(2, "0")}</div>
                <h3 className="defense-title">{defense.title}</h3>
                <p className="defense-detail">{defense.detail}</p>
              </motion.div>
            ))}
          </div>
        </RevealSlide>

        {/* 11 Learn more */}
        <RevealSlide slideNumber={11}>
          <motion.div className="slide-num" variants={fadeUp}>KEEP LEARNING</motion.div>
          <motion.h2 className="slide-h slide-h-sm" variants={fadeUp}>
            Where to <em>go next.</em>
          </motion.h2>
          <div className="learn-grid">
            {LEARN_GROUPS.map((group) => (
              <motion.div className="learn-group" key={group.label} variants={fadeUp}>
                <div className="learn-label">{group.label}</div>
                <div className="learn-items">
                  {group.items.map((item) => (
                    <a key={item.name} href={item.href} target="_blank" rel="noreferrer" className="learn-link" {...hoverHandlers}>
                      {item.name}
                      <ArrowUpRight size={12} strokeWidth={1.75} />
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </RevealSlide>

        {/* 12 Closing */}
        <RevealSlide slideNumber={12} isCentered>
          <motion.div className="slide-num" variants={fadeUp}>STAY CURIOUS, STAY ETHICAL</motion.div>
          <motion.h2 className="title-h" variants={fadeUp}>
            Thank you<span className="title-dot">.</span>
          </motion.h2>
          <motion.div className="cover-speaker" variants={fadeUp}>
            <span className="cover-name">{PROFILE.firstName} {PROFILE.lastName}</span>
            <span className="cover-role-line">{DECK_SUBTITLE}</span>
          </motion.div>
          {socialRow}
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

function IdorFlow() {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCycle((previousCycle) => previousCycle + 1), 13500);
    return () => clearInterval(timer);
  }, []);

  const attempt = IDOR_REQUESTS[cycle % IDOR_REQUESTS.length];
  const responseFields = [
    { key: "id", value: attempt.user.id, highlight: false },
    { key: "name", value: `"${attempt.user.name}"`, highlight: false },
    { key: "email", value: `"${attempt.user.email}"`, highlight: false },
    { key: "role", value: `"${attempt.user.role}"`, highlight: false },
    { key: "reset_token", value: `"${attempt.user.resetToken}"`, highlight: attempt.stolen },
  ];

  return (
    <div className="idor-stage" aria-hidden="true">
      <div className="idor-node">
        <span className="idor-node-tag">ATTACKER</span>
        <div className="idor-node-box">browser</div>
      </div>

      <div className="idor-track">
        <div className="idor-wire" />

        <motion.div
          key={`request-${cycle}`}
          className={`idor-packet${attempt.stolen ? " is-stolen" : ""}`}
          initial={{ left: "2%", opacity: 0 }}
          animate={{ left: ["2%", "2%", "2%", "98%", "98%", "98%"], opacity: [0, 1, 1, 1, 1, 0] }}
          transition={{ duration: 6, times: [0, 0.067, 0.433, 0.633, 0.9, 1], ease: "easeInOut" }}
        >
          <code>GET /api/profile/{attempt.id}</code>
        </motion.div>

        <motion.div
          key={`record-${cycle}`}
          className={`idor-record${attempt.stolen ? " is-stolen" : ""}`}
          initial={{ left: "98%", opacity: 0 }}
          animate={{ left: ["98%", "98%", "98%", "26%", "26%"], opacity: [0, 1, 1, 1, 1] }}
          transition={{ duration: 7, delay: 5.6, times: [0, 0.07, 0.43, 0.6, 1], ease: "easeInOut" }}
        >
          <span className="idor-record-top">
            <span className="idor-record-status">200 OK</span>
            {attempt.stolen && <span className="idor-leak">LEAKED</span>}
          </span>
          <div className="idor-json">
            <span className="idor-json-brace">{"{"}</span>
            {responseFields.map((field, fieldIndex) => (
              <span key={field.key} className={`idor-json-line${field.highlight ? " is-hot" : ""}`}>
                <span className="idor-json-k">&quot;{field.key}&quot;</span>
                <span className="idor-json-sep">: </span>
                <span className="idor-json-v">{field.value}</span>
                {fieldIndex < responseFields.length - 1 ? "," : ""}
              </span>
            ))}
            <span className="idor-json-brace">{"}"}</span>
          </div>
          {attempt.stolen && <span className="idor-record-foot">reset her password with this token</span>}
        </motion.div>
      </div>

      <div className="idor-node">
        <span className="idor-node-tag">SERVER</span>
        <div className="idor-node-box">database</div>
        <motion.span
          key={`check-${cycle}`}
          className="idor-node-note"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 1, 0.3] }}
          transition={{ duration: 2.2, delay: 2.3, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
        >
          no ownership check
        </motion.span>
      </div>
    </div>
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
  .lede { font-size: clamp(16px, 1.7vw, 21px); line-height: 1.65; color: var(--ink-dim); max-width: 860px; margin-bottom: 36px; }
  .lede em, .slide em { font-style: italic; color: var(--accent); }

  /* ── Title / cover ────────────────────────── */
  .title-h { font-family: var(--serif); font-size: clamp(52px, 8.6vw, 136px); line-height: 0.96; font-weight: 400; letter-spacing: -0.04em; max-width: 1200px; margin-bottom: 32px; }
  .title-h em { font-style: italic; color: var(--accent); }
  .title-h-md { font-size: clamp(44px, 6.4vw, 100px); margin-bottom: 28px; }
  .title-dot { color: var(--accent); }
  .title-tagline {
    font-family: var(--serif); font-size: clamp(24px, 3vw, 44px); letter-spacing: -0.02em;
    color: var(--ink-dim); margin-bottom: 44px;
  }
  .title-tagline em { font-style: italic; color: var(--accent); }

  .cover-speaker { display: flex; flex-direction: column; gap: 6px; margin-bottom: 36px; }
  .cover-name { font-family: var(--serif); font-size: clamp(22px, 2.2vw, 30px); letter-spacing: -0.02em; }
  .cover-role-line { font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; color: var(--ink-dim); }
  .cover-role-with-logo { display: inline-flex; align-items: center; justify-content: center; gap: 10px; }
  .cover-role-logo { width: 28px; height: auto; flex-shrink: 0; }

  .social-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .social-row-centered { justify-content: center; }
  .social-link {
    display: inline-flex; align-items: center; gap: 10px; padding: 9px 16px;
    border: 1px solid var(--line); color: var(--ink); text-decoration: none;
    font-family: var(--mono); font-size: 12px; letter-spacing: 0.06em;
    transition: border-color 0.2s, color 0.2s;
  }
  .social-link:hover { border-color: var(--accent); color: var(--accent); }
  .brand-icon { width: 16px; height: 16px; flex-shrink: 0; }

  /* ── Aspects (02) ─────────────────────────── */
  .aspect-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-bottom: 24px; }
  .aspect-card { padding: 30px 26px; border: 1px solid var(--line); background: var(--bg-2); transition: border-color 0.2s; }
  .aspect-letter {
    display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px;
    font-family: var(--mono); font-size: 16px; font-weight: 700; color: var(--accent);
    border: 1px solid var(--line); margin-bottom: 20px;
  }
  .aspect-name { font-family: var(--serif); font-size: clamp(20px, 1.9vw, 27px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 10px; }
  .aspect-meaning { font-size: 13.5px; line-height: 1.6; color: var(--ink-dim); }
  .aspect-footnote { font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; color: var(--ink-faint); }

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

  /* ── Code steps (03) ──────────────────────── */
  .code-steps { display: flex; flex-direction: column; gap: 2px; }
  .code-step {
    display: grid; grid-template-columns: 230px auto 1fr; gap: 28px; align-items: center;
    padding: 22px 28px; border: 1px solid var(--line); background: var(--bg-2);
  }
  .code-step-highlighted { border-color: var(--accent); }
  .code-step-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-dim); }
  .code-step-highlighted .code-step-label { color: var(--accent); }
  .code-step-value { font-family: var(--mono); font-size: clamp(15px, 1.5vw, 19px); color: var(--ink); white-space: nowrap; }
  .code-step-note { font-size: 13.5px; color: var(--ink-faint); text-align: right; }

  /* ── IDOR animation (04) ──────────────────── */
  .idor-stage { display: flex; align-items: center; gap: 28px; margin-top: 46px; width: 100%; }
  .idor-node { display: flex; flex-direction: column; align-items: center; gap: 10px; flex-shrink: 0; width: 148px; }
  .idor-node-tag { font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; color: var(--ink-dim); }
  .idor-node-box {
    font-family: var(--mono); font-size: 13px; color: var(--ink); text-align: center;
    width: 100%; padding: 20px 0; border: 1px solid var(--line); background: var(--bg-2);
  }
  .idor-node-note { font-family: var(--mono); font-size: 11px; letter-spacing: 0.04em; color: var(--accent); min-height: 14px; }
  .idor-track { position: relative; flex: 1; height: 240px; }
  .idor-wire {
    position: absolute; top: 50%; left: 0; right: 0; height: 1px;
    background: repeating-linear-gradient(90deg, var(--line) 0 8px, transparent 8px 15px);
  }
  .idor-packet {
    position: absolute; top: 50%; transform: translate(-50%, -50%); white-space: nowrap;
    padding: 9px 13px; border: 1px solid var(--line); background: var(--bg); border-radius: 2px;
  }
  .idor-packet code { font-family: var(--mono); font-size: 13px; color: var(--ink); }
  .idor-packet.is-stolen { border-color: var(--accent); }
  .idor-packet.is-stolen code { color: var(--accent); }
  .idor-record {
    position: absolute; top: 50%; transform: translate(-50%, -50%);
    display: flex; flex-direction: column; gap: 10px; min-width: 300px;
    padding: 16px 18px; border: 1px solid var(--line); background: var(--bg-2); border-radius: 2px;
  }
  .idor-record.is-stolen { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
  .idor-record-top { display: flex; align-items: center; justify-content: space-between; gap: 18px; }
  .idor-record-status { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; color: var(--ink-dim); }
  .idor-leak { font-family: var(--mono); font-size: 9px; letter-spacing: 0.12em; color: var(--bg); background: var(--accent); padding: 2px 6px; }
  .idor-json { display: flex; flex-direction: column; font-family: var(--mono); font-size: 13px; line-height: 1.7; }
  .idor-json-brace { color: var(--ink-dim); }
  .idor-json-line { padding-left: 18px; }
  .idor-json-k { color: var(--ink-dim); }
  .idor-json-sep { color: var(--ink-dim); }
  .idor-json-v { color: var(--ink); }
  .idor-json-line.is-hot { background: rgba(255, 92, 46, 0.14); margin-left: -4px; padding-left: 22px; padding-right: 6px; }
  .idor-json-line.is-hot .idor-json-k,
  .idor-json-line.is-hot .idor-json-v { color: var(--accent); }
  .idor-record-foot { font-family: var(--mono); font-size: 11px; letter-spacing: 0.02em; color: var(--accent); padding-top: 2px; }

  /* ── Takeover chain (07) ──────────────────── */
  .ato-chain { display: flex; flex-direction: column; gap: 2px; max-width: 1060px; }
  .ato-step {
    display: grid; grid-template-columns: 44px 300px 1fr; gap: 26px; align-items: center;
    padding: 20px 28px; border: 1px solid var(--line); background: var(--bg-2); transition: border-color 0.2s;
  }
  .ato-step-num { font-family: var(--mono); font-size: 12px; font-weight: 700; letter-spacing: 0.08em; color: var(--accent); }
  .ato-step-code { font-family: var(--mono); font-size: clamp(14px, 1.4vw, 18px); color: var(--ink); white-space: nowrap; }
  .ato-step-note { font-size: 14px; color: var(--ink-dim); }
  .ato-step.is-owned { border-color: var(--accent); }
  .ato-step.is-owned .ato-step-code { color: var(--accent); }

  /* ── Point lists (05, 06) ─────────────────── */
  .point-list { list-style: none; padding: 0; margin: 0 0 32px; display: flex; flex-direction: column; gap: 2px; max-width: 980px; }
  .point-list-tight { margin-bottom: 0; }
  .point-list li {
    position: relative; padding: 18px 28px 18px 54px; border: 1px solid var(--line); background: var(--bg-2);
    font-family: var(--serif); font-size: clamp(18px, 1.8vw, 26px); letter-spacing: -0.01em; line-height: 1.25;
  }
  .point-list li::before {
    content: ""; position: absolute; left: 28px; top: 50%; width: 10px; height: 10px;
    transform: translateY(-50%); background: var(--accent);
  }
  .cause-block { margin-bottom: 32px; }
  .cause-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 14px; }

  .aspect-hit {
    display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap;
    padding: 22px 28px; border: 1px solid var(--accent); background: rgba(255,92,46,0.08);
  }
  .aspect-hit-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); }
  .aspect-hit-value { font-family: var(--serif); font-size: clamp(26px, 2.6vw, 38px); letter-spacing: -0.02em; font-style: italic; }
  .aspect-hit-plus { font-family: var(--mono); font-size: 12px; letter-spacing: 0.06em; color: var(--ink-dim); }

  /* ── Defense (06) ─────────────────────────── */
  .defense-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .defense-card { padding: 30px 30px; border: 1px solid var(--line); background: var(--bg-2); transition: border-color 0.2s; }
  .defense-card:hover { border-color: var(--accent); }
  .defense-card:last-child:nth-child(odd) { grid-column: 1 / -1; }
  .defense-number { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; color: var(--accent); margin-bottom: 14px; }
  .defense-title { font-family: var(--serif); font-size: clamp(22px, 2.1vw, 30px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 10px; }
  .defense-detail { font-size: 14px; line-height: 1.6; color: var(--ink-dim); }

  /* ── Demo (07) ────────────────────────────── */
  .demo-sub { font-size: clamp(16px, 1.8vw, 22px); line-height: 1.65; color: var(--ink-dim); max-width: 720px; margin: 0 auto 28px; }
  .demo-sub em { font-style: italic; color: var(--accent); }
  .demo-endpoints { display: flex; flex-direction: column; gap: 10px; align-items: center; margin: 4px 0 30px; }
  .demo-endpoint { display: flex; align-items: center; gap: 16px; border: 1px solid var(--line); background: var(--bg-2); padding: 12px 20px; }
  .demo-endpoint-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-dim); white-space: nowrap; }
  .demo-endpoint-code { font-family: var(--mono); font-size: clamp(13px, 1.3vw, 16px); color: var(--ink); }
  .demo-badge { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); padding: 10px 18px; border: 1px solid var(--accent); }

  /* ── Learn (08) ───────────────────────────── */
  .learn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .learn-group { padding: 28px 30px; border: 1px solid var(--line); background: var(--bg-2); }
  .learn-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 18px; }
  .learn-items { display: flex; gap: 8px; flex-wrap: wrap; }
  .learn-link {
    display: inline-flex; align-items: center; gap: 5px; padding: 8px 14px;
    border: 1px solid var(--line); color: var(--ink); text-decoration: none;
    font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em;
    transition: border-color 0.2s, color 0.2s;
  }
  .learn-link:hover { border-color: var(--accent); color: var(--accent); }

  /* ── Responsive ───────────────────────────── */
  @media (max-width: 960px) {
    .deck-home { top: 20px; left: 20px; }
    .deck-event { display: none; }
    .deck-chrome { bottom: 20px; right: 16px; }
    .deck-dots { display: none; }
    .slide-inner { padding: 100px 24px 60px; }

    .aspect-grid { grid-template-columns: 1fr 1fr; }
    .channel-grid { grid-template-columns: 1fr; }
    .code-step { grid-template-columns: 1fr; gap: 8px; }
    .code-step-note { text-align: left; }
    .defense-grid, .learn-grid { grid-template-columns: 1fr; }
    .point-list li { padding: 16px 20px 16px 44px; }
    .point-list li::before { left: 20px; }
  }
  @media (max-width: 560px) {
    .aspect-grid { grid-template-columns: 1fr; }
  }
`;
