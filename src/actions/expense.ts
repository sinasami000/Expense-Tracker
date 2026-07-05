"use server";

import { db } from "@/utils/db";
import { Budgets, Expenses } from "@/utils/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export const getExpenses = async (budgetId: number) => {
  const data = await db
    .select()
    .from(Expenses)
    .where(eq(Expenses.budgetId, budgetId))
    .orderBy(desc(Expenses.createdAt));
  return data;
};

export const deleteExpense = async (expenseId: number) => {
  await db.delete(Expenses).where(eq(Expenses.id, expenseId));
};

export const createExpense = async (data: {
  name: string;
  amount: string;
  budgetId: number;
}) => {
  const [newExpense] = await db
    .insert(Expenses)
    .values({
      name: data.name,
      amount: data.amount,
      budgetId: data.budgetId,
    })
    .returning();
  console.log(newExpense);
  return newExpense;
};

export const updateExpense = async (
  id: number,
  data: { name: string; amount: string },
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const [updated] = await db
    .update(Expenses)
    .set(data)
    .where(eq(Expenses.id, id))
    .returning();
  if (!updated) {
    throw new Error("Expense not found or unauthorized");
  }
  console.log(updated);
  return updated;
};

export const getLatestExpenses = async () => {
  const user = await currentUser();
  const email = user?.emailAddresses[0].emailAddress;
  if (!email) {
    throw new Error("Unauthorized");
  }
  const result = await db
    .select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      budgetId: Expenses.budgetId,
      createdAt: Expenses.createdAt,
      updatedAt: Expenses.updatedAt,
      // pull along whatever budget info you need for display
      budgetName: Budgets.name,
      budgetIcon: Budgets.icon,
    })
    .from(Expenses)
    .innerJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
    .where(eq(Budgets.createdBy, email))
    .orderBy(desc(Expenses.createdAt));

  return result;
};
