import { TeacherContentPage } from "@/components/teacher/teacher-content-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quizzes" };

export default async function Page({ searchParams }: PageProps<"/teacher/quizzes">) {
  return <TeacherContentPage kind="quiz" searchParams={searchParams} />;
}
