import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { hashPassword } from "@/lib/password";
import { dataDir } from "@/lib/data-dir";
import { SCHEMA_SQL } from "@/lib/schema-sql";
import type { AdminUserRow, CourseCard, CourseDetail, CourseLesson, CourseModule, SqlRow } from "@/lib/db-types";

export type { AdminUserRow, CourseCard, CourseDetail, CourseLesson, CourseModule, SqlRow };

const dbPath = path.join(dataDir(), "ths.db");

type GlobalDb = { db?: DatabaseSync; seeded?: boolean };

const globalForDb = globalThis as unknown as GlobalDb;

export type DbUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: "student" | "teacher" | "admin";
  class_name: string | null;
  status: string;
  score: number;
  subject: string | null;
  qualification: string | null;
  avatar: string | null;
};

function openDb() {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(SCHEMA_SQL);
  migrateUsers(db);
  return db;
}

function migrateUsers(database: DatabaseSync) {
  const cols = database.prepare("PRAGMA table_info(users)").all() as Array<{ name: string }>;
  if (!cols.some((col) => col.name === "avatar")) {
    database.exec("ALTER TABLE users ADD COLUMN avatar TEXT");
  }
}

export function db() {
  if (!globalForDb.db) {
    globalForDb.db = openDb();
  }
  return globalForDb.db;
}

export function ensureSeeded() {
  const database = db();
  migrateUsers(database);
  database.exec(SCHEMA_SQL);
}

export function getUserByEmail(email: string) {
  ensureSeeded();
  return db().prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as DbUser | undefined;
}

export function getUserById(id: string) {
  ensureSeeded();
  return db().prepare("SELECT * FROM users WHERE id = ?").get(id) as DbUser | undefined;
}

