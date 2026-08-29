import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { studentNotifications } from "@/lib/db";
import { currentStudentId } from "@/lib/session-user";
import { cn } from "@/lib/cn";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const userId = await currentStudentId();
  const notifications = studentNotifications(userId) as Array<{
    id: string;
    type: string;
    title: string;
    unread: number;
    created_at: string;
  }>;

  return (
    <>
      <PageHeader title="Notifications" actions={<Button variant="secondary">Mark all read</Button>} />
      <Card padded={false}>
        {notifications.map((n) => (
          <div
            key={n.id}
            className={cn(
              "flex items-start justify-between gap-4 border-b border-border px-5 py-4 last:border-0",
              n.unread && "bg-primary-soft/40",
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
