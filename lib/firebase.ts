import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

type ServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function readServiceAccount(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as {
        project_id?: string;
        client_email?: string;
        private_key?: string;
        projectId?: string;
        clientEmail?: string;
        privateKey?: string;
      };
      const projectId = parsed.project_id || parsed.projectId || "";
      const clientEmail = parsed.client_email || parsed.clientEmail || "";
      const privateKey = (parsed.private_key || parsed.privateKey || "").replace(/\\n/g, "\n");
      if (projectId && clientEmail && privateKey) {
        return { projectId, clientEmail, privateKey };
      }
    } catch {
      return null;
    }
  }
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim() || "";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim() || "";
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim() || "";
  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }
  return null;
}

export function firebaseConfigured() {
  return Boolean(readServiceAccount()) || Boolean(process.env.FIREBASE_WEB_API_KEY?.trim() || process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim());
}

export function getFirebaseDb(): Firestore | null {
  const account = readServiceAccount();
  if (!account) return null;
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: account.projectId,
        clientEmail: account.clientEmail,
        privateKey: account.privateKey,
      }),
    });
  }
  return getFirestore();
}
