"use server";
import { db } from "@/utils/db";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, budgetType, Expenses } from "@/utils/schema";
import { auth, currentUser } from "@clerk/nextjs/server";

export const getBudgets = async (email: string) => {
  const budgets = await db
    .select()
    .from(Budgets)
    .where(eq(Budgets.createdBy, email));
  return budgets;
};

interface budgetProps {
  name: string;
  amount: number;
  icon: string;
}
export const createBudget = async (
  budgetInfos: budgetProps,
  createdBy: string,
) => {
  const createdBudget = await db
    .insert(Budgets)
    .values({
      name: budgetInfos.name,
      amount: budgetInfos.amount.toString(),
      icon: budgetInfos.icon,
      createdBy,
    })
    .returning();
  return createdBudget;
};

export type BudgetWithExpenseStats = {
  id: number;
  name: string;
  amount: string;
  icon: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  totalSpend: number;
  totalItems: number;
};
export const getBudgetExpense = async (userEmail: string) => {
  const result = await db
    .select({
      ...getTableColumns(Budgets),
      totalSpend: sql<number>`coalesce(sum(${Expenses.amount}), 0)`.mapWith(
        Number,
      ),
      totalItems: sql<number>`count(${Expenses.id})`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, userEmail))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.createdAt));
  return result;
};

export const getBudgetInformation = async (id: number) => {
  const user = await currentUser();
  const email = user?.emailAddresses[0].emailAddress;
  const response = await db
    .select({
      ...getTableColumns(Budgets),
      totalSpend: sql<number>`coalesce(sum(${Expenses.amount}), 0)`.mapWith(
        Number,
      ),
      totalItems: sql<number>`count(${Expenses.id})`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, email))
    .where(eq(Budgets.id, id))
    .groupBy(Budgets.id);

  return response;
};

export const deleteBudget = async (budgetId: string) => {
  await db.delete(Budgets).where(eq(Budgets.id, budgetId));
};

export const updateBudget = async (
  id: number,
  updateBudgetInfo: { name: string; amount: string; icon: string },
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const [updated] = await db
    .update(Budgets)
    .set(updateBudgetInfo)
    .where(eq(Budgets.id, id))
    .returning();
  if (!updated) {
    throw new Error("Budget not found or unauthorized");
  }
  console.log(updated);
  return updated;
};
