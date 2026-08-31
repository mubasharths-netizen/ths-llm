import { UsersManager } from "@/components/admin/users-manager";
import { listAdminUsers } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users" };

export default function UsersPage() {
  return (
    <UsersManager
      title="Users"
      description="Login accounts are visible only to administrators."
      initialUsers={listAdminUsers()}
    />
  );
}
