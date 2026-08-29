import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AiAnswerMode, AiProvider } from "@/lib/ai-types";

export type { AiAnswerMode, AiProvider };

export type AiConfig = {
  enabled: boolean;
  provider: AiProvider;
  apiKey: string;
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
  apiKey: "",
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

export function publicAiConfig(config: AiConfig) {
  const key = config.apiKey.trim();
  return {
    enabled: config.enabled,
    provider: config.provider,
    apiKeySet: key.length > 0,
    apiKeyHint: key ? `••••${key.slice(-4)}` : "",
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
    envKeySet: Boolean(
      process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
        process.env.OPENAI_API_KEY ||
        process.env.GROQ_API_KEY,
    ),
  };
}

export async function readAiConfig(): Promise<AiConfig> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<AiConfig>;
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
  const config = await readAiConfig();
  const date = today();
  const usedToday = config.usageDate === date ? config.usedToday + 1 : 1;
  const next = { ...config, usageDate: date, usedToday };
  await writeAiConfig(next);
  return next;
}

export function resolveApiKey(config: AiConfig) {
  if (config.apiKey.trim()) return config.apiKey.trim();
  if (config.provider === "gemini") {
    return process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
  }
  if (config.provider === "openai") return process.env.OPENAI_API_KEY || "";
  if (config.provider === "groq") return process.env.GROQ_API_KEY || "";
  return "";
}
