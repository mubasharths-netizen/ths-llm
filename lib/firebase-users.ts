import { firebaseConfigured, getFirebaseDb } from "@/lib/firebase";
import { firebaseAuthSession, firebaseWebConfigured, writeFirestoreUser } from "@/lib/firebase-web";
import { upsertUserRecord, type DbUser } from "@/lib/db";

const COLLECTION = "users";

function profileFields(user: DbUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email.toLowerCase(),
    role: user.role,
    active: user.status === "Active",
    class_name: user.class_name,
  };
}

async function saveWithAdmin(user: DbUser) {
  const firestore = getFirebaseDb();
  if (!firestore) return { ok: false, error: "Firebase Admin is not connected." };
  await firestore.collection(COLLECTION).doc(user.email.toLowerCase()).set(profileFields(user), { merge: true });
  return { ok: true, error: "" };
}

async function saveWithWebAuth(user: DbUser, password: string) {
  const session = await firebaseAuthSession(user.email, password);
  await writeFirestoreUser(session.idToken, session.localId, {
    id: session.localId,
    name: user.name,
    email: user.email.toLowerCase(),
    role: user.role,
    active: user.status === "Active",
    class_name: user.class_name,
    lms_id: user.id,
  });
  return { ok: true, error: "" };
}

export async function saveUserToFirebase(user: DbUser, password?: string) {
  try {
    if (getFirebaseDb()) return await saveWithAdmin(user);
    if (password && firebaseWebConfigured()) return await saveWithWebAuth(user, password);
    if (firebaseWebConfigured()) {
      return {
        ok: false,
        error: "Firebase needs the account password to create the student or teacher in Firestore.",
      };
    }
    return {
      ok: false,
      error: "Firebase is not connected. Set FIREBASE_WEB_API_KEY and FIREBASE_PROJECT_ID.",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Firebase write failed.";
    return { ok: false, error: message.replace(/_/g, " ").slice(0, 180) };
  }
}

export async function deleteUserFromFirebase(email: string) {
  const firestore = getFirebaseDb();
  if (!firestore || !email) return { ok: firebaseConfigured() || firebaseWebConfigured(), error: "" };
  try {
    await firestore.collection(COLLECTION).doc(email.toLowerCase()).delete();
    return { ok: true, error: "" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Firebase delete failed.";
    return { ok: false, error: message.slice(0, 180) };
  }
}

export async function hydrateUsersFromFirebase() {
  const firestore = getFirebaseDb();
  if (!firestore) return { ok: false, count: 0 };
  try {
    const snap = await firestore.collection(COLLECTION).get();
    let count = 0;
    for (const doc of snap.docs) {
      const data = doc.data() as Partial<DbUser> & { active?: boolean; lms_id?: string };
      const email = String(data.email || doc.id).toLowerCase();
      const role = data.role === "teacher" || data.role === "admin" ? data.role : "student";
      if (!email.includes("@") || !data.name || !data.password_hash) continue;
      upsertUserRecord({
        id: String(data.lms_id || data.id || doc.id),
        name: String(data.name),
        email,
        password_hash: String(data.password_hash || ""),
        role,
        class_name: data.class_name == null ? null : String(data.class_name),
        status: data.active === false ? "Disabled" : String(data.status || "Active"),
        score: Number(data.score ?? 0),
        subject: data.subject == null ? null : String(data.subject),
        qualification: data.qualification == null ? null : String(data.qualification),
        avatar: data.avatar == null ? null : String(data.avatar),
      });
      count += 1;
    }
    return { ok: true, count };
  } catch {
    return { ok: false, count: 0 };
  }
}
