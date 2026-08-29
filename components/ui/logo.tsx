import { cn } from "@/lib/cn";
import Link from "next/link";

export function Logo({
  href = "/",
  inverted = false,
  compact = false,
}: {
  href?: string;
  inverted?: boolean;
  compact?: boolean;
}) {
  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white",
          inverted ? "bg-white/15 text-white" : "bg-primary",
        )}
      >
        TH
      </span>
      <span className={cn("leading-tight", inverted ? "text-white" : "text-text")}>
        <span className="block text-[15px] font-bold tracking-tight">THS LAB</span>
        {!compact ? (
          <span className={cn("block text-xs font-medium", inverted ? "text-white/70" : "text-text-muted")}>
            LMS
          </span>
        ) : null}
      </span>
    </Link>
  );
}
