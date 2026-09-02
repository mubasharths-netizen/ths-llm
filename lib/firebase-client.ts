import { getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

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

export async function signInWithGooglePopup() {
  const auth = getAuth(clientApp());
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  if (!idToken) throw new Error("Google did not return a sign-in token.");
  return idToken;
}
