import Link from "next/link";
import { ArrowUp } from "lucide-react";

/**
 * Sitewide footer.
 * backHref / backLabel allow each page to set a contextual "back" link.
 */
export default function SiteFooter({
  backHref = "/",
  backLabel = "BACK HOME",
}: {
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <span>© 2026 JONATHAN CHRISTIANI</span>
          <span>BATAM · INDONESIA · GMT+7</span>
          <span>
            I KNOW THAT I KNOW NOTHING ·{" "}
            <Link href={backHref} className="inline-icon">
              <ArrowUp size={12} strokeWidth={2} />
              {backLabel}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
