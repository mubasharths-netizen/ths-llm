import { RegisterForm } from "@/components/auth/register-form";
import { adminCount } from "@/lib/db";

export const metadata = { title: "Sign up" };

export default function RegisterPage() {
  return <RegisterForm allowEmailSetup={adminCount() === 0} />;
}
