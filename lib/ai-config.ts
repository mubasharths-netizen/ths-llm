import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AiAnswerMode, AiProvider } from "@/lib/ai-types";

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

const filePath = path.join(process.cwd(), "data", "ai-config.json");

const defaults: AiConfig = {
  enabled: true,
  provider: "gemini",
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
    const { apiKey: _ignored, ...safe } = parsed;
    return { ...defaults, ...safe };
  } catch {
    return { ...defaults };
  }
}

export async function writeAiConfig(next: AiConfig) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(next, null, 2), "utf8");
}

export async function incrementAiUsage() {
  const config = await readAiConfig();
  const date = today();
  const usedToday = config.usageDate === date ? config.usedToday + 1 : 1;
  const next = { ...config, usageDate: date, usedToday };
  await writeAiConfig(next);
  return next;
}

export function resolveApiKey() {
  const keys = [
    process.env.AI_API_KEY,
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    process.env.OPENAI_API_KEY,
    process.env.GROQ_API_KEY,
  ];
  return keys.map((value) => value?.trim() || "").find(isUsableKey) || "";
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
    return "The AI provider rejected the request. Check AI_API_KEY in .env.local.";
  }
  return message.slice(0, 180);
}
