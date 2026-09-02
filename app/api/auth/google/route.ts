import { NextResponse } from "next/server";
import { sessionCookie, signSession } from "@/lib/auth";
import { releaseAssessmentLock } from "@/lib/assessment-lock";
import {
  adminCount,
  createManagedUser,
  ensureAdministrator,
  getUserByEmail,
  isOwnerAdminEmail,
} from "@/lib/db";
import { lookupFirebaseIdToken } from "@/lib/firebase-web";
import { randomBytes } from "node:crypto";

export const runtime = "nodejs";

function homeFor(role: string) {
  if (role === "admin") return "/admin";
  if (role === "teacher") return "/teacher";
  return "/student";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { idToken?: string };
    const idToken = typeof body.idToken === "string" ? body.idToken.trim() : "";
    if (!idToken) {
      return NextResponse.json({ error: "Google sign-in was cancelled." }, { status: 400 });
    }

    const profile = await lookupFirebaseIdToken(idToken);
    if (!profile.fromGoogle && !profile.emailVerified) {
      return NextResponse.json({ error: "Google could not verify this account." }, { status: 401 });
    }

    let user = getUserByEmail(profile.email);
    if (!user) {
      const role = adminCount() === 0 || isOwnerAdminEmail(profile.email) ? "admin" : "student";
      user = createManagedUser({
        name: profile.name,
        email: profile.email,
        password: randomBytes(24).toString("hex"),
        role,
      });
    } else if (isOwnerAdminEmail(profile.email) && user.role !== "admin") {
      user = ensureAdministrator({ email: profile.email }).user;
    }

    if (!user) {
      return NextResponse.json({ error: "Unable to sign in with Google." }, { status: 400 });
    }
    if (user.status !== "Active") {
      return NextResponse.json(
        { error: "This account is not active yet. An admin must approve it." },
        { status: 403 },
      );
    }

    const session = { id: user.id, name: user.name, email: user.email, role: user.role };
    const res = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      dest: homeFor(user.role),
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
  } catch (err) {
    const message = err instanceof Error ? err.message.replace(/_/g, " ") : "Unable to sign in with Google.";
    return NextResponse.json({ error: message.slice(0, 180) }, { status: 401 });
  }
}
