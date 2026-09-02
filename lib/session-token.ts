import { createHmac, timingSafeEqual } from "node:crypto";

export type Role = "student" | "teacher" | "admin";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export const SESSION_COOKIE = "ths_session";
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

export function sessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: TTL_SEC,
    secure: process.env.NODE_ENV === "production",
  };
}

export function homeForRole(role: Role) {
  if (role === "admin") return "/admin";
  if (role === "teacher") return "/teacher";
  return "/student";
}
