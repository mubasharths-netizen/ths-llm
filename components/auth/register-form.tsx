"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState("student");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(role === "teacher" ? "/login" : "/student");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card>
          <h1 className="text-[28px] font-semibold tracking-tight">Create account</h1>
          <p className="mt-1 text-sm text-text-secondary">Teacher accounts require admin approval.</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label" htmlFor="name">
                Full name
              </label>
              <input id="name" className="input" defaultValue="Ayesha Khan" required />
            </div>
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
              <input id="password" type="password" className="input" required />
            </div>
            <div>
              <label className="label" htmlFor="confirm">
                Confirm password
              </label>
              <input id="confirm" type="password" className="input" required />
            </div>
            <div>
              <label className="label" htmlFor="role">
                Role
              </label>
              <select id="role" className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <label className="flex items-start gap-2 text-sm text-text-secondary">
              <input type="checkbox" className="mt-1 h-4 w-4" required />
              I agree to the THS LAB LMS terms of use.
            </label>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
          <p className="mt-4 text-sm text-text-secondary">
            Already registered?{" "}
            <Link href="/login" className="font-medium text-primary">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
