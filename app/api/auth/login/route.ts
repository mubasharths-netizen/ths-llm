import { NextResponse } from "next/server";
import { sessionCookie, signSession } from "@/lib/auth";
import { releaseAssessmentLock } from "@/lib/assessment-lock";
import { ensureAdministrator, getUserByEmail, isOwnerAdminEmail, upsertUserRecord } from "@/lib/db";
import { persistLmsDatabase, restoreLmsDatabase } from "@/lib/db-cloud";
import { hydrateUsersFromFirebase } from "@/lib/firebase-users";
import { firebaseAuthSignIn, readFirestoreUser } from "@/lib/firebase-web";
import { hashPassword, verifyPassword } from "@/lib/password";

export const runtime = "nodejs";

async function importFirebaseUser(email: string, password: string) {
  try {
    const session = await firebaseAuthSignIn(email, password);
    const profile =
      (await readFirestoreUser(session.idToken, session.localId)) ||
      (await readFirestoreUser(session.idToken, email));
    const role =
      profile?.role === "teacher" || profile?.role === "admin" || profile?.role === "student"
        ? profile.role
        : isOwnerAdminEmail(email)
          ? "admin"
          : "student";
    const existing = getUserByEmail(email);
    upsertUserRecord({
      id: profile?.id || existing?.id || session.localId,
      name: profile?.name || existing?.name || email.split("@")[0],
      email,
      password_hash: hashPassword(password),
      role,
      class_name:
        profile?.class_name ||
        existing?.class_name ||
        (role === "admin" ? "Ops" : role === "teacher" ? "Faculty" : "BSIT-4A"),
      status: profile?.active === false ? "Disabled" : existing?.status || "Active",
      score: existing?.score ?? 0,
      subject: existing?.subject ?? null,
      qualification: existing?.qualification ?? null,
      avatar: existing?.avatar ?? null,
    });
    return getUserByEmail(email);
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !email.includes("@") || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    await restoreLmsDatabase();
    await hydrateUsersFromFirebase();

    let user = getUserByEmail(email);
    const localOk = Boolean(user && verifyPassword(password, user.password_hash));
    if (!localOk) {
      const imported = await importFirebaseUser(email, password);
      if (!imported) {
        return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
      }
      user = imported;
    }

    if (!user) {
      return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
    }
    if (user.status !== "Active") {
      return NextResponse.json(
        { error: "This account is not active yet. An admin must approve it." },
        { status: 403 },
      );
    }

    const signedIn =
      isOwnerAdminEmail(email) && user.role !== "admin" ? ensureAdministrator({ email }).user : user;
    if (!signedIn) {
      return NextResponse.json({ error: "Unable to sign in." }, { status: 400 });
    }

    const session = { id: signedIn.id, name: signedIn.name, email: signedIn.email, role: signedIn.role };
    const res = NextResponse.json({
      user: { id: signedIn.id, name: signedIn.name, email: signedIn.email, role: signedIn.role },
    });
    releaseAssessmentLock(signedIn.id);
    await persistLmsDatabase();
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
