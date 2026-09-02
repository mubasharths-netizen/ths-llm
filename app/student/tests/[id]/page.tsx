import { LockedTest } from "@/components/student/locked-test";
import { getPublishedAssessment } from "@/lib/teacher-content";

const demoQuestions = [
  { prompt: "What does range(3) produce?", options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3"], correct: 1 },
  { prompt: "Which statement exits a loop immediately?", options: ["pass", "continue", "break"], correct: 2 },
];

function durationSeconds(value: string | null | undefined) {
  const n = Number.parseInt(value || "45", 10);
  return (Number.isFinite(n) ? n : 45) * 60;
}

export const metadata = { title: "Test" };

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = getPublishedAssessment(id, "test");
  const questions = test?.questions.length ? test.questions : demoQuestions;
  return (
    <LockedTest
      id={id}
      title={test?.title ?? "Python Midterm"}
      questions={questions}
      seconds={durationSeconds(test?.duration)}
    />
  );
}
