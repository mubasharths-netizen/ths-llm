import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { getAssignmentForStudent } from "@/lib/db";
import { currentStudentId } from "@/lib/session-user";

export default async function AssignmentDetailPage({
  params,
}: PageProps<"/student/assignments/[id]">) {
  const { id } = await params;
  const userId = await currentStudentId();
  const item = getAssignmentForStudent(id, userId);
  if (!item) notFound();
  const status = item.status ?? "Not submitted";

  return (
    <>
      <PageHeader title={item.title} description={item.course} />
      <div className="mb-4">
        <Badge tone="hint">Deadline {item.deadline}</Badge>
      </div>
      <Card>
        <h2 className="font-semibold">Instructions</h2>
        <p className="mt-2 text-sm leading-7 text-text-secondary">{item.instructions}</p>
        <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
          Drag a file here or choose a file to upload
        </div>
        <div className="mt-4">
          <Button type="button">Upload submission</Button>
        </div>
      </Card>
      <Card className="mt-4">
        <h2 className="font-semibold">Teacher feedback</h2>
        {status === "Graded" && item.feedback ? (
          <p className="mt-2 text-sm text-text-secondary">{item.feedback}</p>
        ) : (
          <div className="mt-3">
            <Alert tone="info">No feedback yet. Status: {status}</Alert>
          </div>
        )}
      </Card>
    </>
  );
}
