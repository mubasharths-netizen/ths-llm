import { TeacherContentPage } from "@/components/teacher/teacher-content-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Exams" };

export default async function Page({ searchParams }: PageProps<"/teacher/exams">) {
  return <TeacherContentPage kind="exam" searchParams={searchParams} />;
}
