import Link from "next/link";
import { PageHeader } from "@/components/ui/card";
import { pythonModules } from "@/lib/data";

export const metadata = { title: "Lessons" };

export default function LessonsPage() {
  return (
    <>
      <PageHeader title="Lessons" description="Open a lesson from Python Fundamentals." />
      <div className="card overflow-hidden">
        {pythonModules.flatMap((m) =>
          m.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/student/courses/python-fundamentals/lessons/${lesson.id}`}
              className="flex items-center justify-between border-b border-border px-4 py-4 last:border-0 hover:bg-surface-muted"
            >
              <span className="text-sm font-medium">{lesson.title}</span>
              <span className="text-xs text-text-muted">{lesson.duration}</span>
            </Link>
          )),
        )}
      </div>
    </>
  );
}
