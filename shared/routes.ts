import { z } from 'zod';
import { 
  insertStudentSchema, students,
  insertTeacherSchema, teachers,
  insertCourseSchema, courses,
  insertEnrollmentSchema, enrollments,
  insertAssignmentSchema, assignments,
  insertSubmissionSchema, submissions,
  insertAttendanceSchema, attendance,
  insertFeeSchema, fees,
  insertEventSchema, events,
  users, insertUserSchema
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/auth/user', // Correct path for user info in this integration
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/users',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  students: {
    list: {
      method: 'GET' as const,
      path: '/api/students',
      responses: {
        200: z.array(z.custom<typeof students.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/students',
      input: insertStudentSchema,
      responses: {
        201: z.custom<typeof students.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  teachers: {
    list: {
      method: 'GET' as const,
      path: '/api/teachers',
      responses: {
        200: z.array(z.custom<typeof teachers.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/teachers',
      input: insertTeacherSchema,
      responses: {
        201: z.custom<typeof teachers.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  courses: {
    list: {
      method: 'GET' as const,
      path: '/api/courses',
      responses: {
        200: z.array(z.custom<typeof courses.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/courses',
      input: insertCourseSchema,
      responses: {
        201: z.custom<typeof courses.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  fees: {
    list: {
      method: 'GET' as const,
      path: '/api/fees',
      responses: {
        200: z.array(z.custom<typeof fees.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/fees',
      input: insertFeeSchema,
      responses: {
        201: z.custom<typeof fees.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events',
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/events',
      input: insertEventSchema,
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
