import { TeacherContentPage } from "@/components/teacher/teacher-content-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Practice questions" };

export default async function Page({ searchParams }: PageProps<"/teacher/practice">) {
  return <TeacherContentPage kind="practice" searchParams={searchParams} />;
}
