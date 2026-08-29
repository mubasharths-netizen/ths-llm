import { Card, PageHeader } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { rankings, student } from "@/lib/data";
import { cn } from "@/lib/cn";

export const metadata = { title: "Class ranking" };

export default function RankingPage() {
  return (
    <>
      <PageHeader title="Class Ranking" description="Academic standing for your cohort." />
      <Card className="mb-6">
        <p className="text-xs uppercase tracking-[0.06em] text-text-muted">Your rank</p>
        <p className="mt-2 text-3xl font-semibold">
          #{student.rank} of {student.totalStudents} students
        </p>
      </Card>
      <DataTable headers={["Rank", "Student", "Class", "Score", "Trend"]}>
        {rankings.map((r) => (
          <Tr key={r.rank}>
            <Td className={cn(r.rank <= 3 && "font-semibold")}>{r.rank}</Td>
            <Td className={cn(r.you && "font-semibold text-primary")}>
              {r.name}
              {r.you ? " (you)" : ""}
            </Td>
            <Td>{r.class}</Td>
            <Td>{r.score}</Td>
            <Td className="text-text-muted">{r.trend}</Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
