import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { listPublishedAssessments } from "@/lib/teacher-content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quizzes" };

const demo = {
  id: "python-quiz-2",
  title: "Python Quiz 2",
  course_title: "Python Fundamentals",
  duration: "10 min",
};

export default function QuizzesListPage() {
  const quizzes = listPublishedAssessments("quiz");
  const rows = quizzes.length > 0 ? quizzes : [demo];

  return (
    <>
      <PageHeader title="Quizzes" description="Short checks posted by your teachers." />
      <DataTable headers={["Quiz", "Course", "Duration", ""]}>
        {rows.map((row) => (
          <Tr key={row.id}>
            <Td>{row.title}</Td>
            <Td>{row.course_title || "—"}</Td>
            <Td>{row.duration || "—"}</Td>
            <Td>
              <Button href={`/student/quizzes/${row.id}`}>Start</Button>
            </Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
