"use client";

import { Card, StatCard } from "@/components/ui/card";
import type { AdminUserRow } from "@/lib/db-types";

const ROLES = ["Student", "Teacher", "Admin"] as const;
type Role = (typeof ROLES)[number];

const ROLE_COLOR: Record<Role, string> = {
  Student: "var(--primary)",
  Teacher: "var(--teal)",
  Admin: "var(--ai)",
};

function countByRole(users: AdminUserRow[]) {
  return {
    Student: users.filter((u) => u.role === "Student").length,
    Teacher: users.filter((u) => u.role === "Teacher").length,
    Admin: users.filter((u) => u.role === "Admin").length,
  };
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const sweep = end - start;
  if (sweep <= 0) return "";
  if (sweep >= 359.99) {
    const a = polarToCartesian(cx, cy, r, 0);
    const b = polarToCartesian(cx, cy, r, 179.99);
    return `M ${a.x} ${a.y} A ${r} ${r} 0 1 1 ${b.x} ${b.y} A ${r} ${r} 0 1 1 ${a.x} ${a.y}`;
  }
  const startPt = polarToCartesian(cx, cy, r, start);
  const endPt = polarToCartesian(cx, cy, r, end);
  const large = sweep > 180 ? 1 : 0;
  return `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${large} 1 ${endPt.x} ${endPt.y}`;
}

export function UsersRoleCharts({
  users,
  activeRole,
  onSelectRole,
  showStats = true,
}: {
  users: AdminUserRow[];
  activeRole: Role | "All";
  onSelectRole?: (role: Role | "All") => void;
  showStats?: boolean;
}) {
  const counts = countByRole(users);
  const total = users.length;
  const active = users.filter((u) => u.status === "Active").length;
  const max = Math.max(counts.Student, counts.Teacher, counts.Admin, 1);

  let angle = 0;
  const slices = ROLES.map((role) => {
    const value = counts[role];
    const sweep = total > 0 ? (value / total) * 360 : 0;
    const slice = { role, value, start: angle, end: angle + sweep };
    angle += sweep;
    return slice;
  });

  return (
    <div className="mb-6 space-y-4">
      {showStats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Students" value={String(counts.Student)} hint="Enrolled learners" />
          <StatCard label="Teachers" value={String(counts.Teacher)} hint="Faculty accounts" />
          <StatCard label="Admins" value={String(counts.Admin)} hint="Institute operators" />
          <StatCard label="Active" value={`${active} / ${total || 0}`} hint="Currently enabled" />
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Accounts by role</h2>
          <p className="mt-1 text-sm text-text-secondary">Student, teacher, and admin totals from live logins.</p>
          <div
            className="mt-6 flex h-52 items-end justify-around gap-4 px-2"
            role="img"
            aria-label={`Students ${counts.Student}, teachers ${counts.Teacher}, admins ${counts.Admin}`}
          >
            {ROLES.map((role) => {
              const value = counts[role];
              const height = Math.max(8, (value / max) * 100);
              const selected = activeRole === "All" || activeRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  className={`flex h-full w-full max-w-[120px] flex-col items-center justify-end gap-2 ${onSelectRole ? "cursor-pointer" : "cursor-default"}`}
                  onClick={() => onSelectRole?.(activeRole === role ? "All" : role)}
                >
                  <span className="text-sm font-semibold text-text">{value}</span>
                  <span
                    className="w-12 rounded-t-lg transition-[height,opacity] duration-300"
                    style={{
                      height: `${height}%`,
                      background: ROLE_COLOR[role],
                      opacity: selected ? 1 : 0.35,
                    }}
                  />
                  <span className="text-xs font-medium text-text-secondary">{role}s</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Role share</h2>
          <p className="mt-1 text-sm text-text-secondary">How the institute is split across roles.</p>
          <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
            <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden>
              {total === 0 ? (
                <circle cx="90" cy="90" r="62" fill="none" stroke="var(--border)" strokeWidth="22" />
              ) : (
                slices.map((slice) =>
                  slice.value === 0 ? null : (
                    <path
                      key={slice.role}
                      d={arcPath(90, 90, 62, slice.start, slice.end)}
                      fill="none"
                      stroke={ROLE_COLOR[slice.role]}
                      strokeWidth="22"
                      strokeLinecap="butt"
                      opacity={activeRole === "All" || activeRole === slice.role ? 1 : 0.35}
                    />
                  ),
                )
              )}
              <text x="90" y="86" textAnchor="middle" fill="var(--text)" fontSize="22" fontWeight="600">
                {total}
              </text>
              <text x="90" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="11">
                accounts
              </text>
            </svg>
            <ul className="w-full space-y-3 text-sm">
              {ROLES.map((role) => {
                const value = counts[role];
                const pct = total ? Math.round((value / total) * 100) : 0;
                return (
                  <li key={role} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-text-secondary">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: ROLE_COLOR[role] }} />
                      {role}s
                    </span>
                    <span className="font-medium text-text">
                      {value} · {pct}%
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold">Status by role</h2>
        <p className="mt-1 text-sm text-text-secondary">Active accounts versus disabled or pending.</p>
        <div className="mt-4 space-y-4">
          {ROLES.map((role) => {
            const group = users.filter((u) => u.role === role);
            const live = group.filter((u) => u.status === "Active").length;
            const other = group.length - live;
            const livePct = group.length ? (live / group.length) * 100 : 0;
            return (
              <div key={role}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-text">{role}s</span>
                  <span className="text-text-muted">
                    {live} active · {other} other
                  </span>
                </div>
                <div className="flex h-2.5 overflow-hidden rounded-full bg-border">
                  <span className="h-full rounded-full" style={{ width: `${livePct}%`, background: ROLE_COLOR[role] }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
