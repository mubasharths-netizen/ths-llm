import { PageHeader } from "@/components/ui/card";
import { studentCourseCards, getCourse } from "@/lib/db";
import { currentStudentId } from "@/lib/session-user";
import Link from "next/link";

export const metadata = { title: "Lessons" };

export default async function LessonsPage() {
  const userId = await currentStudentId();
  const courses = studentCourseCards(userId);
  const lessons = courses.flatMap((course) => {
    const detail = getCourse(course.id);
    if (!detail) return [];
    return detail.modules.flatMap((mod) =>
      (mod.lessons as Array<{ id: string; title: string; duration: string }>).map((lesson) => ({
        ...lesson,
        courseId: course.id,
      })),
    );
  });

  return (
    <>
      <PageHeader title="Lessons" description="Lessons from your enrolled courses." />
      <div className="card overflow-hidden">
        {lessons.length === 0 ? (
          <p className="px-4 py-6 text-sm text-text-secondary">No lessons yet.</p>
        ) : (
          lessons.map((lesson) => (
            <Link
              key={`${lesson.courseId}-${lesson.id}`}
              href={`/student/courses/${lesson.courseId}/lessons/${lesson.id}`}
              className="flex items-center justify-between border-b border-border px-4 py-4 last:border-0 hover:bg-surface-muted"
            >
              <span className="text-sm font-medium">{lesson.title}</span>
              <span className="text-xs text-text-muted">{lesson.duration}</span>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
