import { TeacherMessages } from "@/components/teacher/teacher-messages";
import { listTeacherMessages, teacherAccessibleStudents } from "@/lib/conduct";
import { currentTeacherId } from "@/lib/session-user";

export const metadata = { title: "Announcements" };

export default async function TeacherAnnouncementsPage() {
  const teacherId = await currentTeacherId();
  return (
    <TeacherMessages
      title="Announcements"
      description="Class-wide announcements, assignment reminders, and test reminders."
      students={teacherAccessibleStudents(teacherId)}
      messages={listTeacherMessages(teacherId)}
      defaultKind="announcement"
      submitLabel="Send announcement"
    />
  );
}
