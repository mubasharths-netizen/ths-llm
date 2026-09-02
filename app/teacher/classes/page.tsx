import { TeacherContentPage } from "@/components/teacher/teacher-content-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Classes" };

export default async function Page({ searchParams }: PageProps<"/teacher/classes">) {
  return <TeacherContentPage kind="class" searchParams={searchParams} />;
}
