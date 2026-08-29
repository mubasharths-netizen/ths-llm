import { Card, PageHeader } from "@/components/ui/card";
import { teacherCourses } from "@/lib/db";
import { currentTeacherId } from "@/lib/session-user";

export const metadata = { title: "Courses" };

export default async function TeacherCoursesPage() {
  const courses = teacherCourses(await currentTeacherId());
  return (
    <>
      <PageHeader title="Courses" description="Courses assigned to you." />
      {courses.length === 0 ? (
        <Card>
          <p className="text-sm text-text-secondary">No courses yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={String(course.id)}>
              <h2 className="font-semibold">{String(course.title)}</h2>
              <p className="mt-1 text-sm text-text-secondary">
                {String(course.category)} · {String(course.level)} · {String(course.duration)}
              </p>
              <p className="mt-3 text-sm text-text-secondary">{String(course.description)}</p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
