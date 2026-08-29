import { TeacherDiscipline } from "@/components/teacher/teacher-discipline";
import { listDiscipline, teacherAccessibleStudents } from "@/lib/conduct";
import { currentTeacherId } from "@/lib/session-user";

export const metadata = { title: "Discipline reports" };

export default async function TeacherDisciplinePage() {
  const teacherId = await currentTeacherId();
  return (
    <TeacherDiscipline
      students={teacherAccessibleStudents(teacherId)}
      reports={listDiscipline({ teacherId })}
    />
  );
}
