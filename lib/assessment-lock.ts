import { cookies } from "next/headers";

export type AssessmentKind = "test" | "exam";

const COOKIE = "ths_assessment_lock";
const memory = new Map<string, { kind: AssessmentKind; until: number }>();

export async function startAssessmentLock(userId: string, kind: AssessmentKind) {
  memory.set(userId, { kind, until: Date.now() + 3 * 60 * 60 * 1000 });
  const jar = await cookies();
  jar.set(COOKIE, kind, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 3 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });
}

export function releaseAssessmentLock(userId: string) {
  memory.delete(userId);
}

export async function clearAssessmentLock(userId: string) {
  memory.delete(userId);
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getAssessmentLock(userId: string): Promise<AssessmentKind | null> {
  const live = memory.get(userId);
  if (live && live.until > Date.now()) return live.kind;
  if (live) memory.delete(userId);
  const jar = await cookies();
  const kind = jar.get(COOKIE)?.value;
  if (kind === "test" || kind === "exam") return kind;
  return null;
}
