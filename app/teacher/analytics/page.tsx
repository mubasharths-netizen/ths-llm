import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { BarChart, DonutChart, HBarList, LineChart } from "@/components/charts/charts";
import { teacherAnalytics } from "@/lib/teacher-analytics";
import { currentTeacherId } from "@/lib/session-user";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics" };

export default async function TeacherAnalyticsPage() {
  const data = teacherAnalytics(await currentTeacherId());

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Live graphs for your classes, scores, courses, and the content you have added."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={String(data.studentCount)} hint="In your roster" />
        <StatCard label="Average score" value={String(data.averageScore)} hint="Out of 1000" />
        <StatCard
          label="Recorded grades"
          value={data.gradeAverage == null ? "—" : `${data.gradeAverage}%`}
          hint="From grades you added"
        />
        <StatCard label="Published courses" value={`${data.publishedCount} / ${data.courseCount}`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Score bands</h2>
          <p className="mt-1 text-sm text-text-secondary">How many students sit in each performance range.</p>
          <BarChart items={data.scoreBands} />
        </Card>
        <Card>
          <h2 className="font-semibold">Content mix</h2>
          <p className="mt-1 text-sm text-text-secondary">Lessons, practice, quizzes, tests, and assignments you added.</p>
          <DonutChart items={data.contentMix} centerLabel="items" />
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Class averages</h2>
          <p className="mt-1 text-sm text-text-secondary">Average student score by class.</p>
          <HBarList items={data.classAverages} maxValue={1000} />
        </Card>
        <Card>
          <h2 className="font-semibold">Course progress</h2>
          <p className="mt-1 text-sm text-text-secondary">Average enrolment progress on your courses.</p>
          <HBarList items={data.courseProgress} maxValue={100} />
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-semibold">Top student scores</h2>
        <p className="mt-1 text-sm text-text-secondary">Highest scores in your roster, shown as a performance curve.</p>
        <LineChart items={data.topScores} maxValue={1000} />
        {data.topScores.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-muted">
            {data.topScores.map((row) => (
              <span key={row.label}>
                {row.label} · {row.value}
              </span>
            ))}
          </div>
        ) : null}
      </Card>
    </>
  );
}
