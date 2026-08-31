import {
  incrementAiUsage,
  publicAiConfig,
  readAiConfig,
  resolveApiKey,
  resolveProvider,
  sanitizeProviderError,
  type AiConfig,
} from "@/lib/ai-config";
import type { AiChatRequest, ChatMessage } from "@/lib/ai-request";

function tutorSystemPrompt(config: AiConfig, request: AiChatRequest) {
  const mode =
    config.answerMode === "hints" || request.intent === "hint"
      ? "Give hints and guiding questions. Do not provide the final answer or complete solution code."
      : config.answerMode === "guided"
        ? "Explain the concept clearly. You may show short examples. Do not dump a complete assignment solution unless the student already attempted it."
        : "Explain fully, including worked examples and corrected code when asked.";

  const safety = config.safetyEnabled
    ? "Refuse harmful requests. Never help during an active test or exam. Stay educational."
    : "";

  const intentGuide: Record<string, string> = {
    chat: "Answer the student clearly.",
    explain: "Explain the programming or IT concept in plain language, then a short example.",
    hint: "Give a hint only. Do not reveal the full answer.",
    mistake: "Explain why the student answer is wrong and how to think about the correct one.",
    code: "Explain what the code does, line by line if useful.",
    debug: "Find the likely bug in the educational example and explain the fix.",
    "generate-question": "Create one practice question at a suitable difficulty, with options if MCQ.",
    "weak-topics": "Identify weak topics from the conversation and student context.",
    "study-plan": "Recommend a short study plan for the weak topics.",
  };

  return `You are Mubashar, the AI Tutor for THS LAB LMS, a professional IT learning platform.
Introduce yourself as Mubashar when asked your name. You are a calm, precise teaching assistant.

Student context:
- Current course: Python Fundamentals
- Weak topics: Loops, Recursion, SQL Joins
- Strong topics: Variables, HTML, SQL SELECT

Allowed contexts: Practice, Learning, Coding Lab assistance.
Never assist with an active test or exam.

Teaching loop: LEARN → PRACTICE → GET HELP → TEST → ANALYZE → IMPROVE.
Style: calm, precise, professional. No gaming language.

LMS context: ${request.context}
Task: ${intentGuide[request.intent] || intentGuide.chat}
Answer mode: ${mode}
${safety}

If code is provided, explain it before rewriting it.
Prefer Python, JavaScript, HTML, CSS, and SQL examples that match lab coursework.`;
}

async function callGemini(apiKey: string, system: string, messages: ChatMessage[]) {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest", "gemini-1.5-flash"];
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  let lastError = "Gemini request failed.";

  for (const model of models) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
        }),
      },
    );
    const data = (await res.json()) as {
      error?: { message?: string };
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    if (!res.ok) {
      lastError = data.error?.message || lastError;
      continue;
    }
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("\n").trim();
    if (text) return text;
  }
  throw new Error(lastError);
}

type ChatCompletionResponse = {
  error?: { message?: string };
  choices?: Array<{
    finish_reason?: string;
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
      reasoning?: string;
      reasoning_content?: string;
    };
  }>;
};

function extractAssistantText(data: ChatCompletionResponse) {
  const message = data.choices?.[0]?.message;
  if (!message) return "";
  const raw = message.content;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (Array.isArray(raw)) {
    const joined = raw
      .map((part) => (typeof part === "string" ? part : part.text || ""))
      .join("")
      .trim();
    if (joined) return joined;
  }
  return "";
}

function groqModelList() {
  return [
    process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-20b",
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
    "qwen/qwen3.6-27b",
  ].filter((model, index, list) => Boolean(model) && list.indexOf(model) === index);
}

async function postChatCompletion(
  url: string,
  apiKey: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as ChatCompletionResponse;
  return { res, data };
}

async function callOpenAiCompatible(
  url: string,
  apiKey: string,
  models: string[],
  system: string,
  messages: ChatMessage[],
) {
  let lastError = "Chat provider request failed.";
  const payloadMessages = [{ role: "system", content: system }, ...messages];

  for (const model of models) {
    const isGptOss = /gpt-oss/i.test(model);
    const isQwen = /qwen/i.test(model);
    const body: Record<string, unknown> = {
      model,
      temperature: 0.4,
      max_completion_tokens: 2048,
      messages: payloadMessages,
    };
    if (isGptOss) body.reasoning_effort = "low";
    if (isQwen) body.reasoning_effort = "none";

    let { res, data } = await postChatCompletion(url, apiKey, body);
    if (!res.ok && /reasoning/i.test(data.error?.message || "")) {
      delete body.reasoning_effort;
      ({ res, data } = await postChatCompletion(url, apiKey, body));
    }
    if (!res.ok) {
      lastError = data.error?.message || lastError;
      continue;
    }
    const text = extractAssistantText(data);
    if (text) return text;
    lastError = "The model returned an empty reply. Try again.";
  }
  throw new Error(lastError);
}

async function callOllama(config: AiConfig, system: string, messages: ChatMessage[]) {
  const res = await fetch(`${config.ollamaUrl.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.ollamaModel || "llama3.2",
      stream: false,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!res.ok) {
    throw new Error("Ollama is not reachable. Start Ollama or switch provider in AI Settings.");
  }
  const data = (await res.json()) as { message?: { content?: string } };
  const text = data.message?.content?.trim();
  if (!text) throw new Error("Ollama returned an empty reply.");
  return text;
}

export async function runTutorChat(request: AiChatRequest) {
  const config = await readAiConfig();
  const status = publicAiConfig(config);

  if (!config.enabled) {
    return { error: "AI Tutor is turned off in Admin -> AI Settings.", status, reply: "" };
  }
  if (status.remainingToday <= 0) {
    return { error: "Daily AI usage limit reached. An administrator can raise the limit.", status, reply: "" };
  }

  const messages = [...request.messages];
  if (request.code) {
    messages.push({
      role: "user",
      content: `Language: ${request.language || "unknown"}\n\nCode:\n${request.code}`,
    });
  }

  const system = tutorSystemPrompt(config, request);
  const history = messages.filter((m) => m.content.trim()).slice(-12);
  const provider = resolveProvider(config.provider);

  try {
    let reply = "";
    if (provider === "ollama") {
      reply = await callOllama(config, system, history);
    } else {
      const apiKey = resolveApiKey(provider);
      if (!apiKey) {
        try {
          reply = await callOllama(config, system, history);
        } catch {
          return {
            error:
              provider === "groq"
                ? "GROQ_API_KEY is not set. Add it to .env.local and restart the server."
                : "AI_API_KEY is not set. Add it to .env.local and restart the server.",
            status,
            reply: "",
          };
        }
      } else if (provider === "gemini") {
        reply = await callGemini(apiKey, system, history);
      } else if (provider === "groq") {
        reply = await callOpenAiCompatible(
          "https://api.groq.com/openai/v1/chat/completions",
          apiKey,
          groqModelList(),
          system,
          history,
        );
      } else {
        reply = await callOpenAiCompatible(
          "https://api.openai.com/v1/chat/completions",
          apiKey,
          ["gpt-4o-mini", "gpt-4.1-mini"],
          system,
          history,
        );
      }
    }
    const next = await incrementAiUsage();
    return { reply, error: "", status: publicAiConfig(next) };
  } catch (err) {
    const message = err instanceof Error ? sanitizeProviderError(err.message) : "AI Tutor could not reply.";
    return { error: message, status, reply: "" };
  }
}
