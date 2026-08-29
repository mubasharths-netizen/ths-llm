import { Button } from "@/components/ui/button";
import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { teacherCourses, teacherRoster } from "@/lib/db";
import { currentTeacherId } from "@/lib/session-user";

export const metadata = { title: "Teacher dashboard" };

export default async function TeacherDashboardPage() {
  const teacherId = await currentTeacherId();
  const courses = teacherCourses(teacherId);
  const students = teacherRoster(teacherId);

  return (
    <>
      <PageHeader
        title="Teacher dashboard"
        description="Your courses, classes, and students — separate from the student and admin apps."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Courses" value={String(courses.length)} />
        <StatCard label="Students" value={String(students.length)} />
        <StatCard label="Published" value={String(courses.filter((c) => Number(c.published) === 1).length)} />
      </div>
      <Card className="mt-6">
        <h2 className="font-semibold">Communication & student care</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Message students, file a complaint, or record a warning. Serious discipline is decided by Admin.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/teacher/messages">Messages / Email</Button>
          <Button href="/teacher/announcements" variant="secondary">
            Announcements
          </Button>
          <Button href="/teacher/complaints" variant="secondary">
            Complaints
          </Button>
          <Button href="/teacher/discipline" variant="secondary">
            Discipline reports
          </Button>
        </div>
      </Card>
      <h2 className="mt-8 mb-4 text-xl font-semibold">Your courses</h2>
      {courses.length === 0 ? (
        <Card>
          <p className="text-sm text-text-secondary">No courses assigned yet. An administrator can assign courses to your account.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <Card key={String(course.id)}>
              <h3 className="font-semibold">{String(course.title)}</h3>
              <p className="mt-1 text-sm text-text-secondary">
                {String(course.level)} · {String(course.lesson_count)} lessons
              </p>
              <div className="mt-4">
                <Button href="/teacher/courses" variant="secondary">
                  Open courses
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
