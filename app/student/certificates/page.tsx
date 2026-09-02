import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { ThsMark } from "@/components/ui/logo";

export const metadata = { title: "Certificates" };

export default function CertificatesPage() {
  return (
    <>
      <PageHeader title="Certificates" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex h-36 items-center justify-center rounded-lg border border-border bg-canvas">
            <ThsMark size="md" />
          </div>
          <h2 className="mt-4 font-semibold">Python Fundamentals</h2>
          <p className="text-sm text-text-secondary">Completed 12 Aug 2026 · ID THS-CERT-19402</p>
          <div className="mt-4">
            <Button href="/student/certificates/ths-cert-19402">View certificate</Button>
          </div>
        </Card>
      </div>
    </>
  );
}
