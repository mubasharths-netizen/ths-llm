import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ClassMessage } from "@/lib/conduct";

const kindLabels: Record<string, string> = {
  announcement: "Announcement",
  assignment: "Assignment reminder",
  test: "Test reminder",
  feedback: "Feedback",
  general: "Message",
};

const kindTones: Record<string, "primary" | "teal" | "hint" | "muted" | "outline"> = {
  announcement: "primary",
  assignment: "hint",
  test: "teal",
  feedback: "muted",
  general: "outline",
};

function senderRoleLabel(role: string) {
  if (role === "admin") return "Admin";
  if (role === "teacher") return "Teacher";
  return role;
}

export function AnnouncementsFeed({
  messages,
  empty = "No announcements yet. When a teacher or admin posts one, it will appear here.",
}: {
  messages: ClassMessage[];
  empty?: string;
}) {
  if (messages.length === 0) {
    return (
      <Card>
        <p className="font-semibold">No announcements yet</p>
        <p className="mt-1 text-sm text-text-secondary">{empty}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((row) => (
        <Card key={row.id}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={kindTones[row.kind] ?? "outline"}>{kindLabels[row.kind] ?? row.kind}</Badge>
            <Badge tone="outline">{senderRoleLabel(row.sender_role)}</Badge>
          </div>
          <p className="mt-3 text-lg font-semibold">{row.subject}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-text-secondary">{row.body}</p>
          <p className="mt-3 text-xs text-text-muted">
            From {row.teacher_name} · {senderRoleLabel(row.sender_role)} · {row.created_at}
          </p>
        </Card>
      ))}
    </div>
  );
}
