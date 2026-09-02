import { teacherAccessibleStudents } from "@/lib/conduct";
import { currentTeacherId } from "@/lib/session-user";
import type { TeacherContentKind } from "@/lib/teacher-content-shared";
import { listTeacherContent, listTeacherCourses } from "@/lib/teacher-content";
import { TeacherContentManager } from "@/components/teacher/teacher-content-manager";

export async function TeacherContentPage({
  kind,
  searchParams,
}: {
  kind: TeacherContentKind;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const teacherId = await currentTeacherId();
  const query = searchParams ? await searchParams : {};
  const raw = query.new;
  const isNew = Array.isArray(raw) ? raw.includes("1") : raw === "1";
  return (
    <TeacherContentManager
      kind={kind}
      courses={listTeacherCourses(teacherId)}
      students={teacherAccessibleStudents(teacherId)}
      items={listTeacherContent(teacherId, kind)}
      defaultOpen={isNew}
    />
  );
}
