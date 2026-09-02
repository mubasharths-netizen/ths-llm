"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { PRACTICE_DIFFICULTIES, PRACTICE_SUBJECTS } from "@/lib/practice-questions";
import {
  CONTENT_PAGES,
  type TeacherContentKind,
  type TeacherContentRow,
  type TeacherQuizQuestion,
} from "@/lib/teacher-content-shared";

const emptyQuestion = (): TeacherQuizQuestion => ({
  prompt: "",
  options: ["", "", "", ""],
  correct: 0,
});

type RosterStudent = { id: string; name: string; email: string; class: string };

export function TeacherContentManager({
  kind,
  courses,
  students,
  items,
  defaultOpen = false,
}: {
  kind: TeacherContentKind;
  courses: Array<{ id: string; title: string }>;
  students: RosterStudent[];
  items: TeacherContentRow[];
  defaultOpen?: boolean;
}) {
  const meta = CONTENT_PAGES[kind];
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen || items.length === 0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState(kind === "practice" ? "HTML" : "IT");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(kind === "practice" ? "Easy" : "Beginner");
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [duration, setDuration] = useState(
    kind === "course" ? "8 weeks" : kind === "quiz" ? "15 min" : kind === "lesson" ? "20 min" : "45 min",
  );
  const [deadline, setDeadline] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [hint, setHint] = useState("");
  const [explanation, setExplanation] = useState("");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [questions, setQuestions] = useState<TeacherQuizQuestion[]>([emptyQuestion()]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [pending, setPending] = useState(false);

  const needsCourse = kind === "lesson" || kind === "assignment" || kind === "quiz" || kind === "test" || kind === "exam";
  const needsStudent = kind === "feedback" || kind === "grade";
  const isAssessment = kind === "quiz" || kind === "test" || kind === "exam";

  const headers = useMemo(() => {
    if (kind === "practice") return ["Question", "Subject", "Topic", "Difficulty"];
    if (kind === "grade") return ["Student", "Title", "Score", "Comment"];
    if (kind === "feedback") return ["Student", "Title", "Feedback"];
    if (kind === "assignment") return ["Assignment", "Course", "Deadline"];
    if (kind === "lesson") return ["Lesson", "Course", "Duration"];
    if (kind === "course") return ["Course", "Category", "Level", "Duration"];
    if (isAssessment) return ["Title", "Course", "Duration", "Questions"];
    return ["Title", "Details"];
  }, [kind, isAssessment]);

  function questionCount(row: TeacherContentRow) {
    try {
      const parsed = JSON.parse(row.extra_json || "{}") as { questions?: unknown[] };
      return Array.isArray(parsed.questions) ? parsed.questions.length : 0;
    } catch {
      return 0;
    }
  }

  function resetForm() {
    setTitle("");
    setBody("");
    setTopic("");
    setHint("");
    setExplanation("");
    setScore("");
    setOptions(["", "", "", ""]);
    setCorrect(0);
    setQuestions([emptyQuestion()]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    setOk("");
    const res = await fetch("/api/teacher/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        title: kind === "practice" ? body.slice(0, 80) : title,
        body: kind === "practice" ? body : body || title,
        subject,
        topic,
        difficulty,
        courseId,
        studentId,
        duration,
        deadline,
        options,
        correct,
        hint,
        explanation,
        score: score ? Number(score) : undefined,
        maxScore: maxScore ? Number(maxScore) : undefined,
        questions,
      }),
    });
    const data = (await res.json()) as { error?: string };
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Unable to save.");
      return;
    }
    setOk(`${meta.addLabel.replace(/^Add /, "")} saved. Students can see it now.`);
    resetForm();
    router.refresh();
  }

  return (
    <>
      <PageHeader
        title={meta.label}
        description={meta.description}
        actions={
          <Button type="button" onClick={() => setOpen((value) => !value)}>
            {open ? "Close" : meta.addLabel}
          </Button>
        }
      />
      {error ? (
        <div className="mb-4">
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}
      {ok ? (
        <div className="mb-4">
          <Alert tone="success">{ok}</Alert>
        </div>
      ) : null}
      {open ? (
        <Card className="mb-6 max-w-3xl">
          <h2 className="mb-4 font-semibold">{meta.addLabel}</h2>
          {needsCourse && courses.length === 0 ? (
            <Alert tone="hint">Add a course first, then you can attach this item to it.</Alert>
          ) : null}
          <form className="mt-4 space-y-4" onSubmit={(e) => void onSubmit(e)}>
            {kind !== "practice" ? (
              <div>
                <label className="label" htmlFor="title">
                  {kind === "class" ? "Class name" : kind === "feedback" ? "Subject" : "Title"}
                </label>
                <input
                  id="title"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required={kind !== "feedback"}
                  placeholder={kind === "course" ? "Python Fundamentals" : ""}
                />
              </div>
            ) : null}
            {kind === "course" ? (
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="label" htmlFor="category">
                    Category
                  </label>
                  <input id="category" className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="level">
                    Level
                  </label>
                  <select id="level" className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    {["Beginner", "Intermediate", "Advanced"].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="duration">
                    Duration
                  </label>
                  <input id="duration" className="input" value={duration} onChange={(e) => setDuration(e.target.value)} />
                </div>
              </div>
            ) : null}
            {kind === "practice" ? (
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="label" htmlFor="subject">
                    Subject
                  </label>
                  <select id="subject" className="input" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    {PRACTICE_SUBJECTS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="topic">
                    Topic
                  </label>
                  <input
                    id="topic"
                    className="input"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Loops"
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="difficulty">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    className="input"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    {PRACTICE_DIFFICULTIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}
            {needsCourse ? (
              <div>
                <label className="label" htmlFor="course">
                  Course
                </label>
                <select id="course" className="input" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                  {kind === "quiz" || kind === "test" || kind === "exam" ? <option value="">No course</option> : null}
                  {courses.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {needsStudent ? (
              <div>
                <label className="label" htmlFor="student">
                  Student
                </label>
                <select id="student" className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                  {students.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.name} · {row.class || "No class"}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {kind === "lesson" || isAssessment ? (
              <div>
                <label className="label" htmlFor="item-duration">
                  Duration
                </label>
                <input
                  id="item-duration"
                  className="input"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            ) : null}
            {kind === "assignment" ? (
              <div>
                <label className="label" htmlFor="deadline">
                  Deadline
                </label>
                <input
                  id="deadline"
                  className="input"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            ) : null}
            {kind === "grade" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label" htmlFor="score">
                    Score
                  </label>
                  <input
                    id="score"
                    className="input"
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="maxScore">
                    Out of
                  </label>
                  <input
                    id="maxScore"
                    className="input"
                    type="number"
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                  />
                </div>
              </div>
            ) : null}
            {kind !== "lesson" ? (
              <div>
                <label className="label" htmlFor="body">
                  {kind === "practice"
                    ? "Question"
                    : kind === "assignment"
                      ? "Instructions"
                      : kind === "feedback"
                        ? "Feedback"
                        : kind === "grade"
                          ? "Comment"
                          : "Description"}
                </label>
                <textarea
                  id="body"
                  className="input h-28 py-3"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required={kind === "practice" || kind === "course" || kind === "assignment" || kind === "feedback"}
                />
              </div>
            ) : null}
            {kind === "practice" ? (
              <>
                {options.map((opt, index) => (
                  <div key={index}>
                    <label className="label" htmlFor={`opt-${index}`}>
                      Option {index + 1}
                    </label>
                    <input
                      id={`opt-${index}`}
                      className="input"
                      value={opt}
                      onChange={(e) =>
                        setOptions((current) => current.map((item, i) => (i === index ? e.target.value : item)))
                      }
                      required={index < 2}
                    />
                  </div>
                ))}
                <div>
                  <label className="label" htmlFor="correct">
                    Correct option
                  </label>
                  <select id="correct" className="input" value={correct} onChange={(e) => setCorrect(Number(e.target.value))}>
                    {options.map((opt, index) => (
                      <option key={index} value={index}>
                        Option {index + 1}
                        {opt ? ` · ${opt}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="hint">
                    Hint
                  </label>
                  <input id="hint" className="input" value={hint} onChange={(e) => setHint(e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="explanation">
                    Explanation
                  </label>
                  <textarea
                    id="explanation"
                    className="input h-24 py-3"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                  />
                </div>
              </>
            ) : null}
            {isAssessment ? (
              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="rounded-xl border border-border p-4">
                    <p className="mb-3 text-sm font-semibold">Question {qIndex + 1}</p>
                    <input
                      className="input mb-3"
                      placeholder="Question prompt"
                      value={question.prompt}
                      onChange={(e) =>
                        setQuestions((current) =>
                          current.map((item, i) => (i === qIndex ? { ...item, prompt: e.target.value } : item)),
                        )
                      }
                      required
                    />
                    {question.options.map((opt, oIndex) => (
                      <input
                        key={oIndex}
                        className="input mb-2"
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) =>
                          setQuestions((current) =>
                            current.map((item, i) =>
                              i === qIndex
                                ? {
                                    ...item,
                                    options: item.options.map((value, j) => (j === oIndex ? e.target.value : value)),
                                  }
                                : item,
                            ),
                          )
                        }
                        required={oIndex < 2}
                      />
                    ))}
                    <select
                      className="input mt-2"
                      value={question.correct}
                      onChange={(e) =>
                        setQuestions((current) =>
                          current.map((item, i) => (i === qIndex ? { ...item, correct: Number(e.target.value) } : item)),
                        )
                      }
                    >
                      {question.options.map((opt, oIndex) => (
                        <option key={oIndex} value={oIndex}>
                          Correct: option {oIndex + 1}
                          {opt ? ` · ${opt}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                {questions.length < 8 ? (
                  <Button type="button" variant="secondary" onClick={() => setQuestions((current) => [...current, emptyQuestion()])}>
                    Add question
                  </Button>
                ) : null}
              </div>
            ) : null}
            <Button
              type="submit"
              disabled={pending || (needsCourse && kind !== "quiz" && kind !== "test" && kind !== "exam" && courses.length === 0) || (needsStudent && students.length === 0)}
            >
              {pending ? "Saving…" : meta.addLabel}
            </Button>
          </form>
        </Card>
      ) : null}
      {items.length === 0 ? (
        <Card>
          <p className="text-sm text-text-secondary">Nothing added yet. Use {meta.addLabel} to create the first one.</p>
        </Card>
      ) : (
        <DataTable headers={headers}>
          {items.map((row) => (
            <Tr key={row.id}>
              {kind === "practice" ? (
                <>
                  <Td>{row.title}</Td>
                  <Td>{row.subject}</Td>
                  <Td>{row.topic}</Td>
                  <Td>
                    <Badge tone="outline">{row.difficulty}</Badge>
                  </Td>
                </>
              ) : kind === "grade" ? (
                <>
                  <Td>{row.student_name}</Td>
                  <Td>{row.title}</Td>
                  <Td>
                    {row.score} / {row.max_score}
                  </Td>
                  <Td>{row.body}</Td>
                </>
              ) : kind === "feedback" ? (
                <>
                  <Td>{row.student_name}</Td>
                  <Td>{row.title}</Td>
                  <Td>{row.body}</Td>
                </>
              ) : kind === "assignment" ? (
                <>
                  <Td>{row.title}</Td>
                  <Td>{row.course_title}</Td>
                  <Td>{row.deadline}</Td>
                </>
              ) : kind === "lesson" ? (
                <>
                  <Td>{row.title}</Td>
                  <Td>{row.course_title}</Td>
                  <Td>{row.duration}</Td>
                </>
              ) : kind === "course" ? (
                <>
                  <Td>{row.title}</Td>
                  <Td>{row.subject}</Td>
                  <Td>{row.difficulty}</Td>
                  <Td>{row.duration}</Td>
                </>
              ) : isAssessment ? (
                <>
                  <Td>{row.title}</Td>
                  <Td>{row.course_title || "—"}</Td>
                  <Td>{row.duration}</Td>
                  <Td>{questionCount(row)}</Td>
                </>
              ) : (
                <>
                  <Td>{row.title}</Td>
                  <Td>{row.body || row.class_name || "—"}</Td>
                </>
              )}
            </Tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
