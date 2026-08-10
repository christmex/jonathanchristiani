import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About Me — Jonathan Christiani",
  description:
    "A slide deck introduction: AI Native Engineer & FullStack Engineer building reliable, production-ready applications — and writing about cyber security on Medium.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
