import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, PageHeader } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { securityAlerts, sessions } from "@/lib/admin-data";

export const metadata = { title: "Security" };

export default function SecurityPage() {
  return (
    <>
      <PageHeader title="Security" description="Sessions, login activity, and alerts." />
      <div className="space-y-3">
        {securityAlerts.map((alert) => (
          <Alert key={alert.title} tone={alert.level === "Medium" ? "hint" : "info"}>
            {alert.level}: {alert.title} — {alert.detail}
          </Alert>
        ))}
      </div>
      <h2 className="mt-8 mb-4 text-xl font-semibold">Active sessions</h2>
      <DataTable headers={["User", "Device", "IP", "Last seen"]}>
        {sessions.map((row) => (
          <Tr key={row.user}>
            <Td>{row.user}</Td>
            <Td>{row.device}</Td>
            <Td className="font-mono text-xs">{row.ip}</Td>
            <Td>{row.time}</Td>
          </Tr>
        ))}
      </DataTable>
      <Card className="mt-6">
        <h2 className="font-semibold">Policy</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="primary">Password min 8</Badge>
          <Badge tone="outline">Session timeout 8h</Badge>
          <Badge tone="outline">Admin 2FA recommended</Badge>
        </div>
      </Card>
    </>
  );
}
