import { AppShell } from "@/components/app/app-shell";
import { adminNav, studentNav, teacherNav } from "@/lib/nav";
import { currentSessionProfile } from "@/lib/session-user";

export async function StudentShell({ children, title }: { children: React.ReactNode; title: string }) {
  const profile = await currentSessionProfile("Student");
  return (
    <AppShell
      nav={studentNav}
      role="Student"
      userName={profile.name}
      avatarUrl={profile.avatarUrl}
      profileHref="/student/profile"
      title={title}
    >
      {children}
    </AppShell>
  );
}

export async function TeacherShell({ children, title }: { children: React.ReactNode; title: string }) {
  const profile = await currentSessionProfile("Teacher");
  return (
    <AppShell
      nav={teacherNav}
      role="Teacher"
      userName={profile.name}
      avatarUrl={profile.avatarUrl}
      profileHref="/teacher/profile"
      title={title}
    >
      {children}
    </AppShell>
  );
}

export async function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const profile = await currentSessionProfile("Admin");
  return (
    <AppShell
      nav={adminNav}
      role="Admin"
      userName={profile.name}
      avatarUrl={profile.avatarUrl}
      profileHref="/admin/profile"
      title={title}
    >
      {children}
    </AppShell>
  );
}
