import { TeacherComplaints } from "@/components/teacher/teacher-complaints";
import { listComplaints, teacherAccessibleStudents } from "@/lib/conduct";
import { currentTeacherId } from "@/lib/session-user";

export const metadata = { title: "Complaints" };

export default async function TeacherComplaintsPage() {
  const teacherId = await currentTeacherId();
  return (
    <TeacherComplaints
      students={teacherAccessibleStudents(teacherId)}
      complaints={listComplaints({ teacherId })}
    />
  );
}
