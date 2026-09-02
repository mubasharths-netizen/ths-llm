import { TeacherContentPage } from "@/components/teacher/teacher-content-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Courses" };

export default async function Page({ searchParams }: PageProps<"/teacher/courses">) {
  return <TeacherContentPage kind="course" searchParams={searchParams} />;
}
