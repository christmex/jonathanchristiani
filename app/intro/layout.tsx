import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Intro — jonathanchristiani.com",
  description: "A ten-second kinetic-typography tour of the new jonathanchristiani.com.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
