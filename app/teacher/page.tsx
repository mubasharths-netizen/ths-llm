import { Button } from "@/components/ui/button";
import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { teacherCourses, teacherRoster } from "@/lib/db";
import { currentTeacherId } from "@/lib/session-user";
import { CONTENT_PAGES } from "@/lib/teacher-content-shared";

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
        <h2 className="font-semibold">Add content</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Each button opens that section with a form so you can add a new item for students.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.values(CONTENT_PAGES).map((item) => (
            <Button key={item.href} href={`${item.href}?new=1`} variant="secondary">
              {item.addLabel}
            </Button>
          ))}
        </div>
      </Card>
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
          <p className="text-sm text-text-secondary">No courses yet. Add a course, then add lessons and assignments to it.</p>
          <div className="mt-4">
            <Button href="/teacher/courses?new=1">Add course</Button>
          </div>
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
