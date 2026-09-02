import { cn } from "@/lib/cn";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function ThsMark({
  inverted = false,
  size = "md",
}: {
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const letter = size === "lg" ? "text-[64px]" : size === "sm" ? "text-[22px]" : "text-[28px]";
  const cap = size === "lg" ? "h-7 w-7 -top-5" : size === "sm" ? "h-3.5 w-3.5 -top-2.5" : "h-4 w-4 -top-3";
  const color = inverted ? "text-white" : "text-primary";

  return (
    <span className={cn("relative inline-flex items-end leading-none", color)} aria-label="THS">
      <span className={cn(letter, "font-black tracking-tight")}>T</span>
      <span className={cn("relative", letter, "font-black tracking-tight")}>
        H
        <GraduationCap
          className={cn("absolute left-1/2 -translate-x-1/2", cap, color)}
          strokeWidth={2.4}
          aria-hidden
        />
      </span>
      <span className={cn(letter, "font-black tracking-tight")}>S</span>
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
    <Link href={href} className="inline-flex items-center gap-2">
      <span className="flex flex-col items-start">
        <ThsMark inverted={inverted} size={markSize} />
        {!compact ? (
          <span
            className={cn(
              "mt-0.5 text-[10px] font-semibold tracking-[0.28em]",
              inverted ? "text-white/70" : "text-text-muted",
            )}
          >
            LAB
          </span>
        ) : null}
      </span>
    </Link>
  );
}
