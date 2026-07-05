"use client";
import { Loader2, MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  deleteExpense,
  getLatestExpenses,
  updateExpense,
} from "@/actions/expense";
import formatDate from "@/utils/formateDate";
import { expenseType } from "@/utils/schema";
import { toast } from "sonner";
function LatestExpenseTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<expenseType[]>([]);
  const [editTarget, setEditTarget] = useState<expenseType | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftAmount, setDraftAmount] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<expenseType | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fetchLatestExpense = async () => {
    try {
      const data = await getLatestExpenses();
      setExpenses(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  async function delExpense(expenseId: number) {
    await deleteExpense(expenseId);
    const updatedExpenses = expenses.filter((each) => each.id !== expenseId);
    setExpenses(updatedExpenses);
  }
  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    await delExpense(deleteTarget.id);
    setDeleteTarget(null);
  }
  useEffect(() => {
    fetchLatestExpense();
  }, []);
  async function handleEditFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    setIsUpdating(true);
    try {
      const updated = await updateExpense(editTarget.id, {
        name: draftName,
        amount: draftAmount,
      });
      setExpenses(
        expenses.map((each) => (each.id === updated.id ? updated : each)),
      );
      setEditTarget(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update expense. Try again");
    } finally {
      setIsUpdating(false);
    }
  }
  const isInvalid =
    draftName.trim() === "" ||
    isNaN(Number(draftAmount)) ||
    Number(draftAmount) <= 0;
  const isUnchanged =
    editTarget !== null &&
    draftName === editTarget.name &&
    draftAmount === String(editTarget.amount);

  const isDisabled = isInvalid || isUnchanged;
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading &&
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.name}</TableCell>
                <TableCell>৳{expense.amount}</TableCell>
                <TableCell>{formatDate(new Date(expense.createdAt))}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          setEditTarget(expense);
                          setDraftName(expense.name);
                          setDraftAmount(String(expense.amount));
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={(e) => {
                          e.preventDefault();
                          setDeleteTarget(expense);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <form id="edit-expense-form" onSubmit={handleEditFormSubmit}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
              <DialogDescription>
                Make changes to your expense here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">Name</Label>
                <Input
                  id="name-1"
                  name="name"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="amount">Name</Label>
                <Input
                  id="amount"
                  name="amount"
                  value={draftAmount}
                  onChange={(e) => setDraftAmount(e.target.value)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isUpdating} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                form="edit-expense-form"
                disabled={isDisabled || isUpdating}
                type="submit"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Updating
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium">{deleteTarget?.name}</span>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default LatestExpenseTable;
