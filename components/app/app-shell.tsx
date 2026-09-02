"use client";

import {
  Award,
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  ChartColumn,
  ChartLine,
  CircleAlert,
  ClipboardCheck,
  ClipboardList,
  Code2,
  FileBadge,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Lock,
  Mail,
  Menu,
  Megaphone,
  MessageSquare,
  PenLine,
  PlayCircle,
  School,
  ScrollText,
  Search,
  Settings,
  Shield,
  Table2,
  Trophy,
  User,
  UserCheck,
  UserPlus,
  UserRoundCog,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const icons = {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  PenLine,
  ListChecks,
  ClipboardCheck,
  FileText,
  Bot,
  Code2,
  CircleAlert,
  CalendarDays,
  Gauge,
  Trophy,
  ChartLine,
  Award,
  Bell,
  User,
  Users,
  GraduationCap,
  FileBadge,
  Table2,
  MessageSquare,
  Megaphone,
  Mail,
  UserRoundCog,
  UserCheck,
  UserPlus,
  School,
  ClipboardList,
  ChartColumn,
  Shield,
  Lock,
  ScrollText,
  Settings,
} as const;

export type NavItem = { href: string; label: string; icon: keyof typeof icons };

export function AppShell({
  nav,
  role,
  userName,
  avatarUrl,
  profileHref,
  children,
  title,
}: {
  nav: NavItem[];
  role: string;
  userName: string;
  avatarUrl?: string;
  profileHref?: string;
  children: ReactNode;
  title: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/student" || href === "/teacher" || href === "/admin") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[color:var(--overlay)] lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface lg:static",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-border px-4">
          <Logo href={nav[0]?.href ?? "/"} compact />
          <button type="button" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.06em] text-text-muted">{role}</p>
          <div className="flex flex-col gap-0.5">
            {nav.map((item) => {
              const Icon = icons[item.icon] ?? icons.LayoutDashboard;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium",
                    active ? "bg-primary text-white" : "text-text-secondary hover:bg-surface-muted",
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-border bg-surface px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{title}</p>
              <p className="hidden text-xs text-text-muted sm:block">THS LAB LMS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-text-muted" />
              <input className="input w-56 pl-9" placeholder="Search" aria-label="Search" />
            </div>
            <Link
              href={role === "Student" ? "/student/notifications" : role === "Teacher" ? "/teacher/announcements" : "/admin/audit-logs"}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error" />
            </Link>
            <ThemeToggle />
            <Link
              href={profileHref ?? (role === "Student" ? "/student/profile" : role === "Teacher" ? "/teacher/profile" : "/admin/profile")}
              className="hidden items-center gap-2 sm:flex"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              )}
              <div className="leading-tight">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-text-muted">{role}</p>
              </div>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="page-wrap">{children}</div>
        </main>
      </div>
    </div>
  );
}
