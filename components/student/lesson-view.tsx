"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

export function LessonView({
  courseId,
  title,
}: {
  courseId: string;
  title: string;
}) {
  const [done, setDone] = useState(false);
  const [tab, setTab] = useState<"notes" | "resources" | "code">("notes");

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm text-text-muted">Python Fundamentals</p>
      <h1 className="mt-1 text-[28px] font-semibold tracking-tight">{title}</h1>
      <div className="mt-6 aspect-video overflow-hidden rounded-2xl bg-[#0B1B4A] text-center text-sm text-blue-100">
        <div className="flex h-full items-center justify-center">Lesson video · 12:40</div>
      </div>
      <div className="mt-4 flex gap-2">
        {(["notes", "resources", "code"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className="capitalize">
            <Badge tone={tab === t ? "primary" : "outline"}>{t}</Badge>
          </button>
        ))}
      </div>
      <Card className="mt-4">
        {tab === "notes" ? (
          <p className="text-sm leading-7 text-text-secondary">
            A for-loop repeats a block for each item in a sequence. In Python, <code>for i in range(3)</code>{" "}
            yields 0, 1, and 2. Use it when the number of iterations is known.
          </p>
        ) : null}
        {tab === "resources" ? (
          <p className="text-sm text-text-secondary">Loops cheat sheet.pdf · Lab worksheet 04.pdf</p>
        ) : null}
        {tab === "code" ? (
          <pre className="overflow-x-auto rounded-lg bg-[#0F172A] p-4 text-sm text-slate-100">{`for i in range(3):
    print(i)
# 0
# 1
# 2`}</pre>
        ) : null}
      </Card>
      {done ? <div className="mt-4"><Alert tone="success">Lesson marked as completed.</Alert></div> : null}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button href={`/student/courses/${courseId}`} variant="secondary">
          Previous
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="teal" onClick={() => setDone(true)}>
            Mark as completed
          </Button>
          <Button href={`/student/courses/${courseId}/lessons/while-loops`}>Next</Button>
        </div>
      </div>
    </div>
  );
}
