import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { studentMistakes } from "@/lib/db";
import { currentStudentId } from "@/lib/session-user";

export const metadata = { title: "My mistakes" };

export default async function MistakesPage() {
  const userId = await currentStudentId();
  const mistakes = studentMistakes(userId) as Array<{
    id: string;
    question: string;
    student_answer: string;
    correct_answer: string;
    explanation: string;
    topic: string;
  }>;

  return (
    <>
      <PageHeader title="My Mistakes" description="Review, understand, then retry." />
      <div className="space-y-4">
        {mistakes.map((m) => (
          <Card key={m.id}>
            <Badge tone="hint">{m.topic}</Badge>
            <h2 className="mt-3 font-semibold">{m.question}</h2>
            <div className="mt-3 space-y-2">
              <Alert tone="error">Your answer: {m.student_answer}</Alert>
              <Alert tone="success">Correct answer: {m.correct_answer}</Alert>
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
