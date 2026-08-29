import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { getCourse, listCourses } from "@/lib/db";

export const metadata = { title: "Admin courses" };

export default function AdminCoursesPage() {
  const courses = listCourses().map((row) => getCourse(String(row.id))).filter(Boolean);

  return (
    <>
      <PageHeader title="Courses" description="Manage categories, modules, lessons, and publish state." />
      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={String(course!.id)}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{String(course!.title)}</h2>
                <p className="text-sm text-text-secondary">
                  {String(course!.teacher_name)} · {String(course!.category)} · {String(course!.lesson_count)} lessons
                </p>
              </div>
              <Badge tone="teal">Published</Badge>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-text-secondary">
              {course!.modules.map((mod) => (
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
