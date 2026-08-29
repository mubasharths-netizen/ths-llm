import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";

export const metadata = { title: "Tests" };

export default function TestsListPage() {
  return (
    <>
      <PageHeader title="Tests" description="Sit assessments in locked test mode." />
      <DataTable headers={["Test", "Course", "Duration", "Status", ""]}>
        <Tr>
          <Td>Python Midterm</Td>
          <Td>Python Fundamentals</Td>
          <Td>45 min</Td>
          <Td>Ready</Td>
          <Td>
            <Button href="/student/tests/python-midterm">Start</Button>
          </Td>
        </Tr>
      </DataTable>
    </>
  );
}
