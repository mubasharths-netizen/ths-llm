"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, BookOpen, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThsMark } from "@/components/ui/logo";

const homeByRole = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
} as const;

export function LoginForm({ justReset = false }: { justReset?: boolean }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void (async () => {
      setError("");
      setPending(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json()) as { error?: string; user?: { role?: string } };
      setPending(false);
      if (!res.ok) {
        setError(data.error || "Unable to sign in.");
        return;
      }
      const accountRole = data.user?.role;
      const dest =
        accountRole && accountRole in homeByRole ? homeByRole[accountRole as keyof typeof homeByRole] : "/student";
      router.push(dest);
      router.refresh();
    })();
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(320px,42%)_1fr]">
        <section className="flex flex-col justify-center px-6 py-10 sm:px-12">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex flex-col items-center">
              <ThsMark size="lg" />
              <p className="mt-1 text-xs font-semibold tracking-[0.28em] text-text-muted">LAB</p>
            </div>
            {justReset ? (
              <p className="mt-6 text-center text-sm font-medium text-teal">Password updated. Sign in below.</p>
            ) : null}
            {error ? <p className="mt-6 text-center text-sm font-medium text-error">{error}</p> : null}
            <form className="mt-8 space-y-4" onSubmit={onSubmit}>
              <input
                id="email"
                name="email"
                type="email"
                className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-base text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 pr-12 text-base text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-primary"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password
                </Link>
              </div>
              <Button type="submit" className="h-12 w-full rounded-full" disabled={pending}>
                {pending ? "Signing in…" : "Sign In"}
              </Button>
            </form>
            <div className="mt-10 space-y-3 text-sm text-text-secondary">
              <Link href="/home" className="flex items-center gap-2 hover:text-primary">
                <Bell size={16} className="text-primary" />
                Notice Board
              </Link>
              <Link href="/how-it-works" className="flex items-center gap-2 hover:text-primary">
                <BookOpen size={16} className="text-primary" />
                Student handbook
              </Link>
            </div>
          </div>
        </section>
        <section className="relative hidden overflow-hidden bg-[#0B1B4A] lg:flex lg:items-center lg:justify-center">
          <div className="welcome-grid absolute inset-0 opacity-30" />
          <div className="absolute inset-0 bg-[#0B1B4A]/55" />
          <div className="relative z-10 max-w-xl px-10 text-center text-white">
            <h1 className="text-4xl font-semibold tracking-tight xl:text-5xl">Learning Management System</h1>
            <p className="mt-6 text-lg text-blue-100">Learn. Practice. Improve.</p>
            <p className="mt-4 text-base leading-8 text-blue-100/90">سیکھو، مشق کرو، بہتر بنو۔</p>
          </div>
        </section>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3 text-xs text-text-muted">
        <p>THS LAB LMS</p>
        <p>© 2026 THS LAB. Professional IT education.</p>
        <div className="flex gap-4">
          <Link href="/contact">Contact us</Link>
          <Link href="/about">Help</Link>
        </div>
      </footer>
    </main>
  );
}
