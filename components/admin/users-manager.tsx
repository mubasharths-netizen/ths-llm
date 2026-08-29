"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { adminUsers } from "@/lib/admin-data";

type User = (typeof adminUsers)[number];

export function UsersManager({
  title,
  description,
  initialRole,
}: {
  title: string;
  description: string;
  initialRole?: User["role"] | "All";
}) {
  const [tab, setTab] = useState<User["role"] | "All">(initialRole ?? "All");
  const [rows, setRows] = useState(adminUsers);
  const [form, setForm] = useState({ name: "", email: "", role: "Student" as User["role"] });

  const filtered = useMemo(
    () => (tab === "All" ? rows : rows.filter((u) => u.role === tab)),
    [rows, tab],
  );

  function addUser() {
    if (!form.name.trim() || !form.email.trim()) return;
    setRows((current) => [
      {
        id: `new-${Date.now()}`,
        name: form.name,
        email: form.email,
        role: form.role,
        class: form.role === "Student" ? "BSIT-4A" : form.role === "Teacher" ? "Faculty" : "Ops",
        status: "Active",
      },
      ...current,
    ]);
    setForm({ name: "", email: "", role: form.role });
  }

  return (
    <>
      <PageHeader title={title} description={description} />
      {!initialRole || initialRole === "All" ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {(["All", "Student", "Teacher", "Admin"] as const).map((role) => (
            <button key={role} type="button" onClick={() => setTab(role)}>
              <Badge tone={tab === role ? "primary" : "outline"}>{role}</Badge>
            </button>
          ))}
        </div>
      ) : null}
      <Card className="mb-6">
        <h2 className="font-semibold">Add user</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })}>
            <option>Student</option>
            <option>Teacher</option>
            <option>Admin</option>
          </select>
          <Button type="button" onClick={addUser}>
            Add
          </Button>
        </div>
      </Card>
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
                  onClick={() =>
                    setRows((current) =>
                      current.map((row) =>
                        row.id === user.id
                          ? { ...row, status: row.status === "Active" ? "Disabled" : "Active" }
                          : row,
                      ),
                    )
                  }
                >
                  {user.status === "Active" ? "Disable" : "Enable"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setRows((current) => current.filter((row) => row.id !== user.id))}
                >
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
