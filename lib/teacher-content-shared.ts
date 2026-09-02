export const TEACHER_CONTENT_KINDS = [
  "course",
  "class",
  "lesson",
  "practice",
  "quiz",
  "test",
  "exam",
  "assignment",
  "feedback",
  "grade",
] as const;

export type TeacherContentKind = (typeof TEACHER_CONTENT_KINDS)[number];

export type TeacherContentRow = {
  id: string;
  teacher_id: string;
  kind: string;
  title: string;
  body: string;
  subject: string | null;
  topic: string | null;
  difficulty: string | null;
  course_id: string | null;
  class_name: string | null;
  student_id: string | null;
  duration: string | null;
  deadline: string | null;
  options_json: string | null;
  correct: number | null;
  hint: string | null;
  explanation: string | null;
  score: number | null;
  max_score: number | null;
  extra_json: string | null;
  created_at: string;
  student_name: string | null;
  course_title: string | null;
};

export type TeacherQuizQuestion = {
  prompt: string;
  options: string[];
  correct: number;
};

export type CreateTeacherContentInput = {
  teacherId: string;
  teacherName: string;
  kind: TeacherContentKind;
  title?: string;
  body?: string;
  subject?: string;
  topic?: string;
  difficulty?: string;
  courseId?: string;
  className?: string;
  studentId?: string;
  duration?: string;
  deadline?: string;
  options?: string[];
  correct?: number;
  hint?: string;
  explanation?: string;
  score?: number;
  maxScore?: number;
  questions?: TeacherQuizQuestion[];
};

export const CONTENT_PAGES: Record<
  TeacherContentKind,
  { href: string; label: string; addLabel: string; description: string }
> = {
  course: {
    href: "/teacher/courses",
    label: "Courses",
    addLabel: "Add course",
    description: "Create a course students can enrol in and study.",
  },
  class: {
    href: "/teacher/classes",
    label: "Classes",
    addLabel: "Add class",
    description: "Add a class or cohort you teach.",
  },
  lesson: {
    href: "/teacher/lessons",
    label: "Lessons",
    addLabel: "Add lesson",
    description: "Add a lesson to one of your courses.",
  },
  practice: {
    href: "/teacher/practice",
    label: "Practice questions",
    addLabel: "Add practice question",
    description: "Add practice questions students can attempt by subject and topic.",
  },
  quiz: {
    href: "/teacher/quizzes",
    label: "Quizzes",
    addLabel: "Add quiz",
    description: "Add a short quiz with multiple-choice questions.",
  },
  test: {
    href: "/teacher/tests",
    label: "Tests",
    addLabel: "Add test",
    description: "Add a locked test for your classes.",
  },
  exam: {
    href: "/teacher/exams",
    label: "Exams",
    addLabel: "Add exam",
    description: "Add a formal exam for your courses.",
  },
  assignment: {
    href: "/teacher/assignments",
    label: "Assignments",
    addLabel: "Add assignment",
    description: "Add lab work and homework with a deadline.",
  },
  feedback: {
    href: "/teacher/feedback",
    label: "Feedback",
    addLabel: "Add feedback",
    description: "Send written feedback to a student.",
  },
  grade: {
    href: "/teacher/grades",
    label: "Grades",
    addLabel: "Add grade",
    description: "Record a mark for a student.",
  },
};

export function isTeacherContentKind(value: string): value is TeacherContentKind {
  return (TEACHER_CONTENT_KINDS as readonly string[]).includes(value);
}
