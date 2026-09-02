import { TeacherContentPage } from "@/components/teacher/teacher-content-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tests" };

export default async function Page({ searchParams }: PageProps<"/teacher/tests">) {
  return <TeacherContentPage kind="test" searchParams={searchParams} />;
}
