"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { UsersRoleCharts } from "@/components/admin/users-role-charts";
import type { AdminUserRow } from "@/lib/db-types";

export function UsersManager({
  title,
  description,
  initialRole,
  initialUsers,
}: {
  title: string;
  description: string;
  initialRole?: AdminUserRow["role"] | "All";
  initialUsers: AdminUserRow[];
}) {
  const [tab, setTab] = useState<AdminUserRow["role"] | "All">(initialRole ?? "All");
  const [rows, setRows] = useState(initialUsers);
  const [loadError, setLoadError] = useState("");
  const [firebaseConnected, setFirebaseConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/users", { cache: "no-store", signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load accounts.");
        return (await res.json()) as { users?: AdminUserRow[]; firebaseConnected?: boolean };
      })
      .then((data) => {
        if (data.users) setRows(data.users);
        if (typeof data.firebaseConnected === "boolean") setFirebaseConnected(data.firebaseConnected);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setLoadError("Could not refresh the account list.");
      });
    return () => controller.abort();
  }, []);

  const filtered = useMemo(
    () => (tab === "All" ? rows : rows.filter((u) => u.role === tab)),
    [rows, tab],
  );

  async function patchUser(id: string, action: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (!res.ok) return;
    if (action === "delete") {
      setRows((current) => current.filter((row) => row.id !== id));
      return;
    }
    const data = (await res.json()) as { user?: AdminUserRow };
    if (data.user) {
      setRows((current) => current.map((row) => (row.id === id ? data.user! : row)));
    }
  }

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button
            href={
              initialRole === "Student"
                ? "/admin/add/student"
                : initialRole === "Teacher"
                  ? "/admin/add/teacher"
                  : initialRole === "Admin"
                    ? "/admin/add/admin"
                    : "/admin/add"
            }
            variant="secondary"
          >
            {initialRole === "Student"
              ? "Add student"
              : initialRole === "Teacher"
                ? "Add teacher"
                : initialRole === "Admin"
                  ? "Add admin"
                  : "Add account"}
          </Button>
        }
      />
      {firebaseConnected === false ? (
        <div className="mb-4">
          <Alert tone="hint">
            Firebase is not connected, so new students and teachers stay on this server only. Add FIREBASE_PROJECT_ID,
            FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local and Vercel, then restart.
          </Alert>
        </div>
      ) : null}
      {firebaseConnected === true ? (
        <div className="mb-4">
          <Alert tone="success">Admin, teacher, and student accounts sync to Google Firebase.</Alert>
        </div>
      ) : null}
      <UsersRoleCharts
        users={rows}
        activeRole={tab}
        onSelectRole={!initialRole || initialRole === "All" ? (role) => setTab(role) : undefined}
      />
      {!initialRole || initialRole === "All" ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {(["All", "Student", "Teacher", "Admin"] as const).map((role) => (
            <button key={role} type="button" onClick={() => setTab(role)}>
              <Badge tone={tab === role ? "primary" : "outline"}>{role}</Badge>
            </button>
          ))}
        </div>
      ) : null}
      <DataTable headers={["Name", "Email", "Role", "Class", "Status", "Actions"]}>
        {loadError ? (
          <Tr>
            <Td className="text-error" colSpan={6}>
              {loadError}
            </Td>
          </Tr>
        ) : null}
        {!loadError && filtered.length === 0 ? (
          <Tr>
            <Td className="text-text-secondary" colSpan={6}>
              No {tab === "All" ? "accounts" : `${tab.toLowerCase()} accounts`} yet. Use Add account to create one —
              the graphs above update from the same list.
            </Td>
          </Tr>
        ) : null}
        {filtered.map((user) => (
          <Tr key={user.id}>
            <Td>{user.name}</Td>
            <Td>{user.email}</Td>
            <Td>{user.role}</Td>
            <Td>{user.class}</Td>
            <Td>
              <Badge tone={user.status === "Active" ? "teal" : "muted"}>{user.status}</Badge>
            </Td>
            <Td>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void patchUser(user.id, user.status === "Active" ? "disable" : "enable")}
                >
                  {user.status === "Active" ? "Disable" : "Enable"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => void patchUser(user.id, "delete")}>
                  Delete
                </Button>
              </div>
            </Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
