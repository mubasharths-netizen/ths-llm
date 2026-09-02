import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import {
  createTeacherContent,
  isTeacherContentKind,
  listTeacherContent,
  listTeacherCourses,
  type TeacherContentKind,
  type TeacherQuizQuestion,
} from "@/lib/teacher-content";
import { teacherAccessibleStudents } from "@/lib/conduct";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { user, error } = await requireSession(["teacher"]);
  if (error) return error;
  const kind = new URL(request.url).searchParams.get("kind") || "";
  if (!isTeacherContentKind(kind)) {
    return NextResponse.json({ error: "Unknown content type." }, { status: 400 });
  }
  return NextResponse.json({
    items: listTeacherContent(user!.id, kind),
    courses: listTeacherCourses(user!.id),
    students: teacherAccessibleStudents(user!.id),
  });
}

export async function POST(request: Request) {
  const { user, error } = await requireSession(["teacher"]);
  if (error) return error;
  try {
    const body = (await request.json()) as {
      kind?: string;
      title?: string;
      body?: string;
      subject?: string;
      topic?: string;
      difficulty?: string;
      courseId?: string;
      className?: string;
      studentId?: string;
      duration?: string;
      deadline?: string;
      options?: string[];
      correct?: number;
      hint?: string;
      explanation?: string;
      score?: number;
      maxScore?: number;
      questions?: TeacherQuizQuestion[];
    };
    const kind = String(body.kind || "");
    if (!isTeacherContentKind(kind)) {
      return NextResponse.json({ error: "Unknown content type." }, { status: 400 });
    }
    const result = createTeacherContent({
      teacherId: user!.id,
      teacherName: user!.name,
      kind: kind as TeacherContentKind,
      title: body.title,
      body: body.body,
      subject: body.subject,
      topic: body.topic,
      difficulty: body.difficulty,
      courseId: body.courseId,
      className: body.className,
      studentId: body.studentId,
      duration: body.duration,
      deadline: body.deadline,
      options: Array.isArray(body.options) ? body.options.map(String) : [],
      correct: body.correct,
      hint: body.hint,
      explanation: body.explanation,
      score: body.score,
      maxScore: body.maxScore,
      questions: body.questions,
    });
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    const { persistLmsDatabase } = await import("@/lib/db-cloud");
    await persistLmsDatabase();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unable to save." }, { status: 400 });
  }
}
