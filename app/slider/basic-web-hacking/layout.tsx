import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Basic Web Hacking | Jonathan Christiani",
  description: "From IDOR to Account Takeover. A beginner-friendly walkthrough of a common web vulnerability and how to defend against it.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
