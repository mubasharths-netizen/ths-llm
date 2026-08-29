import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { adminClasses } from "@/lib/admin-data";
import { courses } from "@/lib/data";

export const metadata = { title: "Results" };

export default function ResultsPage() {
  return (
    <>
      <PageHeader title="Results & analytics" description="Student, course, and class performance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Average score" value="81%" />
        <StatCard label="Completion" value="94%" />
        <StatCard label="Tests sat" value="1,204" />
        <StatCard label="At-risk students" value="11" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Course completion</h2>
          <div className="mt-4 space-y-4">
            {courses.map((course) => (
              <div key={course.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{course.title}</span>
                  <span className="text-text-muted">{course.progress}%</span>
                </div>
                <ProgressBar value={course.progress} />
              </div>
            ))}
          </div>
        </Card>
        <DataTable headers={["Class", "Average", "Students"]}>
          {adminClasses.map((row) => (
            <Tr key={row.id}>
              <Td>{row.name}</Td>
              <Td>{row.avg}%</Td>
              <Td>{row.students}</Td>
            </Tr>
          ))}
        </DataTable>
      </div>
    </>
  );
}
