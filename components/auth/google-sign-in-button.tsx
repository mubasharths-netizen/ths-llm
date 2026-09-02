"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGooglePopup } from "@/lib/firebase-client";

const homeByRole = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
} as const;

export function GoogleSignInButton({
  label = "Continue with Google",
  onError,
}: {
  label?: string;
  onError: (message: string) => void;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    onError("");
    setPending(true);
    try {
      const idToken = await signInWithGooglePopup();
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = (await res.json()) as { error?: string; user?: { role?: string }; dest?: string };
      if (!res.ok || !data.user?.role) {
        onError(data.error || "Google sign-in failed.");
        setPending(false);
        return;
      }
      const dest =
        data.dest ||
        (data.user.role in homeByRole ? homeByRole[data.user.role as keyof typeof homeByRole] : "/student");
      router.push(dest);
      router.refresh();
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Google sign-in failed.";
      if (/popup-closed-by-user|cancelled/i.test(raw)) {
        onError("Google sign-in was cancelled.");
      } else if (/unauthorized-domain/i.test(raw)) {
        onError("This site domain is not allowed in Firebase Google sign-in yet.");
      } else if (/operation-not-allowed/i.test(raw)) {
        onError("Google sign-in is not enabled yet in Firebase Authentication.");
      } else {
        onError(raw.replace(/_/g, " ").slice(0, 180));
      }
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={pending}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-slate-300 bg-white text-sm font-medium text-text hover:bg-slate-50 disabled:opacity-60"
    >
      <GoogleMark />
      {pending ? "Connecting to Google…" : label}
    </button>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.8-6.6 7.5l6.3 5.3C38.2 37.3 44 32 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
