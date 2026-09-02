import { TeacherContentPage } from "@/components/teacher/teacher-content-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Assignments" };

export default async function Page({ searchParams }: PageProps<"/teacher/assignments">) {
  return <TeacherContentPage kind="assignment" searchParams={searchParams} />;
}
