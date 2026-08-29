import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { clearAssessmentLock, getAssessmentLock, startAssessmentLock } from "@/lib/assessment-lock";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
}

export async function GET() {
  const { user, error } = await requireSession(["student", "teacher", "admin"]);
  if (error) return error;
  if (!user) return unauthorized();
  const lock = await getAssessmentLock(user.id);
  return Response.json({ active: Boolean(lock), kind: lock });
}

export async function POST(request: Request) {
  const { user, error } = await requireSession(["student"]);
  if (error) return error;
  if (!user) return unauthorized();
  const body = (await request.json()) as { action?: string; kind?: string };
  if (body.action === "end") {
    await clearAssessmentLock(user.id);
    return Response.json({ active: false });
  }
  if (body.action !== "start" || (body.kind !== "test" && body.kind !== "exam")) {
    return Response.json({ error: "Invalid assessment lock request." }, { status: 400 });
  }
  await startAssessmentLock(user.id, body.kind);
  return Response.json({ active: true, kind: body.kind });
}
