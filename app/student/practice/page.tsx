import { PracticeClient } from "@/app/student/practice/practice-client";
import { listPublishedPractice } from "@/lib/teacher-content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Practice" };

export default function PracticePage() {
  return <PracticeClient extraQuestions={listPublishedPractice()} />;
}
