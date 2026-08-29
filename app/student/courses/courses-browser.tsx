"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import type { CourseCard } from "@/lib/db-types";

export function CoursesBrowser({ courses }: { courses: CourseCard[] }) {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("All");
  const filtered = useMemo(
    () =>
      courses.filter(
        (c) =>
          (level === "All" || c.level === level) &&
          c.title.toLowerCase().includes(q.toLowerCase()),
      ),
    [courses, q, level],
  );

  return (
    <>
      <PageHeader title="My Courses" description="Continue where you left off." />
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <input className="input md:max-w-sm" placeholder="Search courses" value={q} onChange={(e) => setQ(e.target.value)} />
        {["All", "Beginner", "Intermediate"].map((l) => (
          <button key={l} type="button" onClick={() => setLevel(l)}>
            <Badge tone={level === l ? "primary" : "outline"}>{l}</Badge>
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((course) => (
          <Card key={course.id}>
            <div className="mb-4 h-28 rounded-lg bg-primary-soft" />
            <Badge>{course.level}</Badge>
            <h2 className="mt-3 font-semibold">{course.title}</h2>
            <p className="text-sm text-text-secondary">{course.teacher}</p>
            <div className="mt-4">
              <ProgressBar value={course.progress} />
              <p className="mt-2 text-xs text-text-muted">{course.progress}%</p>
            </div>
            <div className="mt-4">
              <Button href={`/student/courses/${course.id}`}>Continue learning</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
