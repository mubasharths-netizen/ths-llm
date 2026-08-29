"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import type { ComplaintRow, RosterStudent } from "@/lib/conduct";

const categories = ["Student behavior", "Academic misconduct", "Attendance issues", "Class discipline", "Other concerns"];

function tone(status: string) {
  if (status === "Resolved" || status === "Closed") return "teal" as const;
  if (status === "Under Review") return "primary" as const;
  return "hint" as const;
}

export function TeacherComplaints({ students, complaints }: { students: RosterStudent[]; complaints: ComplaintRow[] }) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [pending, setPending] = useState(false);
  const selected = students.find((row) => row.id === studentId);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    setOk("");
    const res = await fetch("/api/teacher/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, category, description, notes }),
    });
    const data = (await res.json()) as { error?: string };
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Unable to submit.");
      return;
    }
    setOk("Complaint submitted. Admin will review it.");
    setDescription("");
    setNotes("");
    router.refresh();
  }

  return (
    <>
      <PageHeader
        title="Complaints"
        description="Submit a professional shikayat for Admin review. Students do not see this unless Admin releases an official notice."
      />
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
              Student name
            </label>
            <select id="student" className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              {students.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Class</label>
            <input className="input" value={selected?.class || ""} readOnly />
          </div>
          <div>
            <label className="label" htmlFor="category">
              Complaint category
            </label>
            <select id="category" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="input h-28 py-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="notes">
              Supporting notes
            </label>
            <textarea id="notes" className="input h-20 py-3" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button type="submit" disabled={pending || students.length === 0}>
            {pending ? "Submitting…" : "Submit complaint"}
          </Button>
        </form>
      </Card>
      <div className="space-y-3">
        {complaints.map((row) => (
          <Card key={row.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{row.student_name}</p>
                <p className="text-sm text-text-secondary">
                  {row.class_name} · {row.category}
                </p>
              </div>
              <Badge tone={tone(row.status)}>{row.status}</Badge>
            </div>
            <p className="mt-3 text-sm">{row.description}</p>
            <p className="mt-2 text-xs text-text-muted">{row.created_at}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
