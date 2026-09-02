import "server-only";
import { db, ensureSeeded, teacherRoster } from "@/lib/db";

export type TeacherAnalytics = {
  studentCount: number;
  courseCount: number;
  publishedCount: number;
  averageScore: number;
  lessonCount: number;
  assignmentCount: number;
  scoreBands: Array<{ label: string; value: number; color: string }>;
  classAverages: Array<{ label: string; value: number; hint: string }>;
  courseProgress: Array<{ label: string; value: number }>;
  contentMix: Array<{ label: string; value: number; color: string }>;
  topScores: Array<{ label: string; value: number }>;
  gradeAverage: number | null;
};

function plain<T extends object>(row: T): T {
  return { ...row };
}

export function teacherAnalytics(teacherId: string): TeacherAnalytics {
  ensureSeeded();
  const students = teacherRoster(teacherId);
  const courses = (
    db()
      .prepare(
        `SELECT c.id, c.title, c.published, COALESCE(AVG(e.progress), 0) AS progress
         FROM courses c
         LEFT JOIN enrollments e ON e.course_id = c.id
         WHERE c.teacher_id = ?
         GROUP BY c.id
         ORDER BY c.title`,
      )
      .all(teacherId) as Array<{ id: string; title: string; published: number; progress: number }>
  ).map(plain);

  const lessonCount = (
    db()
      .prepare(
        `SELECT COUNT(*) AS count
         FROM lessons l
         JOIN modules m ON m.id = l.module_id
         JOIN courses c ON c.id = m.course_id
         WHERE c.teacher_id = ?`,
      )
      .get(teacherId) as { count: number }
  ).count;

  const assignmentCount = (
    db()
      .prepare(
        `SELECT COUNT(*) AS count
         FROM assignments a
         JOIN courses c ON c.id = a.course_id
         WHERE c.teacher_id = ?`,
      )
      .get(teacherId) as { count: number }
  ).count;

  const itemCounts = (
    db()
      .prepare("SELECT kind, COUNT(*) AS count FROM teacher_items WHERE teacher_id = ? GROUP BY kind")
      .all(teacherId) as Array<{ kind: string; count: number }>
  ).map(plain);

  const countOf = (kind: string) => itemCounts.find((row) => row.kind === kind)?.count ?? 0;

  const bands = [
    { label: "Needs support", min: 0, max: 499, color: "var(--error)" },
    { label: "Developing", min: 500, max: 699, color: "var(--hint)" },
    { label: "Strong", min: 700, max: 849, color: "var(--teal)" },
    { label: "Excellent", min: 850, max: 1000, color: "var(--primary)" },
  ];

  const scoreBands = bands.map((band) => ({
    label: band.label,
    color: band.color,
    value: students.filter((row) => row.score >= band.min && row.score <= band.max).length,
  }));

  const classMap = new Map<string, { total: number; count: number }>();
  students.forEach((row) => {
    const name = row.class || "No class";
    const current = classMap.get(name) ?? { total: 0, count: 0 };
    classMap.set(name, { total: current.total + row.score, count: current.count + 1 });
  });
  const classAverages = [...classMap.entries()].map(([label, stats]) => ({
    label,
    value: Math.round(stats.total / stats.count),
    hint: `${Math.round(stats.total / stats.count)} avg · ${stats.count} students`,
  }));

  const avgScore =
    students.length > 0 ? Math.round(students.reduce((sum, row) => sum + row.score, 0) / students.length) : 0;

  const gradeRow = db()
    .prepare(
      `SELECT AVG(CASE WHEN max_score > 0 THEN (score * 100.0 / max_score) ELSE score END) AS avg
       FROM teacher_items WHERE teacher_id = ? AND kind = 'grade'`,
    )
    .get(teacherId) as { avg: number | null };

  const topScores = [...students]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((row) => ({ label: row.name.split(" ")[0] ?? row.name, value: row.score }));

  return {
    studentCount: students.length,
    courseCount: courses.length,
    publishedCount: courses.filter((row) => Number(row.published) === 1).length,
    averageScore: avgScore,
    lessonCount,
    assignmentCount,
    scoreBands,
    classAverages,
    courseProgress: courses.map((row) => ({ label: row.title, value: Math.round(Number(row.progress) || 0) })),
    contentMix: [
      { label: "Lessons", value: lessonCount, color: "var(--primary)" },
      { label: "Practice", value: countOf("practice"), color: "var(--teal)" },
      { label: "Quizzes", value: countOf("quiz"), color: "var(--ai)" },
      { label: "Tests", value: countOf("test") + countOf("exam"), color: "var(--hint)" },
      { label: "Assignments", value: assignmentCount, color: "var(--error)" },
    ],
    topScores,
    gradeAverage: gradeRow.avg == null ? null : Math.round(gradeRow.avg),
  };
}
