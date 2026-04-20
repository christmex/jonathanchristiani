import type { Metadata } from "next";
import { categories, posts } from "@/lib/posts";
import WritingCategoriesClient from "./WritingCategoriesClient";

export const metadata: Metadata = {
  title: "Writing — Jonathan Christiani",
  description: "Three running logs: Why (philosophy), Life's (tech), Important (life lessons).",
};

export default function WritingPage() {
  return <WritingCategoriesClient categories={categories} totalPosts={posts.length} />;
}
