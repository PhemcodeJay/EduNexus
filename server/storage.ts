import { 
  students, teachers, courses, enrollments, assignments, submissions, attendance, fees, events,
  type Student, type Teacher, type Course, type Fee, type Event
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getStudents(): Promise<Student[]>;
  createStudent(student: any): Promise<Student>;
  
  getTeachers(): Promise<Teacher[]>;
  createTeacher(teacher: any): Promise<Teacher>;
  
  getCourses(): Promise<Course[]>;
  createCourse(course: any): Promise<Course>;
  
  getFees(): Promise<Fee[]>;
  createFee(fee: any): Promise<Fee>;
  
  getEvents(): Promise<Event[]>;
  createEvent(event: any): Promise<Event>;
}

export class DatabaseStorage implements IStorage {
  async getStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  async createStudent(insertStudent: any): Promise<Student> {
    const [student] = await db.insert(students).values(insertStudent).returning();
    return student;
  }

  async getTeachers(): Promise<Teacher[]> {
    return await db.select().from(teachers);
  }

  async createTeacher(insertTeacher: any): Promise<Teacher> {
    const [teacher] = await db.insert(teachers).values(insertTeacher).returning();
    return teacher;
  }

  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async createCourse(insertCourse: any): Promise<Course> {
    const [course] = await db.insert(courses).values(insertCourse).returning();
    return course;
  }

  async getFees(): Promise<Fee[]> {
    return await db.select().from(fees);
  }

  async createFee(insertFee: any): Promise<Fee> {
    const [fee] = await db.insert(fees).values(insertFee).returning();
    return fee;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async createEvent(insertEvent: any): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }
}

export const storage = new DatabaseStorage();
