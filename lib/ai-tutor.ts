import { incrementAiUsage, publicAiConfig, readAiConfig, resolveApiKey, type AiConfig } from "@/lib/ai-config";

export type ChatMessage = { role: "user" | "assistant"; content: string };

function tutorSystemPrompt(config: AiConfig) {
  const mode =
    config.answerMode === "hints"
      ? "Give hints and guiding questions. Do not provide the final answer or complete solution code."
      : config.answerMode === "guided"
        ? "Explain the concept clearly. You may show short examples. Do not dump a complete assignment solution unless the student already attempted it."
        : "Explain fully, including worked examples and corrected code when asked.";

  const safety = config.safetyEnabled
    ? "Refuse harmful, exam-cheating during locked tests, or off-platform illegal requests. Stay educational."
    : "";

  return `You are THS AI Tutor for THS LAB LMS, a professional IT learning platform.

Student context:
- Name: Ayesha Khan
- Class: BSIT-4A
- Current course: Python Fundamentals
- Weak topics: Loops, Recursion, SQL Joins
- Strong topics: Variables, HTML, SQL SELECT

Teaching loop: LEARN → PRACTICE → GET HELP → TEST → ANALYZE → IMPROVE.

Style: calm, precise, professional. No gaming language. No emojis unless the student uses them.

Answer mode: ${mode}
${safety}

If the student asks for a hint, start with one nudge, then a second if they still need it.
If they paste code, explain what it does and the likely bug before rewriting it.
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

async function callOpenAiCompatible(
  url: string,
  apiKey: string,
  model: string,
  system: string,
  messages: ChatMessage[],
) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  const data = (await res.json()) as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string } }>;
  };
  if (!res.ok) throw new Error(data.error?.message || "Chat provider request failed.");
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The model returned an empty reply.");
  return text;
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

export async function runTutorChat(messages: ChatMessage[]) {
  const config = await readAiConfig();
  const status = publicAiConfig(config);

  if (!config.enabled) {
    return { error: "AI Tutor is turned off in Admin -> AI Settings.", status, reply: "" };
  }
  if (status.remainingToday <= 0) {
    return { error: "Daily AI usage limit reached. An administrator can raise the limit.", status, reply: "" };
  }

  const system = tutorSystemPrompt(config);
  const history = messages.filter((m) => m.content.trim()).slice(-12);

  try {
    let reply = "";
    if (config.provider === "ollama") {
      reply = await callOllama(config, system, history);
    } else {
      const apiKey = resolveApiKey(config);
      if (!apiKey) {
        try {
          reply = await callOllama(config, system, history);
        } catch {
          return {
            error:
              "No API key configured. Open Admin -> AI Settings, paste a Gemini or OpenAI key, then save.",
            status,
            reply: "",
          };
        }
      } else if (config.provider === "gemini") {
        reply = await callGemini(apiKey, system, history);
      } else if (config.provider === "groq") {
        reply = await callOpenAiCompatible(
          "https://api.groq.com/openai/v1/chat/completions",
          apiKey,
          "llama-3.3-70b-versatile",
          system,
          history,
        );
      } else {
        reply = await callOpenAiCompatible(
          "https://api.openai.com/v1/chat/completions",
          apiKey,
          "gpt-4o-mini",
          system,
          history,
        );
      }
    }
    const next = await incrementAiUsage();
    return { reply, error: "", status: publicAiConfig(next) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI Tutor could not reply.";
    return { error: message, status, reply: "" };
  }
}
