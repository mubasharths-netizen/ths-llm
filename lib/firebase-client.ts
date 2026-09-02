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

export async function signInWithGooglePopup() {
  const result = await signInWithPopup(clientAuth(), googleProvider());
  const idToken = await result.user.getIdToken();
  if (!idToken) throw new Error("Google did not return a sign-in token.");
  return idToken;
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
