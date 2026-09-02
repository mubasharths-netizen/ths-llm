"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const currentPassword = String(form.get("currentPassword") || "");
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    void (async () => {
      setError("");
      setPending(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword, password, confirm }),
      });
      const data = (await res.json()) as { error?: string };
      setPending(false);
      if (!res.ok) {
        setError(data.error || "Unable to reset password.");
        return;
      }
      router.push("/login?reset=1");
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
          <h1 className="text-[28px] font-semibold tracking-tight">Change password</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Enter your current password, then choose a new one.
          </p>
          {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input id="email" name="email" type="email" className="input" required />
            </div>
            <div>
              <label className="label" htmlFor="currentPassword">
                Current password
              </label>
              <input id="currentPassword" name="currentPassword" type="password" className="input" required />
            </div>
            <div>
              <label className="label" htmlFor="password">
                New password
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
              {pending ? "Saving…" : "Save new password"}
            </Button>
          </form>
          <Link href="/login" className="mt-4 inline-block text-sm font-medium text-primary">
            Back to login
          </Link>
        </Card>
      </div>
    </main>
  );
}
