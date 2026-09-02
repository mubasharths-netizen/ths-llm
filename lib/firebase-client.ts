import { getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  type Auth,
} from "firebase/auth";

function firebaseClientConfig() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "ths-lab-lms-97e043";
  return {
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ||
      process.env.FIREBASE_WEB_API_KEY?.trim() ||
      "AIzaSyDmhYINPtjs4w-bJm_G8bs8As7Tfyz8T-4",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || `${projectId}.firebaseapp.com`,
    projectId,
  };
}

function clientApp() {
  const existing = getApps()[0];
  if (existing) return existing;
  return initializeApp(firebaseClientConfig());
}

function googleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

export function clientAuth(): Auth {
  return getAuth(clientApp());
}

export function googleAuthErrorMessage(err: unknown) {
  const code = typeof err === "object" && err && "code" in err ? String((err as { code?: string }).code) : "";
  const message = err instanceof Error ? err.message : "";
  if (code === "auth/unauthorized-domain" || /unauthorized-domain/i.test(message)) {
    const host = typeof window !== "undefined" ? window.location.hostname : "this domain";
    return `Google sign-in is blocked on ${host}. Add this domain in Firebase Authentication → Settings → Authorized domains.`;
  }
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "Google sign-in was cancelled.";
  }
  if (code === "auth/popup-blocked") {
    return "The Google popup was blocked. Allow popups and try again.";
  }
  if (code === "auth/operation-not-allowed") {
    return "Google sign-in is not enabled in Firebase Authentication.";
  }
  return message.replace(/Firebase:\s*/i, "").slice(0, 180) || "Google sign-in failed. Try again.";
}

function authBridgeOrigin() {
  return process.env.NEXT_PUBLIC_AUTH_BRIDGE_ORIGIN?.trim() || "https://ths-lab-lms-97e043.web.app";
}

function isLocalHost() {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

export async function signInWithGooglePopup() {
  const result = await signInWithPopup(clientAuth(), googleProvider());
  const idToken = await result.user.getIdToken();
  if (!idToken) throw new Error("Google did not return a sign-in token.");
  return idToken;
}

export async function signInWithGoogleBridge() {
  const target = window.location.origin;
  const url = `${authBridgeOrigin()}/?origin=${encodeURIComponent(target)}`;
  const allowed = new Set([
    "https://ths-lab-lms-97e043.web.app",
    "https://ths-lab-lms-97e043.firebaseapp.com",
    authBridgeOrigin().replace(/\/$/, ""),
  ]);
  return new Promise<string>((resolve, reject) => {
    const popup = window.open(url, "ths-google-auth", "width=480,height=720");
    if (!popup) {
      const err = new Error("The Google popup was blocked. Allow popups and try again.");
      (err as Error & { code?: string }).code = "auth/popup-blocked";
      reject(err);
      return;
    }
    let done = false;
    const finish = (error?: unknown, token?: string) => {
      if (done) return;
      done = true;
      window.removeEventListener("message", onMessage);
      window.clearInterval(timer);
      try {
        popup.close();
      } catch {
        // Ignore if the popup is already gone.
      }
      if (token) resolve(token);
      else reject(error instanceof Error ? error : new Error("Google sign-in failed. Try again."));
    };
    const onMessage = (event: MessageEvent) => {
      if (!allowed.has(event.origin)) return;
      const data = event.data as { type?: string; idToken?: string; error?: string } | null;
      if (!data || data.type !== "ths-google-auth") return;
      if (data.idToken) finish(undefined, data.idToken);
      else finish(new Error(data.error || "Google sign-in failed. Try again."));
    };
    window.addEventListener("message", onMessage);
    const timer = window.setInterval(() => {
      if (!popup.closed) return;
      window.clearInterval(timer);
      window.setTimeout(() => {
        finish(Object.assign(new Error("Google sign-in was cancelled."), { code: "auth/popup-closed-by-user" }));
      }, 800);
    }, 400);
  });
}

export async function signInWithGoogle() {
  try {
    return await signInWithGooglePopup();
  } catch (err) {
    const code = typeof err === "object" && err && "code" in err ? String((err as { code?: string }).code) : "";
    const message = err instanceof Error ? err.message : "";
    const needsBridge =
      !isLocalHost() &&
      (code === "auth/unauthorized-domain" ||
        code === "auth/popup-blocked" ||
        /unauthorized-domain/i.test(message));
    if (needsBridge) return signInWithGoogleBridge();
    throw err;
  }
}

export async function startGoogleRedirect() {
  await signInWithRedirect(clientAuth(), googleProvider());
}

export async function googleRedirectIdToken() {
  const result = await getRedirectResult(clientAuth());
  if (!result?.user) return null;
  const idToken = await result.user.getIdToken();
  return idToken || null;
}
