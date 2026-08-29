import { ProfileCard } from "@/components/profile/profile-card";
import { PageHeader } from "@/components/ui/card";
import { avatarUrl } from "@/lib/avatar";
import { getUserById } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Profile" };

export default async function AdminProfilePage() {
  const session = await getSession();
  const user = session ? getUserById(session.id) : undefined;
  return (
    <>
      <PageHeader title="Profile" description="Your photo, account details, and sign out." />
      <div className="max-w-sm">
        <ProfileCard
          name={user?.name ?? session?.name ?? "Admin"}
          email={user?.email ?? session?.email ?? ""}
          meta="Administrator"
          avatarUrl={avatarUrl(user?.avatar)}
        />
      </div>
    </>
  );
}
