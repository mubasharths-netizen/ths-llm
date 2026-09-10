import { spawnSync } from "node:child_process";
import fs from "node:fs";

function run(label, command, args = []) {
  console.log(`\n→ ${label}`);
  const result = spawnSync(command, args, { stdio: "inherit", shell: true });
  if (result.status !== 0) {
    throw new Error(`${label} failed`);
  }
}

if (!fs.existsSync(".firebase-admin-creds.json") && !fs.existsSync("firebase-service-account.json")) {
  run("Fetch Firebase Admin credentials", "node", ["scripts/fetch-firebase-admin-creds.mjs"]);
  if (fs.existsSync(".firebase-admin-creds.json")) {
    console.log("Saved .firebase-admin-creds.json");
  }
}

run("Sync Vercel environment variables", "node", ["scripts/sync-vercel-env.mjs"]);
run("Allow Vercel domain in Firebase Auth", "node", ["scripts/add-auth-domain.mjs"]);
run("Ensure admin@gmail.com exists in Firebase Auth", "node", ["scripts/seed-firebase-admin.mjs"]);
run("Deploy production", "npx", ["vercel", "--prod", "--yes"]);

console.log("\nFirebase Admin setup complete.");