export function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
}) {
  ensureSeeded();
  const admins = db().prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").get() as { count: number };
  const role = admins.count === 0 ? "admin" : input.role;
  const id = `${role}-${Date.now()}`;
  db()
    .prepare(
      `INSERT INTO users (id, name, email, password_hash, role, class_name, status, score)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
    )
    .run(
      id,
      input.name,
      input.email.toLowerCase(),
      hashPassword(input.password),
      role,
      role === "student" ? "BSIT-4A" : role === "teacher" ? "Faculty" : "Ops",
      role === "teacher" ? "Pending" : "Active",
    );
  return getUserById(id)!;
}

export function listCourses() {
  ensureSeeded();
  return db()
    .prepare(
      `SELECT c.*, u.name AS teacher_name
       FROM courses c
       JOIN users u ON u.id = c.teacher_id
       WHERE c.published = 1
       ORDER BY c.title`,
    )
    .all() as SqlRow[];
}

export function getCourse(id: string): CourseDetail | null {
  ensureSeeded();
  const course = db()
    .prepare(
      `SELECT c.*, u.name AS teacher_name
       FROM courses c
       JOIN users u ON u.id = c.teacher_id
       WHERE c.id = ?`,
    )
    .get(id) as SqlRow | undefined;
  if (!course) return null;
  const modules = db()
    .prepare("SELECT * FROM modules WHERE course_id = ? ORDER BY sort_order")
    .all(id) as Array<{ id: string; title: string }>;
  const withLessons: CourseModule[] = modules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    lessons: db()
      .prepare("SELECT id, title, duration FROM lessons WHERE module_id = ? ORDER BY sort_order")
      .all(mod.id) as CourseLesson[],
  }));
  return {
    id: String(course.id),
    title: String(course.title),
    description: String(course.description ?? ""),
    teacher_name: String(course.teacher_name ?? ""),
    category: String(course.category),
    level: String(course.level),
    duration: String(course.duration),
    lesson_count: Number(course.lesson_count ?? 0),
    modules: withLessons,
  };
}

export function teacherCourses(teacherId: string) {
  ensureSeeded();
  return db()
    .prepare(
      `SELECT c.*, u.name AS teacher_name
       FROM courses c
       JOIN users u ON u.id = c.teacher_id
       WHERE c.teacher_id = ?
       ORDER BY c.title`,
    )
    .all(teacherId) as Array<Record<string, unknown>>;
}

export function teacherRoster(teacherId: string) {
  ensureSeeded();
  return db()
    .prepare(
      `SELECT DISTINCT u.id, u.name, u.email, u.class_name AS class, u.score
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       JOIN users u ON u.id = e.user_id
       WHERE c.teacher_id = ?
       ORDER BY u.name`,
    )
    .all(teacherId) as Array<{ id: string; name: string; email: string; class: string; score: number }>;
}

export function studentDashboard(userId: string) {
  ensureSeeded();
  const user = getUserById(userId);
  const enrollments = db()
    .prepare(
      `SELECT c.id, c.title, c.level, u.name AS teacher_name, e.progress
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       JOIN users u ON u.id = c.teacher_id
       WHERE e.user_id = ?
       ORDER BY e.progress DESC`,
    )
    .all(userId) as Array<{ id: string; title: string; level: string; teacher_name: string; progress: number }>;
  const rankRow = db()
    .prepare(
      `SELECT COUNT(*) + 1 AS rank FROM users
       WHERE role = 'student' AND status = 'Active' AND score > ?`,
    )
    .get(user?.score ?? 0) as { rank: number };
  const total = db().prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'student' AND status = 'Active'").get() as {
    count: number;
  };
  return { user, enrollments, rank: rankRow.rank, totalStudents: total.count };
}

function asPlain<T extends object>(row: T): T {
  return { ...row };
}

function asSqlRow(row: unknown): SqlRow {
  if (row && typeof row === "object") return { ...(row as SqlRow) };
  return {};
}

function mapCourse(row: Record<string, unknown>, progress = 0): CourseCard {
  return {
    id: String(row.id),
    title: String(row.title),
    teacher: String(row.teacher_name ?? ""),
    level: String(row.level),
    category: String(row.category),
    progress,
    duration: String(row.duration),
    lessons: Number(row.lesson_count ?? 0),
    description: String(row.description),
  };
}

export function publicCourses(): CourseCard[] {
  return listCourses().map((row) => mapCourse(row, 0));
}

export function studentCourseCards(userId: string): CourseCard[] {
  ensureSeeded();
  const rows = db()
    .prepare(
      `SELECT c.*, u.name AS teacher_name, COALESCE(e.progress, 0) AS progress
       FROM courses c
       JOIN users u ON u.id = c.teacher_id
       LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = ?
       WHERE c.published = 1
       ORDER BY c.title`,
    )
    .all(userId) as Array<Record<string, unknown>>;
  return rows.map((row) => mapCourse(row, Number(row.progress ?? 0)));
}

export function getCourseForStudent(courseId: string, userId: string) {
  const course = getCourse(courseId);
  if (!course) return null;
  const enroll = db()
    .prepare("SELECT progress FROM enrollments WHERE user_id = ? AND course_id = ?")
    .get(userId, courseId) as { progress: number } | undefined;
  const doneRows = db()
    .prepare("SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND completed = 1")
    .all(userId) as Array<{ lesson_id: string }>;
  const completed = new Set(doneRows.map((row) => row.lesson_id));
  const modules = course.modules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    lessons: mod.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration,
      done: completed.has(lesson.id),
    })),
  }));
  return {
    ...mapCourse(
      {
        id: course.id,
        title: course.title,
        teacher_name: course.teacher_name,
        category: course.category,
        level: course.level,
        duration: course.duration,
        lesson_count: course.lesson_count,
        description: course.description,
      },
      enroll?.progress ?? 0,
    ),
    modules,
  };
}

export function studentRankings() {
  ensureSeeded();
  const rows = db()
    .prepare(
      `SELECT name, class_name AS class, score
       FROM users
       WHERE role = 'student' AND status = 'Active'
       ORDER BY score DESC`,
    )
    .all() as Array<{ name: string; class: string; score: number }>;
  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

function roleLabel(role: DbUser["role"]): AdminUserRow["role"] {
  if (role === "student") return "Student";
  if (role === "teacher") return "Teacher";
  return "Admin";
}

export function toAdminUserRow(user: DbUser): AdminUserRow {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleLabel(user.role),
    class: user.class_name ?? "",
    status: user.status,
  };
}

export function listAdminUsers(role?: string) {
  return listUsers(role).map(toAdminUserRow);
}

export function listPendingTeachers() {
  ensureSeeded();
  const rows = db()
    .prepare(
      `SELECT id, name, email, subject, qualification
       FROM users
       WHERE role = 'teacher' AND status = 'Pending'
       ORDER BY name`,
    )
    .all() as Array<{
    id: string;
    name: string;
    email: string;
    subject: string | null;
    qualification: string | null;
  }>;
  return rows.map(asPlain);
}

export function createManagedUser(input: {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
  className?: string;
}) {
  ensureSeeded();
  const id = `${input.role}-${Date.now()}`;
  const className =
    input.className?.trim() ||
    (input.role === "student" ? "BSIT-4A" : input.role === "teacher" ? "Faculty" : "Ops");
  db()
    .prepare(
      `INSERT INTO users (id, name, email, password_hash, role, class_name, status, score)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
    )
    .run(
      id,
      input.name,
      input.email.toLowerCase(),
      hashPassword(input.password),
      input.role,
      className,
      "Active",
    );
  return getUserById(id)!;
}

