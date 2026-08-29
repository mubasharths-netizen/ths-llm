import { Button } from "@/components/ui/button";
import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { adminUsers, auditLogs } from "@/lib/admin-data";
import { courses } from "@/lib/data";

export const metadata = { title: "Admin dashboard" };

export default function AdminDashboardPage() {
  const students = adminUsers.filter((u) => u.role === "Student").length;
  const teachers = adminUsers.filter((u) => u.role === "Teacher").length;
  const active = adminUsers.filter((u) => u.status === "Active").length;

  return (
    <>
      <PageHeader
        title="Admin dashboard"
        description="Institute overview for THS LAB LMS."
        actions={<Button href="/admin/ai-settings">AI Settings</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total students" value={String(students)} hint="Across all classes" />
        <StatCard label="Total teachers" value={String(teachers)} />
        <StatCard label="Total courses" value={String(courses.length)} />
        <StatCard label="Active users" value={String(active)} />
        <StatCard label="Average score" value="81" hint="Last 30 days" />
        <StatCard label="System activity" value="24" hint="Events today" />
      </div>
      <h2 className="mt-8 mb-4 text-xl font-semibold">Recent activity</h2>
      <DataTable headers={["Actor", "Action", "Target", "Time"]}>
        {auditLogs.map((log) => (
          <Tr key={`${log.time}-${log.action}`}>
            <Td>{log.actor}</Td>
            <Td>{log.action}</Td>
            <Td>{log.target}</Td>
            <Td className="text-text-muted">{log.time}</Td>
          </Tr>
        ))}
      </DataTable>
      <Card className="mt-6">
        <h2 className="font-semibold">Quick links</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/admin/approvals" variant="secondary">
            Teacher approval
          </Button>
          <Button href="/admin/users" variant="secondary">
            Manage users
          </Button>
          <Button href="/admin/security" variant="secondary">
            Security
          </Button>
        </div>
      </Card>
    </>
  );
}
