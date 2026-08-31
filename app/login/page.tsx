import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Login" };

const home = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
} as const;

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const session = await getSession();
  if (session) redirect(home[session.role]);
  const query = await searchParams;
  return <LoginForm justReset={query.reset === "1"} />;
}
