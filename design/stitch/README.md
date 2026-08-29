# How to generate THS LAB LMS in Google Stitch

Open [Google Stitch](https://stitch.withgoogle.com) → New project → name it **THS LAB LMS**.

## Why batches

Stitch quality drops if you ask for 50+ screens in one generation. The design system and every screen are **defined** in the master prompt. You still generate **one batch at a time**.

## Steps

1. Paste `DESIGN.md` as the project design system / theme rules.
2. Paste **Section A** from `MASTER-PROMPT.md` as the project brief.
3. Copy **Batch 01** from `BATCHES.md` and generate.
4. Lock the look. For every later batch, keep the first line:  
   `Reuse the same design system, navbar, sidebar, typography, and components.`
5. Run Batches 02 → 15 in order.
6. If a batch returns too many screens, split it (the file already notes where).

## Order

| Batch | What you get |
| --- | --- |
| 01 | Welcome + Home (sets the visual language) |
| 02 | About, Courses, Features, How It Works |
| 03 | Contact, Login, Register, Forgot Password |
| 04 | Student Dashboard + app shell |
| 05 | My Courses, Course Detail, Lesson |
| 06 | Practice, Quiz, Test, Results |
| 07 | AI Tutor, Coding Lab |
| 08 | Assignments, Mistakes, Planner, Score, Rank, Progress |
| 09 | Certificates, Notifications, Profile |
| 10 | Teacher Dashboard + courses/classes |
| 11 | Teacher question/quiz/test/assignment tools |
| 12 | Teacher grades, analytics, announcements |
| 13 | Admin Dashboard + users + approval |
| 14 | Admin academics, AI, security, settings |
| 15 | Dark mode of key screens |

## Files

- `DESIGN.md` — tokens only (colors, type, radius, components)
- `MASTER-PROMPT.md` — full product + every screen defined
- `BATCHES.md` — copy-paste generation prompts
