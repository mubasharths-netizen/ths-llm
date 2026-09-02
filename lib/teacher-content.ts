import "server-only";
import { teacherAccessibleStudents } from "@/lib/conduct";
import { db, ensureSeeded, writeAudit } from "@/lib/db";
import {
  PRACTICE_DIFFICULTIES,
  PRACTICE_SUBJECTS,
  type PracticeDifficulty,
  type PracticeQuestion,
  type PracticeSubject,
} from "@/lib/practice-questions";
import type { CreateTeacherContentInput, TeacherContentKind, TeacherContentRow, TeacherQuizQuestion } from "@/lib/teacher-content-shared";

export type {
  CreateTeacherContentInput,
  TeacherContentKind,
  TeacherContentRow,
  TeacherQuizQuestion,
} from "@/lib/teacher-content-shared";
export { CONTENT_PAGES, isTeacherContentKind, TEACHER_CONTENT_KINDS } from "@/lib/teacher-content-shared";

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function plain<T extends object>(row: T): T {
  return { ...row };
}

function trim(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function teacherOwnsCourse(teacherId: string, courseId: string) {
  const row = db()
    .prepare("SELECT id FROM courses WHERE id = ? AND teacher_id = ?")
    .get(courseId, teacherId) as { id: string } | undefined;
  return Boolean(row);
}

function courseModuleId(courseId: string) {
  const existing = db()
    .prepare("SELECT id FROM modules WHERE course_id = ? ORDER BY sort_order LIMIT 1")
    .get(courseId) as { id: string } | undefined;
  if (existing) return existing.id;
  const id = newId("mod");
  db().prepare("INSERT INTO modules (id, title, sort_order, course_id) VALUES (?, 'Lessons', 1, ?)").run(id, courseId);
  return id;
}

function insertItem(row: Omit<TeacherContentRow, "student_name" | "course_title" | "created_at"> & { created_at?: string }) {
  db()
    .prepare(
      `INSERT INTO teacher_items (
         id, teacher_id, kind, title, body, subject, topic, difficulty, course_id, class_name,
         student_id, duration, deadline, options_json, correct, hint, explanation, score, max_score, extra_json
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      row.id,
      row.teacher_id,
      row.kind,
      row.title,
      row.body,
      row.subject,
      row.topic,
      row.difficulty,
      row.course_id,
      row.class_name,
      row.student_id,
      row.duration,
      row.deadline,
      row.options_json,
      row.correct,
      row.hint,
      row.explanation,
      row.score,
      row.max_score,
      row.extra_json,
    );
}

function notifyStudents(teacherId: string, type: string, title: string, studentId?: string) {
  const recipients = studentId
    ? [{ id: studentId }]
    : teacherAccessibleStudents(teacherId);
  const insert = db().prepare(
    "INSERT INTO notifications (id, type, title, unread, user_id) VALUES (?, ?, ?, 1, ?)",
  );
  recipients.forEach((row, index) => {
    insert.run(newId(`n-${index}`), type, title, row.id);
  });
}

function parseQuestions(raw: TeacherQuizQuestion[] | undefined): TeacherQuizQuestion[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const prompt = trim(item?.prompt);
      const options = Array.isArray(item?.options)
        ? item.options.map((opt) => trim(opt)).filter(Boolean).slice(0, 6)
        : [];
      const correct = Number(item?.correct);
      return { prompt, options, correct: Number.isInteger(correct) ? correct : 0 };
    })
    .filter((item) => item.prompt && item.options.length >= 2);
}

export function listTeacherCourses(teacherId: string) {
  ensureSeeded();
  return (
    db()
      .prepare("SELECT id, title FROM courses WHERE teacher_id = ? ORDER BY title")
      .all(teacherId) as Array<{ id: string; title: string }>
  ).map(plain);
}

export function listTeacherContent(teacherId: string, kind: TeacherContentKind): TeacherContentRow[] {
  ensureSeeded();
  if (kind === "course") {
    return (
      db()
        .prepare(
          `SELECT id, teacher_id, 'course' AS kind, title, description AS body, category AS subject, NULL AS topic,
                  level AS difficulty, id AS course_id, NULL AS class_name, NULL AS student_id, duration, NULL AS deadline,
                  NULL AS options_json, NULL AS correct, NULL AS hint, NULL AS explanation, NULL AS score, NULL AS max_score,
                  NULL AS extra_json, '' AS created_at, NULL AS student_name, title AS course_title
           FROM courses WHERE teacher_id = ? ORDER BY title`,
        )
        .all(teacherId) as TeacherContentRow[]
    ).map(plain);
  }
  if (kind === "lesson") {
    return (
      db()
        .prepare(
          `SELECT l.id, c.teacher_id, 'lesson' AS kind, l.title, '' AS body, NULL AS subject, NULL AS topic,
                  NULL AS difficulty, c.id AS course_id, NULL AS class_name, NULL AS student_id, l.duration, NULL AS deadline,
                  NULL AS options_json, NULL AS correct, NULL AS hint, NULL AS explanation, NULL AS score, NULL AS max_score,
                  NULL AS extra_json, '' AS created_at, NULL AS student_name, c.title AS course_title
           FROM lessons l
           JOIN modules m ON m.id = l.module_id
           JOIN courses c ON c.id = m.course_id
           WHERE c.teacher_id = ?
           ORDER BY c.title, l.sort_order, l.title`,
        )
        .all(teacherId) as TeacherContentRow[]
    ).map(plain);
  }
  if (kind === "assignment") {
    return (
      db()
        .prepare(
          `SELECT a.id, c.teacher_id, 'assignment' AS kind, a.title, a.instructions AS body, NULL AS subject, NULL AS topic,
                  NULL AS difficulty, c.id AS course_id, NULL AS class_name, NULL AS student_id, NULL AS duration, a.deadline,
                  NULL AS options_json, NULL AS correct, NULL AS hint, NULL AS explanation, NULL AS score, NULL AS max_score,
                  NULL AS extra_json, '' AS created_at, NULL AS student_name, c.title AS course_title
           FROM assignments a
           JOIN courses c ON c.id = a.course_id
           WHERE c.teacher_id = ?
           ORDER BY a.deadline DESC, a.title`,
        )
        .all(teacherId) as TeacherContentRow[]
    ).map(plain);
  }
  return (
    db()
      .prepare(
        `SELECT i.id, i.teacher_id, i.kind, i.title, i.body, i.subject, i.topic, i.difficulty, i.course_id, i.class_name,
                i.student_id, i.duration, i.deadline, i.options_json, i.correct, i.hint, i.explanation, i.score, i.max_score,
                i.extra_json, i.created_at, u.name AS student_name, c.title AS course_title
         FROM teacher_items i
         LEFT JOIN users u ON u.id = i.student_id
         LEFT JOIN courses c ON c.id = i.course_id
         WHERE i.teacher_id = ? AND i.kind = ?
         ORDER BY i.created_at DESC`,
      )
      .all(teacherId, kind) as TeacherContentRow[]
  ).map(plain);
}

export function listPublishedPractice(): PracticeQuestion[] {
  ensureSeeded();
  const rows = db()
    .prepare(
      `SELECT subject, topic, difficulty, body AS prompt, options_json, correct, hint, explanation
       FROM teacher_items WHERE kind = 'practice' ORDER BY created_at DESC`,
    )
    .all() as Array<{
    subject: string;
    topic: string;
    difficulty: string;
    prompt: string;
    options_json: string | null;
    correct: number | null;
    hint: string | null;
    explanation: string | null;
  }>;
  return rows.flatMap((row) => {
    let options: string[] = [];
    try {
      options = JSON.parse(row.options_json || "[]") as string[];
    } catch {
      options = [];
    }
    const subject = PRACTICE_SUBJECTS.includes(row.subject as PracticeSubject)
      ? (row.subject as PracticeSubject)
      : null;
    const difficulty = PRACTICE_DIFFICULTIES.includes(row.difficulty as PracticeDifficulty)
      ? (row.difficulty as PracticeDifficulty)
      : null;
    if (!subject || !difficulty || options.length < 2) return [];
    return [
      {
        subject,
        topic: row.topic || "General",
        difficulty,
        prompt: row.prompt,
        options,
        correct: Number(row.correct ?? 0),
        hint: row.hint || "",
        explanation: row.explanation || "",
      },
    ];
  });
}

export function listPublishedAssessments(kind: "quiz" | "test" | "exam") {
  ensureSeeded();
  return (
    db()
      .prepare(
        `SELECT i.id, i.title, i.body, i.duration, i.extra_json, c.title AS course_title, i.created_at
         FROM teacher_items i
         LEFT JOIN courses c ON c.id = i.course_id
         WHERE i.kind = ?
         ORDER BY i.created_at DESC`,
      )
      .all(kind) as Array<{
      id: string;
      title: string;
      body: string;
      duration: string | null;
      extra_json: string | null;
      course_title: string | null;
      created_at: string;
    }>
  ).map(plain);
}

export function getPublishedAssessment(id: string, kind?: "quiz" | "test" | "exam") {
  ensureSeeded();
  const row = (
    kind
      ? db()
          .prepare(
            `SELECT i.id, i.kind, i.title, i.body, i.duration, i.extra_json, c.title AS course_title
             FROM teacher_items i LEFT JOIN courses c ON c.id = i.course_id WHERE i.id = ? AND i.kind = ?`,
          )
          .get(id, kind)
      : db()
          .prepare(
            `SELECT i.id, i.kind, i.title, i.body, i.duration, i.extra_json, c.title AS course_title
             FROM teacher_items i LEFT JOIN courses c ON c.id = i.course_id WHERE i.id = ?`,
          )
          .get(id)
  ) as
    | {
        id: string;
        kind: string;
        title: string;
        body: string;
        duration: string | null;
        extra_json: string | null;
        course_title: string | null;
      }
    | undefined;
  if (!row) return null;
  let questions: TeacherQuizQuestion[] = [];
  try {
    const parsed = JSON.parse(row.extra_json || "{}") as { questions?: TeacherQuizQuestion[] };
    questions = Array.isArray(parsed.questions) ? parsed.questions : [];
  } catch {
    questions = [];
  }
  return { ...plain(row), questions };
}

export function createTeacherContent(input: CreateTeacherContentInput): { error: string | null; id?: string } {
  ensureSeeded();
  const kind = input.kind;
  const title = trim(input.title);
  const body = trim(input.body);
  const courseId = trim(input.courseId);
  const studentId = trim(input.studentId);

  if (kind === "course") {
    if (!title || !body) return { error: "Course title and description are required." };
    const id = newId("course");
    db()
      .prepare(
        `INSERT INTO courses (id, title, description, category, level, duration, lesson_count, published, teacher_id)
         VALUES (?, ?, ?, ?, ?, ?, 0, 1, ?)`,
      )
      .run(
        id,
        title,
        body,
        trim(input.subject) || "IT",
        trim(input.difficulty) || "Beginner",
        trim(input.duration) || "8 weeks",
        input.teacherId,
      );
    writeAudit(input.teacherName, "Added course", title);
    notifyStudents(input.teacherId, "course", `New course: ${title}`);
    return { error: null, id };
  }

  if (kind === "lesson") {
    if (!title || !courseId) return { error: "Lesson title and course are required." };
    if (!teacherOwnsCourse(input.teacherId, courseId)) return { error: "Choose one of your courses." };
    const moduleId = courseModuleId(courseId);
    const sort = db().prepare("SELECT COUNT(*) AS count FROM lessons WHERE module_id = ?").get(moduleId) as {
      count: number;
    };
    const id = newId("lesson");
    db()
      .prepare("INSERT INTO lessons (id, title, duration, sort_order, module_id) VALUES (?, ?, ?, ?, ?)")
      .run(id, title, trim(input.duration) || "20 min", sort.count + 1, moduleId);
    db()
      .prepare(
        "UPDATE courses SET lesson_count = (SELECT COUNT(*) FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = ?) WHERE id = ?",
      )
      .run(courseId, courseId);
    writeAudit(input.teacherName, "Added lesson", title);
    notifyStudents(input.teacherId, "lesson", `New lesson: ${title}`);
    return { error: null, id };
  }

  if (kind === "assignment") {
    if (!title || !courseId || !body) return { error: "Assignment title, course, and instructions are required." };
    if (!teacherOwnsCourse(input.teacherId, courseId)) return { error: "Choose one of your courses." };
    const id = newId("asg");
    db()
      .prepare("INSERT INTO assignments (id, title, deadline, instructions, course_id) VALUES (?, ?, ?, ?, ?)")
      .run(id, title, trim(input.deadline) || "Next week", body, courseId);
    writeAudit(input.teacherName, "Added assignment", title);
    notifyStudents(input.teacherId, "assignment", `New assignment: ${title}`);
    return { error: null, id };
  }

  if (kind === "practice") {
    const prompt = body || title;
    const options = (input.options ?? []).map((opt) => trim(opt)).filter(Boolean);
    if (!prompt || options.length < 2) return { error: "A question and at least two options are required." };
    const correct = Number(input.correct);
    if (!Number.isInteger(correct) || correct < 0 || correct >= options.length) {
      return { error: "Choose the correct option." };
    }
    const subject = trim(input.subject) || "Python";
    const topic = trim(input.topic) || "General";
    const difficulty = trim(input.difficulty) || "Easy";
    const id = newId("practice");
    insertItem({
      id,
      teacher_id: input.teacherId,
      kind,
      title: prompt.slice(0, 80),
      body: prompt,
      subject,
      topic,
      difficulty,
      course_id: courseId || null,
      class_name: null,
      student_id: null,
      duration: null,
      deadline: null,
      options_json: JSON.stringify(options),
      correct,
      hint: trim(input.hint),
      explanation: trim(input.explanation),
      score: null,
      max_score: null,
      extra_json: null,
    });
    writeAudit(input.teacherName, "Added practice question", prompt.slice(0, 80));
    notifyStudents(input.teacherId, "practice", `New practice: ${topic}`);
    return { error: null, id };
  }

  if (kind === "quiz" || kind === "test" || kind === "exam") {
    if (!title) return { error: "A title is required." };
    const questions = parseQuestions(input.questions);
    if (questions.length === 0) return { error: "Add at least one question with options." };
    if (courseId && !teacherOwnsCourse(input.teacherId, courseId)) return { error: "Choose one of your courses." };
    const id = newId(kind);
    insertItem({
      id,
      teacher_id: input.teacherId,
      kind,
      title,
      body,
      subject: null,
      topic: null,
      difficulty: null,
      course_id: courseId || null,
      class_name: null,
      student_id: null,
      duration: trim(input.duration) || (kind === "quiz" ? "15 min" : "45 min"),
      deadline: null,
      options_json: null,
      correct: null,
      hint: null,
      explanation: null,
      score: null,
      max_score: null,
      extra_json: JSON.stringify({ questions }),
    });
    writeAudit(input.teacherName, `Added ${kind}`, title);
    notifyStudents(input.teacherId, kind, `New ${kind}: ${title}`);
    return { error: null, id };
  }

  if (kind === "class") {
    if (!title) return { error: "Class name is required." };
    const id = newId("class");
    insertItem({
      id,
      teacher_id: input.teacherId,
      kind,
      title,
      body,
      subject: null,
      topic: null,
      difficulty: null,
      course_id: null,
      class_name: title,
      student_id: null,
      duration: null,
      deadline: null,
      options_json: null,
      correct: null,
      hint: null,
      explanation: null,
      score: null,
      max_score: null,
      extra_json: null,
    });
    writeAudit(input.teacherName, "Added class", title);
    return { error: null, id };
  }

  if (kind === "feedback") {
    if (!studentId || !body) return { error: "Student and feedback message are required." };
    const id = newId("feedback");
    insertItem({
      id,
      teacher_id: input.teacherId,
      kind,
      title: title || "Feedback",
      body,
      subject: null,
      topic: null,
      difficulty: null,
      course_id: courseId || null,
      class_name: null,
      student_id: studentId,
      duration: null,
      deadline: null,
      options_json: null,
      correct: null,
      hint: null,
      explanation: null,
      score: null,
      max_score: null,
      extra_json: null,
    });
    writeAudit(input.teacherName, "Added feedback", title || studentId);
    notifyStudents(input.teacherId, "feedback", title || "New feedback from your teacher", studentId);
    return { error: null, id };
  }

  if (kind === "grade") {
    if (!studentId || !title) return { error: "Student and grade title are required." };
    const score = Number(input.score);
    const maxScore = Number(input.maxScore ?? 100);
    if (!Number.isFinite(score)) return { error: "Enter a numeric score." };
    const id = newId("grade");
    insertItem({
      id,
      teacher_id: input.teacherId,
      kind,
      title,
      body,
      subject: null,
      topic: null,
      difficulty: null,
      course_id: courseId || null,
      class_name: null,
      student_id: studentId,
      duration: null,
      deadline: null,
      options_json: null,
      correct: null,
      hint: null,
      explanation: null,
      score: Math.round(score),
      max_score: Number.isFinite(maxScore) ? Math.round(maxScore) : 100,
      extra_json: null,
    });
    writeAudit(input.teacherName, "Added grade", title);
    notifyStudents(input.teacherId, "grade", `New grade: ${title}`, studentId);
    return { error: null, id };
  }

  return { error: "Unknown content type." };
}
