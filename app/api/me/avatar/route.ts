import fs from "node:fs";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { avatarFile, AVATAR_MAX_BYTES, sniffImage, writeAvatar } from "@/lib/avatar";
import { getUserById, setUserAvatar } from "@/lib/db";

export const runtime = "nodejs";

const types = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;

export async function GET() {
  const { user, error } = await requireSession();
  if (error) return error;
  const row = getUserById(user!.id);
  if (!row?.avatar) return new NextResponse(null, { status: 404 });
  const file = avatarFile(user!.id, row.avatar);
  if (!file || !fs.existsSync(file)) return new NextResponse(null, { status: 404 });
  const ext = row.avatar.split(".").pop() as keyof typeof types;
  const body = fs.readFileSync(file);
  return new NextResponse(new Uint8Array(body), {
    headers: {
      "Content-Type": types[ext] ?? "application/octet-stream",
      "Cache-Control": "private, max-age=60",
    },
  });
}

export async function POST(request: Request) {
  const { user, error } = await requireSession();
  if (error) return error;
  try {
    const form = await request.formData();
    const file = form.get("avatar");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose a photo to upload." }, { status: 400 });
    }
    if (file.size > AVATAR_MAX_BYTES) {
      return NextResponse.json({ error: "Photo must be 2 MB or smaller." }, { status: 400 });
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const kind = sniffImage(bytes);
    if (!kind) {
      return NextResponse.json({ error: "Use a JPG, PNG, or WebP photo." }, { status: 400 });
    }
    const filename = writeAvatar(user!.id, bytes, kind);
    if (!filename) {
      return NextResponse.json({ error: "Unable to save photo." }, { status: 400 });
    }
    setUserAvatar(user!.id, filename);
    return NextResponse.json({ avatarUrl: `/api/me/avatar?v=${encodeURIComponent(filename)}` });
  } catch {
    return NextResponse.json({ error: "Unable to upload photo." }, { status: 400 });
  }
}
