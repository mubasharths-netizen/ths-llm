"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

const question = {
  prompt: "What values does range(3) produce in Python?",
  options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3, 2, 1"],
  correct: 1,
  hint: "range(n) starts at 0 and stops before n.",
  explanation: "range(3) yields 0, 1, and 2. The stop value is exclusive.",
};

export default function PracticePage() {
  const [topic, setTopic] = useState("Loops");
  const [diff, setDiff] = useState("Easy");
  const [choice, setChoice] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<"ok" | "bad" | null>(null);

  return (
    <>
      <PageHeader title="Practice" description="Encouraging practice. Hints and AI help are available." />
      <div className="mb-4 flex flex-wrap gap-3">
        <select className="input max-w-xs" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option>Loops</option>
          <option>Functions</option>
          <option>Joins</option>
        </select>
        {["Easy", "Medium", "Hard"].map((d) => (
          <button key={d} type="button" onClick={() => setDiff(d)}>
            <Badge tone={diff === d ? "teal" : "outline"}>{d}</Badge>
          </button>
        ))}
      </div>
      <Card>
        <p className="text-xs text-text-muted">
          {topic} · {diff}
        </p>
        <h2 className="mt-2 text-lg font-semibold">{question.prompt}</h2>
        <div className="mt-4 space-y-2">
          {question.options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              onClick={() => setChoice(i)}
              className={`flex w-full rounded-lg border px-4 py-3 text-left text-sm ${
                choice === i ? "border-primary bg-primary-soft" : "border-border"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {showHint ? (
          <div className="mt-4">
            <Alert tone="hint">Hint: {question.hint}</Alert>
          </div>
        ) : null}
        {result === "ok" ? (
          <div className="mt-4">
            <Alert tone="success">Correct. {question.explanation}</Alert>
          </div>
        ) : null}
        {result === "bad" ? (
          <div className="mt-4">
            <Alert tone="error">Incorrect. Review the explanation, then try again.</Alert>
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={() => setResult(choice === question.correct ? "ok" : "bad")}>
            Submit
          </Button>
          <Button type="button" variant="secondary" onClick={() => setShowHint(true)}>
            Hint
          </Button>
          <Button
            href={`/student/ai-tutor?prompt=${encodeURIComponent(
              `I am practising ${topic} (${diff}). Question: ${question.prompt}. ${
                choice !== null ? `I chose: ${question.options[choice]}.` : "I have not answered yet."
              } Help me understand this. Follow the tutor answer mode.`,
            )}`}
            variant="ai"
          >
            Ask AI Tutor
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setChoice(null);
              setResult(null);
              setShowHint(false);
            }}
          >
            Try again
          </Button>
        </div>
      </Card>
    </>
  );
}
