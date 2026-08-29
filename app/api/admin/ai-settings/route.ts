import { publicAiConfig, readAiConfig, writeAiConfig } from "@/lib/ai-config";
import type { AiAnswerMode, AiProvider } from "@/lib/ai-types";

export const runtime = "nodejs";

export async function GET() {
  const config = await readAiConfig();
  return Response.json(publicAiConfig(config));
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    enabled?: boolean;
    provider?: AiProvider;
    apiKey?: string;
    ollamaUrl?: string;
    ollamaModel?: string;
    dailyLimit?: number;
    answerMode?: AiAnswerMode;
    safetyEnabled?: boolean;
    clearKey?: boolean;
  };
  const current = await readAiConfig();
  const next = {
    ...current,
    enabled: body.enabled ?? current.enabled,
    provider: body.provider ?? current.provider,
    ollamaUrl: body.ollamaUrl ?? current.ollamaUrl,
    ollamaModel: body.ollamaModel ?? current.ollamaModel,
    dailyLimit: Number.isFinite(body.dailyLimit) ? Number(body.dailyLimit) : current.dailyLimit,
    answerMode: body.answerMode ?? current.answerMode,
    safetyEnabled: body.safetyEnabled ?? current.safetyEnabled,
    apiKey: body.clearKey ? "" : body.apiKey?.trim() ? body.apiKey.trim() : current.apiKey,
  };
  await writeAiConfig(next);
  return Response.json(publicAiConfig(next));
}
