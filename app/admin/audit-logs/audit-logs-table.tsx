"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";

type AuditLog = {
  actor: string;
  action: string;
  target: string;
  ip: string;
  created_at: string;
};

export function AuditLogsTable({ logs }: { logs: AuditLog[] }) {
  const [q, setQ] = useState("");
  const rows = useMemo(
    () =>
      logs.filter((log) =>
        `${log.actor} ${log.action} ${log.target}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [logs, q],
  );

  return (
    <>
      <PageHeader title="Audit logs" description="Who did what, when, and from where." />
      <input className="input mb-4 max-w-sm" placeholder="Filter logs" value={q} onChange={(e) => setQ(e.target.value)} />
      <DataTable headers={["Actor", "Action", "Target", "Time", "IP"]}>
        {rows.map((log) => (
          <Tr key={`${log.created_at}-${log.action}-${log.target}`}>
            <Td>{log.actor}</Td>
            <Td>{log.action}</Td>
            <Td>{log.target}</Td>
            <Td>{log.created_at}</Td>
            <Td className="font-mono text-xs">{log.ip}</Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
