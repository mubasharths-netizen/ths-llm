# THS LAB LMS — Stitch Batch Prompts

Generate **one batch per Stitch run**. After Batch 01, tell Stitch:  
`Reuse the same design system, navbar, sidebar, typography, and components. Do not restyle the product.`

Each prompt is ready to copy. Desktop 1440 first.

---

## BATCH 01 — Design language + Welcome + Home

```
Product: THS LAB LMS — premium professional IT Learning Management System.

ANATOMY
Create 2 desktop screens (1440px) and 2 mobile screens (390px):

1) Welcome — full-viewport cinematic hero. Full-bleed technology background (programming, networks, AI, cybersecurity) with a dark overlay. Centered content block. Two CTA buttons in a row. Tiny trust line under buttons. No navbar. No footer.

2) Home — marketing layout. Sticky top navbar (logo, links, Login, Get Started). Hero with headline + subcopy + two buttons. Then: featured courses (3 cards), 5-step learning process, AI Tutor feature band, Practice/Test/Coding Lab 3-column features, stats row (4 metrics), teacher section, testimonials (3 quotes), CTA band, 4-column footer.

VIBE
Clean SaaS education. Calm, trustworthy, intelligent, focused. International university-meets-Linear. Not a game. No neon. No mascots. Subtle technology atmosphere only on Welcome.

CONTENT
Brand: THS LAB LMS
Welcome title: Welcome to THS LAB LMS
Subtitle: Learn. Practice. Improve.
Home headline: Learn Technology. Practice Skills. Build Your Future.
Courses: Python Fundamentals, Web Development, Cybersecurity Basics
Stats: 12,400 students · 86 courses · 94% completion · 81 avg score
```

---

## BATCH 02 — Public site pages

```
Continue THS LAB LMS. Reuse the same marketing navbar and footer from Home.

ANATOMY
Create 4 desktop screens:

1) About — intro + 3 value cards + faculty grid (4 people) + lab photo placeholder.
2) Courses catalog — left filters (category, level) + search + course card grid (6 courses).
3) Features — bento grid of 8 features: AI Tutor, Practice Hints, Locked Test Mode, Coding Lab, Analytics, Rankings, Certificates, Assignments.
4) How It Works — vertical stepper of the student journey: Register → Learn → Practice → Get Help → Quiz → Test → Analyze → Improve.

VIBE
Same premium IT education system. Editorial, spacious, lots of whitespace.

CONTENT
Use THS LAB LMS copy. Categories: Programming, Web, Cybersecurity, Data, AI. Levels: Beginner, Intermediate, Advanced.
```

---

## BATCH 03 — Contact + Auth

```
Continue THS LAB LMS. Same design system.

ANATOMY
Create 4 desktop screens + Login mobile:

1) Contact — split layout: form left, institute details + map placeholder right.
2) Login — centered auth card on light canvas. Logo, Email, Password with show/hide, Remember me, Forgot password, primary Login, Register link.
3) Register — same card pattern. Full name, Email, Password, Confirm password, Role select (Student / Teacher), terms checkbox, Create account, Login link. Helper text: Teacher accounts require admin approval.
4) Forgot Password — compact card, email + Send reset link + Back to login.

VIBE
Quiet, secure, professional authentication. Card-based. No illustrations crowding the form.

CONTENT
Student example: Ayesha Khan, ayesha@thslab.edu
```

---

## BATCH 04 — Student app shell + Dashboard

```
Continue THS LAB LMS. Now the logged-in STUDENT app.

ANATOMY
Create Student Dashboard desktop 1440 and mobile 390.

Desktop: left sidebar 256px (full student nav), top bar 64px, main canvas.
Sidebar items in this exact order: Dashboard, My Courses, Lessons, Practice, Quizzes, Tests, Assignments, AI Tutor, Coding Lab, My Mistakes, Study Planner, Total Score, Class Ranking, Progress, Certificates, Notifications, Profile.
Dashboard main: welcome header, 4 stat cards, current courses (3 progress cards), two columns Strong Topics / Weak Topics, recommended learning list, upcoming tests table.

Mobile: hamburger, stacked stats, horizontal course cards, bottom padding.

VIBE
Calm productivity dashboard. Academic, not gamified. Rank is a number, not a trophy room.

CONTENT
Ayesha Khan · BSIT-4A · Total Score 850/1000 · Rank #4 of 120 · 3 courses in progress · Upcoming: Python Midterm in 2 days
Strong: Variables, HTML, SQL SELECT
Weak: Loops, Recursion, Joins
```

---

## BATCH 05 — Courses + Lesson

