import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { mistakes } from "@/lib/data";

export const metadata = { title: "My mistakes" };

export default function MistakesPage() {
  return (
    <>
      <PageHeader title="My Mistakes" description="Review, understand, then retry." />
      <div className="space-y-4">
        {mistakes.map((m) => (
          <Card key={m.id}>
            <Badge tone="hint">{m.topic}</Badge>
            <h2 className="mt-3 font-semibold">{m.question}</h2>
            <div className="mt-3 space-y-2">
              <Alert tone="error">Your answer: {m.studentAnswer}</Alert>
              <Alert tone="success">Correct answer: {m.correctAnswer}</Alert>
            </div>
            <p className="mt-3 text-sm text-text-secondary">{m.explanation}</p>
            <div className="mt-4">
              <Button href="/student/practice">Retry</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
