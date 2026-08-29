import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { getCourseForStudent } from "@/lib/db";
import { currentStudentId } from "@/lib/session-user";

export default async function CourseDetailPage({ params }: PageProps<"/student/courses/[id]">) {
  const { id } = await params;
  const userId = await currentStudentId();
  const course = getCourseForStudent(id, userId);
  if (!course) notFound();
  const nextLesson =
    course.modules.flatMap((mod) => mod.lessons).find((lesson) => !lesson.done) ??
    course.modules[0]?.lessons[0];

  return (
    <>
      <div className="mb-6 h-40 rounded-2xl bg-primary p-6 text-white">
        <p className="text-sm text-white/80">{course.category}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{course.title}</h1>
        <p className="mt-2 text-sm text-white/80">{course.teacher}</p>
      </div>
      <PageHeader title="Course overview" description={course.description} />
      <div className="mb-6 flex items-center gap-3">
        <Badge>{course.level}</Badge>
        <span className="text-sm text-text-secondary">
          {course.lessons} lessons · {course.duration}
        </span>
      </div>
      <ProgressBar value={course.progress} />
      <p className="mt-2 mb-8 text-sm text-text-muted">{course.progress}% complete</p>

      <div className="space-y-4">
        {course.modules.map((mod) => (
          <Card key={mod.id}>
            <h2 className="font-semibold">{mod.title}</h2>
            <ul className="mt-3 divide-y divide-border">
              {mod.lessons.map((lesson) => (
                <li key={lesson.id} className="flex items-center justify-between py-3 text-sm">
                  <Link
                    href={`/student/courses/${course.id}/lessons/${lesson.id}`}
                    className="font-medium text-primary"
                  >
                    {lesson.title}
                  </Link>
                  <span className="text-text-muted">
                    {lesson.duration}
                    {lesson.done ? " · Completed" : ""}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <h2 className="font-semibold">Resources</h2>
        <p className="mt-2 text-sm text-text-secondary">Course worksheet.pdf · Topic cheat sheet.pdf</p>
        {nextLesson ? (
          <div className="mt-4">
            <Button href={`/student/courses/${course.id}/lessons/${nextLesson.id}`}>Continue to lesson</Button>
          </div>
        ) : null}
      </Card>
    </>
  );
}
