import { Card, PageHeader } from "@/components/ui/card";

export function TeacherSection({ title, description }: { title: string; description: string }) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Card>
        <p className="text-sm text-text-secondary">No items yet. Content for this teacher section will appear here.</p>
      </Card>
    </>
  );
}
