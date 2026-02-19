import { db } from "./db";
import { users, students, teachers, courses, fees, events, enrollments } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Create mock users (Admin/Teacher/Student)
  // Note: These won't be able to login via Replit Auth (OIDC), but they populate the DB for display.
  // The 'id' in users table is varchar.

  const [teacherUser] = await db.insert(users).values({
    id: "teacher-1",
    email: "math.teacher@school.com",
    firstName: "Alan",
    lastName: "Turing",
    role: "teacher",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alan",
  }).returning();

  const [studentUser] = await db.insert(users).values({
    id: "student-1",
    email: "student.jane@school.com",
    firstName: "Jane",
    lastName: "Doe",
    role: "student",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  }).returning();

  const [studentUser2] = await db.insert(users).values({
    id: "student-2",
    email: "student.john@school.com",
    firstName: "John",
    lastName: "Smith",
    role: "student",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  }).returning();

  // Create Teacher profile
  const [teacher] = await db.insert(teachers).values({
    userId: teacherUser.id,
    specialization: "Mathematics & Computer Science",
  }).returning();

  // Create Student profiles
  const [student1] = await db.insert(students).values({
    userId: studentUser.id,
    dob: "2008-05-15",
    address: "123 School Lane",
    phone: "555-0101",
  }).returning();

  const [student2] = await db.insert(students).values({
    userId: studentUser2.id,
    dob: "2009-08-20",
    address: "456 Academy Road",
    phone: "555-0102",
  }).returning();

  // Create Courses
  const [mathCourse] = await db.insert(courses).values({
    name: "Advanced Mathematics",
    description: "Calculus and Linear Algebra",
    teacherId: teacher.id,
    schedule: "Mon/Wed 09:00 AM",
  }).returning();

  const [csCourse] = await db.insert(courses).values({
    name: "Computer Science 101",
    description: "Introduction to Programming",
    teacherId: teacher.id,
    schedule: "Tue/Thu 11:00 AM",
  }).returning();

  // Enroll students
  await db.insert(enrollments).values([
    { studentId: student1.id, courseId: mathCourse.id },
    { studentId: student1.id, courseId: csCourse.id },
    { studentId: student2.id, courseId: csCourse.id },
  ]);

  // Create Events
  await db.insert(events).values([
    {
      title: "Science Fair 2024",
      description: "Annual Science Fair for all grades.",
      date: new Date("2024-12-15T09:00:00Z"),
      location: "Main Auditorium",
    },
    {
      title: "Parent-Teacher Conference",
      description: "Term 1 review.",
      date: new Date("2024-11-20T16:00:00Z"),
      location: "Classrooms",
    },
  ]);

  // Create Fees
  await db.insert(fees).values([
    {
      studentId: student1.id,
      amount: 50000, // $500.00
      description: "Term 1 Tuition",
      dueDate: "2024-09-01",
      paid: true,
    },
    {
      studentId: student2.id,
      amount: 50000,
      description: "Term 1 Tuition",
      dueDate: "2024-09-01",
      paid: false,
    },
  ]);

  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
});
