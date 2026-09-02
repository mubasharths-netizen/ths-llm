"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { DataTable, Td, Tr } from "@/components/ui/table";
import type { ClassMessage, RosterStudent } from "@/lib/conduct";

const kinds = [
  { id: "announcement", label: "Announcement" },
  { id: "assignment", label: "Assignment reminder" },
  { id: "test", label: "Test reminder" },
  { id: "feedback", label: "Performance feedback" },
  { id: "general", label: "General message" },
];

type Audience = "one" | "selected" | "class" | "all";

export function TeacherMessages({
  title,
  description,
  students,
  messages,
  defaultKind = "general",
  apiPath = "/api/teacher/messages",
  allowInstituteWide = false,
  submitLabel = "Send message",
}: {
  title: string;
  description: string;
  students: RosterStudent[];
  messages: ClassMessage[];
  defaultKind?: string;
  apiPath?: string;
  allowInstituteWide?: boolean;
  submitLabel?: string;
}) {
  const router = useRouter();
  const classes = useMemo(() => [...new Set(students.map((row) => row.class).filter(Boolean))], [students]);
  const [audience, setAudience] = useState<Audience>(allowInstituteWide ? "all" : "one");
  const [kind, setKind] = useState(defaultKind);
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const [className, setClassName] = useState(classes[0] ?? "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [pending, setPending] = useState(false);

  function studentIds() {
    if (audience === "all") return students.map((row) => row.id);
    if (audience === "one") return studentId ? [studentId] : [];
    if (audience === "selected") return selected;
    return students.filter((row) => row.class === className).map((row) => row.id);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    setOk("");
    const res = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body, kind, audience, className, studentIds: studentIds() }),
    });
    const data = (await res.json()) as { error?: string; count?: number };
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Unable to send.");
      return;
    }
    setOk(`Message sent to ${data.count} student${data.count === 1 ? "" : "s"}.`);
    setSubject("");
    setBody("");
    router.refresh();
  }

  return (
    <>
      <PageHeader title={title} description={description} />
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
      <Card className="mb-6">
        <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="kind">
                Type
              </label>
              <select id="kind" className="input" value={kind} onChange={(e) => setKind(e.target.value)}>
                {kinds.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="audience">
                Send to
              </label>
              <select
                id="audience"
                className="input"
                value={audience}
                onChange={(e) => setAudience(e.target.value as Audience)}
              >
                {allowInstituteWide ? <option value="all">Entire institute</option> : null}
                <option value="one">Individual student</option>
                <option value="selected">Selected students</option>
                <option value="class">Entire class</option>
              </select>
            </div>
          </div>
          {audience === "one" ? (
            <div>
              <label className="label" htmlFor="student">
                Student
              </label>
              <select id="student" className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                {students.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name} · {row.class || "No class"}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {audience === "class" ? (
            <div>
              <label className="label" htmlFor="className">
                Class
              </label>
              <select id="className" className="input" value={className} onChange={(e) => setClassName(e.target.value)}>
                {classes.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {audience === "selected" ? (
            <div className="space-y-2">
              <p className="label">Selected students</p>
              {students.map((row) => (
                <label key={row.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() =>
                      setSelected((current) =>
                        current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id],
                      )
                    }
                  />
                  {row.name} · {row.class}
                </label>
              ))}
            </div>
          ) : null}
          <div>
            <label className="label" htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              className="input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Upcoming JavaScript Test"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="body">
              Message
            </label>
            <textarea
              id="body"
              className="input h-32 py-3"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Please prepare for the upcoming JavaScript test."
              required
            />
          </div>
          <Button type="submit" disabled={pending || students.length === 0}>
            {pending ? "Sending…" : submitLabel}
          </Button>
        </form>
      </Card>
      <DataTable headers={["Subject", "Type", "Audience", "Recipients", "Date"]}>
        {messages.map((row) => (
          <Tr key={row.id}>
            <Td>{row.subject}</Td>
            <Td>
              <Badge tone="outline">{row.kind}</Badge>
            </Td>
            <Td>{row.audience}</Td>
            <Td>{row.recipients}</Td>
            <Td className="text-text-muted">{row.created_at}</Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
