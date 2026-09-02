import { PageHeader } from "@/components/ui/card";
import { AnnouncementsFeed } from "@/components/student/announcements-feed";
import { listStudentAnnouncements } from "@/lib/conduct";
import { currentStudentId } from "@/lib/session-user";

export const metadata = { title: "Announcements" };

export default async function StudentAnnouncementsPage() {
  const userId = await currentStudentId();
  const messages = listStudentAnnouncements(userId);

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Notices, reminders, and messages sent to you by teachers and admins."
      />
      <AnnouncementsFeed messages={messages} />
    </>
  );
}
