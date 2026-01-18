import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, longtext } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tasks table - stores user tasks per tab
 */
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tabId: varchar("tabId", { length: 64 }).notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Notes table - stores user notes per tab
 */
export const notes = mysqlTable("notes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tabId: varchar("tabId", { length: 64 }).notNull(),
  content: text("content").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

/**
 * User preferences - stores user settings (dark mode, widget order, etc.)
 */
export const userPreferences = mysqlTable("user_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  darkMode: boolean("darkMode").default(false).notNull(),
  widgetOrder: text("widgetOrder"), // JSON stored as text for compatibility
  tabConfig: text("tabConfig"), // JSON stored as text for compatibility
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;

/**
 * Custom tabs - user-created tabs with whiteboard/canvas functionality
 */
export const customTabs = mysqlTable("custom_tabs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tabId: varchar("tabId", { length: 64 }).notNull(),
  label: varchar("label", { length: 128 }).notNull(),
  color: varchar("color", { length: 32 }).default("#FF69B4").notNull(),
  icon: varchar("icon", { length: 64 }).default("file").notNull(),
  tabType: mysqlEnum("tabType", ["widgets", "whiteboard"]).default("whiteboard").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomTab = typeof customTabs.$inferSelect;
export type InsertCustomTab = typeof customTabs.$inferInsert;

/**
 * Canvas data - stores whiteboard/drawing data for each tab
 */
export const canvasData = mysqlTable("canvas_data", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tabId: varchar("tabId", { length: 64 }).notNull(),
  data: longtext("data"), // JSON snapshot of tldraw state
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CanvasData = typeof canvasData.$inferSelect;
export type InsertCanvasData = typeof canvasData.$inferInsert;
