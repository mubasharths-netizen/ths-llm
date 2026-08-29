import { AddAccountForm } from "@/components/admin/add-account-form";

export const metadata = { title: "Add admin" };

export default function AddAdminPage() {
  return <AddAccountForm role="Admin" />;
}
