import { UsersManager } from "@/components/admin/users-manager";
import { listAdminUsers } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Students" };

export default function AdminStudentsPage() {
  return (
    <UsersManager
      title="Students"
      description="Student logins. Only administrators can view or create these accounts."
      initialRole="Student"
      initialUsers={listAdminUsers("student")}
    />
  );
}
