import { spawnSync } from "node:child_process";
import fs from "node:fs";

const PROJECT = process.env.VERCEL_PROJECT || "ths-llm-ryhr";
const SCOPE = process.env.VERCEL_SCOPE || "mubashar6";
const ENVIRONMENTS = (process.env.VERCEL_ENVS || "production,preview,development").split(",");

const CONFIG = {
  FIREBASE_PROJECT_ID: "ths-lab-lms-97e043",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "ths-lab-lms-97e043",
  FIREBASE_WEB_API_KEY: "AIzaSyDmhYINPtjs4w-bJm_G8bs8As7Tfyz8T-4",
  NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyDmhYINPtjs4w-bJm_G8bs8As7Tfyz8T-4",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "ths-lab-lms-97e043.firebaseapp.com",
  FIREBASE_STORAGE_BUCKET: "ths-lab-lms-97e043.firebasestorage.app",
  NEXT_PUBLIC_GOOGLE_CLIENT_ID:
    "459777135899-oj160q89lhs1ohcq2cv31hmgukdtchqh.apps.googleusercontent.com",
  JWT_SECRET: "ths-lab-lms-production-jwt-secret-2026",
  BOOTSTRAP_ADMIN_EMAIL: "admin@gmail.com",
  BOOTSTRAP_ADMIN_PASSWORD: "admin",
  BOOTSTRAP_ADMIN_NAME: "Administrator",
};

function loadExtraEnv() {
  const files = [".firebase-admin-creds.json", ".env.local", ".env.ossi", ".env.lab-lms.prod"];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    try {
      if (file.endsWith(".json")) {
        const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
        if (parsed.clientEmail) CONFIG.FIREBASE_CLIENT_EMAIL = parsed.clientEmail;
        if (parsed.privateKey) CONFIG.FIREBASE_PRIVATE_KEY = parsed.privateKey;
        if (parsed.projectId) CONFIG.FIREBASE_PROJECT_ID = parsed.projectId;
        if (parsed.storageBucket) CONFIG.FIREBASE_STORAGE_BUCKET = parsed.storageBucket;
        continue;
      }
      for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
        if (!line || line.startsWith("#")) continue;
        const idx = line.indexOf("=");
        if (idx <= 0) continue;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim().replace(/^"|"$/g, "");
        if (!key.startsWith("FIREBASE_") && !["JWT_SECRET", "GROQ_API_KEY", "AI_API_KEY"].includes(key)) continue;
        if (value) CONFIG[key] = value;
      }
    } catch {
      // Ignore malformed local env files.
    }
  }
}

function addEnv(name, value, environment) {
  const args = ["vercel", "env", "add", name, environment, "--force", "--scope", SCOPE];
  if (name.startsWith("NEXT_PUBLIC_")) {
    args.push("--type", "config");
  } else if (name === "FIREBASE_PRIVATE_KEY" || name === "JWT_SECRET" || name === "FIREBASE_WEB_API_KEY") {
    args.push("--type", "secret");
  } else {
    args.push("--type", "secret");
  }
  const result = spawnSync("npx", args, {
    input: `${value}\n`,
    encoding: "utf8",
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Failed to set ${name} for ${environment}`);
  }
}

loadExtraEnv();

spawnSync("npx", ["vercel", "link", "--yes", "--project", PROJECT, "--scope", SCOPE], {
  stdio: "inherit",
  shell: true,
});

for (const environment of ENVIRONMENTS) {
  for (const [name, value] of Object.entries(CONFIG)) {
    if (!value) continue;
    addEnv(name, value, environment);
    console.log(`Set ${name} (${environment})`);
  }
}

console.log(`Synced ${Object.keys(CONFIG).length} variables to ${PROJECT}.`);
