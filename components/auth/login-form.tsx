"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card>
          <h1 className="text-[28px] font-semibold tracking-tight">Login</h1>
          <p className="mt-1 text-sm text-text-secondary">Sign in with your email and password.</p>
          {justReset ? (
            <p className="mt-3 text-sm font-medium text-teal">Password updated. Sign in with your new password.</p>
          ) : null}
          {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="you@thslab.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  className="input pr-24"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-primary"
                  onClick={() => setShow((v) => !v)}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-text-secondary">
                <input type="checkbox" className="h-4 w-4" suppressHydrationWarning />
                Remember me
              </label>
              <Link href="/forgot-password" className="font-medium text-primary">
                Forgot password
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Login"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
