import { Card, PageHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";

export const metadata = { title: "Progress" };

const weeks = [40, 55, 48, 70, 62, 80, 74];
const subjects = [
  ["Python", 72],
  ["Web", 41],
  ["SQL", 55],
  ["Cybersecurity", 18],
] as const;

export default function ProgressPage() {
  return (
    <>
      <PageHeader title="Progress" description="Course completion and weekly activity." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Course completion</h2>
          <div className="mt-4 space-y-4">
            {subjects.map(([name, v]) => (
              <div key={name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="text-text-muted">{v}%</span>
                </div>
                <ProgressBar value={v} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Weekly activity</h2>
          <div className="mt-6 flex h-40 items-end gap-3">
            {weeks.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t bg-primary" style={{ height: `${h}%` }} />
                <span className="text-[11px] text-text-muted">W{i + 1}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
