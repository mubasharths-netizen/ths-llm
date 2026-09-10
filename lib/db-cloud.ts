import "server-only";
import fs from "node:fs";
import path from "node:path";
import { getStorage } from "firebase-admin/storage";
import { db, resetOpenDatabase, sqlitePath } from "@/lib/db";
import { getFirebaseDb } from "@/lib/firebase";

const CLOUD_FILE = "lms/ths.db";
const CLOUD_TIMEOUT_MS = 4000;

type CloudState = {
  restored?: boolean;
  ready?: boolean;
  restoring?: Promise<void>;
};

const g = globalThis as unknown as CloudState;

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T | null> {
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`${label} timed out`)), CLOUD_TIMEOUT_MS);
      }),
    ]);
  } catch {
    return null;
  }
}

function storageBuckets() {
  if (!getFirebaseDb()) return [];
  const named = process.env.FIREBASE_STORAGE_BUCKET?.trim();
  if (named) return [getStorage().bucket(named)];
  try {
    return [getStorage().bucket()];
  } catch {
    return [];
  }
}

async function downloadDb() {
  const dest = sqlitePath();
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const buckets = storageBuckets();
  if (buckets.length === 0) return "skip" as const;
  let sawMissing = false;
  for (const store of buckets) {
    try {
      const existsResult = await withTimeout(store.file(CLOUD_FILE).exists(), "storage exists check");
      if (!existsResult) continue;
      const [exists] = existsResult;
      if (!exists) {
        sawMissing = true;
        continue;
      }
      resetOpenDatabase();
      const downloaded = await withTimeout(
        store.file(CLOUD_FILE).download({ destination: dest }),
        "storage download",
      );
      if (!downloaded) continue;
      return "ok" as const;
    } catch {
      continue;
    }
  }
  return sawMissing ? ("missing" as const) : ("error" as const);
}

export async function restoreLmsDatabase() {
  if (!process.env.VERCEL) return;
  if (g.restored) return;
  if (!g.restoring) {
    g.restoring = downloadDb().then((result) => {
      g.restored = true;
      g.ready = result !== "error";
    });
  }
  await g.restoring;
}

export async function persistLmsDatabase() {
  if (!process.env.VERCEL) return;
  await restoreLmsDatabase();
  if (g.ready === false) return;
  const dest = sqlitePath();
  if (!fs.existsSync(dest)) return;
  try {
    db().exec("PRAGMA wal_checkpoint(TRUNCATE);");
  } catch {
    // Continue even if checkpoint is unavailable.
  }
  for (const store of storageBuckets()) {
    try {
      const uploaded = await withTimeout(
        store.upload(dest, {
          destination: CLOUD_FILE,
          resumable: false,
          metadata: { contentType: "application/octet-stream" },
        }),
        "storage upload",
      );
      if (!uploaded) continue;
      g.ready = true;
      return;
    } catch {
      continue;
    }
  }
}
