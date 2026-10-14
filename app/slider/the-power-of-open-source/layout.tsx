import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "The Power of Open Source | Jonathan Christiani",
  description: "Build fast, ship fast. Introducing FilamentPHP and the open source TALL stack it is built on.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
