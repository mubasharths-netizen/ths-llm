import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { BarChart, DonutChart, HBarList } from "@/components/charts/charts";
import { adminOverview, classStats, courseProgressAverages } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin analytics" };

export default function AdminAnalyticsPage() {
  const overview = adminOverview();
  const courses = courseProgressAverages();
  const classes = classStats();
  const classBars = classes.map((row) => ({
    label: row.name,
    value: Number(row.avg) || 0,
    hint: `${row.avg} avg · ${row.students} students`,
  }));
  const classShare = classes.map((row) => ({
    label: row.name,
    value: Number(row.students) || 0,
  }));

  return (
    <>
      <PageHeader title="Analytics" description="Institute performance with live graphs." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={String(overview.students)} />
        <StatCard label="Teachers" value={String(overview.teachers)} />
        <StatCard label="Courses" value={String(overview.courses)} />
        <StatCard label="Average score" value={String(overview.averageScore)} hint="Across active students" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Class average scores</h2>
          <p className="mt-1 text-sm text-text-secondary">Average student score for each class.</p>
          <BarChart items={classBars} />
        </Card>
        <Card>
          <h2 className="font-semibold">Students by class</h2>
          <p className="mt-1 text-sm text-text-secondary">How the institute is split across classes.</p>
          <DonutChart items={classShare} centerLabel="students" />
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-semibold">Course progress</h2>
        <p className="mt-1 text-sm text-text-secondary">Average enrolment progress per course.</p>
        <HBarList items={courses.map((course) => ({ label: course.title, value: Math.round(course.progress) }))} maxValue={100} />
      </Card>
    </>
  );
}
