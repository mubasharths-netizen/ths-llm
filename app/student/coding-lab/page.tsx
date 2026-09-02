"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const samples: Record<string, string> = {
  HTML: "<h1>THS LAB</h1>\n<p>Learn. Practice. Improve.</p>",
  CSS: "body { font-family: Inter, sans-serif; color: #0F172A; }",
  JavaScript: "function greet(name) {\n  return `Hello, ${name}`;\n}\nconsole.log(greet('Ayesha'));",
  Java: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, THS\");\n  }\n}",
  Python: "def calculate_sum(nums):\n    total = 0\n    for n in nums:\n        total += n\n    return total\n\nprint(calculate_sum([1, 2, 3]))",
  SQL: "SELECT name, score FROM students\nWHERE class = 'BSIT-4A'\nORDER BY score DESC;",
};

const labInstructions: Record<string, string> = {
  HTML: "Instructions: Build a heading and a short paragraph for the THS LAB home block.",
  CSS: "Instructions: Set a clean body font and text color for the lab pages.",
  JavaScript: "Instructions: Write greet(name) so it returns a hello message. Expected: Hello, Ayesha",
  Java: "Instructions: Print Hello, THS from the main method.",
  Python: "Instructions: Implement calculate_sum so it returns the total of a list. Test case: [1, 2, 3] → 6.",
  SQL: "Instructions: Select student name and score for class BSIT-4A, highest score first.",
};

const runOutput: Record<string, string> = {
  HTML: "<h1>THS LAB</h1>\n<p>Learn. Practice. Improve.</p>",
  CSS: "Styles applied to the page.",
  JavaScript: "Hello, Ayesha",
  Java: "Hello, THS",
  Python: "6",
  SQL: "name          score\nAyesha Khan   850\nHassan Ali    942",
};

export default function CodingLabPage() {
  const [lang, setLang] = useState("Python");
  const [code, setCode] = useState(samples.Python);
  const [out, setOut] = useState("Run code to see output.");
  const [help, setHelp] = useState("");
  const [busy, setBusy] = useState(false);

  async function askAi() {
    setBusy(true);
    setHelp("");
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: "coding-lab",
        intent: "debug",
        language: lang,
        code,
        messages: [{ role: "user", content: `Help me understand and debug this ${lang} lab code. Do not write a complete assignment for me.` }],
      }),
    });
    const data = (await res.json()) as { reply?: string; error?: string };
    setHelp(data.reply || data.error || "AI Tutor could not reply.");
    setBusy(false);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[28px] font-semibold tracking-tight">Coding Lab</h1>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="teal" onClick={() => setOut(runOutput[lang] ?? "Program finished.")}>
            Run
          </Button>
          <Button type="button" variant="secondary" onClick={() => setCode(samples[lang])}>
            Reset
          </Button>
          <Button type="button" variant="ghost">
            Test cases
          </Button>
          <Button type="button" variant="ai" disabled={busy} onClick={() => void askAi()}>
            Ask AI Tutor
          </Button>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {Object.keys(samples).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => {
              setLang(l);
              setCode(samples[l]);
            }}
          >
            <Badge tone={lang === l ? "primary" : "outline"}>{l}</Badge>
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-border bg-[#0F172A]">
          <p className="border-b border-slate-700 px-3 py-2 text-xs text-slate-400">Editor · {lang}</p>
          <textarea
            className="h-[420px] w-full resize-none bg-[#0F172A] p-4 font-mono text-sm text-slate-100 outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <p className="border-b border-border px-3 py-2 text-xs text-text-muted">Output / Preview</p>
          <pre className="h-[420px] overflow-auto p-4 font-mono text-sm text-text">{out}</pre>
        </div>
      </div>
      <p className="mt-4 text-sm text-text-secondary">
        {labInstructions[lang] ?? "Follow the lab instructions for this language."}
      </p>
      {help ? (
        <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-border bg-ai-soft p-4 text-sm leading-6 text-text">
          {help}
        </pre>
      ) : null}
    </div>
  );
}