```
Continue THS LAB LMS student app. Same sidebar and top bar. Dashboard is active only when on Dashboard.

ANATOMY
Create 3 desktop screens:

1) My Courses — toolbar (search, category, level filters) + course cards with image, title, teacher Imran Malik, level badge, teal progress bar, Continue Learning.
2) Course Detail — banner, description, teacher, overall progress. Module accordion. Each module expands to lessons with duration and completion check. Resources list.
3) Lesson — focus layout. Slim top bar with course breadcrumb. 16:9 video. Right or below: tabs Notes / Resources / Code example. Footer: Mark as completed, Previous, Next.

VIBE
Distraction-free learning. Plenty of whitespace around the video. Code block uses monospace.

CONTENT
Course: Python Fundamentals. Modules: Basics, Control Flow, Functions. Lesson: For Loops in Python. Duration 12:40.
```

---

## BATCH 06 — Practice + Quiz + Test + Result

```
Continue THS LAB LMS student app.

ANATOMY
Create 5 desktop screens + Test mobile:

1) Practice — topic dropdown, difficulty chips (Easy/Medium/Hard). Large question card. Answer options. Primary Submit. Text-style actions: Hint, Ask AI Tutor, Try Again. Color meaning via badges/icons: hint=warning, correct=success, incorrect=error.
2) Practice Result — result banner, explanation, topic chip, Next Question / Review Mistake.
3) Quiz — title, question 4 of 10, progress bar, 4 options, Next, Submit on last.
4) Test — top banner “TEST MODE ACTIVE” + timer 00:42:18. Question navigator. Answer area. Submit Test. A small lock panel: Practice locked, Hints locked, AI Tutor locked. No extra decoration.
5) Test Result — big score 78/100 (78%), meta row (correct, incorrect, time), strong/weak topics, Review Results, Return to Dashboard.

VIBE
Practice feels encouraging. Quiz is structured. Test is serious and quiet — exam hall energy, not a game boss fight.

CONTENT
Practice topic: Python Loops. Test: Python Midterm. Weak topics after test: Nested loops, Range.
```

---

## BATCH 07 — AI Tutor + Coding Lab

```
Continue THS LAB LMS student app.

ANATOMY
Create 2 desktop screens + both as mobile stacked:

1) AI Tutor — split. Main chat thread with student and THS AI Tutor messages. Suggested prompt chips. Composer with send. Right rail: current course, weak topics, “Explain this mistake”. Professional AI — subtle purple accent only here. No cartoon robot.

2) Coding Lab — language tabs HTML CSS JavaScript Python SQL. Left dark code editor with line numbers. Right output/preview. Top toolbar: Run, Reset, Test Cases, Instructions. Python file: calculate_sum.py with a small function and failing/passing test case list.

VIBE
Intelligent tools. Editor is dark even in light mode app chrome. Chat is clean like a modern AI product, not Discord gaming.

CONTENT
Student asks: Why is my for-loop infinite? Tutor explains calmly with a short code snippet.
```

---

## BATCH 08 — Assignments, Mistakes, Planner, Score, Rank, Progress

```
Continue THS LAB LMS student app. Same shell.

ANATOMY
Create 6 desktop screens:

1) Assignments list — table: title, course, deadline, status badges.
2) Assignment detail — instructions, due date, drag-and-drop upload, submission status, teacher feedback.
3) My Mistakes — stacked review cards: question, student answer, correct answer, explanation, topic, Retry.
4) Study Planner — calendar left, daily tasks right, AI recommendation strip at top.
5) Total Score — hero 850/1000, 85%. Five breakdown cards (Practice, Quiz, Assignment, Test, Exam). Strong/weak topics. Recommended revision.
6) Class Ranking — academic table, restrained top-3 highlight, sticky your-rank card “#4 of 120”. No gold cups, no XP.
7) Progress — 4 professional charts: completion, weekly activity, subject bars, performance line.

If the tool limits screens, split: first 1–4, then 5–7 in a follow-up with the same shell.

VIBE
Academic analytics. Charts thin and muted. Ranking looks like a results board, not a game leaderboard.
```

---

## BATCH 09 — Certificates, Notifications, Profile

```
Continue THS LAB LMS student app.

ANATOMY
Create 4 desktop screens:

1) Certificates — card grid with certificate thumbnail, course, date, ID, Verify.
2) Certificate detail — landscape certificate preview (THS LAB LMS, Ayesha Khan, Python Fundamentals, 12 Aug 2026, ID THS-CERT-19402), Download, Verify.
3) Notifications — grouped list with unread dots: assignment, test reminder, result, teacher announcement, new course.
4) Profile — avatar, name, email, password fields, learning stats mini cards, notification toggles, dark mode toggle, Log out.

VIBE
Quiet account area. Certificate is elegant print-like, not a game badge.
```

