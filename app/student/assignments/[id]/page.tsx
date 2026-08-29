import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { assignments } from "@/lib/data";

export default async function AssignmentDetailPage({
  params,
}: PageProps<"/student/assignments/[id]">) {
  const { id } = await params;
  const item = assignments.find((a) => a.id === id);
  if (!item) notFound();

  return (
    <>
      <PageHeader title={item.title} description={item.course} />
      <div className="mb-4">
        <Badge tone="hint">Deadline {item.deadline}</Badge>
      </div>
      <Card>
        <h2 className="font-semibold">Instructions</h2>
        <p className="mt-2 text-sm leading-7 text-text-secondary">
          Complete the lab exercises on loops. Upload a single .py file. Late submissions are marked after the
          deadline.
        </p>
        <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
          Drag a file here or choose a file to upload
        </div>
        <div className="mt-4">
          <Button type="button">Upload submission</Button>
        </div>
      </Card>
      <Card className="mt-4">
        <h2 className="font-semibold">Teacher feedback</h2>
        {item.status === "Graded" ? (
          <p className="mt-2 text-sm text-text-secondary">Clear queries. Revise JOIN order before the next lab.</p>
        ) : (
          <div className="mt-3">
            <Alert tone="info">No feedback yet. Status: {item.status}</Alert>
          </div>
        )}
      </Card>
    </>
  );
}
