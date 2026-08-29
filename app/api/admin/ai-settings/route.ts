import { publicAiConfig, readAiConfig, writeAiConfig } from "@/lib/ai-config";
import { requireSession } from "@/lib/auth";
import type { AiAnswerMode, AiProvider } from "@/lib/ai-types";

export const runtime = "nodejs";

export async function GET() {
  const { error } = await requireSession(["admin"]);
  if (error) return error;
  const config = await readAiConfig();
  return Response.json(publicAiConfig(config));
}

export async function POST(request: Request) {
  const { error } = await requireSession(["admin"]);
  if (error) return error;
  const body = (await request.json()) as {
    enabled?: boolean;
    provider?: AiProvider;
    ollamaUrl?: string;
    ollamaModel?: string;
    dailyLimit?: number;
    answerMode?: AiAnswerMode;
    safetyEnabled?: boolean;
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
  };
  await writeAiConfig(next);
  return Response.json(publicAiConfig(next));
}
