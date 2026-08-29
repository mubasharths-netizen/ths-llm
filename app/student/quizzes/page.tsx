"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";

const questions = [
  { q: "What is the output of len('THS')?", options: ["2", "3", "4", "Error"], answer: 1 },
  { q: "Which keyword defines a function in Python?", options: ["func", "define", "def", "function"], answer: 2 },
  { q: "What does list.append() do?", options: ["Removes last item", "Adds an item", "Sorts the list", "Copies the list"], answer: 1 },
];

export default function QuizPage() {
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const current = questions[i];

  if (done) {
    return (
      <>
        <PageHeader title="Python Quiz 2" description="Submitted." />
        <Card>
          <p className="text-2xl font-semibold">Score 2 / 3</p>
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
      <PageHeader title="Python Quiz 2" description={`Question ${i + 1} of ${questions.length}`} />
      <ProgressBar value={((i + 1) / questions.length) * 100} />
      <Card className="mt-6">
        <h2 className="text-lg font-semibold">{current.q}</h2>
        <div className="mt-4 space-y-2">
          {current.options.map((opt, idx) => (
            <button
              key={opt}
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
              onClick={() => {
                setI((n) => n + 1);
                setChoice(null);
              }}
            >
              Next
            </Button>
          ) : (
            <Button type="button" onClick={() => setDone(true)}>
              Submit
            </Button>
          )}
        </div>
      </Card>
    </>
  );
}
