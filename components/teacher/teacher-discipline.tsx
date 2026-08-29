"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import type { DisciplineRow, RosterStudent } from "@/lib/conduct";

const levels = [
  { id: "warning", label: "Warning", hint: "First recorded warning. No punishment applied." },
  { id: "second_warning", label: "Second warning", hint: "Repeat concern. Still a record, not a punishment." },
  { id: "incident", label: "Classroom incident", hint: "Document what happened in class." },
  { id: "escalate", label: "Escalate to Admin", hint: "Recommend action. Admin reviews and decides." },
];

function levelTone(level: string) {
  if (level === "escalate") return "error" as const;
  if (level === "second_warning" || level === "incident") return "hint" as const;
  return "primary" as const;
}

export function TeacherDiscipline({ students, reports }: { students: RosterStudent[]; reports: DisciplineRow[] }) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [level, setLevel] = useState("warning");
  const [description, setDescription] = useState("");
  const [recommendedAction, setRecommendedAction] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    setOk("");
    const res = await fetch("/api/teacher/discipline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, level, description, recommendedAction }),
    });
    const data = (await res.json()) as { error?: string };
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Unable to save.");
      return;
    }
    setOk(
      level === "escalate"
        ? "Report sent to Admin for review. No punishment is applied until Admin decides."
        : "Record saved. Serious action still requires Admin review.",
    );
    setDescription("");
    setRecommendedAction("");
    router.refresh();
  }

  return (
    <>
      <PageHeader
        title="Discipline reports"
        description="Warning → Report → Admin review → Action. Teachers do not apply serious punishment directly."
      />
      <div className="mb-4">
        <Alert tone="info">
          Flow: Teacher submits a warning or report. Admin reviews. Only then is an official decision recorded.
        </Alert>
      </div>
      {error ? (
        <div className="mb-4">
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}
      {ok ? (
        <div className="mb-4">
          <Alert tone="success">{ok}</Alert>
        </div>
      ) : null}
      <Card className="mb-6 max-w-2xl">
        <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
          <div>
            <label className="label" htmlFor="student">
              Student
            </label>
            <select id="student" className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              {students.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name} · {row.class}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            {levels.map((item) => (
              <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3">
                <input type="radio" name="level" checked={level === item.id} onChange={() => setLevel(item.id)} />
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-text-muted">{item.hint}</span>
                </span>
              </label>
            ))}
          </div>
          <div>
            <label className="label" htmlFor="description">
              What happened
            </label>
            <textarea
              id="description"
              className="input h-28 py-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          {level === "escalate" ? (
            <div>
              <label className="label" htmlFor="recommend">
                Recommended action for Admin
              </label>
              <textarea
                id="recommend"
                className="input h-20 py-3"
                value={recommendedAction}
                onChange={(e) => setRecommendedAction(e.target.value)}
                placeholder="Recommend counselling / parent meeting / official warning letter"
              />
            </div>
          ) : null}
          <Button type="submit" disabled={pending || students.length === 0}>
            {pending ? "Saving…" : level === "escalate" ? "Submit to Admin" : "Record warning / incident"}
          </Button>
        </form>
      </Card>
      <div className="space-y-3">
        {reports.map((row) => (
          <Card key={row.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{row.student_name}</p>
                <p className="text-sm text-text-secondary">{row.class_name}</p>
              </div>
              <div className="flex gap-2">
                <Badge tone={levelTone(row.level)}>{row.level.replace("_", " ")}</Badge>
                <Badge tone="outline">{row.status}</Badge>
              </div>
            </div>
            <p className="mt-3 text-sm">{row.description}</p>
            <p className="mt-2 text-xs text-text-muted">{row.created_at}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
