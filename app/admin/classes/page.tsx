import { PageHeader, StatCard } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { classStats } from "@/lib/db";

export const metadata = { title: "Classes" };

export default function AdminClassesPage() {
  const classes = classStats();
  const studentCount = classes.reduce((n, row) => n + row.students, 0);
  const avg = classes.length
    ? Math.round(classes.reduce((n, row) => n + row.avg * row.students, 0) / studentCount)
    : 0;

  return (
    <>
      <PageHeader title="Classes" description="Cohorts, enrollment, and class averages." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Classes" value={String(classes.length)} />
        <StatCard label="Students" value={String(studentCount)} />
        <StatCard label="Avg score" value={String(avg)} />
      </div>
      <DataTable headers={["Class", "Students", "Average"]}>
        {classes.map((row) => (
          <Tr key={row.name}>
            <Td>{row.name}</Td>
            <Td>{row.students}</Td>
            <Td>{row.avg}%</Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
