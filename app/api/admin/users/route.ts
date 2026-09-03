import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import {
  createManagedUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  listAdminUsers,
  setUserStatus,
  toAdminUserRow,
  writeAudit,
} from "@/lib/db";
import { persistLmsDatabase, restoreLmsDatabase } from "@/lib/db-cloud";
import { firebaseConfigured } from "@/lib/firebase";
import { firebaseWebConfigured } from "@/lib/firebase-web";
import { deleteUserFromFirebase, hydrateUsersFromFirebase, saveUserToFirebase } from "@/lib/firebase-users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireSession(["admin"]);
  if (error) return error;
  await restoreLmsDatabase();
  await hydrateUsersFromFirebase();
  return NextResponse.json({
    users: listAdminUsers(),
    firebaseConnected: firebaseConfigured() || firebaseWebConfigured(),
  });
}

export async function POST(request: Request) {
  const { user, error } = await requireSession(["admin"]);
  if (error) return error;
  try {
    await restoreLmsDatabase();
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      role?: string;
      password?: string;
      className?: string;
    };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const className = typeof body.className === "string" ? body.className.trim() : "";
    const role =
      body.role === "Teacher" || body.role === "teacher"
        ? "teacher"
        : body.role === "Admin" || body.role === "admin"
          ? "admin"
          : "student";
    if (!name || !email.includes("@") || password.length < 4) {
      return NextResponse.json({ error: "Name, email, and a password (4+ characters) are required." }, { status: 400 });
    }
    if (getUserByEmail(email)) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    const created = createManagedUser({ name, email, password, role, className: className || undefined });
    writeAudit(user!.name, "Created user", created.name);
    const cloud = await saveUserToFirebase(created, password);
    await persistLmsDatabase();
    if (!cloud.ok) {
      return NextResponse.json(
        {
          user: toAdminUserRow(created),
          firebaseConnected: false,
          firebaseError: cloud.error,
          warning: `Account saved, but Firebase sync failed: ${cloud.error}`,
        },
        { status: 201 },
      );
    }
    return NextResponse.json({
      user: toAdminUserRow(created),
      firebaseConnected: true,
      firebaseError: "",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to create user.";
    return NextResponse.json({ error: message.slice(0, 180) }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const { user, error } = await requireSession(["admin"]);
  if (error) return error;
  try {
    await restoreLmsDatabase();
    const body = (await request.json()) as { id?: string; action?: string };
    if (!body.id || !body.action) {
      return NextResponse.json({ error: "User and action are required." }, { status: 400 });
    }
    if (body.action === "delete") {
      const existing = getUserById(body.id);
      deleteUser(body.id);
      if (existing) await deleteUserFromFirebase(existing.email);
      writeAudit(user!.name, "Deleted user", body.id);
      await persistLmsDatabase();
      return NextResponse.json({ ok: true });
    }
    const status =
      body.action === "disable"
        ? "Disabled"
        : body.action === "approve"
          ? "Active"
          : body.action === "reject"
            ? "Rejected"
            : "Active";
    const updated = setUserStatus(body.id, status);
    if (!updated) return NextResponse.json({ error: "User not found." }, { status: 404 });
    await saveUserToFirebase(updated);
    writeAudit(user!.name, `${body.action} user`, updated.name);
    await persistLmsDatabase();
    return NextResponse.json({ user: toAdminUserRow(updated) });
  } catch {
    return NextResponse.json({ error: "Unable to update user." }, { status: 400 });
  }
}
