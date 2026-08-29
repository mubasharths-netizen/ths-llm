import { Card } from "@/components/ui/card";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="marketing-wrap py-16">
      <h1 className="text-4xl font-bold tracking-tight">About THS LAB</h1>
      <p className="mt-4 max-w-2xl text-text-secondary leading-7">
        THS LAB LMS is a professional IT laboratory learning system. Students learn programming and
        technology, practice with structured feedback, and improve through tests and analytics.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["Focus", "Calm layouts for long study sessions."],
          ["Practice", "Hints and AI help without turning learning into a game."],
          ["Integrity", "Locked test mode. Honest results. Clear rankings."],
        ].map(([title, body]) => (
          <Card key={title}>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-text-secondary">{body}</p>
          </Card>
        ))}
      </div>
      <h2 className="mt-14 text-[28px] font-semibold">Faculty</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Imran Malik", "Sara Ahmed", "Nadia Rehman", "Kamran Aziz"].map((name) => (
          <Card key={name}>
            <div className="mb-3 h-16 w-16 rounded-full bg-primary-soft" />
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-text-muted">THS LAB Faculty</p>
          </Card>
        ))}
      </div>
      <div className="mt-10 h-48 rounded-2xl bg-primary-soft" aria-hidden />
    </div>
  );
}
