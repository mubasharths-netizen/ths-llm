import { cn } from "@/lib/cn";
import Link from "next/link";

export const THS_LOGO_SRC = "/ths-logo.png";

const markClass = {
  sm: "h-12 w-12",
  md: "h-14 w-14",
  lg: "h-36 w-36 sm:h-44 sm:w-44",
} as const;

export function ThsMark({
  inverted = false,
  size = "md",
}: {
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        inverted && "rounded-2xl bg-white p-1",
        markClass[size],
      )}
    >
      <img
        src={THS_LOGO_SRC}
        alt="Taleem-o-Hunar Society"
        width={176}
        height={164}
        className="h-full w-full object-contain object-center"
        draggable={false}
      />
    </span>
  );
}

export function Logo({
  href = "/",
  inverted = false,
  compact = false,
  size,
}: {
  href?: string;
  inverted?: boolean;
  compact?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const markSize = size ?? (compact ? "sm" : "md");
  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      <ThsMark inverted={inverted} size={markSize} />
      {!compact ? (
        <span className="flex flex-col items-start leading-tight">
          <span className={cn("text-sm font-semibold tracking-tight", inverted ? "text-white" : "text-text")}>
            Taleem-o-Hunar Society
          </span>
          <span
            className={cn(
              "text-[11px] font-medium",
              inverted ? "text-white/70" : "text-text-muted",
            )}
          >
            Education & Skill Development
          </span>
        </span>
      ) : null}
    </Link>
  );
}
