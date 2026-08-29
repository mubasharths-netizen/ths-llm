import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card>
          <h1 className="text-[28px] font-semibold tracking-tight">Reset password</h1>
          <p className="mt-1 text-sm text-text-secondary">Enter your email and we will send a reset link.</p>
          <form className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" className="input" />
            </div>
            <Button type="button" className="w-full">
              Send reset link
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
