import { AppShell } from "@/components/app/app-shell";
import { adminNav, studentNav, teacherNav } from "@/lib/nav";
import { admin, student, teacher } from "@/lib/data";

export function StudentShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <AppShell nav={studentNav} role="Student" userName={student.name} title={title}>
      {children}
    </AppShell>
  );
}

export function TeacherShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <AppShell nav={teacherNav} role="Teacher" userName={teacher.name} title={title}>
      {children}
    </AppShell>
  );
}

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <AppShell nav={adminNav} role="Admin" userName={admin.name} title={title}>
      {children}
    </AppShell>
  );
}
