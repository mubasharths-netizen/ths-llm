import { Card, PageHeader } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { rankings } from "@/lib/data";
import { cn } from "@/lib/cn";

export const metadata = { title: "Rankings" };

export default function AdminRankingsPage() {
  return (
    <>
      <PageHeader title="Rankings" description="Institute-wide academic standing." />
      <Card className="mb-6">
        <label className="label">Class filter</label>
        <select className="input max-w-xs">
          <option>All classes</option>
          <option>BSIT-4A</option>
          <option>BSIT-4B</option>
        </select>
      </Card>
      <DataTable headers={["Rank", "Student", "Class", "Score"]}>
        {rankings.map((row) => (
          <Tr key={row.rank}>
            <Td className={cn(row.rank <= 3 && "font-semibold")}>{row.rank}</Td>
            <Td>{row.name}</Td>
            <Td>{row.class}</Td>
            <Td>{row.score}</Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
