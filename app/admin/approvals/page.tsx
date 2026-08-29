"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { pendingTeachers } from "@/lib/data";

export default function ApprovalsPage() {
  const [pending, setPending] = useState(pendingTeachers);
  const [note, setNote] = useState("");

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
              <p className="mt-3 text-sm">Subject: {teacher.subject}</p>
              <p className="text-sm text-text-muted">{teacher.qualification}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setPending((rows) => rows.filter((row) => row.id !== teacher.id));
                    setNote(`${teacher.name} approved.`);
                  }}
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => {
                    setPending((rows) => rows.filter((row) => row.id !== teacher.id));
                    setNote(`${teacher.name} rejected.`);
                  }}
                >
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
