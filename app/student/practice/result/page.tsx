import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Practice result" };

export default function PracticeResultPage() {
  return (
    <>
      <PageHeader title="Practice result" />
      <Card>
        <Alert tone="error">Incorrect</Alert>
        <p className="mt-4 text-sm">Your answer: 1, 2, 3</p>
        <p className="mt-2 text-sm">Correct answer: 0, 1, 2</p>
        <p className="mt-4 text-sm text-text-secondary">
          range(3) starts at 0 and stops before 3, so the values are 0, 1, and 2.
        </p>
        <div className="mt-4">
          <Badge tone="hint">Loops</Badge>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button href="/student/practice">Next question</Button>
          <Button href="/student/practice" variant="secondary">
            Retry
          </Button>
          <Button href="/student/mistakes" variant="ghost">
            Review in My Mistakes
          </Button>
        </div>
      </Card>
    </>
  );
}
