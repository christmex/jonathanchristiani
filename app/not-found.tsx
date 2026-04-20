import type { Metadata } from "next";
import NotFoundClient from "./NotFoundClient";

export const metadata: Metadata = {
  title: "404 — Route Not Found · Jonathan Christiani",
  description: "This route returned null. Probably a stale link. Let's get you back.",
};

export default function NotFound() {
  return <NotFoundClient />;
}
