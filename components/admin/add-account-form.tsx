"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import type { AdminUserRow } from "@/lib/db-types";

const copy: Record<AdminUserRow["role"], { title: string; description: string; listHref: string; listLabel: string }> = {
  Student: {
    title: "Add student",
    description: "Create a student login. The student can sign in only with this email and password.",
    listHref: "/admin/students",
    listLabel: "View students",
  },
  Teacher: {
    title: "Add teacher",
    description: "Create a teacher login. The teacher can sign in only with this email and password.",
    listHref: "/admin/teachers",
    listLabel: "View teachers",
  },
  Admin: {
    title: "Add admin",
    description: "Create an administrator login. Admins can add students, teachers, and other admins.",
    listHref: "/admin/admins",
    listLabel: "View admins",
  },
};

export function AddAccountForm({ role }: { role: AdminUserRow["role"] }) {
  const router = useRouter();
  const meta = copy[role];
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", className: "" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      setOk("");
      return;
    }
    setPending(true);
    setError("");
    setOk("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        className: form.className,
      }),
    });
    const data = (await res.json()) as { error?: string; user?: AdminUserRow };
    setPending(false);
    if (!res.ok || !data.user) {
      setError(data.error || "Unable to add account.");
      return;
    }
    setOk(`${role} account created for ${data.user.name}.`);
    setForm({ name: "", email: "", password: "", confirm: "", className: "" });
    router.refresh();
  }

  return (
    <>
      <PageHeader
        title={meta.title}
        description={meta.description}
        actions={
          <Button href={meta.listHref} variant="secondary">
            {meta.listLabel}
          </Button>
        }
      />
      <Card className="max-w-xl">
        {error ? (
          <div className="mb-4">
            <Alert tone="error">{error}</Alert>
          </div>
        ) : null}
        {ok ? (
          <div className="mb-4">
            <Alert tone="success">{ok}</Alert>
          </div>
        ) : null}
        <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Login email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          {role === "Student" ? (
            <div>
              <label className="label" htmlFor="className">
                Class
              </label>
              <input
                id="className"
                className="input"
                placeholder="BSIT-4A"
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
              />
            </div>
          ) : null}
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              minLength={4}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="confirm">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              className="input"
              minLength={4}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Creating…" : `Create ${role.toLowerCase()} account`}
          </Button>
        </form>
      </Card>
    </>
  );
}
