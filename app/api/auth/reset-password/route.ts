import { NextResponse } from "next/server";
import { setUserPassword } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string; confirm?: string };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const confirm = typeof body.confirm === "string" ? body.confirm : "";
    if (!email.includes("@") || password.length < 4) {
      return NextResponse.json({ error: "Email and a new password (4+ characters) are required." }, { status: 400 });
    }
    if (password !== confirm) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }
    const user = setUserPassword(email, password);
    if (!user) {
      return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to reset password." }, { status: 400 });
  }
}
