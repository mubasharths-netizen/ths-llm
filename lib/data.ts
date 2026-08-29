export const student = {
  name: "Ayesha Khan",
  email: "ayesha@thslab.edu",
  class: "BSIT-4A",
  rank: 4,
  totalStudents: 120,
  score: 850,
  maxScore: 1000,
  avatar: "AK",
};

export const teacher = {
  name: "Imran Malik",
  email: "imran@thslab.edu",
  subjects: ["Python", "Web Development", "SQL"],
  avatar: "IM",
};

export const admin = {
  name: "System Administrator",
  email: "admin@thslab.edu",
  avatar: "SA",
};

export const courses = [
  {
    id: "python-fundamentals",
    title: "Python Fundamentals",
    teacher: "Imran Malik",
    level: "Beginner",
    category: "Programming",
    progress: 72,
    duration: "8 weeks",
    lessons: 24,
    description:
      "Learn Python from first principles: syntax, control flow, functions, and problem-solving for academic and lab work.",
  },
  {
    id: "web-development",
    title: "Web Development",
    teacher: "Imran Malik",
    level: "Intermediate",
    category: "Web",
    progress: 41,
    duration: "10 weeks",
    lessons: 32,
    description:
      "Build professional websites with HTML, CSS, and JavaScript. Practice layout, accessibility, and interactive UI.",
  },
  {
    id: "cybersecurity-basics",
    title: "Cybersecurity Basics",
    teacher: "Sara Ahmed",
    level: "Beginner",
    category: "Cybersecurity",
    progress: 18,
    duration: "6 weeks",
    lessons: 18,
    description:
      "Understand networks, threats, and defensive fundamentals used in modern IT laboratories.",
  },
  {
    id: "sql-databases",
    title: "SQL & Databases",
    teacher: "Imran Malik",
    level: "Intermediate",
    category: "Data",
    progress: 55,
    duration: "7 weeks",
    lessons: 20,
    description:
      "Query, model, and analyze relational data with SQL. Focus on SELECT, joins, and lab assignments.",
  },
  {
    id: "javascript-programming",
    title: "JavaScript Programming",
    teacher: "Nadia Rehman",
    level: "Intermediate",
    category: "Programming",
    progress: 0,
    duration: "9 weeks",
    lessons: 28,
    description:
      "Write reliable JavaScript for the browser and lab exercises, including functions, arrays, and DOM work.",
  },
];

export const pythonModules = [
  {
    id: "basics",
    title: "Module 1 — Basics",
    lessons: [
      { id: "variables", title: "Variables and Types", duration: "11:20", done: true },
      { id: "operators", title: "Operators", duration: "09:14", done: true },
      { id: "io", title: "Input and Output", duration: "08:40", done: true },
    ],
  },
  {
    id: "control-flow",
    title: "Module 2 — Control Flow",
    lessons: [
      { id: "conditionals", title: "If Statements", duration: "12:05", done: true },
      { id: "for-loops", title: "For Loops in Python", duration: "12:40", done: false },
      { id: "while-loops", title: "While Loops", duration: "10:18", done: false },
    ],
  },
  {
    id: "functions",
    title: "Module 3 — Functions",
    lessons: [
      { id: "def", title: "Defining Functions", duration: "14:02", done: false },
      { id: "scope", title: "Scope and Returns", duration: "11:50", done: false },
    ],
  },
];

export const rankings = [
  { rank: 1, name: "Hassan Ali", class: "BSIT-4A", score: 942, trend: "up" },
  { rank: 2, name: "Fatima Noor", class: "BSIT-4A", score: 918, trend: "same" },
  { rank: 3, name: "Omar Sheikh", class: "BSIT-4B", score: 891, trend: "up" },
  { rank: 4, name: "Ayesha Khan", class: "BSIT-4A", score: 850, trend: "up", you: true },
  { rank: 5, name: "Bilal Hussain", class: "BSIT-4A", score: 838, trend: "down" },
  { rank: 6, name: "Zara Iqbal", class: "BSIT-4B", score: 821, trend: "up" },
  { rank: 7, name: "Usman Tariq", class: "BSIT-4A", score: 804, trend: "same" },
  { rank: 8, name: "Hira Saeed", class: "BSIT-4B", score: 792, trend: "down" },
];

export const assignments = [
  {
    id: "py-loops",
    title: "Python Loops Lab",
    course: "Python Fundamentals",
    deadline: "2 Sep 2026",
    status: "Not submitted" as const,
  },
  {
    id: "web-layout",
    title: "Responsive Layout",
    course: "Web Development",
    deadline: "5 Sep 2026",
    status: "Submitted" as const,
  },
  {
    id: "sql-joins",
    title: "SQL Joins Worksheet",
    course: "SQL & Databases",
    deadline: "28 Aug 2026",
    status: "Graded" as const,
  },
];

export const mistakes = [
  {
    id: "1",
    question: "What does range(3) produce in Python?",
    studentAnswer: "1, 2, 3",
    correctAnswer: "0, 1, 2",
    explanation: "range(n) starts at 0 and stops before n, so range(3) is 0, 1, 2.",
    topic: "Loops",
  },
  {
    id: "2",
    question: "Which SQL clause filters grouped rows?",
    studentAnswer: "WHERE",
    correctAnswer: "HAVING",
    explanation: "WHERE filters rows before grouping. HAVING filters after GROUP BY.",
    topic: "Joins",
  },
];

export const notifications = [
  { id: "1", type: "Test", title: "Python Midterm in 2 days", time: "1 hour ago", unread: true },
  { id: "2", type: "Assignment", title: "Python Loops Lab deadline reminder", time: "3 hours ago", unread: true },
  { id: "3", type: "Result", title: "SQL quiz graded — 82%", time: "Yesterday", unread: false },
  { id: "4", type: "Announcement", title: "Lab hours extended this week", time: "Yesterday", unread: true },
  { id: "5", type: "Course", title: "New lesson published: For Loops in Python", time: "2 days ago", unread: false },
];

export const teacherStudents = [
  { id: "1", name: "Ayesha Khan", class: "BSIT-4A", score: 850, lastActive: "Today" },
  { id: "2", name: "Hassan Ali", class: "BSIT-4A", score: 942, lastActive: "Today" },
  { id: "3", name: "Fatima Noor", class: "BSIT-4A", score: 918, lastActive: "Yesterday" },
  { id: "4", name: "Bilal Hussain", class: "BSIT-4A", score: 838, lastActive: "2 days ago" },
  { id: "5", name: "Omar Sheikh", class: "BSIT-4B", score: 891, lastActive: "Today" },
];

export const pendingTeachers = [
  {
    id: "1",
    name: "Kamran Aziz",
    email: "kamran@thslab.edu",
    subject: "Cybersecurity",
    qualification: "MS Information Security",
  },
  {
    id: "2",
    name: "Mehwish Raza",
    email: "mehwish@thslab.edu",
    subject: "Data Science",
    qualification: "MPhil Computer Science",
  },
];
