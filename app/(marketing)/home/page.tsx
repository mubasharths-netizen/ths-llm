import { Bot, Code2, ClipboardCheck, GraduationCap, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { publicCourses } from "@/lib/db";

const steps = ["Learn", "Practice", "Get Help", "Test", "Improve"];

export default function HomePage() {
  const courses = publicCourses();
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="marketing-wrap grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge>IT Learning Platform</Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-text">
              Learn Technology. Practice Skills. Build Your Future.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
              THS LAB LMS helps students learn programming, practice with guidance, sit focused tests, and
              improve through analytics — without noise or gamification.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/login">Get Started</Button>
              <Button href="/courses" variant="secondary">
                Browse courses
              </Button>
            </div>
          </div>
          <Card>
            <p className="text-sm font-medium text-text-muted">Learning loop</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {steps.map((step, i) => (
                <span key={step} className="badge bg-primary-soft text-primary">
                  {i + 1}. {step}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-text-secondary">
              Learn → Practice → Get Help → Test → Analyze → Improve
            </p>
          </Card>
        </div>
      </section>

      <section className="marketing-wrap py-16">
        <h2 className="text-[28px] font-semibold tracking-tight">Featured courses</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <Card key={course.id}>
              <div className="mb-4 h-28 rounded-lg bg-primary-soft" />
              <Badge tone="primary">{course.level}</Badge>
              <h3 className="mt-3 text-base font-semibold">{course.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{course.teacher}</p>
              <div className="mt-4">
                <ProgressBar value={course.progress || 35} />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="marketing-wrap">
          <h2 className="text-[28px] font-semibold tracking-tight">How students learn</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {steps.map((step, i) => (
              <Card key={step}>
                <p className="text-xs font-medium text-text-muted">Step {i + 1}</p>
                <p className="mt-2 font-semibold">{step}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-wrap grid gap-4 py-16 md:grid-cols-3">
        <Card>
          <Bot className="text-ai" />
          <h3 className="mt-3 font-semibold">AI Tutor</h3>
          <p className="mt-2 text-sm text-text-secondary">
            Ask for explanations, hints, and code walkthroughs without replacing your own thinking.
          </p>
        </Card>
        <Card>
          <PenLine className="text-teal" />
          <h3 className="mt-3 font-semibold">Practice system</h3>
          <p className="mt-2 text-sm text-text-secondary">
            Topic practice with hints, retry, and clear correct / incorrect feedback.
          </p>
        </Card>
        <Card>
          <ClipboardCheck className="text-primary" />
          <h3 className="mt-3 font-semibold">Test mode</h3>
          <p className="mt-2 text-sm text-text-secondary">
            Distraction-free exams. Practice, hints, and AI Tutor stay locked until you submit.
          </p>
        </Card>
        <Card>
          <Code2 className="text-primary" />
          <h3 className="mt-3 font-semibold">Coding Lab</h3>
          <p className="mt-2 text-sm text-text-secondary">
            Write HTML, CSS, JavaScript, Python, and SQL in a professional editor.
          </p>
        </Card>
        <Card>
          <GraduationCap className="text-teal" />
          <h3 className="mt-3 font-semibold">Teachers</h3>
          <p className="mt-2 text-sm text-text-secondary">
            Faculty create courses, grade work, and see where a class is struggling.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold">Student success</h3>
          <p className="mt-2 text-sm text-text-secondary">
            “The practice-to-test path is clear. I know what to revise before every exam.” — Ayesha Khan, BSIT-4A
          </p>
        </Card>
      </section>

      <section className="bg-surface">
        <div className="marketing-wrap grid grid-cols-2 gap-6 py-12 md:grid-cols-4">
          {[
            ["12,400", "Students"],
            ["86", "Courses"],
            ["94%", "Completion"],
            ["81", "Average score"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-3xl font-semibold tracking-tight">{value}</p>
              <p className="text-sm text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="marketing-wrap py-16 text-center">
        <h2 className="text-[28px] font-semibold tracking-tight">Start learning with THS LAB LMS</h2>
        <p className="mt-2 text-text-secondary">Sign in with the account your administrator created for you.</p>
        <div className="mt-6 flex justify-center">
          <Button href="/login">Login</Button>
        </div>
      </section>
    </>
  );
}
