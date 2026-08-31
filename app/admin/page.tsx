import { Button } from "@/components/ui/button";
import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { UsersRoleCharts } from "@/components/admin/users-role-charts";
import { adminOverview, listAdminUsers } from "@/lib/db";

export const metadata = { title: "Admin dashboard" };

export default function AdminDashboardPage() {
  const overview = adminOverview();
  const users = listAdminUsers();
  const logs = overview.logs as Array<{
    actor: string;
    action: string;
    target: string;
    created_at: string;
  }>;

  return (
    <>
      <PageHeader
        title="Admin dashboard"
        description="Institute overview for THS LAB LMS."
        actions={
          <>
            <Button href="/admin/add/student">Add student</Button>
            <Button href="/admin/add/teacher" variant="secondary">
              Add teacher
            </Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total students" value={String(overview.students)} hint="Across all classes" />
        <StatCard label="Total teachers" value={String(overview.teachers)} />
        <StatCard label="Total courses" value={String(overview.courses)} />
        <StatCard label="Active users" value={String(overview.active)} />
        <StatCard label="Average score" value={String(overview.averageScore)} hint="From student records" />
        <StatCard label="System activity" value={String(logs.length)} hint="Recent audit events" />
      </div>
      <div className="mt-6">
        <UsersRoleCharts users={users} activeRole="All" showStats={false} />
      </div>
      <h2 className="mt-2 mb-4 text-xl font-semibold">Recent activity</h2>
      <DataTable headers={["Actor", "Action", "Target", "Time"]}>
        {logs.map((log) => (
          <Tr key={`${log.created_at}-${log.action}-${log.target}`}>
            <Td>{log.actor}</Td>
            <Td>{log.action}</Td>
            <Td>{log.target}</Td>
            <Td className="text-text-muted">{log.created_at}</Td>
          </Tr>
        ))}
      </DataTable>
      <Card className="mt-6">
        <h2 className="font-semibold">Quick links</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/admin/conduct" variant="secondary">
            Complaints & discipline
          </Button>
          <Button href="/admin/approvals" variant="secondary">
            Teacher approval
          </Button>
          <Button href="/admin/add" variant="secondary">
            Add account
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
