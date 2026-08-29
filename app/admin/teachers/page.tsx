import { UsersManager } from "@/components/admin/users-manager";

export const metadata = { title: "Teachers" };

export default function AdminTeachersPage() {
  return (
    <UsersManager
      title="Teachers"
      description="Faculty accounts. Pending applicants appear under Teacher Approval."
      initialRole="Teacher"
    />
  );
}
