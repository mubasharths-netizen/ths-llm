import { TeacherContentPage } from "@/components/teacher/teacher-content-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Lessons" };

export default async function Page({ searchParams }: PageProps<"/teacher/lessons">) {
  return <TeacherContentPage kind="lesson" searchParams={searchParams} />;
}
