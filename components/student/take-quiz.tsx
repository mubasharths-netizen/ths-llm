"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import type { TeacherQuizQuestion } from "@/lib/teacher-content-shared";

export function TakeQuiz({ title, questions }: { title: string; questions: TeacherQuizQuestion[] }) {
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const current = questions[i];

  if (questions.length === 0) {
    return (
      <>
        <PageHeader title={title} />
        <Card>
          <p className="text-sm text-text-secondary">This quiz has no questions yet.</p>
        </Card>
      </>
    );
  }

  if (done) {
    return (
      <>
        <PageHeader title={title} description="Submitted." />
        <Card>
          <p className="text-2xl font-semibold">
            Score {score} / {questions.length}
          </p>
          <p className="mt-2 text-sm text-text-secondary">Review weak topics in My Mistakes.</p>
          <div className="mt-4">
            <Button href="/student">Return to dashboard</Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title={title} description={`Question ${i + 1} of ${questions.length}`} />
      <ProgressBar value={((i + 1) / questions.length) * 100} />
      <Card className="mt-6">
        <h2 className="text-lg font-semibold">{current.prompt}</h2>
        <div className="mt-4 space-y-2">
          {current.options.map((opt, idx) => (
            <button
              key={`${opt}-${idx}`}
              type="button"
              onClick={() => setChoice(idx)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${
                choice === idx ? "border-primary bg-primary-soft" : "border-border"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {i < questions.length - 1 ? (
            <Button
              type="button"
              disabled={choice === null}
              onClick={() => {
                if (choice === current.correct) setScore((n) => n + 1);
                setI((n) => n + 1);
                setChoice(null);
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              disabled={choice === null}
              onClick={() => {
                if (choice === current.correct) setScore((n) => n + 1);
                setDone(true);
              }}
            >
              Submit
            </Button>
          )}
        </div>
      </Card>
    </>
  );
}
