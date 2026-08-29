import { db, ensureSeeded, getUserById, listUsers, teacherRoster, writeAudit, type DbUser } from "@/lib/db";

export type RosterStudent = { id: string; name: string; email: string; class: string };

export type ClassMessage = {
  id: string;
  subject: string;
  body: string;
  kind: string;
  audience: string;
  class_name: string | null;
  created_at: string;
  teacher_name: string;
  recipients: string;
};

export type ComplaintRow = {
  id: string;
  teacher_id: string;
  student_id: string;
  teacher_name: string;
  student_name: string;
  class_name: string;
  category: string;
  description: string;
  notes: string | null;
  status: string;
  visible_to_student: number;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DisciplineRow = {
  id: string;
  teacher_id: string;
  student_id: string;
  teacher_name: string;
  student_name: string;
  class_name: string;
  level: string;
  description: string;
  recommended_action: string | null;
  status: string;
  visible_to_student: number;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CaseEvent = {
  id: string;
  actor_name: string;
  action: string;
  note: string | null;
  created_at: string;
};

function plain<T extends object>(row: T): T {
  return { ...row };
}

export function teacherAccessibleStudents(teacherId: string): RosterStudent[] {
  ensureSeeded();
  const roster = teacherRoster(teacherId).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    class: row.class || "",
  }));
  if (roster.length > 0) return roster;
  return listUsers("student")
    .filter((user) => user.status === "Active")
    .map((user) => ({ id: user.id, name: user.name, email: user.email, class: user.class_name ?? "" }));
}

export function canAccessStudent(actor: { id: string; role: string }, studentId: string) {
  if (actor.role === "admin") return true;
  if (actor.role !== "teacher") return false;
  return teacherAccessibleStudents(actor.id).some((row) => row.id === studentId);
}

function requireStudent(studentId: string): DbUser | null {
  const user = getUserById(studentId);
  if (!user || user.role !== "student") return null;
  return user;
}

