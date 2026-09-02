"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ProgressBar } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import type { TeacherQuizQuestion } from "@/lib/teacher-content-shared";

export function LockedTest({
  id,
  title,
  questions,
  seconds: initialSeconds,
}: {
  id: string;
  title: string;
  questions: TeacherQuizQuestion[];
  seconds: number;
}) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    void fetch("/api/assessments/lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", kind: "test" }),
    });
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const current = questions[i];

  async function submitTest() {
    await fetch("/api/assessments/lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "end" }),
    });
    router.push(`/student/tests/${id}/result`);
  }

  if (!current) {
    return (
      <Card>
        <p className="text-sm text-text-secondary">This test has no questions yet.</p>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Alert tone="hint">TEST MODE ACTIVE · Practice, hints, and AI Tutor are locked.</Alert>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-[28px] font-semibold tracking-tight">{title}</h1>
        <p className="font-mono text-lg">
          {mm}:{ss}
        </p>
      </div>
      <p className="mt-2 text-sm text-text-muted">
        Question {i + 1} of {questions.length}
      </p>
      <div className="mt-3">
        <ProgressBar value={((i + 1) / questions.length) * 100} />
      </div>
      <Card className="mt-6">
        <h2 className="text-lg font-semibold">{current.prompt}</h2>
        <div className="mt-4 space-y-2">
          {current.options.map((opt, idx) => (
            <label key={`${opt}-${idx}`} className="flex w-full rounded-lg border border-border px-4 py-3 text-sm">
              <input
                type="radio"
                name={`q-${i}`}
                className="mr-3"
                checked={choice === idx}
                onChange={() => setChoice(idx)}
              />
              {opt}
            </label>
          ))}
        </div>
      </Card>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {["Practice", "Hints", "AI Tutor"].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text-muted"
          >
            <Lock size={14} />
            {item} · Locked
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setI((n) => Math.max(0, n - 1));
            setChoice(null);
          }}
        >
          Previous
        </Button>
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
          <Button type="button" onClick={() => void submitTest()}>
            Submit test
          </Button>
        )}
      </div>
    </div>
  );
}
