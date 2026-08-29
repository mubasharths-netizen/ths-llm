import { AdminShell } from "@/components/app/role-shells";
import { requireRole } from "@/lib/require-role";

export default async function Layout({ children }: LayoutProps<"/admin">) {
  await requireRole("admin");
  return <AdminShell title="Admin">{children}</AdminShell>;
}
