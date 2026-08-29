import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { studentNotifications } from "@/lib/db";
import { listComplaints, listDiscipline, listStudentMessages } from "@/lib/conduct";
import { currentStudentId } from "@/lib/session-user";
import { cn } from "@/lib/cn";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const userId = await currentStudentId();
  const notifications = studentNotifications(userId);
  const messages = listStudentMessages(userId);
  const notices = [
    ...listComplaints({ studentId: userId, visibleOnly: true }).map((row) => ({
      id: row.id,
      title: "Official notice",
      body: row.admin_notes || "An official notice was added to your record.",
      at: row.updated_at,
    })),
    ...listDiscipline({ studentId: userId, visibleOnly: true }).map((row) => ({
      id: row.id,
      title: "Official notice",
      body: row.admin_notes || "An official notice was added to your record.",
      at: row.updated_at,
    })),
  ];

  return (
    <>
      <PageHeader title="Notifications" actions={<Button variant="secondary">Mark all read</Button>} />
      {messages.length > 0 ? (
        <div className="mb-6 space-y-3">
          <h2 className="text-lg font-semibold">Messages from teachers</h2>
          {messages.map((row) => (
            <Card key={row.id}>
              <Badge tone="outline">{row.kind}</Badge>
              <p className="mt-2 font-semibold">{row.subject}</p>
              <p className="mt-1 text-sm text-text-secondary">{row.body}</p>
              <p className="mt-2 text-xs text-text-muted">
                {row.teacher_name} · {row.created_at}
              </p>
            </Card>
          ))}
        </div>
      ) : null}
      {notices.length > 0 ? (
        <div className="mb-6 space-y-3">
          <h2 className="text-lg font-semibold">Official notices</h2>
          {notices.map((row) => (
            <Card key={row.id}>
              <p className="font-semibold">{row.title}</p>
              <p className="mt-1 text-sm text-text-secondary">{row.body}</p>
              <p className="mt-2 text-xs text-text-muted">{row.at}</p>
            </Card>
          ))}
        </div>
      ) : null}
      <Card padded={false}>
        {notifications.map((n) => (
          <div
            key={n.id}
            className={cn(
              "flex items-start justify-between gap-4 border-b border-border px-5 py-4 last:border-0",
              n.unread > 0 ? "bg-primary-soft/40" : false,
            )}
          >
            <div>
              <Badge tone="outline">{n.type}</Badge>
              <p className="mt-2 text-sm font-medium">{n.title}</p>
              <p className="text-xs text-text-muted">{n.created_at}</p>
            </div>
            {n.unread ? <span className="mt-2 h-2 w-2 rounded-full bg-primary" /> : null}
          </div>
        ))}
      </Card>
    </>
  );
}
