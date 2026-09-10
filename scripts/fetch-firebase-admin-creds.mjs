import { firebaseCliAccessToken } from "./firebase-cli-auth.mjs";

const PROJECT = process.env.FIREBASE_PROJECT_ID?.trim() || "ths-lab-lms-97e043";

async function api(path, init = {}) {
  const token = await firebaseCliAccessToken();
  const res = await fetch(`https://iam.googleapis.com/v1/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `IAM request failed (${res.status})`);
  }
  return data;
}

const accounts = await api(`projects/${PROJECT}/serviceAccounts`);
const adminAccount =
  accounts.accounts?.find((account) => account.email?.includes("firebase-adminsdk")) ||
  accounts.accounts?.[0];

if (!adminAccount?.name) {
  throw new Error("No Firebase Admin service account found for this project.");
}

const key = await api(`${adminAccount.name}/keys`, {
  method: "POST",
  body: JSON.stringify({
    keyAlgorithm: "KEY_ALG_RSA_2048",
    privateKeyType: "TYPE_GOOGLE_CREDENTIALS_FILE",
  }),
});

const encoded = key.privateKeyData;
if (!encoded) {
  throw new Error("Google Cloud did not return a service account key.");
}

const json = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
process.stdout.write(
  JSON.stringify(
    {
      projectId: json.project_id,
      clientEmail: json.client_email,
      privateKey: json.private_key,
      storageBucket: `${json.project_id}.firebasestorage.app`,
    },
    null,
    0,
  ),
);
