import { NextResponse } from "next/server";
import { sessionCookie, signSession } from "@/lib/auth";
import { releaseAssessmentLock } from "@/lib/assessment-lock";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !email.includes("@") || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "No account found for this email. Demo logins like ayesha@ / admin@ were removed." },
        { status: 401 },
      );
    }
    if (user.status !== "Active") {
      return NextResponse.json({ error: "This account is not active yet. An admin must approve it." }, { status: 403 });
    }
    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: "Wrong password. Open Forgot password and set a new one for this email." },
        { status: 401 },
      );
    }
    const session = { id: user.id, name: user.name, email: user.email, role: user.role };
    const res = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    releaseAssessmentLock(user.id);
    res.cookies.set(sessionCookie(signSession(session)));
    res.cookies.set({
      name: "ths_assessment_lock",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Unable to sign in." }, { status: 400 });
  }
}
