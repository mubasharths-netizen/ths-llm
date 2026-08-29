import { Button } from "@/components/ui/button";
import { Card, PageHeader } from "@/components/ui/card";

export const metadata = { title: "Add account" };

const options = [
  {
    href: "/admin/add/student",
    title: "Add student",
    body: "Create a student login for a class. The student signs in on the student app.",
  },
  {
    href: "/admin/add/teacher",
    title: "Add teacher",
    body: "Create a teacher login. The teacher signs in on the teacher app.",
  },
  {
    href: "/admin/add/admin",
    title: "Add admin",
    body: "Create an administrator login. Admins manage accounts and the institute.",
  },
];

export default function AddAccountHubPage() {
  return (
    <>
      <PageHeader title="Add account" description="Student, teacher, and admin logins are created separately." />
      <div className="grid gap-4 md:grid-cols-3">
        {options.map((option) => (
          <Card key={option.href}>
            <h2 className="font-semibold">{option.title}</h2>
            <p className="mt-2 text-sm text-text-secondary">{option.body}</p>
            <div className="mt-4">
              <Button href={option.href}>Open</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
