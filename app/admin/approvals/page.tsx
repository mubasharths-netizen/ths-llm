import { ApprovalsList } from "@/app/admin/approvals/approvals-list";
import { listPendingTeachers } from "@/lib/db";

export const metadata = { title: "Teacher approval" };

export default function ApprovalsPage() {
  return <ApprovalsList initialPending={listPendingTeachers()} />;
}
