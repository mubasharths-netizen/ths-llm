import { TeacherMessages } from "@/components/teacher/teacher-messages";
import { listTeacherMessages, teacherAccessibleStudents } from "@/lib/conduct";
import { currentTeacherId } from "@/lib/session-user";

export const metadata = { title: "Messages" };

export default async function TeacherMessagesPage() {
  const teacherId = await currentTeacherId();
  return (
    <TeacherMessages
      title="Messages / Email"
      description="Send a message to one student, selected students, or an entire class."
      students={teacherAccessibleStudents(teacherId)}
      messages={listTeacherMessages(teacherId)}
    />
  );
}
