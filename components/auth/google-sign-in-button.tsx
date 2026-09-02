"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  googleAuthErrorMessage,
  googleRedirectIdToken,
  signInWithGooglePopup,
  startGoogleRedirect,
} from "@/lib/firebase-client";

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

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const token = await googleRedirectIdToken();
        if (!token || cancelled) return;
        await finishSignIn(token);
      } catch (err) {
        if (!cancelled) onError(googleAuthErrorMessage(err));
      }
    })();
    return () => {
      cancelled = true;
    };
    // Finish Google redirect once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function finishSignIn(idToken: string) {
    onError("");
    setPending(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = (await res.json()) as { error?: string; user?: { role?: string }; dest?: string };
      if (!res.ok || !data.user?.role) {
        onError(data.error || "Google sign-in failed.");
        return;
      }
      const dest =
        data.dest ||
        (data.user.role in homeByRole ? homeByRole[data.user.role as keyof typeof homeByRole] : "/student");
      router.push(dest);
      router.refresh();
    } catch {
      onError("Google sign-in failed. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function onClick() {
    onError("");
    setPending(true);
    try {
      const idToken = await signInWithGooglePopup();
      await finishSignIn(idToken);
    } catch (err) {
      const code = typeof err === "object" && err && "code" in err ? String((err as { code?: string }).code) : "";
      if (code === "auth/popup-blocked") {
        try {
          await startGoogleRedirect();
          return;
        } catch (redirectErr) {
          onError(googleAuthErrorMessage(redirectErr));
        }
      } else {
        onError(googleAuthErrorMessage(err));
      }
      setPending(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Button type="button" variant="secondary" className="h-12 w-full rounded-full" disabled={pending} onClick={() => void onClick()}>
        {pending ? "Signing in with Google…" : label}
      </Button>
    </div>
  );
}
