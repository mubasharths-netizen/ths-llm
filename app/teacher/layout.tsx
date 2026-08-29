import { TeacherShell } from "@/components/app/role-shells";
import { requireRole } from "@/lib/require-role";

export default async function Layout({ children }: LayoutProps<"/teacher">) {
  await requireRole("teacher");
  return <TeacherShell title="Teacher">{children}</TeacherShell>;
}
