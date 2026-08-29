"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ProfileCard({
  name,
  email,
  meta,
  avatarUrl,
}: {
  name: string;
  email: string;
  meta?: string;
  avatarUrl?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState(avatarUrl || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setBusy(true);
    const body = new FormData();
    body.set("avatar", file);
    const res = await fetch("/api/me/avatar", { method: "POST", body });
    const data = (await res.json()) as { error?: string; avatarUrl?: string };
    setBusy(false);
    if (!res.ok || !data.avatarUrl) {
      setError(data.error || "Unable to upload photo.");
      return;
    }
    setPhoto(data.avatarUrl);
    router.refresh();
  }

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/login");
  }

  return (
    <Card className="text-center">
      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-primary text-xl font-semibold text-white">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">{initials(name) || "U"}</div>
        )}
      </div>
      <p className="mt-3 font-semibold">{name}</p>
      <p className="text-sm text-text-secondary">{email}</p>
      {meta ? <p className="text-sm text-text-muted">{meta}</p> : null}
      {error ? (
        <div className="mt-3 text-left">
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
      <div className="mt-4 flex flex-col gap-2">
        <Button type="button" variant="secondary" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? "Saving…" : photo ? "Change photo" : "Add photo"}
        </Button>
        <Button type="button" variant="danger" disabled={busy} onClick={() => void logout()}>
          Log out
        </Button>
      </div>
    </Card>
  );
}
