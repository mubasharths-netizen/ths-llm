import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { adminCount } from "@/lib/db";

export const metadata = { title: "Create administrator" };

export default function RegisterPage() {
  if (adminCount() > 0) redirect("/login");
  return <RegisterForm />;
}
