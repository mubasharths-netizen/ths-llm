import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const FIREBASE_CLI_CLIENT_ID = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com";
const FIREBASE_CLI_CLIENT_SECRET = "j9iVZfS8kkCEFUPaAeJV0sAi";

function readRefreshToken() {
  const files = [
    path.join(process.env.APPDATA || "", "configstore", "firebase-tools.json"),
    path.join(os.homedir(), ".config", "configstore", "firebase-tools.json"),
    path.join(process.env.USERPROFILE || os.homedir(), ".config", "configstore", "firebase-tools.json"),
  ];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const token = raw.tokens?.refresh_token || raw.refresh_token;
    if (token) return token;
  }
  throw new Error("Firebase CLI is not logged in.");
}

export async function firebaseCliAccessToken() {
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
