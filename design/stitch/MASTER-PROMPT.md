# THS LAB LMS — Google Stitch Master Prompt

Paste this into [Google Stitch](https://stitch.withgoogle.com) as the **project brief**.  
Do **not** ask Stitch to generate all screens in one run.

**Workflow**
1. Create project: `THS LAB LMS`
2. Paste `DESIGN.md` as the project design system
3. Paste **Section A** (this file, Product + Shells + Screen Inventory) as project context
4. Generate screens using `BATCHES.md` — one batch at a time
5. After Batch 01, lock the design system and reuse the same shells

---

# SECTION A — PROJECT BRIEF (paste once)

You are designing a complete, premium, fully responsive **IT Learning Management System**.

## Product

**Name:** THS LAB LMS  
**Type:** Professional IT Lab LMS  
**Users:** Student, Teacher, Admin  
**Core systems:** Courses, Lessons, Practice, Quizzes, Tests, Assignments, AI Tutor, Coding Lab, Analytics, Rankings, Certificates

This must look like a real international IT education platform (Coursera / Linear / Notion-for-learning quality).  
It must **not** look like a game, bootcamp landing page with neon, or a kids app.

## Experience loop

LEARN → PRACTICE → GET HELP → TEST → ANALYZE → IMPROVE

Users should feel: focused, calm, safe, intelligent, motivated, professional, confident.

## Sample content (use consistently)

Institute: THS LAB  
Student: Ayesha Khan · Class: BSIT-4A · Rank #4 of 120 · Total Score 850 / 1000  
Teacher: Imran Malik  
Admin: System Administrator  
Courses: Python Fundamentals, Web Development, Cybersecurity Basics, SQL & Databases, JavaScript Programming  
AI Tutor name: THS AI Tutor

## Global chrome

### Marketing navbar
Logo THS LAB LMS · Home · About · Courses · Features · How It Works · Contact · Login (ghost) · Get Started (primary)

### Marketing footer
Product, Learn, Support, Legal columns · © 2026 THS LAB LMS

### Student sidebar (fixed order)
Dashboard · My Courses · Lessons · Practice · Quizzes · Tests · Assignments · AI Tutor · Coding Lab · My Mistakes · Study Planner · Total Score · Class Ranking · Progress · Certificates · Notifications · Profile

### Teacher sidebar
Dashboard · Courses · Classes · Students · Lessons · Practice Questions · Quizzes · Tests · Exams · Assignments · Grades · Feedback · Analytics · Messages / Email · Announcements · Complaints · Discipline reports · Profile

### Admin sidebar
Dashboard · Users · Students · Teachers · Teacher Approval · Complaints & discipline · Courses · Classes · Assessments · Results · Rankings · Certificates · AI Settings · Analytics · Permissions · Security · Audit Logs · Settings

### App top bar
Breadcrumbs · Search · Notification bell with count · Dark mode toggle · User avatar + name + role

## Screen inventory (define all, generate later in batches)

Generate **high-fidelity desktop (1440)** first for each screen.  
Also produce **mobile (390)** for: Welcome, Home, Login, Student Dashboard, Practice, Test, AI Tutor, Coding Lab.

### Public
P01 Welcome · P02 Home · P03 About · P04 Courses Catalog · P05 Features · P06 How It Works · P07 Contact · P08 Login · P09 Register · P10 Forgot Password

### Student
S01 Dashboard · S02 My Courses · S03 Course Detail · S04 Lesson · S05 Practice · S06 Practice Result · S07 AI Tutor · S08 Quiz · S09 Test · S10 Test Result · S11 Assignments List · S12 Assignment Detail · S13 My Mistakes · S14 Study Planner · S15 Total Score · S16 Class Ranking · S17 Progress · S18 Certificates · S19 Certificate Detail · S20 Notifications · S21 Profile · S22 Coding Lab

### Teacher
T01 Dashboard · T02 Courses · T03 Create/Edit Course · T04 Classes · T05 Class Detail · T06 Students · T07 Practice Manager · T08 Question Editor · T09 Quiz Manager · T10 Test Manager · T11 Assignment Manager · T12 Submissions/Grade · T13 Grades · T14 Analytics · T15 Announcements · T16 Profile · T17 Messages / Email · T18 Complaints · T19 Discipline reports

### Admin
A01 Dashboard · A02 Users · A03 Teacher Approval · A04 Courses · A05 Assessments · A06 Results & Analytics · A07 Rankings · A08 Certificates · A09 AI Settings · A10 Security · A11 Audit Logs · A12 Settings · A13 Permissions · A14 Complaints & discipline review

## Layout rules by screen type

- Public pages: marketing shell
- Auth: centered card
- Dashboards: app shell + bento/stat cards + tables
- Learning (Lesson): focus layout, video 16:9, resources rail
- Practice/Quiz: focus, question card, option list
- Test: focus + lock banner, no hints/AI
- AI Tutor: split chat
- Coding Lab: split editor/preview, dark editor
- Rankings/Scores: academic, not leaderboard-game
- Admin/Security: dense but calm data UI

## Final design rules

Modern, premium, professional, clean, educational, technology-focused, responsive, accessible, consistent.  
Avoid gaming aesthetics, neon, too many gradients, clutter, excessive animation.

Every screen must exist in **light mode**. Key student screens also need a **dark mode** variant that follows DESIGN.md.

---

# SECTION B — SCREEN SPECIFICATIONS

Use these specs when generating each screen. Anatomy / content only. Colors come from DESIGN.md.

## P01 — Welcome

Cinematic full-viewport. Technology still/video background (code, networks, AI, cybersecurity) with dark-blue overlay. Centered hero: “Welcome to THS LAB LMS” / “Learn. Practice. Improve.” Short description. Two buttons: Get Started, Login. Subtle code symbols and network lines. No mascot. No game HUD.

## P02 — Home

Marketing homepage. Hero: “Learn Technology. Practice Skills. Build Your Future.” Featured course cards. 5-step process: Learn → Practice → Get Help → Test → Improve. AI Tutor intro. Practice / Test / Coding Lab feature rows. Stats: students, courses, completion, avg score. Teacher section. Student success quotes. CTA. Footer.

## P03 — About

Mission, how THS LAB teaches IT, values (focus, practice, integrity), team/faculty cards, campus/lab photo placeholders.

## P04 — Courses Catalog (public)

Search, category chips (Programming, Web, Cybersecurity, Data, AI), course grid with image, title, level, duration, teacher.

## P05 — Features

Bento grid: AI Tutor, Practice with hints, Locked Test Mode, Coding Lab, Analytics, Rankings, Certificates, Assignments.

## P06 — How It Works

Vertical stepper for student journey from register → learn → practice → test → rank → improve.

## P07 — Contact

Split: form (name, email, subject, message) + institute details / map placeholder.

## P08 — Login

Centered auth card. Logo. Email, password with show/hide, Remember me, Forgot password, Login. Link to Register. Role note: students and teachers use same login.

## P09 — Register

Full name, email, password, confirm password, optional role (Student / Teacher — teacher requires later approval). Terms checkbox. Create account.

## P10 — Forgot Password

Email field + send reset link. Back to login.

## S01 — Student Dashboard

App shell. Welcome “Good afternoon, Ayesha”. Stat cards: Total Score 850/1000, Rank #4, Courses in progress 3, Upcoming tests 2. Current courses with progress. Strong topics / weak topics chips. Recommended learning list. Upcoming tests table.

## S02 — My Courses

Search + filters (level, category, progress). Course cards: image, title, teacher, level badge, progress bar, Continue Learning.

## S03 — Course Detail

Banner, description, teacher chip, overall progress. Module accordion → lessons with duration and completed check. Resources list.

## S04 — Lesson

Focus layout. Title, 16:9 video, transcript/resources tabs, code example block, Mark as completed (teal), Prev / Next.

## S05 — Practice

Topic + difficulty selectors. Question card. Answer area (MCQ or short/code). Submit. Secondary actions: Hint (amber), Ask AI Tutor (purple), Try Again. Empty/encouraging tone.

## S06 — Practice Result

Correct (green) or incorrect (red) state. Explanation. Topic tag. Next question / Retry / Review in My Mistakes.

## S07 — AI Tutor

Split: conversation thread left/main, context rail right (current course, weak topics, suggested prompts). Composer at bottom. Suggestions: Explain concept, Hint, Why was I wrong, Explain this code. Professional, not cartoon robot.

## S08 — Quiz

Quiz title, question x of y, thin progress. Options. Next. Final Submit. Hints allowed (unlike Test).

## S09 — Test

Banner: TEST MODE ACTIVE. Timer. Question nav. Answer area. Submit Test. Sidebar items Practice / Hints / AI Tutor shown as locked. No decorative graphics.

## S10 — Test Result

Score, percentage, correct/incorrect counts, time used. Strong/weak topics. Buttons: Review Results, Return to Dashboard.

## S11 — Assignments List

Table/cards: title, course, deadline, status (Not submitted / Submitted / Graded).

## S12 — Assignment Detail

Title, description, instructions, deadline, file upload dropzone, status, teacher feedback panel.

## S13 — My Mistakes

List of review cards: question, student answer (red), correct answer (green), explanation, topic, Retry.

## S14 — Study Planner

Calendar + daily/weekly task list. Exam dates. Deadlines. AI recommendation strip: “Revise Python Loops — weak topic”.

## S15 — Total Score

Hero metric 850 / 1000 + 85%. Score breakdown cards: Practice, Quiz, Assignment, Test, Exam. Strong / weak topics. Recommended revision.

## S16 — Class Ranking

Academic table. Top 3 highlighted with restrained badges (not gold trophies). Sticky “Your rank: #4 of 120”. Columns: rank, student, class, score, trend.

## S17 — Progress

Charts: course completion, weekly activity, subject progress, performance over time. Professional analytics.

## S18 — Certificates

Grid of certificate previews with course, date, ID, Verify.

## S19 — Certificate Detail

Landscape certificate preview, metadata, Download PDF, Verify authenticity.

## S20 — Notifications

Grouped list: courses, assignments, tests, results, announcements. Unread state. Mark all read.

## S21 — Profile

Avatar, name, email, password change, learning stats, notification prefs, dark mode, logout.

## S22 — Coding Lab

Language tabs: HTML, CSS, JavaScript, Python, SQL. Left editor (dark). Right output/preview. Toolbar: Run, Reset, Test Cases, Instructions drawer.

## T01 — Teacher Dashboard

Stats: students, courses, class average, upcoming tests. Recent activity feed. Classes needing grading.

## T02 — Teacher Courses

Course table with status Draft/Published. Create Course button.

## T03 — Create/Edit Course

Form: title, description, category, level, cover. Module builder. Lesson list. Publish.

## T04 / T05 — Classes

Class cards then detail: roster, performance, attendance.

## T06 — Students

Searchable table, performance, last active, message/feedback.

## T07 / T08 — Practice Manager + Question Editor

Question bank table. Editor: prompt, options, correct answer, hint, explanation, topic, difficulty.

## T09 / T10 — Quiz & Test Manager

Create flow: title, questions, timer, passing score, attempts, publish. Results preview.

## T11 / T12 — Assignment Manager + Grading

Create assignment. Submissions list. Grade + feedback form.

## T13 — Grades

Matrix/table: student, course, assignment, quiz, test, final score. Export.

## T14 — Teacher Analytics

Class average, course progress, weak topics, test vs assignment performance.

## T15 — Announcements

Compose, select class, publish. History list.

## T16 — Teacher Profile

Professional profile, subjects, classes.

## T17 — Messages / Email

Compose card: type (announcement, assignment reminder, test reminder, performance feedback), audience (one student, selected students, entire class), subject, message. History table of sent mail.

## T18 — Complaints (Shikayat)

Form: student, class (read-only), category, description, supporting notes. Status chips: Pending, Under Review, Resolved, Closed. Teacher sees only their filings.

## T19 — Discipline reports

Warning / Second warning / Classroom incident / Escalate to Admin. Teachers do not apply serious punishment. Flow: Teacher → Submit report → Admin review → Decision → Action recorded.

## A01 — Admin Dashboard

Stats: students, teachers, courses, active users, average score, system activity. Activity timeline.

## A02 — Users

Tabs Students / Teachers / Admins. Add, Edit, Disable, Delete, Reset, Assign role.

## A03 — Teacher Approval

Pending cards: profile, qualifications, Approve / Reject.

## A04 — Admin Courses

Categories, courses, modules, lessons, resources. Publish controls.

## A05 — Assessments

Practice, Quizzes, Tests, Exams, Assignments overview.

## A06 — Results & Analytics

Student / course / class performance, averages, completion rates.

## A07 — Rankings (admin)

Institute-wide ranking controls and class filters.

## A08 — Certificates (admin)

Issue, revoke, verify IDs.

## A09 — AI Settings

Enable tutor, usage limits, model safety, allowed features (hints vs full answers).

## A10 — Security

Active sessions, login activity, alerts. Deep blue + slate. Serious tone.

## A11 — Audit Logs

Filterable log table: actor, action, target, timestamp, IP.

## A12 — Settings

Platform name, logo, theme, dark mode default, notifications, scoring rules.

## A13 — Permissions

Role matrix: Student / Teacher / Admin capabilities.

## A14 — Complaints & discipline review

Admin-only. Two stacks: complaints and discipline reports. Each case: student, teacher, category/level, notes, status, official notes, approve/reject/resolve, optional release of an official notice to that student only. Audit of who submitted and status changes.

---

# TEACHER COMMUNICATION, COMPLAINT & DISCIPLINE SYSTEM

Add a professional communication and student management system to the THS LAB LMS Teacher Portal.

## EMAIL / MESSAGE SYSTEM

Teachers can communicate with students: one student, selected students, or an entire class. Types: announcements, assignment reminders, test reminders, performance feedback.

Example subject: Upcoming JavaScript Test  
Example message: Please prepare for the upcoming JavaScript test.

## COMPLAINT / SHIKAYAT SYSTEM

Teachers submit complaints on student behavior, academic misconduct, attendance, class discipline, or other concerns. Form fields: student name, class, category, description, date, supporting notes. Status: Pending, Under Review, Resolved, Closed. Visible to Admin. Students see complaint details only if Admin releases an official notice to that student.

## STUDENT DISCIPLINE SYSTEM

Teachers must not apply serious punishment directly. They may give a warning, record a classroom incident, submit a disciplinary report, or recommend action to Admin (Warning → Second warning → Escalate to Admin). Serious flow: Teacher → Submit report → Admin review → Decision → Action recorded.

## ADMIN REVIEW

Admin reviews complaints and disciplinary reports, approves or rejects recommended actions, adds official notes, marks resolved, and keeps audit history (submitter, date/time, status changes, decision).

## PRIVACY & SECURITY

Records are private. Teachers see only their own students/classes. Admin has authorized institute access. Students must not see other students’ disciplinary information. Enforce permissions on the backend.

## TEACHER DASHBOARD ADDITIONS

Menu: Messages / Email, Announcements, Complaints, Discipline Reports. Teachers communicate and report; Admin handles serious disciplinary decisions.

---

# SECTION C — COMPONENT SET TO KEEP IDENTICAL

Buttons, cards, inputs, modal, table, tabs, sidebar, navbar, charts, alerts, badges, progress bars, empty states, locked-state rows (Test Mode).

Empty states: calm illustration-free, one sentence + one primary action.  
Locked states: muted row + lock icon + “Unavailable during Test Mode”.

---

# USER JOURNEY (for flow consistency)

Welcome → Get Started → Register / Login → Student Dashboard → Course → Lesson → Practice (Hint / AI) → Quiz → Test Mode → Result → Total Score → Class Rank → Weak topics → Revision → Improvement
