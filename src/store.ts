import { create } from "zustand";
import { budgetType, expenseType } from "./utils/schema";

type BudgetStore = {
  budgets: budgetType[];
  addBudget: (newBudget: budgetType) => void;
  editBudget: (updatedBudget: budgetType) => void;
  deleteBudget: (id: budgetType["id"]) => void;
  setBudget: (budgets: budgetType[]) => void;
};

type ExpenseStore = {
  expenses: expenseType[];
  addExpense: (newexpense: expenseType) => void;
  editExpense: (updatedexpense: expenseType) => void;
  deleteExpense: (id: expenseType["id"]) => void;
  setExpenses: (expenses: expenseType[]) => void;
};

const useBudgets = create<BudgetStore>()((set) => ({
  budgets: [],
  addBudget: (newBudget: budgetType) =>
    set((state) => ({ budgets: [newBudget, ...state.budgets] })),
  editBudget: (updatedBudget: budgetType) =>
    set((state) => ({
      budgets: state.budgets.map((each) =>
        each.id === updatedBudget.id ? updatedBudget : each,
      ),
    })),
  deleteBudget: (id: budgetType["id"]) =>
    set((state) => ({
      budgets: state.budgets.filter((each) => each.id !== id),
    })),
  setBudget: (budgets: budgetType[]) => set({ budgets }),
}));

export const useExpenses = create<ExpenseStore>()((set) => ({
  expenses: [],
  addExpense: (newExpense: expenseType) =>
    set((state) => ({ expenses: [newExpense, ...state.expenses] })),
  editExpense: (updatedExpense: expenseType) =>
    set((state) => ({
      expenses: state.expenses.map((each) =>
        each.id === updatedExpense.id ? updatedExpense : each,
      ),
    })),
  deleteExpense: (id: expenseType["id"]) =>
    set((state) => ({
      expenses: state.expenses.filter((each) => each.id !== id),
    })),
  setExpenses: (expenses: expenseType[]) => set({ expenses }),
}));

export default useBudgets;
