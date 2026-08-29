import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export type Role = "student" | "teacher" | "admin";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

const COOKIE = "ths_session";
const TTL_SEC = 60 * 60 * 8;

function secret() {
  return process.env.JWT_SECRET?.trim() || "ths-lab-lms-session-secret";
}

function b64urlJson(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export function signSession(user: SessionUser) {
  const header = b64urlJson({ alg: "HS256", typ: "JWT" });
  const now = Math.floor(Date.now() / 1000);
  const payload = b64urlJson({ ...user, iat: now, exp: now + TTL_SEC });
  const unsigned = `${header}.${payload}`;
  const sig = createHmac("sha256", secret()).update(unsigned).digest("base64url");
  return `${unsigned}.${sig}`;
}

export function verifySession(token: string): SessionUser | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts;
  const expected = createHmac("sha256", secret()).update(`${header}.${payload}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser & {
      exp?: number;
    };
    if (!data?.id || !data.email || !data.role) return null;
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return null;
    if (data.role !== "student" && data.role !== "teacher" && data.role !== "admin") return null;
    return { id: data.id, name: data.name, email: data.email, role: data.role };
  } catch {
    return null;
  }
}

export function authenticate(email: string, password: string): SessionUser | null {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@") || !password.trim()) return null;
  const user = getUserByEmail(normalized);
  if (!user) return null;
  if (user.status !== "Active") return null;
  const valid = verifyPassword(password, user.password_hash);
  if (!valid) return null;
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

export function sessionCookie(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: TTL_SEC,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
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
