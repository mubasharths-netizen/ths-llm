import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AiAnswerMode, AiProvider } from "@/lib/ai-types";
import { dataDir } from "@/lib/data-dir";

export type { AiAnswerMode, AiProvider };

export type AiConfig = {
  enabled: boolean;
  provider: AiProvider;
  ollamaUrl: string;
  ollamaModel: string;
  dailyLimit: number;
  usedToday: number;
  usageDate: string;
  answerMode: AiAnswerMode;
  safetyEnabled: boolean;
};

const filePath = path.join(dataDir(), "ai-config.json");

const defaults: AiConfig = {
  enabled: true,
  provider: "groq",
  ollamaUrl: "http://127.0.0.1:11434",
  ollamaModel: "llama3.2",
  dailyLimit: 80,
  usedToday: 0,
  usageDate: "",
  answerMode: "guided",
  safetyEnabled: true,
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function isUsableKey(value?: string) {
  const key = value?.trim() || "";
  if (!key) return false;
  if (/your_.*key/i.test(key) || key.includes("YOUR_")) return false;
  return true;
}

function envKeySet() {
  return Boolean(
    isUsableKey(process.env.AI_API_KEY) ||
      isUsableKey(process.env.GEMINI_API_KEY) ||
      isUsableKey(process.env.GOOGLE_GENERATIVE_AI_API_KEY) ||
      isUsableKey(process.env.OPENAI_API_KEY) ||
      isUsableKey(process.env.GROQ_API_KEY),
  );
}

export function publicAiConfig(config: AiConfig) {
  return {
    enabled: config.enabled,
    provider: config.provider,
    apiKeySet: envKeySet(),
    ollamaUrl: config.ollamaUrl,
    ollamaModel: config.ollamaModel,
    dailyLimit: config.dailyLimit,
    usedToday: config.usageDate === today() ? config.usedToday : 0,
    remainingToday: Math.max(
      0,
      config.dailyLimit - (config.usageDate === today() ? config.usedToday : 0),
    ),
    answerMode: config.answerMode,
    safetyEnabled: config.safetyEnabled,
    envKeySet: envKeySet(),
  };
}

export async function readAiConfig(): Promise<AiConfig> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<AiConfig> & { apiKey?: string };
    delete parsed.apiKey;
    return { ...defaults, ...parsed };
  } catch {
    return { ...defaults };
  }
}

export async function writeAiConfig(next: AiConfig) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(next, null, 2), "utf8");
}

export async function incrementAiUsage() {
  try {
    const config = await readAiConfig();
    const date = today();
    const usedToday = config.usageDate === date ? config.usedToday + 1 : 1;
    const next = { ...config, usageDate: date, usedToday };
    await writeAiConfig(next);
    return next;
  } catch {
    const config = await readAiConfig().catch(() => defaults);
    return config;
  }
}

export function resolveApiKey(provider?: AiProvider) {
  const groqFirst = ["GROQ_API_KEY", "AI_API_KEY"] as const;
  const geminiFirst = ["GEMINI_API_KEY", "GOOGLE_GENERATIVE_AI_API_KEY", "AI_API_KEY"] as const;
  const openaiFirst = ["OPENAI_API_KEY", "AI_API_KEY"] as const;
  const names =
    provider === "groq"
      ? groqFirst
      : provider === "gemini"
        ? geminiFirst
        : provider === "openai"
          ? openaiFirst
          : (["AI_API_KEY", "GROQ_API_KEY", "GEMINI_API_KEY", "GOOGLE_GENERATIVE_AI_API_KEY", "OPENAI_API_KEY"] as const);
  return names.map((name) => process.env[name]?.trim() || "").find(isUsableKey) || "";
}

export function resolveProvider(configured: AiProvider): AiProvider {
  const fromEnv = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (fromEnv === "gemini" || fromEnv === "openai" || fromEnv === "groq" || fromEnv === "ollama") {
    return fromEnv;
  }
  const key = resolveApiKey();
  if (key.startsWith("sk-")) return "openai";
  if (key.startsWith("gsk_")) return "groq";
  if (key.startsWith("AIza")) return "gemini";
  return configured;
}

export function sanitizeProviderError(message: string) {
  if (/api[_-]?key|sk-|gsk_|AIza|bearer/i.test(message)) {
    return "The AI provider rejected the request. Check GROQ_API_KEY in .env.local, then restart the server.";
  }
  return message.slice(0, 180);
}
