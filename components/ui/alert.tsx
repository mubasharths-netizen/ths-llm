import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Alert({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "success" | "hint" | "error";
}) {
  const map = {
    info: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    hint: "bg-hint-soft text-hint",
    error: "bg-error-soft text-error",
  };
  return <div className={cn("rounded-xl px-4 py-3 text-sm font-medium", map[tone])}>{children}</div>;
}

export function EmptyState({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="card card-pad flex flex-col items-start gap-4">
      <p className="text-text-secondary">{title}</p>
      {action}
    </div>
  );
}
