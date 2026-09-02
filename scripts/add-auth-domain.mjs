import { firebaseCliAccessToken } from "./firebase-cli-auth.mjs";

const PROJECT = "ths-lab-lms-97e043";
const EXTRA_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "ths-llm-sight.vercel.app",
  "ths-llm-1.vercel.app",
  "ths-lab-lms-97e043.firebaseapp.com",
  "ths-lab-lms-97e043.web.app",
];

async function main() {
  const token = await firebaseCliAccessToken();
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
