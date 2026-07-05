"use client";
import {
  BudgetWithExpenseStats,
  deleteBudget,
  getBudgetInformation,
} from "@/actions/budgets";
import BudgetCard from "@/components/BudgetCard";
import BudgetCardSkeleton from "@/components/BudgetCardSkeleton";
import { DataTable } from "@/components/DataTable";
import { NewExpenseForm } from "@/components/NewExpenseForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Loader2, Trash2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import useBudgets, { useExpenses } from "@/store";
import { SkeletonForm } from "@/components/formSkeleton";
import { toast } from "sonner";
import EditBudgetDialogue from "@/components/EditBudgetDialogue";
type PageProps = {
  params: Promise<{ budgetId: string }>;
};

export default function Page({ params }: PageProps) {
  const { budgetId } = use(params);
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [budgetData, setBudgetData] = useState<BudgetWithExpenseStats | {}>({});
  const [isDeletingBudget, setIsDeletingBudget] = useState(false);
  async function gettingData() {
    try {
      const data = await getBudgetInformation(Number(budgetId));
      setBudgetData(data[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  const expenses = useExpenses((state) => state.expenses);
  const budgets = useBudgets(state => state.budgets);
  useEffect(() => {
    gettingData();
  }, [budgetId, expenses,budgets]);
  const router = useRouter();
  const handleDeleteBudget = async () => {
    setIsDeletingBudget(true);
    setOpenDeleteDialogue(true);
    try {
      await deleteBudget(budgetId);
      toast.success("Budget deleted successfully");
      router.replace("/dashboard/budgets");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete budget. Try again");
    } finally {
      setOpenDeleteDialogue(false);
      setIsDeletingBudget(false);
    }
  };
  return (
    <div className="p-2 sm:p-10">
      <div className="flex mb-5 justify-between">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              router.replace("/dashboard/budgets");
            }}
            className="cursor-pointer"
          >
            <ArrowLeft />
          </button>
          <h1 className="font-bold text-xl sm:text-2xl">My Expenses</h1>
        </div>
        <div className="flex gap-1 items-center">
          {budgetId && <EditBudgetDialogue budgetId={budgetId} />}

          <AlertDialog
            open={openDeleteDialogue}
            onOpenChange={setOpenDeleteDialogue}
          >
            <AlertDialogTrigger asChild>
              <Button
                size={"lg"}
                className="cursor-pointer"
                variant={"destructive"}
              >
                <Trash2 />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeletingBudget}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeletingBudget}
                  onClick={handleDeleteBudget}
                >
                  {isDeletingBudget ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Deleting
                    </>
                  ) : (
                    "Continue"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          {!isLoading ? (
            <BudgetCard budget={budgetData} />
          ) : (
            <BudgetCardSkeleton />
          )}
        </div>
        {isLoading ? <SkeletonForm /> : <NewExpenseForm budgetId={budgetId} />}
      </div>

      <div className="mt-6">
        <h1 className="font-bold text-2xl">Latest Expenses</h1>
        <DataTable budgetId={budgetId} />
      </div>
    </div>
  );
}
