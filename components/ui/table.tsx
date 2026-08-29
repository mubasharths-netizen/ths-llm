import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function DataTable({
  headers,
  children,
  className,
}: {
  headers: string[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-border">
              {headers.map((header) => (
                <th
                  key={header}
                  className="h-[52px] px-4 text-xs font-medium uppercase tracking-[0.06em] text-text-muted"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="h-[52px] border-b border-border last:border-0 hover:bg-surface-muted">{children}</tr>;
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("px-4 text-sm text-text", className)}>{children}</td>;
}
