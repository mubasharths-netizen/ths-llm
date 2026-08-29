"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { marketingLinks } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function MarketingNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="marketing-wrap flex h-16 items-center justify-between gap-4">
        <Logo href="/home" />
        <nav className="hidden items-center gap-6 lg:flex">
          {marketingLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium",
                pathname === link.href ? "text-primary" : "text-text-secondary hover:text-text",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button href="/login" variant="ghost">
            Login
          </Button>
          <Button href="/login">Get Started</Button>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-border bg-surface px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {marketingLinks.map((link) => (
              <Link key={link.href} href={link.href} className="py-2 text-sm font-medium" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Button href="/login" variant="secondary">
              Login
            </Button>
            <Button href="/login">Get Started</Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="marketing-wrap grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo href="/home" />
          <p className="mt-3 max-w-xs text-sm text-text-secondary">
            Professional IT learning. Practice skills. Improve with guidance.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-text-muted">Product</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
            <Link href="/features">Features</Link>
            <Link href="/courses">Courses</Link>
            <Link href="/how-it-works">How it works</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-text-muted">Learn</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
            <Link href="/student">Student app</Link>
            <Link href="/teacher">Teacher app</Link>
            <Link href="/admin">Admin app</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-text-muted">Support</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
            <Link href="/contact">Contact</Link>
            <Link href="/about">About</Link>
            <Link href="/login">Login</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-sm text-text-muted">© 2026 THS LAB LMS</div>
    </footer>
  );
}
