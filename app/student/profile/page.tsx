import { Button } from "@/components/ui/button";
import { Card, PageHeader, StatCard } from "@/components/ui/card";
import { student } from "@/lib/data";

export const metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profile" />
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white">
            AK
          </div>
          <p className="mt-3 font-semibold">{student.name}</p>
          <p className="text-sm text-text-secondary">{student.email}</p>
          <p className="text-sm text-text-muted">{student.class}</p>
        </Card>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Score" value="850" />
            <StatCard label="Rank" value="#4" />
            <StatCard label="Courses" value="3" />
          </div>
          <Card>
            <h2 className="font-semibold">Account</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="label">Email</label>
                <input className="input" defaultValue={student.email} />
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
