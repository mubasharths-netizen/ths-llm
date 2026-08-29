"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

const issued = [
  { id: "THS-CERT-19402", student: "Ayesha Khan", course: "Python Fundamentals", date: "12 Aug 2026", status: "Valid" },
  { id: "THS-CERT-18811", student: "Hassan Ali", course: "Web Development", date: "4 Aug 2026", status: "Valid" },
];

export default function AdminCertificatesPage() {
  const [rows, setRows] = useState(issued);
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<string | null>(null);

  return (
    <>
      <PageHeader title="Certificates" description="Issue, revoke, and verify certificate IDs." />
      <Card className="mb-6">
        <h2 className="font-semibold">Verify certificate</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input className="input" placeholder="THS-CERT-19402" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button
            type="button"
            onClick={() => {
              const match = rows.find((r) => r.id.toLowerCase() === query.trim().toLowerCase());
              setFound(match ? `${match.id} is ${match.status} — ${match.student}` : "Certificate not found.");
            }}
          >
            Verify
          </Button>
        </div>
        {found ? (
          <div className="mt-3">
            <Alert tone={found.includes("not found") ? "error" : "success"}>{found}</Alert>
          </div>
        ) : null}
      </Card>
      <div className="space-y-3">
        {rows.map((row) => (
          <Card key={row.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{row.student}</p>
              <p className="text-sm text-text-secondary">
                {row.course} · {row.id} · {row.date}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={row.status === "Valid" ? "teal" : "error"}>{row.status}</Badge>
              <Button
                type="button"
                variant="danger"
                onClick={() => setRows((current) => current.map((item) => (item.id === row.id ? { ...item, status: "Revoked" } : item)))}
              >
                Revoke
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
