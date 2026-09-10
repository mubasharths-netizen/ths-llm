export const DEMO_PASSWORD = "admin";

export const DEMO_ACCOUNTS = [
  {
    id: "firebase-admin",
    name: "Administrator",
    email: "admin@gmail.com",
    role: "admin" as const,
    class_name: "Ops",
    alias: "admin",
  },
  {
    id: "demo-admin",
    name: "Administrator",
    email: "admin@thslab.edu",
    role: "admin" as const,
    class_name: "Ops",
    alias: "admin-lms",
  },
  {
    id: "demo-teacher",
    name: "Teacher",
    email: "teacher@thslab.edu",
    role: "teacher" as const,
    class_name: "Faculty",
    alias: "teacher",
  },
  {
    id: "demo-student",
    name: "Student",
    email: "student@thslab.edu",
    role: "student" as const,
    class_name: "BSIT-4A",
    alias: "student",
  },
] as const;

export function resolveLoginEmail(input: string) {
  const value = input.trim().toLowerCase();
  if (value === "admin" || value === "admin@gmail.com") return "admin@gmail.com";
  if (value === "admin@thslab.edu" || value === "admin-lms") return "admin@thslab.edu";
  if (value === "teacher" || value === "teacher@thslab.edu") return "teacher@thslab.edu";
  if (value === "student" || value === "studant" || value === "student@thslab.edu") {
    return "student@thslab.edu";
  }
  return value;
}
