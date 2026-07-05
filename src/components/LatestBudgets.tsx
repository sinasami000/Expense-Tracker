"use client";

import { BudgetWithExpenseStats } from "@/actions/budgets";
import BudgetCard from "./BudgetCard";
import BudgetCardSkeleton from "./BudgetCardSkeleton";

function LatestBudgets({
  latestBudgets,
  loading,
}: {
  latestBudgets: BudgetWithExpenseStats[];
  loading: boolean;
}) {
  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold">Latest Budgets</h1>
      <div className="mt-4 grid grid-cols-1 gap-6">
        {latestBudgets && latestBudgets.length > 0 && !loading
          ? latestBudgets.map((each, index) => (
              <BudgetCard key={index} budget={each} />
            ))
          : [...Array(2)].map((_each, index) => (
              <BudgetCardSkeleton key={index} />
            ))}
      </div>
    </div>
  );
}

export default LatestBudgets;
