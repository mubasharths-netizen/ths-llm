import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { assignments } from "@/lib/data";

export const metadata = { title: "Assignments" };

export default function AssignmentsPage() {
  return (
    <>
      <PageHeader title="Assignments" />
      <DataTable headers={["Assignment", "Course", "Deadline", "Status", ""]}>
        {assignments.map((a) => (
          <Tr key={a.id}>
            <Td>{a.title}</Td>
            <Td>{a.course}</Td>
            <Td>{a.deadline}</Td>
            <Td>
              <Badge tone={a.status === "Graded" ? "teal" : a.status === "Submitted" ? "primary" : "hint"}>
                {a.status}
              </Badge>
            </Td>
            <Td>
              <Button href={`/student/assignments/${a.id}`} variant="secondary">
                Open
              </Button>
            </Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
