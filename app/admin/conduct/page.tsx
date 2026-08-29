import { AdminConductReview } from "@/components/admin/conduct-review";
import { listComplaints, listDiscipline } from "@/lib/conduct";

export const metadata = { title: "Complaints & discipline" };

export default function AdminConductPage() {
  return <AdminConductReview complaints={listComplaints({})} reports={listDiscipline({})} />;
}
