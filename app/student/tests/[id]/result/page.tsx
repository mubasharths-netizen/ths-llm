import { Button } from "@/components/ui/button";
import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Test result" };

export default function TestResultPage() {
  return (
    <>
      <PageHeader title="Test result" description="Python Midterm" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Score" value="78 / 100" />
        <StatCard label="Percentage" value="78%" />
        <StatCard label="Correct" value="14" hint="Incorrect 4" />
        <StatCard label="Time used" value="38:12" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Strong topics</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="teal">Variables</Badge>
            <Badge tone="teal">Functions</Badge>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Weak topics</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="hint">Nested loops</Badge>
            <Badge tone="hint">Range</Badge>
          </div>
        </Card>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button href="/student/mistakes">Review results</Button>
        <Button href="/student" variant="secondary">
          Return to dashboard
        </Button>
      </div>
    </>
  );
}
