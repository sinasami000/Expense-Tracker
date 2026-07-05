"use client";

import { BudgetWithExpenseStats, getBudgetExpense } from "@/actions/budgets";
import { BudgetBarChart } from "@/components/BudgetBarChart";
import DashboardCards from "@/components/DashboardCards";
import LatestBudgets from "@/components/LatestBudgets";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

function page() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [latestBudgets, setLatestBudgets] = useState<BudgetWithExpenseStats[]>(
    [],
  );
  const [budgetCount, setBudgetCount] = useState(0);
  const [loading, setLoading] = useState(true);

  async function getBudgetInfo() {
    if (email) {
      if (email) {
        const info = await getBudgetExpense(email);
        console.log(info);
        setTotalBudget(
          info.reduce((prev, curr) => {
            return prev + Number(curr.amount);
          }, 0),
        );
        setBudgetCount(info.length);
        setTotalSpend(
          info.reduce((prev, curr) => {
            return prev + curr.totalSpend;
          }, 0),
        );
      }
    }
  }
  async function getLatestBudgets() {
    try {
      if (email) {
        const res = await getBudgetExpense(email);
        setLatestBudgets(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBudgetInfo();
    getLatestBudgets();
  }, [user]);
  return (
    <div className="p-5">
      <h1 className="font-bold text-2xl">Hi, {user?.fullName}!</h1>
      <p>Here's what happening with your money. let's manage your expense.</p>
      <DashboardCards
        totalSpend={totalSpend}
        totalBudget={totalBudget}
        budgetCount={budgetCount}
      />
      <div className="mt-5 gap-6 grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2">
          <BudgetBarChart latestBudgets={latestBudgets} />
        </div>
        <div className="md:col-span-1">
          <LatestBudgets latestBudgets={latestBudgets} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default page;
