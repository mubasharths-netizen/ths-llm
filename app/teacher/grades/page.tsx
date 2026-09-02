import { TeacherContentPage } from "@/components/teacher/teacher-content-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Grades" };

export default async function Page({ searchParams }: PageProps<"/teacher/grades">) {
  return <TeacherContentPage kind="grade" searchParams={searchParams} />;
}
