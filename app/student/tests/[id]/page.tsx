"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ProgressBar } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

const questions = [
  { q: "What does range(3) produce?", options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3"] },
  { q: "Which statement exits a loop immediately?", options: ["pass", "continue", "break"] },
];

export default function TestPage() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [seconds, setSeconds] = useState(42 * 60 + 18);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-3xl">
      <Alert tone="hint">TEST MODE ACTIVE · Practice, hints, and AI Tutor are locked.</Alert>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-[28px] font-semibold tracking-tight">Python Midterm</h1>
        <p className="font-mono text-lg">{mm}:{ss}</p>
      </div>
      <p className="mt-2 text-sm text-text-muted">
        Question {i + 1} of {questions.length}
      </p>
      <div className="mt-3">
        <ProgressBar value={((i + 1) / questions.length) * 100} />
      </div>
      <Card className="mt-6">
        <h2 className="text-lg font-semibold">{questions[i].q}</h2>
        <div className="mt-4 space-y-2">
          {questions[i].options.map((opt) => (
            <label key={opt} className="flex w-full rounded-lg border border-border px-4 py-3 text-sm">
              <input type="radio" name="q" className="mr-3" />
              {opt}
            </label>
          ))}
        </div>
      </Card>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {["Practice", "Hints", "AI Tutor"].map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text-muted">
            <Lock size={14} />
            {item} · Locked
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <Button type="button" variant="secondary" onClick={() => setI(0)}>
          Question 1
        </Button>
        <Button type="button" onClick={() => router.push("/student/tests/python-midterm/result")}>
          Submit test
        </Button>
      </div>
    </div>
  );
}
