import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, getCategory, getPostsByCategory, type CategoryId } from "@/lib/posts";
import CategoryPostsClient from "./CategoryPostsClient";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Not found" };
  return {
    title: `${cat.title} — Jonathan Christiani`,
    description: cat.desc,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const catPosts = getPostsByCategory(cat.id as CategoryId);
  return <CategoryPostsClient category={cat} posts={catPosts} allCategories={categories} />;
}
