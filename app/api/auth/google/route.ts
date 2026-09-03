import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { sessionCookie, signSession } from "@/lib/auth";
import { releaseAssessmentLock } from "@/lib/assessment-lock";
import { persistLmsDatabase, restoreLmsDatabase } from "@/lib/db-cloud";
import {
  adminCount,
  createManagedUser,
  ensureAdministrator,
  getUserByEmail,
  isOwnerAdminEmail,
  upsertUserRecord,
} from "@/lib/db";
import { getFirebaseDb } from "@/lib/firebase";
import { hydrateUsersFromFirebase, saveUserToFirebase } from "@/lib/firebase-users";
import { lookupFirebaseIdToken, readFirestoreUser, verifyGoogleCredential, writeFirestoreUser } from "@/lib/firebase-web";
import { hashPassword } from "@/lib/password";

export const runtime = "nodejs";

function homeFor(role: string) {
  if (role === "admin") return "/admin";
  if (role === "teacher") return "/teacher";
  return "/student";
}

async function googleProfile(idToken: string) {
  try {
    return await lookupFirebaseIdToken(idToken);
  } catch {
    return verifyGoogleCredential(idToken);
  }
}

async function saveCloudProfile(
  idToken: string,
  uid: string,
  user: { id: string; name: string; email: string; role: string; status: string; class_name: string | null; password_hash: string },
) {
  const fields = {
    id: user.id,
    lms_id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.status === "Active",
    class_name: user.class_name,
    password_hash: user.password_hash,
  };
  try {
    await writeFirestoreUser(idToken, uid, fields);
  } catch {
    // Admin SDK or rules may already have the profile.
  }
  try {
    await writeFirestoreUser(idToken, user.email, fields);
  } catch {
    // Email-keyed document is optional.
  }
}

export async function POST(request: Request) {
  try {
    await restoreLmsDatabase();
    const body = (await request.json()) as { idToken?: string };
    const idToken = typeof body.idToken === "string" ? body.idToken.trim() : "";
    if (!idToken) {
      return NextResponse.json({ error: "Google sign-in was cancelled." }, { status: 400 });
    }

    const profile = await googleProfile(idToken);
    if (!profile.fromGoogle && !profile.emailVerified) {
      return NextResponse.json({ error: "Google could not verify this account." }, { status: 401 });
    }

    await hydrateUsersFromFirebase();
    const cloud =
      (await readFirestoreUser(idToken, profile.localId)) || (await readFirestoreUser(idToken, profile.email));

    let user = getUserByEmail(profile.email);
    if (!user && cloud?.email) {
      upsertUserRecord({
        id: cloud.id || profile.localId,
        name: cloud.name || profile.name,
        email: profile.email,
        password_hash: cloud.password_hash || hashPassword(randomBytes(24).toString("hex")),
        role: cloud.role === "teacher" || cloud.role === "admin" ? cloud.role : "student",
        class_name: cloud.class_name,
        status: cloud.active === false ? "Disabled" : "Active",
        score: 0,
        subject: null,
        qualification: null,
        avatar: null,
      });
      user = getUserByEmail(profile.email);
    }
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

    if (getFirebaseDb()) {
      await saveUserToFirebase(user);
    } else {
      await saveCloudProfile(idToken, profile.localId, user);
    }
    await persistLmsDatabase();

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
