# EduNexus - School Management System

## Overview

EduNexus is a comprehensive web-based school management system designed to handle various aspects of school operations. The application provides a modern, responsive interface for managing students, teachers, courses, fees, and events. It features local authentication with Passport.js, a PostgreSQL database backend, and a React frontend with a polished UI using shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Charts**: Recharts for dashboard analytics and data visualization
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for validation
- **Authentication**: Passport.js with local strategy (hardcoded admin: admin/admin1234)
- **Session Storage**: In-memory sessions via express-session

### Data Storage
- **Database**: PostgreSQL (Replit-provisioned)
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for database schema push (`npm run db:push`)

### Key Database Tables
- `users` - Core user accounts
- `students` - Student profiles with references to users
- `teachers` - Teacher profiles with specializations
- `courses` - Course definitions with teacher assignments
- `enrollments` - Student-course relationships
- `assignments` - Course assignments
- `submissions` - Student assignment submissions
- `attendance` - Attendance tracking
- `fees` - Fee management and payment tracking
- `events` - School events and activities
- `sessions` - Authentication session storage

### Build System
- **Development**: `npm run dev` - Vite dev server with HMR, proxied through Express on port 5000
- **Production Build**: `npm run build` - Custom build script using esbuild for server bundling and Vite for client
- **Production Start**: `npm run start` - Runs the bundled server
- **Output**: Server bundle as CommonJS (`dist/index.cjs`), client as static files (`dist/public`)

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn/ui + custom)
│   ├── hooks/           # React hooks (auth, data fetching)
│   ├── pages/           # Page components (Dashboard, Students, etc.)
│   └── lib/             # Utilities
├── server/              # Express backend
│   ├── index.ts         # Server entry point (port 5000)
│   ├── replitAuth.ts    # Local auth with Passport.js
│   ├── routes.ts        # API route handlers
│   ├── vite.ts          # Vite dev server setup
│   ├── static.ts        # Production static file serving
│   ├── db.ts            # Database connection
│   └── storage.ts       # Data access layer
├── shared/              # Shared code (schemas, routes)
│   ├── schema.ts        # Drizzle database schema
│   ├── routes.ts        # API route definitions
│   └── models/auth.ts   # Auth-related models
└── script/build.ts      # Build script
```

## Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned)
- `SESSION_SECRET` - Secret for session encryption (defaults to "dev-secret")

## Recent Changes
- Fixed login flow: Replaced server-rendered HTML login form with React-based login page
- Updated auth hooks to support login/logout via API calls
- Installed nanoid as direct dependency
- Database schema pushed via Drizzle Kit
