import { redirect } from "next/navigation";
import { getSession, type Role } from "@/lib/auth";

const home: Record<Role, string> = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
};

export async function requireRole(role: Role) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== role) redirect(home[session.role]);
  return session;
}
