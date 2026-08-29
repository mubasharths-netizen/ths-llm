import { CoursesBrowser } from "@/app/student/courses/courses-browser";
import { studentCourseCards } from "@/lib/db";
import { currentStudentId } from "@/lib/session-user";

export const metadata = { title: "My courses" };

export default async function MyCoursesPage() {
  const userId = await currentStudentId();
  return <CoursesBrowser courses={studentCourseCards(userId)} />;
}
