"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const samples: Record<string, string> = {
  HTML: "<h1>THS LAB</h1>\n<p>Learn. Practice. Improve.</p>",
  CSS: "body { font-family: Inter, sans-serif; color: #0F172A; }",
  JavaScript: "function greet(name) {\n  return `Hello, ${name}`;\n}\nconsole.log(greet('Ayesha'));",
  Python: "def calculate_sum(nums):\n    total = 0\n    for n in nums:\n        total += n\n    return total\n\nprint(calculate_sum([1, 2, 3]))",
  SQL: "SELECT name, score FROM students\nWHERE class = 'BSIT-4A'\nORDER BY score DESC;",
};

export default function CodingLabPage() {
  const [lang, setLang] = useState("Python");
  const [code, setCode] = useState(samples.Python);
  const [out, setOut] = useState("Run code to see output.");

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[28px] font-semibold tracking-tight">Coding Lab</h1>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="teal" onClick={() => setOut(lang === "Python" ? "6" : "Program finished.")}>
            Run
          </Button>
          <Button type="button" variant="secondary" onClick={() => setCode(samples[lang])}>
            Reset
          </Button>
          <Button type="button" variant="ghost">
            Test cases
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
        Instructions: Implement calculate_sum so it returns the total of a list. Test case: [1, 2, 3] → 6.
      </p>
    </div>
  );
}
