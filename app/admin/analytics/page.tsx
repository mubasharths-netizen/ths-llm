import { Card, PageHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { courseProgressAverages } from "@/lib/db";

export const metadata = { title: "Admin analytics" };

export default function AdminAnalyticsPage() {
  const courses = courseProgressAverages();
  return (
    <>
      <PageHeader title="Analytics" description="Institute performance over time." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Course progress</h2>
          <div className="mt-4 space-y-4">
            {courses.map((course) => (
              <div key={course.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{course.title}</span>
                  <span className="text-text-muted">{Math.round(course.progress)}%</span>
                </div>
                <ProgressBar value={course.progress} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Weak topics (institute)</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li>Loops — 38% miss rate</li>
            <li>SQL Joins — 31% miss rate</li>
            <li>Recursion — 29% miss rate</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
