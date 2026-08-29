import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { studentAssignments } from "@/lib/db";
import { currentStudentId } from "@/lib/session-user";

export const metadata = { title: "Assignments" };

export default async function AssignmentsPage() {
  const userId = await currentStudentId();
  const assignments = studentAssignments(userId) as Array<{
    id: string;
    title: string;
    deadline: string;
    course: string;
    status: string | null;
  }>;

  return (
    <>
      <PageHeader title="Assignments" />
      <DataTable headers={["Assignment", "Course", "Deadline", "Status", ""]}>
        {assignments.map((a) => {
          const status = a.status ?? "Not submitted";
          return (
            <Tr key={a.id}>
              <Td>{a.title}</Td>
              <Td>{a.course}</Td>
              <Td>{a.deadline}</Td>
              <Td>
                <Badge tone={status === "Graded" ? "teal" : status === "Submitted" ? "primary" : "hint"}>
                  {status}
                </Badge>
              </Td>
              <Td>
                <Button href={`/student/assignments/${a.id}`} variant="secondary">
                  Open
                </Button>
              </Td>
            </Tr>
          );
        })}
      </DataTable>
    </>
  );
}
