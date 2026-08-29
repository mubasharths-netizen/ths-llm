"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

type PendingTeacher = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  qualification: string | null;
};

export function ApprovalsList({ initialPending }: { initialPending: PendingTeacher[] }) {
  const [pending, setPending] = useState(initialPending);
  const [note, setNote] = useState("");

  async function decide(id: string, action: "approve" | "reject", name: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (!res.ok) return;
    setPending((rows) => rows.filter((row) => row.id !== id));
    setNote(`${name} ${action === "approve" ? "approved" : "rejected"}.`);
  }

  return (
    <>
      <PageHeader title="Teacher approval" description="Review pending faculty accounts before they can teach." />
      {note ? (
        <div className="mb-4">
          <Alert tone="success">{note}</Alert>
        </div>
      ) : null}
      {pending.length === 0 ? (
        <Card>
          <p className="text-text-secondary">No pending teacher applications.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pending.map((teacher) => (
            <Card key={teacher.id}>
              <p className="font-semibold">{teacher.name}</p>
              <p className="text-sm text-text-secondary">{teacher.email}</p>
              <p className="mt-3 text-sm">Subject: {teacher.subject ?? "Not specified"}</p>
              <p className="text-sm text-text-muted">{teacher.qualification ?? ""}</p>
              <div className="mt-4 flex gap-2">
                <Button type="button" onClick={() => void decide(teacher.id, "approve", teacher.name)}>
                  Approve
                </Button>
                <Button type="button" variant="danger" onClick={() => void decide(teacher.id, "reject", teacher.name)}>
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
