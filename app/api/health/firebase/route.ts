import { NextResponse } from "next/server";
import { firebaseConfigured, getFirebaseDb } from "@/lib/firebase";
import { firebaseWebConfigured } from "@/lib/firebase-web";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const adminDb = Boolean(getFirebaseDb());
  const web = firebaseWebConfigured();
  const configured = firebaseConfigured();
  const missing: string[] = [];
  if (!process.env.FIREBASE_PROJECT_ID?.trim() && !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim()) {
    missing.push("FIREBASE_PROJECT_ID");
  }
  if (!process.env.FIREBASE_CLIENT_EMAIL?.trim() && !process.env.FIREBASE_SERVICE_ACCOUNT?.trim()) {
    missing.push("FIREBASE_CLIENT_EMAIL or FIREBASE_SERVICE_ACCOUNT");
  }
  if (!process.env.FIREBASE_PRIVATE_KEY?.trim() && !process.env.FIREBASE_SERVICE_ACCOUNT?.trim()) {
    missing.push("FIREBASE_PRIVATE_KEY or FIREBASE_SERVICE_ACCOUNT");
  }
  if (!process.env.FIREBASE_WEB_API_KEY?.trim() && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim()) {
    missing.push("FIREBASE_WEB_API_KEY or NEXT_PUBLIC_FIREBASE_API_KEY");
  }
  if (!process.env.JWT_SECRET?.trim()) {
    missing.push("JWT_SECRET");
  }

  const ok = adminDb && web;
  return NextResponse.json({
    ok,
    vercel: Boolean(process.env.VERCEL),
    firebase: {
      configured,
      adminSdk: adminDb,
      webApi: web,
      storageBucket: Boolean(process.env.FIREBASE_STORAGE_BUCKET?.trim()),
    },
    missing,
    hint: ok
      ? "Firebase Admin + Web API look ready for production auth and user sync."
      : "Set the missing Vercel env vars, then Redeploy. Without Admin SDK, accounts created on Vercel will not persist reliably.",
  });
}
