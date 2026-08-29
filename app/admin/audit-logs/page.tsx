import { AuditLogsTable } from "@/app/admin/audit-logs/audit-logs-table";
import { listAuditLogs } from "@/lib/db";

export const metadata = { title: "Audit logs" };

export default function AuditLogsPage() {
  return <AuditLogsTable logs={listAuditLogs()} />;
}
