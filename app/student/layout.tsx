import { StudentShell } from "@/components/app/role-shells";

export default function Layout({ children }: LayoutProps<"/student">) {
  return <StudentShell title="Student">{children}</StudentShell>;
}
