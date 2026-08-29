import { Award, Bot, ChartLine, ClipboardCheck, Code2, FileText, PenLine, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Features" };

const features = [
  { icon: Bot, title: "AI Tutor", body: "Explanations, hints, and study recommendations." },
  { icon: PenLine, title: "Practice hints", body: "Amber hints when you need a nudge, not an answer dump." },
  { icon: ClipboardCheck, title: "Locked test mode", body: "Practice, hints, and AI stay unavailable during exams." },
  { icon: Code2, title: "Coding Lab", body: "HTML, CSS, JavaScript, Python, and SQL in one editor." },
  { icon: ChartLine, title: "Analytics", body: "Strong topics, weak topics, and weekly activity." },
  { icon: Trophy, title: "Rankings", body: "Academic class rank — professional, not a game board." },
  { icon: Award, title: "Certificates", body: "Course completion with verifiable certificate IDs." },
  { icon: FileText, title: "Assignments", body: "Upload, deadline tracking, and teacher feedback." },
];

export default function FeaturesPage() {
  return (
    <div className="marketing-wrap py-16">
      <h1 className="text-4xl font-bold tracking-tight">Features</h1>
      <p className="mt-3 max-w-2xl text-text-secondary">
        Everything in THS LAB LMS follows one loop: Learn → Practice → Test → Analyze → Improve.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Card key={f.title}>
            <f.icon size={20} className="text-primary" />
            <h2 className="mt-3 font-semibold">{f.title}</h2>
            <p className="mt-2 text-sm text-text-secondary">{f.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
