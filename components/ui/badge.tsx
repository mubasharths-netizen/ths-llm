import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Tone = "primary" | "teal" | "hint" | "error" | "muted" | "outline";

const tones: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  teal: "bg-teal-soft text-teal",
  hint: "bg-hint-soft text-hint",
  error: "bg-error-soft text-error",
  muted: "bg-surface-muted text-text-secondary",
  outline: "border border-border text-text-secondary bg-transparent",
};

export function Badge({
  children,
  tone = "primary",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return <span className={cn("badge", tones[tone], className)}>{children}</span>;
}
