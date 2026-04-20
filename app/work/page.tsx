import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import WorkListClient from "./WorkListClient";

export const metadata: Metadata = {
  title: "Work — Jonathan Christiani",
  description: "Every project I've shipped — filter by status.",
};

export default function WorkPage() {
  return <WorkListClient projects={projects} />;
}
