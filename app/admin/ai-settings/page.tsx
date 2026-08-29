"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import type { AiAnswerMode, AiProvider } from "@/lib/ai-types";

type Status = {
  enabled: boolean;
  provider: AiProvider;
  apiKeySet: boolean;
  apiKeyHint: string;
  ollamaUrl: string;
  ollamaModel: string;
  dailyLimit: number;
  usedToday: number;
  remainingToday: number;
  answerMode: AiAnswerMode;
  safetyEnabled: boolean;
  envKeySet: boolean;
};

export default function AiSettingsPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error" | "info">("info");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/ai-settings");
    const data = (await res.json()) as Status;
    setStatus(data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(extra?: Partial<Status> & { apiKey?: string; clearKey?: boolean }) {
    if (!status) return;
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/admin/ai-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabled: extra?.enabled ?? status.enabled,
        provider: extra?.provider ?? status.provider,
        dailyLimit: extra?.dailyLimit ?? status.dailyLimit,
        answerMode: extra?.answerMode ?? status.answerMode,
        safetyEnabled: extra?.safetyEnabled ?? status.safetyEnabled,
        ollamaUrl: extra?.ollamaUrl ?? status.ollamaUrl,
        ollamaModel: extra?.ollamaModel ?? status.ollamaModel,
        apiKey: extra?.apiKey ?? (apiKey || undefined),
        clearKey: extra?.clearKey,
      }),
    });
    const data = (await res.json()) as Status;
    setStatus(data);
    setApiKey("");
    setBusy(false);
    setTone("success");
    setMessage("AI settings saved.");
  }

  async function testTutor() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Reply with one short sentence confirming THS AI Tutor is working." }],
      }),
    });
    const data = (await res.json()) as { reply?: string; error?: string };
    setBusy(false);
    if (data.reply) {
      setTone("success");
      setMessage(data.reply);
      await load();
    } else {
      setTone("error");
      setMessage(data.error || "Test failed.");
    }
  }

  if (!status) {
    return <p className="text-sm text-text-secondary">Loading AI settings…</p>;
  }

  const connected = status.apiKeySet || status.envKeySet || status.provider === "ollama";

  return (
    <>
      <PageHeader
        title="AI Settings"
        description="Configure THS AI Tutor, usage limits, and safety."
        actions={
          <Button href="/student/ai-tutor" variant="secondary">
            Open AI Tutor
          </Button>
        }
      />
      {message ? (
        <div className="mb-4">
          <Alert tone={tone === "info" ? "info" : tone}>{message}</Alert>
        </div>
      ) : null}
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge tone={status.enabled ? "teal" : "muted"}>{status.enabled ? "Tutor enabled" : "Tutor disabled"}</Badge>
        <Badge tone={connected ? "primary" : "hint"}>{connected ? "Provider configured" : "API key needed"}</Badge>
        <Badge tone="outline">
          {status.remainingToday} / {status.dailyLimit} remaining today
        </Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Provider</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Gemini has a free API key from Google AI Studio. You can also use OpenAI, Groq, or local Ollama.
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="label" htmlFor="provider">
                Model provider
              </label>
              <select
                id="provider"
                className="input"
                value={status.provider}
                onChange={(e) => setStatus({ ...status, provider: e.target.value as AiProvider })}
              >
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="groq">Groq</option>
                <option value="ollama">Ollama (local)</option>
              </select>
            </div>
            {status.provider === "ollama" ? (
              <>
                <div>
                  <label className="label">Ollama URL</label>
                  <input
                    className="input"
                    value={status.ollamaUrl}
                    onChange={(e) => setStatus({ ...status, ollamaUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Ollama model</label>
                  <input
                    className="input"
                    value={status.ollamaModel}
                    onChange={(e) => setStatus({ ...status, ollamaModel: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="label" htmlFor="apiKey">
                  API key {status.apiKeyHint ? `(saved ${status.apiKeyHint})` : ""}
                </label>
                <input
                  id="apiKey"
                  type="password"
                  className="input"
                  placeholder={status.apiKeySet || status.envKeySet ? "Leave blank to keep current key" : "Paste API key"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="mt-1 text-xs text-text-muted">
                  Gemini: aistudio.google.com/apikey · stored only on this server, not in git.
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled={busy} onClick={() => save()}>
                Save settings
              </Button>
              <Button type="button" variant="teal" disabled={busy} onClick={testTutor}>
                Test AI Tutor
              </Button>
              {status.apiKeySet ? (
                <Button type="button" variant="ghost" disabled={busy} onClick={() => save({ clearKey: true })}>
                  Clear saved key
                </Button>
              ) : null}
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Tutor behaviour</h2>
          <label className="mt-4 flex items-center justify-between gap-3 text-sm">
            Enable AI Tutor
            <input
              type="checkbox"
              checked={status.enabled}
              onChange={(e) => setStatus({ ...status, enabled: e.target.checked })}
            />
          </label>
          <label className="mt-3 flex items-center justify-between gap-3 text-sm">
            Safety filter
            <input
              type="checkbox"
              checked={status.safetyEnabled}
              onChange={(e) => setStatus({ ...status, safetyEnabled: e.target.checked })}
            />
          </label>
          <div className="mt-4">
            <label className="label">Answer mode</label>
            <select
              className="input"
              value={status.answerMode}
              onChange={(e) => setStatus({ ...status, answerMode: e.target.value as AiAnswerMode })}
            >
              <option value="hints">Hints only — no full answers</option>
              <option value="guided">Guided — explain with short examples</option>
              <option value="full">Full answers</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="label">Daily usage limit</label>
            <input
              className="input"
              type="number"
              min={1}
              value={status.dailyLimit}
              onChange={(e) => setStatus({ ...status, dailyLimit: Number(e.target.value) })}
            />
            <p className="mt-1 text-xs text-text-muted">Used today: {status.usedToday}</p>
          </div>
        </Card>
      </div>
    </>
  );
}
