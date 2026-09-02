import { NextResponse } from "next/server";
import { getUserByEmail, setUserPassword } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      currentPassword?: string;
      password?: string;
      confirm?: string;
    };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const password = typeof body.password === "string" ? body.password : "";
    const confirm = typeof body.confirm === "string" ? body.confirm : "";
    if (!email.includes("@") || !currentPassword || password.length < 4) {
      return NextResponse.json(
        { error: "Email, current password, and a new password (4+ characters) are required." },
        { status: 400 },
      );
    }
    if (password !== confirm) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }
    const existing = getUserByEmail(email);
    if (!existing) {
      return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
    }
    if (!verifyPassword(currentPassword, existing.password_hash)) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    const user = setUserPassword(email, password);
    if (!user) {
      return NextResponse.json({ error: "Unable to update password." }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to reset password." }, { status: 400 });
  }
}
