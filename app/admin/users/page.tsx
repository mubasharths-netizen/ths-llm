import { UsersManager } from "@/components/admin/users-manager";

export const metadata = { title: "Users" };

export default function UsersPage() {
  return <UsersManager title="Users" description="Add, disable, delete, and assign roles." />;
}
