export type SqlRow = Record<string, unknown>;

export type CourseLesson = {
  id: string;
  title: string;
  duration: string;
};

export type CourseModule = {
  id: string;
  title: string;
  lessons: CourseLesson[];
};

export type CourseDetail = {
  id: string;
  title: string;
  description: string;
  teacher_name: string;
  category: string;
  level: string;
  duration: string;
  lesson_count: number;
  modules: CourseModule[];
};

export type CourseCard = {
  id: string;
  title: string;
  teacher: string;
  level: string;
  category: string;
  progress: number;
  duration: string;
  lessons: number;
  description: string;
};

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Teacher" | "Admin";
  class: string;
  status: string;
};
