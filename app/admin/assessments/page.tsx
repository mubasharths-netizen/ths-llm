import { Badge } from "@/components/ui/badge";
import { Card, PageHeader } from "@/components/ui/card";
import { assessments } from "@/lib/admin-data";

export const metadata = { title: "Assessments" };

export default function AssessmentsPage() {
  return (
    <>
      <PageHeader title="Assessments" description="Practice, quizzes, tests, exams, and assignments." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assessments.map((item) => (
          <Card key={item.type}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{item.type}</h2>
              <Badge tone="primary">{item.count}</Badge>
            </div>
            <p className="mt-2 text-sm text-text-secondary">{item.published} published</p>
          </Card>
        ))}
      </div>
    </>
  );
}
