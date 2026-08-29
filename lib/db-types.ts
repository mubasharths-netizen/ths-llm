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
