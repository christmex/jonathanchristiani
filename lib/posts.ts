export type PostBlock =
  | { type: "p"; content: string }
  | { type: "h2"; content: string }
  | { type: "quote"; content: string; cite?: string }
  | { type: "code"; content: string; lang?: string }
  | { type: "list"; items: string[] };

export type CategoryId = "why" | "life" | "important";

export type Category = {
  id: CategoryId;
  kicker: string;       // "WHY."
  title: string;        // "I Debug Reality"
  tagline: string;      // short one-liner
  desc: string;         // card description (medium)
  lede: string;         // longer intro on the category page
  image: string;
  tags: string[];       // category-wide theme tags
  openedOn: string;     // ISO date the category was started
};

export type Post = {
  slug: string;
  category: CategoryId;
  title: string;
  desc: string;
  date: string;         // ISO date
  readTime: string;
  image: string;
  tags: string[];
  body: PostBlock[];
};

export const categories: Category[] = [
  {
    id: "why",
    kicker: "WHY.",
    title: "I Debug Reality",
    tagline: "The philosophical log.",
    desc: "First principles, mental models, and the questions I keep coming back to — notes from treating life like a codebase.",
    lede: "When a system misbehaves, a good engineer doesn't argue with it. They attach a debugger, set a breakpoint, and watch the actual state of the world. I've started treating my own life the same way. These are the notes from that habit — messy, honest, and mostly for myself.",
    image: "/images/blog-why-hero.png",
    tags: ["philosophy", "first-principles", "process"],
    openedOn: "2025-06-01",
  },
  {
    id: "life",
    kicker: "LIFE'S.",
    title: "An Infinite Loop",
    tagline: "The tech workbench.",
    desc: "Research problems I solved, the approach I took, and what I learned along the way. The tech loop I actually want to rerun.",
    lede: "The scariest thing about engineering isn't that it's hard. It's that it's a loop — read a spec, form a model, ship, break, learn, ship again. This is the public log of that loop: the research problems I'm in the middle of, the approaches that clicked, and the lessons I only paid for once.",
    image: "/images/blog-life-hero.png",
    tags: ["engineering", "research", "tooling"],
    openedOn: "2025-07-15",
  },
  {
    id: "important",
    kicker: "IMPORTANT.",
    title: "For Myself",
    tagline: "The life-lesson log.",
    desc: "Failures, reminders, and personal notes — written so future-me can reread them when the pattern repeats.",
    lede: "This is a note to the version of me who will re-read it six months from now — probably in the middle of some fresh self-inflicted mess — and need to be reminded that the pattern has happened before. Public because I figure the version of you reading this might be in the same spot.",
    image: "/images/blog-important-hero.png",
    tags: ["notes", "self", "lessons"],
    openedOn: "2025-09-10",
  },
];

export const posts: Post[] = [];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getPostsByCategory(id: CategoryId): Post[] {
  return posts.filter((p) => p.category === id);
}

export function getPost(category: string, slug: string): Post | undefined {
  return posts.find((p) => p.category === category && p.slug === slug);
}

export function countByCategory(id: CategoryId): number {
  return posts.filter((p) => p.category === id).length;
}

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}
