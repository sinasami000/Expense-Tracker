"use client";
import CreateBudget from "./CreateBudget";
import useBudgets from "@/store";
import BudgetCard from "./BudgetCard";
import { useEffect, useState } from "react";
import { BudgetWithExpenseStats, getBudgetExpense } from "@/actions/budgets";
import { toast } from "sonner";
import BudgetCardSkeleton from "./BudgetCardSkeleton";
import { useUser } from "@clerk/nextjs";

function BudgetList() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const budgets = useBudgets((state) => state.budgets);
  const [mainBudgets, setMainBudgets] = useState<BudgetWithExpenseStats[]>([]);
  const [loading, setLoading] = useState(true);
  async function data() {
    if (email) {
      try {
        const res = await getBudgetExpense(email);
        setMainBudgets(res);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch budget data");
      } finally {
        setLoading(false);
      }
    }
  }
  const arr = [...Array(10)];
  useEffect(() => {
    data();
  }, [budgets, user]);
  return (
    <div className="grid gap-4 p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <CreateBudget />
      {loading ? (
        arr.map((e,index) => <BudgetCardSkeleton key={index} />)
      ) : mainBudgets && mainBudgets.length > 0 ? (
        mainBudgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-semibold">No budgets yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first budget to start tracking your expenses.
          </p>
        </div>
      )}
    </div>
  );
}

export default BudgetList;
