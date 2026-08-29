import { PageHeader, StatCard } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { adminClasses } from "@/lib/admin-data";

export const metadata = { title: "Classes" };

export default function AdminClassesPage() {
  return (
    <>
      <PageHeader title="Classes" description="Cohorts, enrollment, and class averages." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Classes" value={String(adminClasses.length)} />
        <StatCard label="Students" value={String(adminClasses.reduce((n, c) => n + c.students, 0))} />
        <StatCard label="Avg score" value="79" />
      </div>
      <DataTable headers={["Class", "Teacher", "Students", "Average"]}>
        {adminClasses.map((row) => (
          <Tr key={row.id}>
            <Td>{row.name}</Td>
            <Td>{row.teacher}</Td>
            <Td>{row.students}</Td>
            <Td>{row.avg}%</Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
