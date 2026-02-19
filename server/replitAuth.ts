import express, { type Express, type RequestHandler } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Setup session
export function getSession() {
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // must be false for localhost
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  });
}

// Setup authentication
export async function setupAuth(app: Express) {
  // Parse JSON and form data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Hardcoded admin user
  const ADMIN_USER = {
    id: "1",
    username: "admin",
    password: "admin1234",
    name: "Administrator",
  };

  // Passport local strategy
  passport.use(
    new LocalStrategy((username, password, done) => {
      if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        return done(null, ADMIN_USER);
      }
      return done(null, false);
    })
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser((id: string, done) => {
    if (id === ADMIN_USER.id) return done(null, ADMIN_USER);
    return done(null, false);
  });

  // LOGIN route (POST)
  app.post("/api/login", (req, res, next) => {
    return passport.authenticate(
      "local",
      (err: Error | null, user: typeof ADMIN_USER | false) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        req.logIn(user, (err: Error | null) => {
          if (err) return next(err);
          return res.json({ user });
        });
      }
    )(req, res, next);
  });

  // LOGOUT route (POST)
  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      return res.json({ message: "Logged out" });
    });
  });

  // CURRENT USER route (GET)
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    return res.json(req.user);
  });

}

// Middleware to protect routes
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
  return next();
};
