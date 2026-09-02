import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import {
  SESSION_COOKIE,
  homeForRole,
  sessionCookie,
  signSession,
  verifySession,
  type Role,
  type SessionUser,
} from "@/lib/session-token";

export { SESSION_COOKIE, homeForRole, sessionCookie, signSession, verifySession };
export type { Role, SessionUser };

export function authenticate(email: string, password: string): SessionUser | null {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@") || !password.trim()) return null;
  const user = getUserByEmail(normalized);
  if (!user) return null;
  if (user.status !== "Active") return null;
  if (!verifyPassword(password, user.password_hash)) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function registerAccount(input: { name: string; email: string; password: string; role: "student" | "teacher" }) {
  const existing = getUserByEmail(input.email);
  if (existing) {
    return { error: "An account with this email already exists." as const, user: null };
  }
  const created = createUser(input);
  return {
    error: null,
    user: { id: created.id, name: created.name, email: created.email, role: created.role as Role },
  };
}

export async function getSession(): Promise<SessionUser | null> {
  const { restoreLmsDatabase } = await import("@/lib/db-cloud");
  await restoreLmsDatabase();
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireSession(roles?: Role[]) {
  const user = await getSession();
  if (!user) {
    return {
      user: null as SessionUser | null,
      error: NextResponse.json({ error: "Sign in to continue." }, { status: 401 }),
    };
  }
  if (roles && !roles.includes(user.role)) {
    return {
      user,
      error: NextResponse.json({ error: "You do not have permission for this action." }, { status: 403 }),
    };
  }
  return { user, error: null };
}
