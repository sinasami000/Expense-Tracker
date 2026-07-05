"use client";
import { NotepadText, PiggyBank, WalletMinimal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function DashboardCards({
  totalBudget,
  totalSpend,
  budgetCount,
}: {
  totalBudget: number;
  totalSpend: number;
  budgetCount: number;
}) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center justify-between p-3">
          <div>
            <p className="text-md font-semibold">Total Budget</p>
            <h1 className="text-2xl font-bold">৳{totalBudget}</h1>
          </div>
          <PiggyBank size={40} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center justify-between p-3">
          <div>
            <p className="text-md font-semibold">Total Spend</p>
            <h1 className="text-2xl font-bold">৳{totalSpend}</h1>
          </div>
          <NotepadText size={40} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center justify-between p-3">
          <div>
            <p className="text-md font-semibold">No. of Budget</p>
            <h1 className="text-2xl font-bold">{budgetCount}</h1>
          </div>
          <WalletMinimal size={40} />
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardCards;
