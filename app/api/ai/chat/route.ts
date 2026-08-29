import { runTutorChat, type ChatMessage } from "@/lib/ai-tutor";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { messages?: ChatMessage[] };
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length) {
    return Response.json({ error: "Ask a question to continue." }, { status: 400 });
  }
  const result = await runTutorChat(messages);
  return Response.json(result, { status: result.error ? 400 : 200 });
}
