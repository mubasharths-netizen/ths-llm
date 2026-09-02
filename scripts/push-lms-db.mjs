import fs from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const cut = trimmed.indexOf("=");
    if (cut < 1) continue;
    const key = trimmed.slice(0, cut).trim();
    let value = trimmed.slice(cut + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value.replace(/\\n/g, "\n");
  }
}

function account() {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim() || "";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim() || "";
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim() || "";
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
  if (raw) {
    const parsed = JSON.parse(raw) as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };
    return {
      projectId: parsed.project_id || projectId,
      clientEmail: parsed.client_email || clientEmail,
      privateKey: (parsed.private_key || "").replace(/\\n/g, "\n"),
    };
  }
  return { projectId, clientEmail, privateKey };
}

async function main() {
  loadEnv();
  const creds = account();
  if (!creds.projectId || !creds.clientEmail || !creds.privateKey) {
    throw new Error("Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local");
  }
  const dbFile = path.join(process.cwd(), "data", "ths.db");
  if (!fs.existsSync(dbFile)) {
    throw new Error("Local data/ths.db was not found. Sign in locally once so the database is created.");
  }
  if (!getApps().length) {
    initializeApp({
      credential: cert(creds),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET?.trim() || `${creds.projectId}.firebasestorage.app`,
    });
  }
  const named = process.env.FIREBASE_STORAGE_BUCKET?.trim();
  const store = named ? getStorage().bucket(named) : getStorage().bucket();
  await store.upload(dbFile, {
    destination: "lms/ths.db",
    resumable: false,
    metadata: { contentType: "application/octet-stream" },
  });
  console.log("Uploaded local LMS database to Firebase Storage as lms/ths.db");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
