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
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error" | "info">("info");
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/ai-settings");
    if (res.status === 401 || res.status === 403) {
      setAuthError("Sign in as Admin to manage AI settings.");
      return;
    }
    const data = (await res.json()) as Status;
    setStatus(data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    if (!status) return;
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/admin/ai-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabled: status.enabled,
        provider: status.provider,
        dailyLimit: status.dailyLimit,
        answerMode: status.answerMode,
        safetyEnabled: status.safetyEnabled,
        ollamaUrl: status.ollamaUrl,
        ollamaModel: status.ollamaModel,
      }),
    });
    const data = (await res.json()) as Status & { error?: string };
    setBusy(false);
    if (!res.ok) {
      setTone("error");
      setMessage(data.error || "Could not save settings.");
      return;
    }
    setStatus(data);
    setTone("success");
    setMessage("AI settings saved. The API key stays in .env.local only.");
  }

  async function testTutor() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: "tutor",
        intent: "chat",
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

  if (authError) {
    return (
      <>
        <PageHeader title="AI Settings" />
        <Alert tone="error">{authError} Use Login as Admin first.</Alert>
      </>
    );
  }

  if (!status) {
    return <p className="text-sm text-text-secondary">Loading AI settings…</p>;
  }

  return (
    <>
      <PageHeader
        title="AI Settings"
        description="Tutor behaviour and limits. The secret key is never stored in the browser."
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
        <Badge tone={status.envKeySet || status.apiKeySet ? "primary" : "hint"}>
          {status.envKeySet || status.apiKeySet ? "AI_API_KEY configured" : "AI_API_KEY missing"}
        </Badge>
        <Badge tone="outline">
          {status.remainingToday} / {status.dailyLimit} remaining today
        </Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">API key</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Put the key in <code>.env.local</code> on the server, then restart Next.js. Never paste a key into this
            page or any React component.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-[#0F172A] p-4 font-mono text-xs text-slate-100">{`AI_API_KEY=your_secret_api_key
AI_PROVIDER=gemini
JWT_SECRET=change-this-secret`}</pre>
          <div className="mt-4">
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
              <option value="ollama">Ollama (local, no key)</option>
            </select>
          </div>
          {status.provider === "ollama" ? (
            <div className="mt-3 space-y-3">
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
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" disabled={busy} onClick={() => void save()}>
              Save settings
            </Button>
            <Button type="button" variant="teal" disabled={busy} onClick={() => void testTutor()}>
              Test AI Tutor
            </Button>
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
