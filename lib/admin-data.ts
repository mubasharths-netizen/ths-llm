export const adminUsers = [
  { id: "s1", name: "Ayesha Khan", email: "ayesha@thslab.edu", role: "Student", class: "BSIT-4A", status: "Active" },
  { id: "s2", name: "Hassan Ali", email: "hassan@thslab.edu", role: "Student", class: "BSIT-4A", status: "Active" },
  { id: "s3", name: "Fatima Noor", email: "fatima@thslab.edu", role: "Student", class: "BSIT-4A", status: "Active" },
  { id: "s4", name: "Bilal Hussain", email: "bilal@thslab.edu", role: "Student", class: "BSIT-4A", status: "Disabled" },
  { id: "s5", name: "Omar Sheikh", email: "omar@thslab.edu", role: "Student", class: "BSIT-4B", status: "Active" },
  { id: "t1", name: "Imran Malik", email: "imran@thslab.edu", role: "Teacher", class: "Faculty", status: "Active" },
  { id: "t2", name: "Sara Ahmed", email: "sara@thslab.edu", role: "Teacher", class: "Faculty", status: "Active" },
  { id: "t3", name: "Nadia Rehman", email: "nadia@thslab.edu", role: "Teacher", class: "Faculty", status: "Active" },
  { id: "a1", name: "System Administrator", email: "admin@thslab.edu", role: "Admin", class: "Ops", status: "Active" },
];

export const adminClasses = [
  { id: "bsit-4a", name: "BSIT-4A", students: 42, teacher: "Imran Malik", avg: 81 },
  { id: "bsit-4b", name: "BSIT-4B", students: 38, teacher: "Sara Ahmed", avg: 76 },
  { id: "bscs-3a", name: "BSCS-3A", students: 40, teacher: "Nadia Rehman", avg: 79 },
];

export const assessments = [
  { type: "Practice", count: 148, published: 140 },
  { type: "Quizzes", count: 36, published: 34 },
  { type: "Tests", count: 12, published: 9 },
  { type: "Exams", count: 4, published: 2 },
  { type: "Assignments", count: 22, published: 18 },
];

export const sessions = [
  { user: "Ayesha Khan", device: "Chrome · Windows", ip: "182.180.12.21", time: "Active now" },
  { user: "Imran Malik", device: "Edge · Windows", ip: "39.44.10.8", time: "12 min ago" },
  { user: "System Administrator", device: "Chrome · Windows", ip: "127.0.0.1", time: "Active now" },
];

export const auditLogs = [
  { actor: "System Administrator", action: "Approved teacher", target: "Kamran Aziz", time: "Today 14:12", ip: "127.0.0.1" },
  { actor: "Imran Malik", action: "Published quiz", target: "Python Quiz 2", time: "Today 11:40", ip: "39.44.10.8" },
  { actor: "Ayesha Khan", action: "Submitted assignment", target: "Responsive Layout", time: "Yesterday 19:03", ip: "182.180.12.21" },
  { actor: "System Administrator", action: "Updated AI settings", target: "THS AI Tutor", time: "Yesterday 16:20", ip: "127.0.0.1" },
];

export const securityAlerts = [
  { level: "Medium", title: "3 failed login attempts", detail: "bilal@thslab.edu · today 09:18" },
  { level: "Low", title: "New admin session", detail: "Chrome · this machine" },
];
