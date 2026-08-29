import { AddAccountForm } from "@/components/admin/add-account-form";

export const metadata = { title: "Add teacher" };

export default function AddTeacherPage() {
  return <AddAccountForm role="Teacher" />;
}
