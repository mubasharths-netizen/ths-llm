import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PROJECT = "ths-lab-lms-97e043";
const EXTRA_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "ths-llm-sight.vercel.app",
  "ths-llm-1.vercel.app",
  "ths-lab-lms-97e043.firebaseapp.com",
  "ths-lab-lms-97e043.web.app",
];

const FIREBASE_CLI_CLIENT_ID = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e2.apps.googleusercontent.com";
const FIREBASE_CLI_CLIENT_SECRET = "jQRSvDrZnXmX9f2NvM-VkjoO";

function readRefreshToken() {
  const files = [
    path.join(process.env.APPDATA || "", "configstore", "firebase-tools.json"),
    path.join(os.homedir(), ".config", "configstore", "firebase-tools.json"),
  ];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const token = raw.tokens?.refresh_token || raw.refresh_token;
    if (token) return token;
  }
  throw new Error("Firebase CLI is not logged in.");
}

async function accessToken() {
  const body = new URLSearchParams({
    client_id: FIREBASE_CLI_CLIENT_ID,
    client_secret: FIREBASE_CLI_CLIENT_SECRET,
    refresh_token: readRefreshToken(),
    grant_type: "refresh_token",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error || "Could not refresh Firebase CLI token.");
  }
  return data.access_token;
}

async function main() {
  const token = await accessToken();
  const url = `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT}/config`;
  const current = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const config = await current.json();
  if (!current.ok) {
    throw new Error(config.error?.message || `Could not read Auth config (${current.status}).`);
  }
  const authorizedDomains = [...new Set([...(config.authorizedDomains || []), ...EXTRA_DOMAINS])];
  const patch = await fetch(`${url}?updateMask=authorizedDomains`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ authorizedDomains }),
  });
  const updated = await patch.json();
  if (!patch.ok) {
    throw new Error(updated.error?.message || `Could not update Auth domains (${patch.status}).`);
  }
  console.log("Authorized domains:");
  for (const domain of updated.authorizedDomains || authorizedDomains) {
    console.log(`- ${domain}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
