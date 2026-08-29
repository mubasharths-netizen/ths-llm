import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { publicCourses } from "@/lib/db";

export const metadata = { title: "Courses" };

const categories = ["All", "Programming", "Web", "Cybersecurity", "Data", "AI"];

export default function CoursesPage() {
  const courses = publicCourses();
  return (
    <div className="marketing-wrap py-16">
      <h1 className="text-4xl font-bold tracking-tight">Courses</h1>
      <p className="mt-3 text-text-secondary">Professional IT courses for lab and classroom learning.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Badge key={c} tone={c === "All" ? "primary" : "outline"}>
            {c}
          </Badge>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <div className="mb-4 h-28 rounded-lg bg-canvas" />
            <Badge>{course.level}</Badge>
            <h2 className="mt-3 font-semibold">{course.title}</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {course.teacher} · {course.duration}
            </p>
            <p className="mt-3 text-sm text-text-secondary">{course.description}</p>
            <div className="mt-4">
              <Button href="/login" variant="secondary">
                View course
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
