import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { student } from "@/lib/data";

export const metadata = { title: "Total score" };

export default function ScorePage() {
  return (
    <>
      <PageHeader title="Total Score" />
      <Card className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.06em] text-text-muted">Total score</p>
        <p className="mt-2 text-5xl font-semibold tracking-tight">
          {student.score} / {student.maxScore}
        </p>
        <p className="mt-2 text-text-secondary">Overall 85%</p>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Practice" value="180" />
        <StatCard label="Quiz" value="160" />
        <StatCard label="Assignment" value="150" />
        <StatCard label="Test" value="220" />
        <StatCard label="Exam" value="140" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Strong topics</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="teal">Variables</Badge>
            <Badge tone="teal">HTML</Badge>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Recommended revision</h2>
          <p className="mt-2 text-sm text-text-secondary">Loops, Recursion, Joins</p>
        </Card>
      </div>
    </>
  );
}
