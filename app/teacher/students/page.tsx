import { PageHeader } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { teacherRoster } from "@/lib/db";
import { currentTeacherId } from "@/lib/session-user";

export const metadata = { title: "Students" };

export default async function TeacherStudentsPage() {
  const students = teacherRoster(await currentTeacherId()).map((row) => ({ ...row }));
  return (
    <>
      <PageHeader title="Students" description="Students enrolled in your courses." />
      <DataTable headers={["Name", "Class", "Score"]}>
        {students.map((row) => (
          <Tr key={row.id}>
            <Td>{row.name}</Td>
            <Td>{row.class}</Td>
            <Td>{row.score}</Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
