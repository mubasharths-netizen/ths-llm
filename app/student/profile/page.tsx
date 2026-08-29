import { ProfileCard } from "@/components/profile/profile-card";
import { Button } from "@/components/ui/button";
import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { avatarUrl } from "@/lib/avatar";
import { studentDashboard } from "@/lib/db";
import { currentStudentId } from "@/lib/session-user";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const userId = await currentStudentId();
  const { user, rank, enrollments } = studentDashboard(userId);
  const name = user?.name ?? "Student";
  const email = user?.email ?? "";
  const className = user?.class_name ?? "";
  const score = user?.score ?? 0;

  return (
    <>
      <PageHeader title="Profile" description="Your photo, account details, and sign out." />
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <ProfileCard name={name} email={email} meta={className} avatarUrl={avatarUrl(user?.avatar)} />
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Score" value={String(score)} />
            <StatCard label="Rank" value={`#${rank}`} />
            <StatCard label="Courses" value={String(enrollments.length)} />
          </div>
          <Card>
            <h2 className="font-semibold">Account</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="label">Email</label>
                <input className="input" defaultValue={email} readOnly />
              </div>
              <div>
                <label className="label">New password</label>
                <input className="input" type="password" />
              </div>
              <Button type="button">Save changes</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
