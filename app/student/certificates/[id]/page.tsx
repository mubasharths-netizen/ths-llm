import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { ThsMark } from "@/components/ui/logo";

export const metadata = { title: "Certificate" };

export default function CertificateDetailPage() {
  return (
    <>
      <PageHeader
        title="Certificate"
        actions={
          <>
            <Button variant="secondary">Download PDF</Button>
            <Button>Verify authenticity</Button>
          </>
        }
      />
      <Card className="aspect-[1.5/1] text-center">
        <div className="mb-4 flex justify-center">
          <ThsMark size="md" />
        </div>
        <p className="text-xs tracking-[0.2em] text-text-muted uppercase">Taleem-o-Hunar Society</p>
        <h1 className="mt-6 text-3xl font-semibold">Certificate of Completion</h1>
        <p className="mt-6 text-text-secondary">This certifies that</p>
        <p className="mt-2 text-2xl font-semibold">Ayesha Khan</p>
        <p className="mt-4 text-text-secondary">has completed</p>
        <p className="mt-2 text-lg font-semibold">Python Fundamentals</p>
        <p className="mt-8 text-sm text-text-muted">12 Aug 2026 · ID THS-CERT-19402</p>
      </Card>
    </>
  );
}
