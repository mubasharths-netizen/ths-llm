function webApiKey() {
  return (
    process.env.FIREBASE_WEB_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ||
    "AIzaSyDmhYINPtjs4w-bJm_G8bs8As7Tfyz8T-4"
  );
}

function projectId() {
  return process.env.FIREBASE_PROJECT_ID?.trim() || "ths-lab-lms-97e043";
}

export function firebaseWebConfigured() {
  return Boolean(webApiKey() && projectId());
}

type AuthSession = { idToken: string; localId: string };

async function identity(path: string, body: Record<string, unknown>) {
  const key = webApiKey();
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/${path}?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as {
    idToken?: string;
    localId?: string;
    error?: { message?: string };
  };
  if (!res.ok || !data.idToken || !data.localId) {
    throw new Error(data.error?.message || "Firebase Auth request failed.");
  }
  return { idToken: data.idToken, localId: data.localId } satisfies AuthSession;
}

export async function firebaseAuthSession(email: string, password: string): Promise<AuthSession> {
  try {
    return await identity("accounts:signUp", {
      email,
      password,
      returnSecureToken: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (!/EMAIL_EXISTS/i.test(message)) throw err;
    return identity("accounts:signInWithPassword", {
      email,
      password,
      returnSecureToken: true,
    });
  }
}

function firestoreValue(value: string | boolean | number | null) {
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return { integerValue: String(value) };
  if (value == null) return { nullValue: null };
  return { stringValue: value };
}

export async function firebaseAuthSignIn(email: string, password: string): Promise<AuthSession> {
  return identity("accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });
}

export async function readFirestoreUser(idToken: string, docId: string) {
  const encoded = encodeURIComponent(docId);
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents/users/${encoded}`,
    { headers: { Authorization: `Bearer ${idToken}` } },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    fields?: Record<string, { stringValue?: string; booleanValue?: boolean }>;
  };
  const fields = data.fields || {};
  const role = fields.role?.stringValue;
  return {
    id: fields.id?.stringValue || fields.lms_id?.stringValue || docId,
    name: fields.name?.stringValue || "",
    email: fields.email?.stringValue || "",
    role: role === "teacher" || role === "admin" ? role : "student",
    active: fields.active?.booleanValue !== false,
    class_name: fields.class_name?.stringValue || null,
  };
}

export async function writeFirestoreUser(
  idToken: string,
  uid: string,
  fields: Record<string, string | boolean | number | null>,
) {
  const encodedUid = encodeURIComponent(uid);
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents/users/${encodedUid}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, firestoreValue(value)])),
      }),
    },
  );
  if (!res.ok) {
    const data = (await res.json()) as { error?: { message?: string } };
    throw new Error(data.error?.message || "Firestore write failed.");
  }
}

