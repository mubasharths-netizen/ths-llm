import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B1B4A] text-white">
      <div className="welcome-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[#0B1B4A]/70" />
      <svg className="absolute inset-0 h-full w-full opacity-25" aria-hidden>
        <line x1="8%" y1="20%" x2="40%" y2="70%" stroke="#93C5FD" strokeWidth="0.6" />
        <line x1="70%" y1="10%" x2="90%" y2="55%" stroke="#5EEAD4" strokeWidth="0.6" />
        <line x1="15%" y1="80%" x2="60%" y2="40%" stroke="#93C5FD" strokeWidth="0.6" />
        <circle cx="18%" cy="28%" r="3" fill="#93C5FD" />
        <circle cx="72%" cy="18%" r="3" fill="#5EEAD4" />
        <circle cx="86%" cy="62%" r="3" fill="#93C5FD" />
      </svg>
      <div className="absolute top-10 left-[8%] hidden font-mono text-xs text-blue-200/50 md:block">{`def learn():`}</div>
      <div className="absolute right-[10%] bottom-16 hidden font-mono text-xs text-teal-200/50 md:block">{`SELECT * FROM skills;`}</div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm font-medium tracking-[0.18em] text-blue-200 uppercase">THS LAB LMS</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Welcome to THS LAB LMS</h1>
        <p className="mt-3 text-xl text-blue-100">Learn. Practice. Improve.</p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-200">
          A professional IT learning platform where students learn technology, practice skills, receive AI
          guidance and improve their academic performance.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/login">Get Started</Button>
          <Link
            href="/login"
            className="btn w-full border border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto"
          >
            Login
          </Link>
        </div>
        <p className="mt-6 text-xs text-blue-200/80">Professional IT education · Focused · Calm · Intelligent</p>
      </div>
    </main>
  );
}
