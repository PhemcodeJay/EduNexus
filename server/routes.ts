import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.students.list.path, async (req, res) => {
    const students = await storage.getStudents();
    res.json(students);
  });

  app.post(api.students.create.path, async (req, res) => {
    try {
      const input = api.students.create.input.parse(req.body);
      const student = await storage.createStudent(input);
      res.status(201).json(student);
    } catch (err) {
       if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  app.get(api.teachers.list.path, async (req, res) => {
    const teachers = await storage.getTeachers();
    res.json(teachers);
  });

  app.post(api.teachers.create.path, async (req, res) => {
    try {
      const input = api.teachers.create.input.parse(req.body);
      const teacher = await storage.createTeacher(input);
      res.status(201).json(teacher);
    } catch (err) {
       if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });
  
  app.get(api.courses.list.path, async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get("/api/courses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid course ID" });
      return;
    }
    const course = await storage.getCourse(id);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json(course);
  });

  app.post(api.courses.create.path, async (req, res) => {
    try {
      const input = api.courses.create.input.parse(req.body);
      const course = await storage.createCourse(input);
      res.status(201).json(course);
    } catch (err) {
       if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  app.get(api.fees.list.path, async (req, res) => {
    const fees = await storage.getFees();
    res.json(fees);
  });

  app.post(api.fees.create.path, async (req, res) => {
    try {
      const input = api.fees.create.input.parse(req.body);
      const fee = await storage.createFee(input);
      res.status(201).json(fee);
    } catch (err) {
       if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.post(api.events.create.path, async (req, res) => {
    try {
      const input = api.events.create.input.parse(req.body);
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (err) {
       if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  return httpServer;
}
