import { Alert } from "@/components/ui/alert";
import { Card, PageHeader } from "@/components/ui/card";

export const metadata = { title: "Study planner" };

const days = ["Mon 25", "Tue 26", "Wed 27", "Thu 28", "Fri 29", "Sat 30", "Sun 31"];

export default function PlannerPage() {
  return (
    <>
      <PageHeader title="Study Planner" description="Daily plan, deadlines, and exam dates." />
      <Alert tone="info">AI recommendation: Revise Python Loops — weak topic.</Alert>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <h2 className="font-semibold">This week</h2>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
            {days.map((d, i) => (
              <div key={d} className={`rounded-lg border border-border p-2 ${i === 4 ? "bg-primary-soft" : ""}`}>
                {d}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Today</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li>Lesson: For Loops in Python</li>
            <li>Practice: Nested loops · Medium</li>
            <li>Deadline: Python Loops Lab · 2 Sep</li>
            <li>Exam: Python Midterm · 31 Aug</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
