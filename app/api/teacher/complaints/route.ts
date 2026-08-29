import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { createComplaint, listComplaints, teacherAccessibleStudents } from "@/lib/conduct";

export const runtime = "nodejs";

export async function GET() {
  const { user, error } = await requireSession(["teacher"]);
  if (error) return error;
  return NextResponse.json({
    students: teacherAccessibleStudents(user!.id),
    complaints: listComplaints({ teacherId: user!.id }),
  });
}

export async function POST(request: Request) {
  const { user, error } = await requireSession(["teacher"]);
  if (error) return error;
  try {
    const body = (await request.json()) as {
      studentId?: string;
      category?: string;
      description?: string;
      notes?: string;
    };
    const studentId = String(body.studentId || "");
    const category = String(body.category || "").trim();
    const description = String(body.description || "").trim();
    if (!studentId || !category || !description) {
      return NextResponse.json({ error: "Student, category, and description are required." }, { status: 400 });
    }
    const result = createComplaint({
      teacherId: user!.id,
      teacherName: user!.name,
      studentId,
      category,
      description,
      notes: typeof body.notes === "string" ? body.notes.trim() : "",
    });
    if (result.error) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unable to submit complaint." }, { status: 400 });
  }
}
