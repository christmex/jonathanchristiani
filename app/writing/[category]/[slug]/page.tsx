import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  posts,
  getCategory,
  getPost,
  getPostsByCategory,
  type CategoryId,
} from "@/lib/posts";
import PostClient from "./PostClient";

export function generateStaticParams() {
  return posts.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} — Jonathan Christiani`,
    description: post.desc,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const cat = getCategory(category);
  const post = getPost(category, slug);
  if (!cat || !post) notFound();

  const related = getPostsByCategory(cat.id as CategoryId)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return <PostClient post={post} category={cat} related={related} />;
}
