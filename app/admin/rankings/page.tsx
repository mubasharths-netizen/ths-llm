import { Card, PageHeader } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { studentRankings } from "@/lib/db";
import { cn } from "@/lib/cn";

export const metadata = { title: "Rankings" };

export default function AdminRankingsPage() {
  const rankings = studentRankings();

  return (
    <>
      <PageHeader title="Rankings" description="Institute-wide academic standing." />
      <Card className="mb-6">
        <label className="label">Class filter</label>
        <select className="input max-w-xs">
          <option>All classes</option>
          {[...new Set(rankings.map((row) => row.class))].map((cls) => (
            <option key={cls}>{cls}</option>
          ))}
        </select>
      </Card>
      <DataTable headers={["Rank", "Student", "Class", "Score"]}>
        {rankings.map((row) => (
          <Tr key={`${row.rank}-${row.name}`}>
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