export function setUserStatus(id: string, status: string) {
  ensureSeeded();
  db().prepare("UPDATE users SET status = ? WHERE id = ?").run(status, id);
  return getUserById(id);
}

export function deleteUser(id: string) {
  ensureSeeded();
  db().prepare("DELETE FROM users WHERE id = ?").run(id);
}

export function setUserAvatar(id: string, filename: string | null) {
  ensureSeeded();
  db().prepare("UPDATE users SET avatar = ? WHERE id = ?").run(filename, id);
  return getUserById(id);
}

export function setUserPassword(email: string, password: string) {
  ensureSeeded();
  const user = getUserByEmail(email);
  if (!user) return null;
  db().prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(password), user.id);
  return getUserById(user.id);
}

export function getAssignmentForStudent(id: string, userId: string) {
  ensureSeeded();
  return db()
    .prepare(
      `SELECT a.id, a.title, a.deadline, a.instructions, c.title AS course, s.status, s.feedback
       FROM assignments a
       JOIN courses c ON c.id = a.course_id
       LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = ?
       WHERE a.id = ?`,
    )
    .get(userId, id) as
    | {
        id: string;
        title: string;
        deadline: string;
        instructions: string;
        course: string;
        status: string | null;
        feedback: string | null;
      }
    | undefined;
}

export function listAuditLogs() {
  ensureSeeded();
  const rows = db()
    .prepare("SELECT actor, action, target, ip, created_at FROM audit_logs ORDER BY created_at DESC")
    .all() as Array<{ actor: string; action: string; target: string; ip: string; created_at: string }>;
  return rows.map(asPlain);
}

export function courseProgressAverages() {
  ensureSeeded();
  return db()
    .prepare(
      `SELECT c.id, c.title, COALESCE(AVG(e.progress), 0) AS progress
       FROM courses c
       LEFT JOIN enrollments e ON e.course_id = c.id
       GROUP BY c.id
       ORDER BY c.title`,
    )
    .all() as Array<{ id: string; title: string; progress: number }>;
}

export function classStats() {
  ensureSeeded();
  return db()
    .prepare(
      `SELECT class_name AS name, COUNT(*) AS students, ROUND(AVG(score)) AS avg
       FROM users
       WHERE role = 'student' AND class_name IS NOT NULL
       GROUP BY class_name
       ORDER BY class_name`,
    )
    .all() as Array<{ name: string; students: number; avg: number }>;
}

