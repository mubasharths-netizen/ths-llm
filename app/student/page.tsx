import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { studentDashboard } from "@/lib/db";
import { currentStudentId } from "@/lib/session-user";

export const metadata = { title: "Student dashboard" };

export default async function StudentDashboard() {
  const userId = await currentStudentId();
  const { user, enrollments, rank, totalStudents } = studentDashboard(userId);
  const name = user?.name.split(" ")[0] ?? "Student";
  const score = user?.score ?? 0;
  const inProgress = enrollments.filter((course) => course.progress > 0 && course.progress < 100).length;

  return (
    <>
      <PageHeader
        title={`Good afternoon, ${name}`}
        description={`${user?.class_name ?? "BSIT"} · Keep the loop: learn, practice, test, improve.`}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total score" value={`${score} / 1000`} hint={`${Math.round(score / 10)}%`} />
        <StatCard label="Class rank" value={`#${rank}`} hint={`of ${totalStudents} students`} />
        <StatCard label="Courses in progress" value={String(inProgress)} />
        <StatCard label="Upcoming tests" value="2" hint="Python Midterm in 2 days" />
      </div>

      <h2 className="mt-8 mb-4 text-xl font-semibold">Current courses</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {enrollments.slice(0, 3).map((course) => (
          <Card key={course.id}>
            <Badge>{course.level}</Badge>
            <h3 className="mt-3 font-semibold">{course.title}</h3>
            <p className="text-sm text-text-secondary">{course.teacher_name}</p>
            <div className="mt-4">
              <ProgressBar value={course.progress} />
              <p className="mt-2 text-xs text-text-muted">{course.progress}% complete</p>
            </div>
            <div className="mt-4">
              <Button href={`/student/courses/${course.id}`} variant="secondary">
                Continue learning
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Strong topics</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Variables", "HTML", "SQL SELECT"].map((t) => (
              <Badge key={t} tone="teal">
                {t}
              </Badge>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Weak topics</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Loops", "Recursion", "Joins"].map((t) => (
              <Badge key={t} tone="hint">
                {t}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <h2 className="mt-8 mb-4 text-xl font-semibold">Recommended learning</h2>
      <Card>
        <ul className="space-y-3 text-sm">
          <li>
            <Link href="/student/courses/python-fundamentals/lessons/for-loops" className="font-medium text-primary">
              Revise For Loops in Python
            </Link>
            <span className="text-text-muted"> — weak topic</span>
          </li>
          <li>
            <Link href="/student/practice" className="font-medium text-primary">
              Practice nested loops
            </Link>
          </li>
          <li>
            <Link href="/student/ai-tutor" className="font-medium text-primary">
              Ask THS AI Tutor about recursion
            </Link>
          </li>
        </ul>
      </Card>

      <h2 className="mt-8 mb-4 text-xl font-semibold">Upcoming tests</h2>
      <DataTable headers={["Test", "Course", "Date", "Action"]}>
        <Tr>
          <Td>Python Midterm</Td>
          <Td>Python Fundamentals</Td>
          <Td>31 Aug 2026</Td>
          <Td>
            <Button href="/student/tests/python-midterm" variant="secondary">
              Open
            </Button>
          </Td>
        </Tr>
        <Tr>
          <Td>SQL Quiz 3</Td>
          <Td>SQL & Databases</Td>
          <Td>4 Sep 2026</Td>
          <Td>
            <Button href="/student/quizzes" variant="secondary">
              Open
            </Button>
          </Td>
        </Tr>
      </DataTable>
    </>
  );
}
