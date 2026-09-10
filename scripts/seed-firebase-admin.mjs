import { firebaseCliAccessToken } from "./firebase-cli-auth.mjs";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID?.trim() || "ths-lab-lms-97e043";
const API_KEY =
  process.env.FIREBASE_WEB_API_KEY?.trim() ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ||
  "AIzaSyDmhYINPtjs4w-bJm_G8bs8As7Tfyz8T-4";

const EMAIL = (process.env.ADMIN_EMAIL || "admin@gmail.com").trim().toLowerCase();
const LMS_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const NAME = process.env.ADMIN_NAME || "Administrator";

function firestoreValue(value) {
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return { integerValue: String(value) };
  if (value == null) return { nullValue: null };
  return { stringValue: value };
}

function firebaseAuthPassword(password) {
  return password.length >= 6 ? password : `${password}1`;
}

async function identity(path, body) {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/${path}?key=${encodeURIComponent(API_KEY)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || !data.idToken || !data.localId) {
    throw new Error(data.error?.message || "Firebase Auth request failed.");
  }
  return { idToken: data.idToken, localId: data.localId };
}

async function ensureAuthUserWithWebApi() {
  const authPassword = firebaseAuthPassword(LMS_PASSWORD);
  try {
    return { ...(await identity("accounts:signUp", { email: EMAIL, password: authPassword, returnSecureToken: true })), authPassword };
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (!/EMAIL_EXISTS/i.test(message)) throw err;
    return {
      ...(await identity("accounts:signInWithPassword", {
        email: EMAIL,
        password: authPassword,
        returnSecureToken: true,
      })),
      authPassword,
    };
  }
}

async function ensureAuthUserWithAdminApi(accessToken) {
  const authPassword = firebaseAuthPassword(LMS_PASSWORD);
  const lookup = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:lookup`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Goog-User-Project": PROJECT_ID,
      },
      body: JSON.stringify({ email: [EMAIL] }),
    },
  );
  const lookupData = await lookup.json();
  const existing = lookupData.users?.[0];

  if (existing?.localId) {
    const update = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:update`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Goog-User-Project": PROJECT_ID,
        },
        body: JSON.stringify({
          localId: existing.localId,
          email: EMAIL,
          displayName: NAME,
          emailVerified: true,
          password: authPassword,
          disableUser: false,
        }),
      },
    );
    const updateData = await update.json();
    if (!update.ok) {
      throw new Error(updateData.error?.message || "Could not update Firebase Auth user.");
    }
    return { localId: existing.localId, authPassword, via: "admin-update" };
  }

  const create = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Goog-User-Project": PROJECT_ID,
    },
    body: JSON.stringify({
      email: EMAIL,
      displayName: NAME,
      emailVerified: true,
      password: authPassword,
      disabled: false,
    }),
  });
  const createData = await create.json();
  if (!create.ok || !createData.localId) {
    throw new Error(createData.error?.message || "Could not create Firebase Auth user.");
  }
  return { localId: createData.localId, authPassword, via: "admin-create" };
}

async function writeFirestoreUserAdmin(accessToken, docId, fields) {
  const encoded = encodeURIComponent(docId);
  const payload = JSON.stringify({
    fields: Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, firestoreValue(value)])),
  });
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "X-Goog-User-Project": PROJECT_ID,
  };
  const docUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${encoded}`;
  let res = await fetch(`${docUrl}?updateMask=${Object.keys(fields).join(",")}`, {
    method: "PATCH",
    headers,
    body: payload,
  });
  if (!res.ok) {
    const collectionUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users?documentId=${encoded}`;
    res = await fetch(collectionUrl, { method: "POST", headers, body: payload });
  }
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error?.message || "Firestore write failed.");
  }
}

async function writeFirestoreUserClient(idToken, docId, fields) {
  const encoded = encodeURIComponent(docId);
  const payload = JSON.stringify({
    fields: Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, firestoreValue(value)])),
  });
  const headers = {
    Authorization: `Bearer ${idToken}`,
    "Content-Type": "application/json",
  };
  const docUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${encoded}`;
  let res = await fetch(docUrl, { method: "PATCH", headers, body: payload });
  if (!res.ok) {
    const collectionUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users?documentId=${encoded}`;
    res = await fetch(collectionUrl, { method: "POST", headers, body: payload });
  }
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error?.message || "Firestore write failed.");
  }
}

let localId = "";
let authPassword = firebaseAuthPassword(LMS_PASSWORD);
let mode = "web";

try {
  const accessToken = await firebaseCliAccessToken();
  const adminUser = await ensureAuthUserWithAdminApi(accessToken);
  localId = adminUser.localId;
  authPassword = adminUser.authPassword;
  mode = adminUser.via;

  const profile = {
    id: "firebase-admin",
    lms_id: "firebase-admin",
    auth_uid: localId,
    name: NAME,
    email: EMAIL,
    role: "admin",
    active: true,
    class_name: "Ops",
    status: "Active",
  };

  await writeFirestoreUserAdmin(accessToken, localId, profile);
  await writeFirestoreUserAdmin(accessToken, EMAIL, profile);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  if (!/Firebase CLI is not logged in/i.test(message)) {
    console.warn(`Admin API seed failed (${message}). Trying web sign-up...`);
  }
  const session = await ensureAuthUserWithWebApi();
  localId = session.localId;
  authPassword = session.authPassword;
  mode = "web";

  const profile = {
    id: "firebase-admin",
    lms_id: "firebase-admin",
    auth_uid: localId,
    name: NAME,
    email: EMAIL,
    role: "admin",
    active: true,
    class_name: "Ops",
    status: "Active",
  };

  await writeFirestoreUserClient(session.idToken, localId, profile);
  await writeFirestoreUserClient(session.idToken, EMAIL, profile);
}

console.log(`Firebase admin ready (${mode})`);
console.log(`Email: ${EMAIL}`);
console.log(`LMS login password: ${LMS_PASSWORD}`);
if (authPassword !== LMS_PASSWORD) {
  console.log(`Firebase Auth password: ${authPassword} (Firebase requires 6+ characters)`);
}
console.log(`Auth uid: ${localId}`);
