import { AiTutorChat } from "@/components/student/ai-tutor-chat";

export const metadata = { title: "AI Tutor" };

export default async function AiTutorPage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string }>;
}) {
  const params = await searchParams;
  return <AiTutorChat initialPrompt={params.prompt ?? ""} />;
}
