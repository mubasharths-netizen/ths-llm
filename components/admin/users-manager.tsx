"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Td, Tr } from "@/components/ui/table";
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
