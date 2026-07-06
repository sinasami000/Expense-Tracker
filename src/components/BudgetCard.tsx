"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { BudgetWithExpenseStats } from "@/actions/budgets";
import Link from "next/link";

function BudgetCard({ budget }: { budget: BudgetWithExpenseStats }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const amount = Number(budget.amount);
  const spend = Number(budget.totalSpend);
  const remaining = amount - spend;
  const isOverBudget = remaining < 0;

  const percentage = amount > 0 ? (spend / amount) * 100 : 0;
  const clampedPercentage = Math.min(percentage, 100);

  const barColor = isOverBudget
    ? "bg-red-500"
    : percentage >= 80
      ? "bg-amber-500"
      : isDark
        ? "bg-indigo-400"
        : "bg-primary";

  return (
    <Link href={`/dashboard/expenses/${budget.id}`}>
      <Card        
        className={cn(
          "cursor-pointer transition-all duration-200",
          "hover:shadow-md hover:-translate-y-0.5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-lg"
              aria-hidden
            >
              {budget.icon || "💰"}
            </span>
            <span className="font-semibold">{budget.name}</span>
          </CardTitle>
          <CardAction className="text-xl font-bold text-primary">
            ৳{amount.toLocaleString()}
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              <span className="font-medium text-foreground">
                ৳{spend.toLocaleString()}
              </span>{" "}
              spent
            </span>
            <span
              className={cn(
                "font-medium",
                isOverBudget ? "text-red-500" : "text-foreground",
              )}
            >
              {isOverBudget
                ? `৳${Math.abs(remaining).toLocaleString()} over`
                : `৳${remaining.toLocaleString()} left`}
            </span>
          </div>

          <div
            className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
            role="progressbar"
            aria-valuenow={Math.round(clampedPercentage)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                barColor,
              )}
              style={{ width: `${clampedPercentage}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {budget.totalItems}{" "}
              {budget.totalItems === 1 ? "expense" : "expenses"}
            </span>
            <span>{Math.round(percentage)}%</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default BudgetCard;
