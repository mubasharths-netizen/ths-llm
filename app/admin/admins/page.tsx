import { UsersManager } from "@/components/admin/users-manager";
import { listAdminUsers } from "@/lib/db";

export const metadata = { title: "Admins" };

export default function AdminAdminsPage() {
  return (
    <UsersManager
      title="Admins"
      description="Administrator accounts. Only admins can see and create these logins."
      initialRole="Admin"
      initialUsers={listAdminUsers("admin")}
    />
  );
}
