import { TeacherContentPage } from "@/components/teacher/teacher-content-page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Feedback" };

export default async function Page({ searchParams }: PageProps<"/teacher/feedback">) {
  return <TeacherContentPage kind="feedback" searchParams={searchParams} />;
}
