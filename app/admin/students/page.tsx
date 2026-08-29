import { UsersManager } from "@/components/admin/users-manager";

export const metadata = { title: "Students" };

export default function AdminStudentsPage() {
  return (
    <UsersManager
      title="Students"
      description="Student accounts across THS LAB LMS."
      initialRole="Student"
    />
  );
}
