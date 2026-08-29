import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { createDisciplineReport, listDiscipline, teacherAccessibleStudents } from "@/lib/conduct";

export const runtime = "nodejs";

const levels = new Set(["warning", "second_warning", "incident", "escalate"]);

export async function GET() {
  const { user, error } = await requireSession(["teacher"]);
  if (error) return error;
  return NextResponse.json({
    students: teacherAccessibleStudents(user!.id),
    reports: listDiscipline({ teacherId: user!.id }),
  });
}

export async function POST(request: Request) {
  const { user, error } = await requireSession(["teacher"]);
  if (error) return error;
  try {
    const body = (await request.json()) as {
      studentId?: string;
      level?: string;
      description?: string;
      recommendedAction?: string;
    };
    const studentId = String(body.studentId || "");
    const level = String(body.level || "");
    const description = String(body.description || "").trim();
    if (!studentId || !levels.has(level) || !description) {
      return NextResponse.json({ error: "Student, level, and description are required." }, { status: 400 });
    }
    const result = createDisciplineReport({
      teacherId: user!.id,
      teacherName: user!.name,
      studentId,
      level,
      description,
      recommendedAction: typeof body.recommendedAction === "string" ? body.recommendedAction.trim() : "",
    });
    if (result.error) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unable to record the report." }, { status: 400 });
  }
}
