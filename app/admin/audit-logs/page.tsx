"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { auditLogs } from "@/lib/admin-data";

export default function AuditLogsPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(
    () =>
      auditLogs.filter((log) =>
        `${log.actor} ${log.action} ${log.target}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <>
      <PageHeader title="Audit logs" description="Who did what, when, and from where." />
      <input className="input mb-4 max-w-sm" placeholder="Filter logs" value={q} onChange={(e) => setQ(e.target.value)} />
      <DataTable headers={["Actor", "Action", "Target", "Time", "IP"]}>
        {rows.map((log) => (
          <Tr key={`${log.time}-${log.action}-${log.target}`}>
            <Td>{log.actor}</Td>
            <Td>{log.action}</Td>
            <Td>{log.target}</Td>
            <Td>{log.time}</Td>
            <Td className="font-mono text-xs">{log.ip}</Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
