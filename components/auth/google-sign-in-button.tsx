"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ||
  "459777135899-oj160q89lhs1ohcq2cv31hmgukdtchqh.apps.googleusercontent.com";

const homeByRole = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
} as const;

type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential?: string }) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        use_fedcm_for_prompt?: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: { theme?: string; size?: string; width?: number; text?: string; shape?: string },
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

export function GoogleSignInButton({
  label = "Continue with Google",
  onError,
}: {
  label?: string;
  onError: (message: string) => void;
}) {
  const router = useRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-ths-google]");
    if (existing && window.google?.accounts?.id) {
      render();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.thsGoogle = "true";
    script.onload = () => render();
    script.onerror = () => onError("Google script could not load. Check your internet connection.");
    document.head.appendChild(script);

    function render() {
      const host = hostRef.current;
      if (!host || !window.google?.accounts?.id) return;
      host.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false,
        callback: (response) => {
          void finishSignIn(response.credential);
        },
      });
      window.google.accounts.id.renderButton(host, {
        theme: "outline",
        size: "large",
        width: 320,
        text: label.toLowerCase().includes("sign up") ? "signup_with" : "continue_with",
        shape: "pill",
      });
    }
  }, [label, onError]);

  async function finishSignIn(credential?: string) {
    if (!credential) {
      onError("Google sign-in was cancelled.");
      return;
    }
    onError("");
    setPending(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credential }),
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
    } catch {
      onError("Google sign-in failed. Try again.");
      setPending(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div ref={hostRef} className="flex min-h-12 w-full justify-center overflow-hidden" />
      {pending ? <p className="text-xs text-text-muted">Signing in with Google…</p> : null}
    </div>
  );
}
