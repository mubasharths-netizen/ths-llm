import { Card, PageHeader } from "@/components/ui/card";
import { DataTable, Td, Tr } from "@/components/ui/table";
import { studentDashboard, studentRankings } from "@/lib/db";
import { currentStudentId } from "@/lib/session-user";
import { cn } from "@/lib/cn";

export const metadata = { title: "Class ranking" };

export default async function RankingPage() {
  const userId = await currentStudentId();
  const { user, rank, totalStudents } = studentDashboard(userId);
  const rankings = studentRankings();

  return (
    <>
      <PageHeader title="Class Ranking" description="Academic standing for your cohort." />
      <Card className="mb-6">
        <p className="text-xs uppercase tracking-[0.06em] text-text-muted">Your rank</p>
        <p className="mt-2 text-3xl font-semibold">
          #{rank} of {totalStudents} students
        </p>
      </Card>
      <DataTable headers={["Rank", "Student", "Class", "Score"]}>
        {rankings.map((r) => (
          <Tr key={`${r.rank}-${r.name}`}>
            <Td className={cn(r.rank <= 3 && "font-semibold")}>{r.rank}</Td>
            <Td className={cn(r.name === user?.name && "font-semibold text-primary")}>
              {r.name}
              {r.name === user?.name ? " (you)" : ""}
            </Td>
            <Td>{r.class}</Td>
            <Td>{r.score}</Td>
          </Tr>
        ))}
      </DataTable>
    </>
  );
}
