import fs from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { firebaseCliAccessToken } from "./firebase-cli-auth.mjs";

const PROJECT = "ths-lab-lms-97e043";
const CLOUD_FILE = "lms/ths.db";

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
    const parsed = JSON.parse(raw);
    return {
      projectId: parsed.project_id || projectId,
      clientEmail: parsed.client_email || clientEmail,
      privateKey: (parsed.private_key || "").replace(/\\n/g, "\n"),
    };
  }
  return { projectId, clientEmail, privateKey };
}

async function bucketsFromCli(token) {
  const named = process.env.FIREBASE_STORAGE_BUCKET?.trim();
  if (named) return [named];
  const res = await fetch(`https://storage.googleapis.com/storage/v1/b?project=${PROJECT}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `Could not list Storage buckets (${res.status}).`);
  }
  const items = Array.isArray(data.items) ? data.items.map((item) => item.name).filter(Boolean) : [];
  const preferred = [
    `${PROJECT}.firebasestorage.app`,
    `${PROJECT}.appspot.com`,
  ];
  return [...new Set([...preferred.filter((name) => items.includes(name)), ...items])];
}

async function uploadWithCli(dbFile) {
  const token = await firebaseCliAccessToken();
  const buckets = await bucketsFromCli(token);
  if (buckets.length === 0) {
    throw new Error("No Firebase Storage bucket found. Create one in Firebase Console → Storage.");
  }
  let lastError = "Upload failed.";
  for (const bucket of buckets) {
    const url = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucket)}/o?uploadType=media&name=${encodeURIComponent(CLOUD_FILE)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/octet-stream",
      },
      body: fs.readFileSync(dbFile),
    });
    if (res.ok) {
      console.log(`Uploaded local LMS database to gs://${bucket}/${CLOUD_FILE}`);
      return;
    }
    const data = await res.json().catch(() => ({}));
    lastError = data.error?.message || `Could not upload to ${bucket} (${res.status}).`;
  }
  throw new Error(lastError);
}

async function main() {
  loadEnv();
  const dbFile = path.join(process.cwd(), "data", "ths.db");
  if (!fs.existsSync(dbFile)) {
    throw new Error("Local data/ths.db was not found. Sign in locally once so the database is created.");
  }
  const creds = account();
  if (creds.projectId && creds.clientEmail && creds.privateKey) {
    if (!getApps().length) {
      initializeApp({
        credential: cert(creds),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET?.trim() || `${creds.projectId}.firebasestorage.app`,
      });
    }
    const named = process.env.FIREBASE_STORAGE_BUCKET?.trim();
    const store = named ? getStorage().bucket(named) : getStorage().bucket();
    await store.upload(dbFile, {
      destination: CLOUD_FILE,
      resumable: false,
      metadata: { contentType: "application/octet-stream" },
    });
    console.log("Uploaded local LMS database to Firebase Storage as lms/ths.db");
    return;
  }
  await uploadWithCli(dbFile);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
