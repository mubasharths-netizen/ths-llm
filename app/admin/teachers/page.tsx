import { UsersManager } from "@/components/admin/users-manager";
import { listAdminUsers } from "@/lib/db";

export const metadata = { title: "Teachers" };

export default function AdminTeachersPage() {
  return (
    <UsersManager
      title="Teachers"
      description="Teacher logins. Pending faculty appear under Teacher Approval."
      initialRole="Teacher"
      initialUsers={listAdminUsers("teacher")}
    />
  );
}
