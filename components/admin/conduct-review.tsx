"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import type { ComplaintRow, DisciplineRow } from "@/lib/conduct";

function CaseCard({
  type,
  id,
  title,
  meta,
  body,
  status,
  extra,
}: {
  type: "complaint" | "discipline";
  id: string;
  title: string;
  meta: string;
  body: string;
  status: string;
  extra?: string;
}) {
  const router = useRouter();
  const [statusValue, setStatusValue] = useState(status);
  const [notes, setNotes] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    setError("");
    const res = await fetch("/api/admin/conduct", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        id,
        status: statusValue,
        adminNotes: notes,
        visibleToStudent: visible,
      }),
    });
    const data = (await res.json()) as { error?: string };
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Unable to save.");
      return;
    }
    router.refresh();
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-text-secondary">{meta}</p>
        </div>
        <Badge tone={status === "Resolved" || status === "Approved" || status === "Closed" ? "teal" : "hint"}>
          {status}
        </Badge>
      </div>
      <p className="mt-3 text-sm">{body}</p>
      {extra ? <p className="mt-2 text-sm text-text-muted">{extra}</p> : null}
      {error ? (
        <div className="mt-3">
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <select className="input" value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
          <option>Pending</option>
          <option>Under Review</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
          Release official notice to this student only
        </label>
      </div>
      <textarea
        className="input mt-3 h-20 py-3"
        placeholder="Official Admin notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="mt-3">
        <Button type="button" disabled={pending} onClick={() => void save()}>
          {pending ? "Saving…" : "Save decision"}
        </Button>
      </div>
    </Card>
  );
}

export function AdminConductReview({
  complaints,
  reports,
}: {
  complaints: ComplaintRow[];
  reports: DisciplineRow[];
}) {
  return (
    <>
      <PageHeader
        title="Complaints & discipline"
        description="Review teacher reports. Serious action is decided here, not by the teacher directly."
      />
      <h2 className="mb-3 text-xl font-semibold">Complaints</h2>
      <div className="mb-8 space-y-3">
        {complaints.length === 0 ? (
          <Card>
            <p className="text-sm text-text-secondary">No complaints.</p>
          </Card>
        ) : (
          complaints.map((row) => (
            <CaseCard
              key={row.id}
              type="complaint"
              id={row.id}
              title={row.student_name}
              meta={`${row.class_name} · ${row.category} · filed by ${row.teacher_name} · ${row.created_at}`}
              body={row.description}
              status={row.status}
              extra={row.notes || undefined}
            />
          ))
        )}
      </div>
      <h2 className="mb-3 text-xl font-semibold">Discipline reports</h2>
      <div className="space-y-3">
        {reports.length === 0 ? (
          <Card>
            <p className="text-sm text-text-secondary">No discipline reports.</p>
          </Card>
        ) : (
          reports.map((row) => (
            <CaseCard
              key={row.id}
              type="discipline"
              id={row.id}
              title={row.student_name}
              meta={`${row.class_name} · ${row.level.replace("_", " ")} · ${row.teacher_name} · ${row.created_at}`}
              body={row.description}
              status={row.status}
              extra={row.recommended_action ? `Recommended: ${row.recommended_action}` : undefined}
            />
          ))
        )}
      </div>
    </>
  );
}
