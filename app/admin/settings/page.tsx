"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { useTheme } from "@/components/theme/theme-provider";

export default function AdminSettingsPage() {
  const { theme, toggle } = useTheme();
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PageHeader title="System settings" description="Platform name, theme, notifications, and scoring." />
      {saved ? (
        <div className="mb-4">
          <Alert tone="success">Settings saved.</Alert>
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">General</h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="label">Platform name</label>
              <input className="input" defaultValue="THS LAB LMS" />
            </div>
            <div>
              <label className="label">Logo</label>
              <input className="input" defaultValue="TH" />
            </div>
            <Button type="button" onClick={() => setSaved(true)}>
              Save
            </Button>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Theme</h2>
          <p className="mt-2 text-sm text-text-secondary">Current: {theme} mode</p>
          <div className="mt-4">
            <Button type="button" variant="secondary" onClick={toggle}>
              Toggle dark mode
            </Button>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Notifications</h2>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked /> Assignment reminders
          </label>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked /> Test reminders
          </label>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked /> Result announcements
          </label>
        </Card>
        <Card>
          <h2 className="font-semibold">Scoring rules</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Practice weight</label>
              <input className="input" defaultValue="15%" />
            </div>
            <div>
              <label className="label">Quiz weight</label>
              <input className="input" defaultValue="20%" />
            </div>
            <div>
              <label className="label">Test weight</label>
              <input className="input" defaultValue="35%" />
            </div>
            <div>
              <label className="label">Exam weight</label>
              <input className="input" defaultValue="30%" />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
