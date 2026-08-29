"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LoginForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [role, setRole] = useState("student");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role === "teacher") router.push("/teacher");
    else if (role === "admin") router.push("/admin");
    else router.push("/student");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card>
          <h1 className="text-[28px] font-semibold tracking-tight">Login</h1>
          <p className="mt-1 text-sm text-text-secondary">Students, teachers, and admins use this sign-in.</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" className="input" defaultValue="ayesha@thslab.edu" required />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input id="password" type={show ? "text" : "password"} className="input pr-24" defaultValue="password" required />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-primary"
                  onClick={() => setShow((v) => !v)}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="role">
                Demo role
              </label>
              <select id="role" className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-text-secondary">
                <input type="checkbox" className="h-4 w-4" defaultChecked />
                Remember me
              </label>
              <Link href="/forgot-password" className="font-medium text-primary">
                Forgot password
              </Link>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <p className="mt-4 text-sm text-text-secondary">
            No account?{" "}
            <Link href="/register" className="font-medium text-primary">
              Register
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
