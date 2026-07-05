import {
  pgTable,
  integer,
  varchar,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  icon: varchar("icon", { length: 10 }),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const Expenses = pgTable("expenses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  budgetId: integer("budgetId").references(() => Budgets.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type budgetType = typeof Budgets.$inferSelect;
export type newBudgetType = typeof Budgets.$inferInsert;
export type expenseType = typeof Budgets.$inferSelect;
export type newExpenseType = typeof Budgets.$inferInsert;
// 01873433727
