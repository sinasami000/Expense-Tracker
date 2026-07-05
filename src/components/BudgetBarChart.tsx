"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { BudgetWithExpenseStats } from "@/actions/budgets";

export const description = "A stacked bar chart with a legend";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

const chartConfig = {
  totalSpend: {
    label: "Total Spend",
    color: "var(--primary)",
  },
  amount: {
    label: "Amount",
    color: "var(--secondary)",
  },
} satisfies ChartConfig;
interface chartData {
  name: string;
  amount: number;
  totalSpend: number;
}
export function BudgetBarChart({
  latestBudgets,
}: {
  latestBudgets: BudgetWithExpenseStats[];
}) {
  const [chartData, setChartData] = useState<chartData[]>([]);
  function formatData() {
    if (latestBudgets.length > 0) {
      const mainFormatedData = latestBudgets.map((each) => ({
        name: each.name,
        amount: Number(each.amount),
        totalSpend: each.totalSpend,
      }));
      setChartData(mainFormatedData);
    }
  }
  useEffect(() => {
    formatData();
  }, [latestBudgets]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="totalSpend"
              stackId="a"
              fill="var(--color-totalSpend)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="amount"
              stackId="a"
              fill="var(--color-amount)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
