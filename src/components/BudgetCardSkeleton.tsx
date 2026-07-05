import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function BudgetCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* icon square */}
          <Skeleton className="h-9 w-9 rounded-lg" />
          {/* budget name */}
          <Skeleton className="h-5 w-28" />
        </div>
        {/* dollar amount, top-right (CardAction slot) */}
        <Skeleton className="h-6 w-16" />
      </CardHeader>

      <CardContent>
        {/* spent / remaining row */}
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* progress bar */}
        <Skeleton className="h-2 w-full rounded-full" />

        {/* expense count / percentage row */}
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
      </CardContent>
    </Card>
  );
}

export default BudgetCardSkeleton;