import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  defaultLoanDays: integer("default_loan_days").notNull().default(7),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id),
  borrowerName: text("borrower_name").notNull(),
  loanedAt: date("loaned_at").notNull().defaultNow(),
  dueDate: date("due_date").notNull(),
  returnedAt: timestamp("returned_at", { mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});