---

## BATCH 10 — Teacher shell + teaching ops

```
Continue THS LAB LMS. Switch role to TEACHER. New sidebar: Dashboard, Courses, Classes, Students, Lessons, Practice Questions, Quizzes, Tests, Exams, Assignments, Grades, Feedback, Analytics, Announcements, Profile.

ANATOMY
Create 5 desktop screens:

1) Teacher Dashboard — stats: 128 students, 6 courses, class average 76%, 3 upcoming tests. Needs-grading list. Recent activity.
2) Teacher Courses — table + Create Course. Status Draft/Published.
3) Create/Edit Course — form + module builder + lesson list + Publish.
4) Classes — class cards. Class Detail: roster, performance, attendance.
5) Students — searchable table with score, last active, View.

VIBE
Faculty console. Efficient, respectable, same visual language as student app but denser data.
Teacher: Imran Malik.
```

---

## BATCH 11 — Teacher assessment tools

```
Continue THS LAB LMS teacher app. Same teacher sidebar.

ANATOMY
Create 6 desktop screens:

1) Practice Manager — question bank table, filters, Add Question.
2) Question Editor — prompt, options, correct answer, hint, explanation, topic, difficulty, save.
3) Quiz Manager — quiz list + create settings (timer, passing score, attempts, publish).
4) Test Manager — same pattern, more serious, lock-hints toggle on.
5) Assignment Manager — list + Create.
6) Grade Submission — student file preview, score input, feedback textarea, Return to student.

VIBE
Authoring tools. Forms aligned. Primary action always bottom-right or sticky footer: Save / Publish.
```

---

## BATCH 12 — Teacher grades, analytics, announcements

```
Continue THS LAB LMS teacher app.

ANATOMY
Create 3 desktop screens:

1) Grades — spreadsheet-like table: student, assignment, quiz, test, final. Sticky first column. Export.
2) Analytics — class average trend, course progress, weak topics horizontal bars, test vs assignment comparison.
3) Announcements — compose card (title, class select, body), Publish, history list below.

VIBE
Clear academic administration. Charts match student Progress page style.
```

---

## BATCH 13 — Admin shell + people

```
Continue THS LAB LMS. Switch role to ADMIN. Sidebar: Dashboard, Users, Students, Teachers, Teacher Approval, Courses, Classes, Assessments, Results, Rankings, Certificates, AI Settings, Analytics, Permissions, Security, Audit Logs, Settings.

ANATOMY
Create 4 desktop screens:

1) Admin Dashboard — 6 stats: students, teachers, courses, active users, average score, system activity. Activity timeline.
2) Users — tabs Students / Teachers / Admins. Table with Add, Edit, Disable, Reset, Role.
3) Teacher Approval — pending teacher cards with profile summary, Approve (primary), Reject (danger ghost).
4) Permissions — matrix of capabilities vs Student / Teacher / Admin.

VIBE
Powerful but calm control center. Same THS LAB visual language, slightly denser.
```

---

## BATCH 14 — Admin academics + AI + security + settings

```
Continue THS LAB LMS admin app. Same admin sidebar.

ANATOMY
Create 7 desktop screens. If limited, split into 14A (1–4) and 14B (5–7).

1) Admin Courses — categories + course tree (course → modules → lessons → resources).
2) Assessments — overview of Practice, Quizzes, Tests, Exams, Assignments with counts and status.
3) Results & Analytics — institute filters, average scores, completion rates, class comparison.
4) Certificates admin — issued list, revoke, verify ID search.
5) AI Settings — enable AI Tutor, daily usage limit, allow hints vs full answers, safety notes.
6) Security — active sessions table, login activity, alert list. Serious, deep-blue/slate, no playful icons.
7) Settings — platform name, logo upload, theme, default dark mode, notification defaults, scoring rules.
8) Audit Logs — filters + log table: actor, action, target, time, IP.

VIBE
Enterprise education admin. Security page is the most restrained screen in the product.
```

---

## BATCH 15 — Dark mode key screens

```
Continue THS LAB LMS. Generate DARK MODE variants only, using the established dark tokens. Do not change layout.

Screens: Student Dashboard, Lesson, Practice, Test, AI Tutor, Coding Lab, Admin Security.

Keep app chrome, spacing, and information architecture identical. Coding Lab editor stays dark (already). Increase contrast on text and borders. No neon.
```

---

## After each batch — consistency check (optional follow-up)

```
Audit this batch against the THS LAB LMS design system.
Fix: mismatched radii, random colors, game-like trophies, inconsistent sidebar, different button heights.
Keep 44px buttons, 12px cards, 8px buttons radius, Inter UI, JetBrains Mono for code.
```
