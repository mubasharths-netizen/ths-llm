"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  "View courses",
  "Create courses",
  "Sit tests",
  "Use AI Tutor",
  "Grade assignments",
  "Manage users",
  "Change AI settings",
  "View audit logs",
];

const matrix: Record<string, boolean[]> = {
  Student: [true, false, true, true, false, false, false, false],
  Teacher: [true, true, false, true, true, false, false, false],
  Admin: [true, true, false, true, true, true, true, true],
};

export default function PermissionsPage() {
  const [grid, setGrid] = useState(matrix);

  return (
    <>
      <PageHeader title="Permissions" description="Role matrix for Student, Teacher, and Admin." />
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="h-[52px] px-4 text-xs font-medium uppercase tracking-[0.06em] text-text-muted">Capability</th>
              {Object.keys(grid).map((role) => (
                <th key={role} className="px-4 text-xs font-medium uppercase tracking-[0.06em] text-text-muted">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {capabilities.map((cap, i) => (
              <tr key={cap} className="h-[52px] border-b border-border last:border-0">
                <td className="px-4 text-sm">{cap}</td>
                {Object.entries(grid).map(([role, values]) => (
                  <td key={role} className="px-4">
                    <button
                      type="button"
                      onClick={() =>
                        setGrid((current) => ({
                          ...current,
                          [role]: current[role].map((v, idx) => (idx === i ? !v : v)),
                        }))
                      }
                    >
                      <Badge tone={values[i] ? "teal" : "muted"}>{values[i] ? "Allow" : "Deny"}</Badge>
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
