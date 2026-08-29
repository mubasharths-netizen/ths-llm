import { getSession } from "@/lib/auth";
import { avatarUrl } from "@/lib/avatar";
import { getUserById } from "@/lib/db";

export async function currentStudentId() {
  const session = await getSession();
  if (session?.role === "student") return session.id;
  return "";
}

export async function currentTeacherId() {
  const session = await getSession();
  if (session?.role === "teacher") return session.id;
  return "";
}

export async function currentSessionName(fallback: string) {
  const session = await getSession();
  return session?.name ?? fallback;
}

export async function currentSessionProfile(fallback: string) {
  const session = await getSession();
  const user = session ? getUserById(session.id) : undefined;
  return {
    name: user?.name ?? session?.name ?? fallback,
    avatarUrl: avatarUrl(user?.avatar),
  };
}
