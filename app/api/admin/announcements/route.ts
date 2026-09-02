import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { activeStudents, listTeacherMessages, sendClassMessage } from "@/lib/conduct";

export const runtime = "nodejs";

export async function GET() {
  const { user, error } = await requireSession(["admin"]);
  if (error) return error;
  return NextResponse.json({
    students: activeStudents(),
    messages: listTeacherMessages(user!.id),
  });
}

export async function POST(request: Request) {
  const { user, error } = await requireSession(["admin"]);
  if (error) return error;
  try {
    const body = (await request.json()) as {
      subject?: string;
      body?: string;
      kind?: string;
      audience?: string;
      className?: string;
      studentIds?: string[];
    };
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const text = typeof body.body === "string" ? body.body.trim() : "";
    const kind = ["announcement", "assignment", "test", "feedback", "general"].includes(String(body.kind))
      ? String(body.kind)
      : "announcement";
    const audience =
      body.audience === "class" ||
      body.audience === "selected" ||
      body.audience === "one" ||
      body.audience === "all"
        ? body.audience
        : "all";
    if (!subject || !text) {
      return NextResponse.json({ error: "Subject and message are required." }, { status: 400 });
    }
    const result = sendClassMessage({
      teacherId: user!.id,
      teacherName: user!.name,
      senderRole: "admin",
      subject,
      body: text,
      kind,
      audience,
      className: typeof body.className === "string" ? body.className : "",
      studentIds: Array.isArray(body.studentIds) ? body.studentIds.map(String) : [],
    });
    if (result.error) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unable to send announcement." }, { status: 400 });
  }
}