function addEvent(caseType: string, caseId: string, actorName: string, action: string, note = "") {
  db()
    .prepare("INSERT INTO case_events (id, case_type, case_id, actor_name, action, note) VALUES (?, ?, ?, ?, ?, ?)")
    .run(`e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, caseType, caseId, actorName, action, note);
}

export function listCaseEvents(caseType: string, caseId: string): CaseEvent[] {
  ensureSeeded();
  return (
    db()
      .prepare(
        "SELECT id, actor_name, action, note, created_at FROM case_events WHERE case_type = ? AND case_id = ? ORDER BY created_at",
      )
      .all(caseType, caseId) as CaseEvent[]
  ).map(plain);
}

export function sendClassMessage(input: {
  teacherId: string;
  teacherName: string;
  subject: string;
  body: string;
  kind: string;
  audience: "one" | "selected" | "class";
  className?: string;
  studentIds: string[];
}) {
  ensureSeeded();
  const allowed = new Set(teacherAccessibleStudents(input.teacherId).map((row) => row.id));
  let ids = [...new Set(input.studentIds)].filter((id) => allowed.has(id));
  if (input.audience === "class" && input.className) {
    ids = teacherAccessibleStudents(input.teacherId)
      .filter((row) => row.class === input.className)
      .map((row) => row.id);
  }
  if (ids.length === 0) return { error: "Select at least one student you are authorized to contact." as const };
  const id = `msg-${Date.now()}`;
  db()
    .prepare(
      `INSERT INTO class_messages (id, teacher_id, subject, body, kind, audience, class_name)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(id, input.teacherId, input.subject, input.body, input.kind, input.audience, input.className || null);
  const insertRecipient = db().prepare("INSERT INTO class_message_recipients (message_id, student_id) VALUES (?, ?)");
  const insertNote = db().prepare(
    "INSERT INTO notifications (id, type, title, unread, user_id) VALUES (?, ?, ?, 1, ?)",
  );
  ids.forEach((studentId, index) => {
    insertRecipient.run(id, studentId);
    insertNote.run(`n-${Date.now()}-${index}`, input.kind, input.subject, studentId);
  });
  writeAudit(input.teacherName, "Sent message", input.subject);
  return { error: null, id, count: ids.length };
}

export function listTeacherMessages(teacherId: string): ClassMessage[] {
  ensureSeeded();
  return (
    db()
      .prepare(
        `SELECT m.id, m.subject, m.body, m.kind, m.audience, m.class_name, m.created_at, u.name AS teacher_name,
                GROUP_CONCAT(s.name, ', ') AS recipients
         FROM class_messages m
         JOIN users u ON u.id = m.teacher_id
         JOIN class_message_recipients r ON r.message_id = m.id
         JOIN users s ON s.id = r.student_id
         WHERE m.teacher_id = ?
         GROUP BY m.id
         ORDER BY m.created_at DESC`,
      )
      .all(teacherId) as ClassMessage[]
  ).map(plain);
}

export function listStudentMessages(studentId: string): ClassMessage[] {
  ensureSeeded();
  return (
    db()
      .prepare(
        `SELECT m.id, m.subject, m.body, m.kind, m.audience, m.class_name, m.created_at, u.name AS teacher_name,
                s.name AS recipients
         FROM class_messages m
         JOIN users u ON u.id = m.teacher_id
         JOIN class_message_recipients r ON r.message_id = m.id
         JOIN users s ON s.id = r.student_id
         WHERE r.student_id = ?
         ORDER BY m.created_at DESC`,
      )
      .all(studentId) as ClassMessage[]
  ).map(plain);
}

export function createComplaint(input: {
  teacherId: string;
  teacherName: string;
  studentId: string;
  category: string;
  description: string;
  notes?: string;
}) {
  ensureSeeded();
  const student = requireStudent(input.studentId);
  if (!student) return { error: "Student not found." as const };
  if (!canAccessStudent({ id: input.teacherId, role: "teacher" }, input.studentId)) {
    return { error: "You can only file complaints for your own students." as const };
  }
  const id = `cmp-${Date.now()}`;
  db()
    .prepare(
      `INSERT INTO complaints (id, teacher_id, student_id, class_name, category, description, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`,
    )
    .run(
      id,
      input.teacherId,
      input.studentId,
      student.class_name || "",
      input.category,
      input.description,
      input.notes || "",
    );
  addEvent("complaint", id, input.teacherName, "Submitted", input.category);
  writeAudit(input.teacherName, "Submitted complaint", student.name);
  return { error: null, id };
}

export function createDisciplineReport(input: {
  teacherId: string;
  teacherName: string;
  studentId: string;
  level: string;
  description: string;
  recommendedAction?: string;
}) {
  ensureSeeded();
  const student = requireStudent(input.studentId);
  if (!student) return { error: "Student not found." as const };
  if (!canAccessStudent({ id: input.teacherId, role: "teacher" }, input.studentId)) {
    return { error: "You can only record incidents for your own students." as const };
  }
  const id = `dsc-${Date.now()}`;
  const status = input.level === "escalate" ? "Pending" : "Recorded";
  db()
    .prepare(
      `INSERT INTO discipline_reports
        (id, teacher_id, student_id, class_name, level, description, recommended_action, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.teacherId,
      input.studentId,
      student.class_name || "",
      input.level,
      input.description,
      input.recommendedAction || "",
      status,
    );
  addEvent("discipline", id, input.teacherName, status === "Pending" ? "Escalated to admin" : "Recorded", input.level);
  writeAudit(input.teacherName, "Discipline report", student.name);
  return { error: null, id };
}

function complaintQuery(where: string) {
  return `SELECT c.id, c.teacher_id, c.student_id, t.name AS teacher_name, s.name AS student_name,
          c.class_name, c.category, c.description, c.notes, c.status, c.visible_to_student, c.admin_notes,
          c.created_at, c.updated_at
          FROM complaints c
          JOIN users t ON t.id = c.teacher_id
          JOIN users s ON s.id = c.student_id
          ${where}
          ORDER BY c.created_at DESC`;
}

function disciplineQuery(where: string) {
  return `SELECT d.id, d.teacher_id, d.student_id, t.name AS teacher_name, s.name AS student_name,
          d.class_name, d.level, d.description, d.recommended_action, d.status, d.visible_to_student,
          d.admin_notes, d.created_at, d.updated_at
          FROM discipline_reports d
          JOIN users t ON t.id = d.teacher_id
          JOIN users s ON s.id = d.student_id
          ${where}
          ORDER BY d.created_at DESC`;
}

export function listComplaints(filter: { teacherId?: string; studentId?: string; visibleOnly?: boolean }): ComplaintRow[] {
  ensureSeeded();
  if (filter.teacherId) {
    return (db().prepare(complaintQuery("WHERE c.teacher_id = ?")).all(filter.teacherId) as ComplaintRow[]).map(plain);
  }
  if (filter.studentId) {
    const sql = filter.visibleOnly
      ? complaintQuery("WHERE c.student_id = ? AND c.visible_to_student = 1")
      : complaintQuery("WHERE c.student_id = ?");
    return (db().prepare(sql).all(filter.studentId) as ComplaintRow[]).map(plain);
  }
  return (db().prepare(complaintQuery("")).all() as ComplaintRow[]).map(plain);
}

export function listDiscipline(filter: { teacherId?: string; studentId?: string; visibleOnly?: boolean }): DisciplineRow[] {
  ensureSeeded();
  if (filter.teacherId) {
    return (db().prepare(disciplineQuery("WHERE d.teacher_id = ?")).all(filter.teacherId) as DisciplineRow[]).map(plain);
  }
  if (filter.studentId) {
    const sql = filter.visibleOnly
      ? disciplineQuery("WHERE d.student_id = ? AND d.visible_to_student = 1")
      : disciplineQuery("WHERE d.student_id = ?");
    return (db().prepare(sql).all(filter.studentId) as DisciplineRow[]).map(plain);
  }
  return (db().prepare(disciplineQuery("")).all() as DisciplineRow[]).map(plain);
}

export function reviewCase(input: {
  adminName: string;
  type: "complaint" | "discipline";
  id: string;
  status: string;
  adminNotes: string;
  visibleToStudent: boolean;
}) {
  ensureSeeded();
  const table = input.type === "complaint" ? "complaints" : "discipline_reports";
  const existing = db().prepare(`SELECT id FROM ${table} WHERE id = ?`).get(input.id) as { id: string } | undefined;
  if (!existing) return { error: "Case not found." as const };
  db()
    .prepare(
      `UPDATE ${table} SET status = ?, admin_notes = ?, visible_to_student = ?, updated_at = datetime('now') WHERE id = ?`,
    )
    .run(input.status, input.adminNotes, input.visibleToStudent ? 1 : 0, input.id);
  addEvent(input.type, input.id, input.adminName, input.status, input.adminNotes);
  writeAudit(input.adminName, `Reviewed ${input.type}`, input.id);
  return { error: null };
}
