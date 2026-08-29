"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

type Msg = { role: "user" | "assistant"; content: string };

const welcome: Msg = {
  role: "assistant",
  content:
    "I am THS AI Tutor. Ask about a concept, request a hint, paste code, or review a mistake. I will stay within your course context.",
};

const chips = [
  "Explain for-loops in Python",
  "Give me a hint, not the answer",
  "Why is range(3) 0, 1, 2?",
  "Explain this SQL JOIN mistake",
];

export function AiTutorChat({ initialPrompt = "" }: { initialPrompt?: string }) {
  const [messages, setMessages] = useState<Msg[]>([welcome]);
  const [input, setInput] = useState(initialPrompt);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string, history: Msg[]) {
    const content = text.trim();
    if (!content || busy) return;
    const nextHistory = [...history.filter((m) => m !== welcome), { role: "user" as const, content }];
    setMessages([...history, { role: "user", content }]);
    setInput("");
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextHistory }),
      });
      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        status?: { remainingToday?: number };
      };
      if (typeof data.status?.remainingToday === "number") setRemaining(data.status.remainingToday);
      if (data.reply) {
        setMessages((current) => [...current, { role: "assistant", content: data.reply as string }]);
      } else {
        setError(data.error || "AI Tutor could not reply.");
      }
    } catch {
      setError("Network error. Check that the app server is running.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (started.current || !initialPrompt.trim()) return;
    started.current = true;
    void send(initialPrompt, [welcome]);
  }, [initialPrompt]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <Card className="flex min-h-[70vh] flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">THS AI Tutor</h1>
            <p className="text-sm text-text-secondary">Live tutor — replies come from the configured model.</p>
          </div>
          {remaining !== null ? <Badge tone="outline">{remaining} left today</Badge> : null}
        </div>
        {error ? (
          <div className="mt-3">
            <Alert tone="error">
              {error}{" "}
              {error.toLowerCase().includes("api key") || error.toLowerCase().includes("turned off") ? (
                <Link href="/admin/ai-settings" className="font-semibold underline">
                  Open AI Settings
                </Link>
              ) : null}
            </Alert>
          </div>
        ) : null}
        <div ref={scroller} className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={`${i}-${m.role}`}
              className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-6 ${
                m.role === "assistant" ? "bg-ai-soft text-text" : "ml-auto bg-primary text-white"
              }`}
            >
              {m.content}
            </div>
          ))}
          {busy ? <div className="max-w-[85%] rounded-xl bg-ai-soft px-4 py-3 text-sm text-text-muted">Thinking…</div> : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((p) => (
            <button key={p} type="button" onClick={() => void send(p, messages)} disabled={busy}>
              <Badge tone="outline">{p}</Badge>
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question"
            disabled={busy}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input, messages);
              }
            }}
          />
          <Button type="button" disabled={busy} onClick={() => void send(input, messages)}>
            Send
          </Button>
        </div>
      </Card>
      <div className="space-y-4">
        <Card>
          <p className="text-xs uppercase tracking-[0.06em] text-text-muted">Current course</p>
          <p className="mt-2 font-semibold">Python Fundamentals</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.06em] text-text-muted">Weak topics</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="hint">Loops</Badge>
            <Badge tone="hint">Recursion</Badge>
            <Badge tone="hint">Joins</Badge>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">
            Admin controls provider, daily limit, and whether you get hints or full answers.
          </p>
          <div className="mt-3">
            <Button href="/admin/ai-settings" variant="secondary">
              AI Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
