export type ProjectLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ProjectStatus = "ongoing" | "production" | "archived";

export type Project = {
  slug: string;
  year: string;
  title: string;
  role: string;
  desc: string;
  tags: string[];
  variant: string;
  status: ProjectStatus;
  image?: string;
  links: ProjectLink[];
  caseStudy?: {
    overview: string;
    background: string;
    myRole: string;
    impact: string;
    learned?: string;
    stack?: string[];
  };
};

export const projects: Project[] = [
  {
    slug: "sekolah-basic",
    year: "2024",
    title: "Sekolah Kristen BASIC",
    role: "K-12 Platform · Solo full-stack",
    desc: "Complete school management system — enrollment, grade promotion, billing, bank reconciliation. A two-phase algorithm for academic year transitions handles edge cases around idempotency.",
    tags: ["Laravel", "Filament", "Python / Pandas", "Pest"],
    variant: "v1",
    status: "production",
    image: "/images/employee-attendance.png",
    links: [{ label: "Case study", href: "/work/sekolah-basic" }],
    caseStudy: {
      overview:
        "A full operating system for a K-12 school: enrollment, grade promotion across academic years, tuition billing, and bank reconciliation — built so non-technical staff can run it without a developer in the loop.",
      background:
        "The school was patching together spreadsheets, paper forms, and a legacy admin panel. Academic year transitions were a week of manual copy-paste that regularly broke reconciliation and duplicated student records.",
      myRole:
        "Solo full-stack. Product scope, data modeling, UI, API, Python reconciliation scripts, Pest test suite, deployment, and training the admin staff.",
      impact:
        "Grade promotion collapsed from a week-long ritual to a one-click, idempotent, auditable operation. Bank reconciliation runs nightly; mismatches are flagged instead of silently accumulating.",
      learned:
        "Idempotency in domain workflows matters more than clever abstractions. A two-phase commit around academic year transitions paid for itself the first time the process was interrupted mid-run.",
      stack: ["Laravel", "Filament", "PostgreSQL", "Python / Pandas", "Pest"],
    },
  },
  {
    slug: "nihonnomise",
    year: "2024",
    title: "Nihonnomise.id",
    role: "Anime Festival Platform · Solo full-stack",
    desc: "Zero to production in weeks. Event registration, gallery management, sponsor showcase, admin dashboard. Built so a non-technical team can run the whole thing independently.",
    tags: ["Next.js", "Laravel", "Filament", "Vercel"],
    variant: "v2",
    status: "production",
    image: "/images/projects/nihonnomise.id.png",
    links: [
      { label: "Visit live", href: "https://nihonnomise.id", external: true },
      { label: "Case study", href: "/work/nihonnomise" },
    ],
    caseStudy: {
      overview:
        "A full-stack web platform for Nihonnomise — an anime festival & creative community in Batam — built from zero to production, covering UI design, frontend, backend, and deployment.",
      background:
        "Nihonnomise was growing fast — events, sponsors, community — but had no digital home. Everything ran on WhatsApp and word of mouth. There was no way to register attendees, showcase events, or attract sponsors professionally.",
      myRole:
        "End-to-end. Product planning, UI/UX design, frontend, backend API, admin panel, and deployment. No handoffs, no back-and-forth — one developer responsible for the full picture.",
      impact:
        "Nihonnomise went from zero digital presence to a live, production platform handling event registrations, galleries, and sponsorship. The team runs everything independently through a custom admin dashboard.",
      learned:
        "Building solo end-to-end forces clarity. Every decision — architecture, UX, data modeling — lands on one person. It sharpens how you scope features under real constraints and design for non-technical users.",
      stack: ["Next.js", "Laravel", "Filament", "Vercel"],
    },
  },
  {
    slug: "elegant-gorden",
    year: "2023",
    title: "Elegant Gorden",
    role: "Curtain Store Website · PM & Full-stack",
    desc: "Marketing site for a Surabaya curtain store. SEO-first build with a lightweight CMS so the team can publish new product photos and updates without touching code.",
    tags: ["Next.js", "SEO", "PM", "UX"],
    variant: "v3",
    status: "ongoing",
    image: "/images/projects/elegantgorden.com.png",
    links: [
      { label: "Visit live", href: "https://elegantgorden.com", external: true },
      { label: "Ongoing project", href: "https://elegantgorden.vercel.app/", external: true },
      { label: "Case study", href: "/work/elegant-gorden" },
    ],
    caseStudy: {
      overview:
        "A simple, elegant website for a curtain store in Surabaya — designed for fast publishing, easy content management, and SEO-first discovery.",
      background:
        "The client had no online presence and needed a quick-to-launch solution to showcase products and services to potential buyers.",
      myRole:
        "Project Manager, UI/UX Designer, and Full-stack Developer. I managed client communication, translated business needs into wireframes, aligned the design with brand identity, and coordinated implementation.",
      impact:
        "Helped the client reach new customers online, increase trust, and drive sales through a visually clean, SEO-optimized website.",
      learned:
        "Small-business SEO is mostly information architecture, not magic. Managing design expectations and deadlines as project lead is half the job.",
      stack: ["Next.js", "Tailwind", "Vercel", "Figma"],
    },
  },
  {
    slug: "lancar-logistic",
    year: "2023",
    title: "Lancar Logistic",
    role: "Freight Forwarding Site · PM & Design",
    desc: "Managed the project end-to-end: client communication, wireframes, brand alignment, and handoff. SEO-first build for a B2B audience.",
    tags: ["PM", "UX", "SEO"],
    variant: "v4",
    status: "archived",
    links: [{ label: "Case study", href: "/work/lancar-logistic" }],
    caseStudy: {
      overview:
        "A marketing website for a freight forwarder targeting B2B buyers — SEO-first, lead-gen focused, and built so the sales team can iterate on copy without developer help.",
      background:
        "The client needed a credible digital presence to support outbound sales conversations. Existing collateral was PDF-driven and didn't hold up when prospects researched them online.",
      myRole:
        "Project manager and designer. Client intake, wireframes, brand alignment, and developer handoff.",
      impact:
        "Shipped on time with a clean SEO foundation. Sales now point prospects to the site during outreach instead of attaching PDFs.",
      stack: ["PM", "UX", "SEO", "WordPress"],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  production: "Live",
  ongoing: "In progress",
  archived: "Archived",
};
