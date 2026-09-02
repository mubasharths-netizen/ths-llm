"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import {
  PRACTICE_DIFFICULTIES,
  PRACTICE_SUBJECTS,
  questionsFor,
  topicsForSubject,
  type PracticeDifficulty,
  type PracticeQuestion,
  type PracticeSubject,
} from "@/lib/practice-questions";

export function PracticeClient({ extraQuestions }: { extraQuestions: PracticeQuestion[] }) {
  const [subject, setSubject] = useState<PracticeSubject>("HTML");
  const [topic, setTopic] = useState(() => topicsForSubject("HTML")[0]);
  const [diff, setDiff] = useState<PracticeDifficulty>("Easy");
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<"ok" | "bad" | null>(null);

  const topics = useMemo(() => {
    const extra = extraQuestions.filter((q) => q.subject === subject).map((q) => q.topic);
    return [...new Set([...extra, ...topicsForSubject(subject)])];
  }, [extraQuestions, subject]);

  const pool = useMemo(() => {
    const extra = extraQuestions.filter(
      (q) => q.subject === subject && q.topic === topic && q.difficulty === diff,
    );
    return [...extra, ...questionsFor(subject, topic, diff)];
  }, [extraQuestions, subject, topic, diff]);
  const question = pool[index % Math.max(pool.length, 1)];

  function resetAnswer() {
    setChoice(null);
    setResult(null);
    setShowHint(false);
  }

  function selectSubject(next: PracticeSubject) {
    const extra = extraQuestions.filter((q) => q.subject === next).map((q) => q.topic);
    const nextTopics = [...new Set([...extra, ...topicsForSubject(next)])];
    setSubject(next);
    setTopic(nextTopics[0]);
    setIndex(0);
    resetAnswer();
  }

  function selectTopic(next: string) {
    setTopic(next);
    setIndex(0);
    resetAnswer();
  }

  function selectDiff(next: PracticeDifficulty) {
    setDiff(next);
    setIndex(0);
    resetAnswer();
  }

  function nextQuestion() {
    setIndex((i) => i + 1);
    resetAnswer();
  }

  return (
    <>
      <PageHeader
        title="Practice"
        description="Choose a language, pick a topic, then practise with hints and AI help. Teacher-added questions appear first."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {PRACTICE_SUBJECTS.map((item) => (
          <button key={item} type="button" onClick={() => selectSubject(item)}>
            <Badge tone={subject === item ? "primary" : "outline"}>{item}</Badge>
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-3">
        <select className="input max-w-xs" value={topic} onChange={(e) => selectTopic(e.target.value)}>
          {topics.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {PRACTICE_DIFFICULTIES.map((d) => (
          <button key={d} type="button" onClick={() => selectDiff(d)}>
            <Badge tone={diff === d ? "teal" : "outline"}>{d}</Badge>
          </button>
        ))}
      </div>
      {!question ? (
        <Card>
          <p className="text-sm text-text-secondary">No questions for this filter yet.</p>
        </Card>
      ) : (
        <Card>
          <p className="text-xs text-text-muted">
            {subject} · {topic} · {diff}
          </p>
          <h2 className="mt-2 text-lg font-semibold">{question.prompt}</h2>
          <div className="mt-4 space-y-2">
            {question.options.map((opt, i) => (
              <button
                key={`${opt}-${i}`}
                type="button"
                onClick={() => setChoice(i)}
                className={`flex w-full rounded-lg border px-4 py-3 text-left text-sm ${
                  choice === i ? "border-primary bg-primary-soft" : "border-border"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {showHint ? (
            <div className="mt-4">
              <Alert tone="hint">Hint: {question.hint}</Alert>
            </div>
          ) : null}
          {result === "ok" ? (
            <div className="mt-4">
              <Alert tone="success">Correct. {question.explanation}</Alert>
            </div>
          ) : null}
          {result === "bad" ? (
            <div className="mt-4">
              <Alert tone="error">Incorrect. {question.explanation} Review this, then try again.</Alert>
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            <Button type="button" onClick={() => setResult(choice === question.correct ? "ok" : "bad")}>
              Submit
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowHint(true)}>
              Hint
            </Button>
            <Button
              href={`/student/ai-tutor?prompt=${encodeURIComponent(
                `I am practising ${subject} — ${topic} (${diff}). Question: ${question.prompt}. ${
                  choice !== null ? `I chose: ${question.options[choice]}.` : "I have not answered yet."
                } Help me understand this. Follow the tutor answer mode.`,
              )}`}
              variant="ai"
            >
              Ask AI Tutor
            </Button>
            <Button type="button" variant="ghost" onClick={resetAnswer}>
              Try again
            </Button>
            <Button type="button" variant="ghost" onClick={nextQuestion}>
              Next question
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