export function writeAudit(actor: string, action: string, target: string, ip = "127.0.0.1") {
  ensureSeeded();
  db()
    .prepare("INSERT INTO audit_logs (id, actor, action, target, ip) VALUES (?, ?, ?, ?, ?)")
    .run(`a-${Date.now()}`, actor, action, target, ip);
}

export type AssignmentRow = {
  id: string;
  title: string;
  deadline: string;
  course: string;
  status: string | null;
};

export type NotificationRow = {
  id: string;
  type: string;
  title: string;
  unread: number;
  created_at: string;
  user_id: string;
};

export type MistakeRow = {
  id: string;
  question: string;
  student_answer: string;
  correct_answer: string;
  explanation: string;
  topic: string;
  user_id: string;
};

export function studentAssignments(userId: string): AssignmentRow[] {
  ensureSeeded();
  return db()
    .prepare(
      `SELECT a.id, a.title, a.deadline, c.title AS course, s.status
       FROM assignments a
       JOIN courses c ON c.id = a.course_id
       LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = ?
       ORDER BY a.deadline`,
    )
    .all(userId)
    .map((row: unknown): AssignmentRow => {
      const values = asSqlRow(row);
      return asPlain({
        id: String(values.id),
        title: String(values.title),
        deadline: String(values.deadline),
        course: String(values.course),
        status: values.status == null ? null : String(values.status),
      });
    });
}

export function studentNotifications(userId: string): NotificationRow[] {
  ensureSeeded();
  return db()
    .prepare("SELECT id, type, title, unread, created_at, user_id FROM notifications WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId)
    .map((row: unknown): NotificationRow => {
      const values = asSqlRow(row);
      return asPlain({
        id: String(values.id),
        type: String(values.type),
        title: String(values.title),
        unread: Number(values.unread ?? 0),
        created_at: String(values.created_at),
        user_id: String(values.user_id),
      });
    });
}

export function studentMistakes(userId: string): MistakeRow[] {
  ensureSeeded();
  return db()
    .prepare("SELECT * FROM mistakes WHERE user_id = ?")
    .all(userId)
    .map((row: unknown): MistakeRow => {
      const values = asSqlRow(row);
      return asPlain({
        id: String(values.id),
        question: String(values.question),
        student_answer: String(values.student_answer),
        correct_answer: String(values.correct_answer),
        explanation: String(values.explanation),
        topic: String(values.topic),
        user_id: String(values.user_id),
      });
    });
}

export function adminOverview() {
  ensureSeeded();
  const students = db().prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'student'").get() as { count: number };
  const teachers = db().prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'teacher' AND status = 'Active'").get() as {
    count: number;
  };
  const courses = db().prepare("SELECT COUNT(*) AS count FROM courses").get() as { count: number };
  const active = db().prepare("SELECT COUNT(*) AS count FROM users WHERE status = 'Active'").get() as { count: number };
  const avg = db().prepare("SELECT AVG(score) AS avg FROM users WHERE role = 'student' AND status = 'Active'").get() as {
    avg: number | null;
  };
  const logs = (
    db().prepare("SELECT actor, action, target, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 8").all() as Array<{
      actor: string;
      action: string;
      target: string;
      created_at: string;
    }>
  ).map(asPlain);
  return {
    students: students.count,
    teachers: teachers.count,
    courses: courses.count,
    active: active.count,
    averageScore: Math.round(avg.avg || 0),
    logs,
  };
}

export function userCount() {
  ensureSeeded();
  const row = db().prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number };
  return row.count;
}

export function adminCount() {
  ensureSeeded();
  const row = db().prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").get() as { count: number };
  return row.count;
}

export function listUsers(role?: string) {
  ensureSeeded();
  if (role) {
    return db().prepare("SELECT * FROM users WHERE role = ? ORDER BY name").all(role) as DbUser[];
  }
  return db().prepare("SELECT * FROM users ORDER BY role, name").all() as DbUser[];
}
