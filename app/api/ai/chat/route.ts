import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { getAssessmentLock } from "@/lib/assessment-lock";
import { parseAiChatBody } from "@/lib/ai-request";
import { rateLimit } from "@/lib/rate-limit";
import { runTutorChat } from "@/lib/ai-tutor";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { user, error } = await requireSession(["student", "teacher", "admin"]);
  if (error) return error;
  if (!user) return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });

  if (user.role === "student") {
    const lock = await getAssessmentLock(user.id);
    if (lock) {
      return NextResponse.json(
        { error: "AI Tutor is unavailable while your test is active.", reply: "" },
        { status: 403 },
      );
    }
  }

  const limited = rateLimit(`ai:${user.id}`, 20, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many AI requests. Wait a minute and try again.", reply: "" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limited.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body.", reply: "" }, { status: 400 });
  }

  const parsed = parseAiChatBody(raw);
  if (parsed.error || !parsed.data) {
    const status = parsed.error?.includes("unavailable") ? 403 : 400;
    return NextResponse.json({ error: parsed.error, reply: "" }, { status });
  }

  const result = await runTutorChat(parsed.data);
  const payload = {
    reply: result.reply,
    error: result.error,
    remainingToday: result.status.remainingToday,
  };
  return NextResponse.json(payload, { status: result.error ? 400 : 200 });
}
