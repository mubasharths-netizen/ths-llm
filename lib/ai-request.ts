export const AI_CONTEXTS = ["practice", "learning", "coding-lab", "tutor"] as const;
export const AI_INTENTS = [
  "chat",
  "explain",
  "hint",
  "mistake",
  "code",
  "debug",
  "generate-question",
  "weak-topics",
  "study-plan",
] as const;

export type AiContext = (typeof AI_CONTEXTS)[number];
export type AiIntent = (typeof AI_INTENTS)[number];
export type ChatMessage = { role: "user" | "assistant"; content: string };

export type AiChatRequest = {
  messages: ChatMessage[];
  context: AiContext;
  intent: AiIntent;
  code?: string;
  language?: string;
};

const MAX_MESSAGES = 16;
const MAX_CONTENT = 4000;
const MAX_CODE = 8000;

function isContext(value: unknown): value is AiContext {
  return typeof value === "string" && (AI_CONTEXTS as readonly string[]).includes(value);
}

function isIntent(value: unknown): value is AiIntent {
  return typeof value === "string" && (AI_INTENTS as readonly string[]).includes(value);
}

export function parseAiChatBody(raw: unknown): { data?: AiChatRequest; error?: string } {
  if (!raw || typeof raw !== "object") return { error: "Invalid request body." };
  const body = raw as Record<string, unknown>;

  if (body.context === "test" || body.context === "exam") {
    return { error: "AI Tutor is unavailable while your test is active." };
  }
  const context = isContext(body.context) ? body.context : "tutor";
  const intent = isIntent(body.intent) ? body.intent : "chat";

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return { error: "Ask a question to continue." };
  }
  if (body.messages.length > MAX_MESSAGES) {
    return { error: "Too many messages in this request." };
  }

  const messages: ChatMessage[] = [];
  for (const item of body.messages) {
    if (!item || typeof item !== "object") return { error: "Invalid message format." };
    const row = item as Record<string, unknown>;
    if (row.role !== "user" && row.role !== "assistant") return { error: "Invalid message role." };
    if (typeof row.content !== "string" || !row.content.trim()) return { error: "Message content is required." };
    if (row.content.length > MAX_CONTENT) return { error: "A message is too long." };
    messages.push({ role: row.role, content: row.content.trim() });
  }

  const code = typeof body.code === "string" ? body.code.slice(0, MAX_CODE) : undefined;
  const language = typeof body.language === "string" ? body.language.slice(0, 40) : undefined;

  return { data: { messages, context, intent, code, language } };
}
