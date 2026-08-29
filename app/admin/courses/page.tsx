import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { getCourse, listCourses } from "@/lib/db";
import type { CourseDetail } from "@/lib/db-types";

export const metadata = { title: "Admin courses" };

export default function AdminCoursesPage() {
  const courses: CourseDetail[] = listCourses()
    .map((row) => getCourse(String(row.id)))
    .filter((course): course is CourseDetail => course !== null);

  return (
    <>
      <PageHeader title="Courses" description="Manage categories, modules, lessons, and publish state." />
      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{course.title}</h2>
                <p className="text-sm text-text-secondary">
                  {course.teacher_name} · {course.category} · {course.lesson_count} lessons
                </p>
              </div>
              <Badge tone="teal">Published</Badge>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-text-secondary">
              {course.modules.map((mod) => (
                <li key={mod.id}>
                  {mod.title} — {mod.lessons.length} lessons
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary">Edit</Button>
              <Button variant="ghost">Unpublish</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
