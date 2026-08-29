import { AddAccountForm } from "@/components/admin/add-account-form";

export const metadata = { title: "Add student" };

export default function AddStudentPage() {
  return <AddAccountForm role="Student" />;
}
