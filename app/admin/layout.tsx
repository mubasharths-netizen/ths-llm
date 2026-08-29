import { AdminShell } from "@/components/app/role-shells";

export default function Layout({ children }: LayoutProps<"/admin">) {
  return <AdminShell title="Admin">{children}</AdminShell>;
}
