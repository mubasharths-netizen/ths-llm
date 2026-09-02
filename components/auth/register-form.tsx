"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export function RegisterForm({ allowEmailSetup = false }: { allowEmailSetup?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setPending(true);
    void (async () => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await res.json()) as { error?: string; user?: { role?: string } };
      setPending(false);
      if (!res.ok) {
        setError(data.error || "Unable to create account.");
        return;
      }
      router.push("/admin");
    })();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card>
          <h1 className="text-[28px] font-semibold tracking-tight">
            {allowEmailSetup ? "Create administrator" : "Sign up"}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {allowEmailSetup
              ? "This setup is only available when no administrator exists. After this, students can join with Google."
              : "Create a student account with Google. Teachers are added by an administrator."}
          </p>
          {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
          <div className="mt-6">
            <GoogleSignInButton label="Sign up with Google" onError={setError} />
          </div>
          {allowEmailSetup ? (
            <>
              <div className="my-6 flex items-center gap-3 text-xs text-text-muted">
                <span className="h-px flex-1 bg-border" />
                or create with email
                <span className="h-px flex-1 bg-border" />
              </div>
              <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label" htmlFor="name">
                Full name
              </label>
              <input id="name" name="name" className="input" required />
            </div>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input id="email" name="email" type="email" className="input" required />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input id="password" name="password" type="password" className="input" minLength={4} required />
            </div>
            <div>
              <label className="label" htmlFor="confirm">
                Confirm password
              </label>
              <input id="confirm" name="confirm" type="password" className="input" minLength={4} required />
            </div>
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Creating account…" : "Create administrator"}
              </Button>
            </form>
            </>
          ) : null}
          <p className="mt-4 text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
