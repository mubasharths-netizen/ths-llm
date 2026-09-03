import { getAuth } from "firebase-admin/auth";
import { firebaseConfigured, getFirebaseDb } from "@/lib/firebase";
import { firebaseAuthSession, firebaseWebConfigured, writeFirestoreUser } from "@/lib/firebase-web";
import { getUserByEmail, upsertUserRecord, type DbUser } from "@/lib/db";

const COLLECTION = "users";

function profileFields(user: DbUser, authUid?: string) {
  return {
    id: user.id,
    lms_id: user.id,
    auth_uid: authUid || null,
    name: user.name,
    email: user.email.toLowerCase(),
    role: user.role,
    active: user.status === "Active",
    class_name: user.class_name,
    status: user.status,
  };
}

async function ensureFirebaseAuthUser(user: DbUser, password?: string) {
  const auth = getAuth();
  try {
    const existing = await auth.getUserByEmail(user.email);
    const update: {
      displayName: string;
      disabled: boolean;
      password?: string;
    } = {
      displayName: user.name,
      disabled: user.status !== "Active",
    };
    if (password && password.length >= 4) update.password = password;
    await auth.updateUser(existing.uid, update);
    return existing.uid;
  } catch (err) {
    const code = typeof err === "object" && err && "code" in err ? String((err as { code?: string }).code) : "";
    if (code !== "auth/user-not-found") throw err;
    if (!password || password.length < 4) {
      return "";
    }
    const created = await auth.createUser({
      email: user.email,
      password,
      displayName: user.name,
      disabled: user.status !== "Active",
      emailVerified: true,
    });
    return created.uid;
  }
}

async function saveWithAdmin(user: DbUser, password?: string) {
  const firestore = getFirebaseDb();
  if (!firestore) return { ok: false, error: "Firebase Admin is not connected." };

  let authUid = "";
  try {
    authUid = await ensureFirebaseAuthUser(user, password);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Firebase Auth create failed.";
    const fields = profileFields(user);
    await firestore.collection(COLLECTION).doc(user.email.toLowerCase()).set(fields, { merge: true });
    return { ok: false, error: message.replace(/_/g, " ").slice(0, 180) };
  }

  const fields = profileFields(user, authUid || undefined);
  const batch = firestore.batch();
  batch.set(firestore.collection(COLLECTION).doc(user.email.toLowerCase()), fields, { merge: true });
  if (authUid) {
    batch.set(firestore.collection(COLLECTION).doc(authUid), fields, { merge: true });
  }
  await batch.commit();
  return { ok: true, error: "" };
}

async function saveWithWebAuth(user: DbUser, password: string) {
  const session = await firebaseAuthSession(user.email, password);
  const fields = {
    id: user.id,
    name: user.name,
    email: user.email.toLowerCase(),
    role: user.role,
    active: user.status === "Active",
    class_name: user.class_name,
    lms_id: user.id,
    auth_uid: session.localId,
    status: user.status,
  };
  await writeFirestoreUser(session.idToken, session.localId, fields);
  try {
    await writeFirestoreUser(session.idToken, user.email.toLowerCase(), fields);
  } catch {
    // Email-keyed doc may already exist from Admin SDK.
  }
  return { ok: true, error: "" };
}

export async function saveUserToFirebase(user: DbUser, password?: string) {
  try {
    if (getFirebaseDb()) return await saveWithAdmin(user, password);
    if (password && firebaseWebConfigured()) return await saveWithWebAuth(user, password);
    if (firebaseWebConfigured()) {
      return {
        ok: false,
        error: "Firebase needs the account password to create the login in Firebase Auth.",
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
  if (!email) return { ok: true, error: "" };
  try {
    if (firestore) {
      const normalized = email.toLowerCase();
      const doc = await firestore.collection(COLLECTION).doc(normalized).get();
      const authUid = String(doc.data()?.auth_uid || "");
      await firestore.collection(COLLECTION).doc(normalized).delete().catch(() => undefined);
      if (authUid) {
        await firestore.collection(COLLECTION).doc(authUid).delete().catch(() => undefined);
      }
      try {
        const auth = getAuth();
        const existing = await auth.getUserByEmail(normalized);
        await auth.deleteUser(existing.uid);
      } catch {
        // Auth user may already be gone.
      }
    }
    return { ok: firebaseConfigured() || firebaseWebConfigured(), error: "" };
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
    const seen = new Set<string>();
    for (const doc of snap.docs) {
      const data = doc.data() as Partial<DbUser> & { active?: boolean; lms_id?: string; auth_uid?: string };
      const email = String(data.email || doc.id).toLowerCase();
      if (!email.includes("@") || !data.name || seen.has(email)) continue;
      seen.add(email);
      const role = data.role === "teacher" || data.role === "admin" ? data.role : "student";
      const existing = getUserByEmail(email);
      const incomingHash = data.password_hash ? String(data.password_hash) : "";
      const keepLocalHash =
        existing?.password_hash &&
        existing.password_hash !== "google:pending" &&
        !existing.password_hash.startsWith("google:");
      upsertUserRecord({
        id: String(data.lms_id || data.id || existing?.id || doc.id),
        name: String(data.name),
        email,
        password_hash: keepLocalHash
          ? existing!.password_hash
          : incomingHash || existing?.password_hash || "google:pending",
        role,
        class_name: data.class_name == null ? null : String(data.class_name),
        status: data.active === false ? "Disabled" : String(data.status || existing?.status || "Active"),
        score: Number(data.score ?? existing?.score ?? 0),
        subject: data.subject == null ? existing?.subject ?? null : String(data.subject),
        qualification: data.qualification == null ? existing?.qualification ?? null : String(data.qualification),
        avatar: data.avatar == null ? existing?.avatar ?? null : String(data.avatar),
      });
      count += 1;
    }
    return { ok: true, count };
  } catch {
    return { ok: false, count: 0 };
  }
}
