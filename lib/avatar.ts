import fs from "node:fs";
import path from "node:path";
import { dataDir } from "@/lib/data-dir";

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const dir = path.join(dataDir(), "avatars");

export type AvatarKind = "jpg" | "png" | "webp";

export function safeUserId(id: string) {
  const clean = id.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!clean || clean !== id) return null;
  return clean;
}

export function sniffImage(bytes: Uint8Array): AvatarKind | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  const head = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  if (head === "RIFF" && webp === "WEBP") return "webp";
  return null;
}

export function avatarFile(userId: string, filename: string) {
  const id = safeUserId(userId);
  if (!id) return null;
  if (!/^[a-zA-Z0-9_-]+\.(jpg|png|webp)$/.test(filename)) return null;
  if (!filename.startsWith(`${id}.`)) return null;
  return path.join(dir, filename);
}

export function writeAvatar(userId: string, bytes: Uint8Array, kind: AvatarKind) {
  const id = safeUserId(userId);
  if (!id) return null;
  fs.mkdirSync(dir, { recursive: true });
  for (const ext of ["jpg", "png", "webp"] as const) {
    const previous = path.join(dir, `${id}.${ext}`);
    if (fs.existsSync(previous)) fs.unlinkSync(previous);
  }
  const filename = `${id}.${kind}`;
  fs.writeFileSync(path.join(dir, filename), bytes);
  return filename;
}

export function avatarUrl(filename: string | null | undefined) {
  if (!filename) return "";
  return `/api/me/avatar?v=${encodeURIComponent(filename)}`;
}
