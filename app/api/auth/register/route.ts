import { NextResponse } from "next/server";
import { registerAccount, sessionCookie, signSession } from "@/lib/auth";
import { releaseAssessmentLock } from "@/lib/assessment-lock";
import { adminCount, getUserByEmail } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!name || !email.includes("@") || password.length < 4) {
      return NextResponse.json({ error: "Name, email, and a password (4+ characters) are required." }, { status: 400 });
    }
    if (getUserByEmail(email)) {
      return NextResponse.json({ error: "An account with this email already exists. Use Login." }, { status: 409 });
    }
    if (adminCount() > 0) {
      return NextResponse.json({ error: "Accounts can only be created by an administrator. Use Login." }, { status: 403 });
    }
    const result = registerAccount({ name, email, password, role: "student" });
    if (result.error || !result.user) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
    const res = NextResponse.json({ user: result.user });
    releaseAssessmentLock(result.user.id);
    res.cookies.set(sessionCookie(signSession(result.user)));
    return res;
  } catch {
    return NextResponse.json({ error: "Unable to register." }, { status: 400 });
  }
}
