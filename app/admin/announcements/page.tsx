import { TeacherMessages } from "@/components/teacher/teacher-messages";
import { activeStudents, listTeacherMessages } from "@/lib/conduct";
import { currentAdminId } from "@/lib/session-user";

export const metadata = { title: "Announcements" };

export default async function AdminAnnouncementsPage() {
  const adminId = await currentAdminId();
  return (
    <TeacherMessages
      title="Announcements"
      description="Send announcements to every student, a class, or selected students."
      students={activeStudents()}
      messages={listTeacherMessages(adminId)}
      defaultKind="announcement"
      apiPath="/api/admin/announcements"
      allowInstituteWide
      submitLabel="Send announcement"
    />
  );
}
