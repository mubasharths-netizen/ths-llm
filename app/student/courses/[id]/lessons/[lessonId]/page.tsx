import { LessonView } from "@/components/student/lesson-view";

export default async function LessonPage({
  params,
}: PageProps<"/student/courses/[id]/lessons/[lessonId]">) {
  const { id, lessonId } = await params;
  const title = lessonId
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
  return <LessonView courseId={id} title={title} />;
}
