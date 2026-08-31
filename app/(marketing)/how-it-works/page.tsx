import { Card } from "@/components/ui/card";

export const metadata = { title: "How it works" };

const steps = [
  ["Login", "Sign in with the account created by your administrator."],
  ["Learn", "Follow course modules and complete lessons."],
  ["Practice", "Attempt questions with optional hints."],
  ["Get help", "Ask Mubashar (AI Tutor) to explain a concept or mistake."],
  ["Quiz", "Check understanding in a short quiz."],
  ["Test", "Sit a locked, timed assessment."],
  ["Analyze", "Review score, rank, and weak topics."],
  ["Improve", "Revise recommended topics and try again."],
];

export default function HowItWorksPage() {
  return (
    <div className="marketing-wrap py-16">
      <h1 className="text-4xl font-bold tracking-tight">How it works</h1>
      <div className="mt-10 space-y-4">
        {steps.map(([title, body], i) => (
          <Card key={title} className="flex gap-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-text-secondary">{body}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
