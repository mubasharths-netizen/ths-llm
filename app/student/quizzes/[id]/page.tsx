import { notFound } from "next/navigation";
import { TakeQuiz } from "@/components/student/take-quiz";
import { getPublishedAssessment } from "@/lib/teacher-content";

const demoQuestions = [
  { prompt: "What is the output of len('THS')?", options: ["2", "3", "4", "Error"], correct: 1 },
  { prompt: "Which keyword defines a function in Python?", options: ["func", "define", "def", "function"], correct: 2 },
  { prompt: "What does list.append() do?", options: ["Removes last item", "Adds an item", "Sorts the list", "Copies the list"], correct: 1 },
];

export const metadata = { title: "Quiz" };

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = getPublishedAssessment(id, "quiz");
  if (!quiz && id !== "python-quiz-2") notFound();
  return (
    <TakeQuiz
      title={quiz?.title ?? "Python Quiz 2"}
      questions={quiz?.questions.length ? quiz.questions : demoQuestions}
    />
  );
}
