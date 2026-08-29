import { StudentShell } from "@/components/app/role-shells";
import { requireRole } from "@/lib/require-role";

export default async function Layout({ children }: LayoutProps<"/student">) {
  await requireRole("student");
  return <StudentShell title="Student">{children}</StudentShell>;
}
