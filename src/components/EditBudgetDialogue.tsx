"use client";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Edit2, Loader2 } from "lucide-react";
import useBudgets from "@/store";
import { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "sonner";
import { updateBudget } from "@/actions/budgets";
function EditBudgetDialogue({ budgetId }: { budgetId: number }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialogue, setOpenDialogue] = useState(false);
  const [opneEmoji, setOpneEmoji] = useState(false);
  const [amount, setAmount] = useState("");
  const [emoji, setEmoji] = useState("");
  const budgets = useBudgets((state) => state.budgets);
  const editBudget = useBudgets((state) => state.editBudget);
  const currBudget = budgets.find((each) => each.id == budgetId);
  useEffect(() => {
    if (currBudget) {
      setName(currBudget.name);
      setAmount(currBudget.amount);
      if (currBudget.icon) {
        setEmoji(currBudget.icon);
      }
    }
  }, [currBudget]);
  const isInvalid =
    name.trim() === "" ||
    amount === "" ||
    isNaN(Number(amount)) ||
    Number(amount) <= 0;
  const isUnchanged =
    currBudget &&
    name === currBudget.name &&
    amount === currBudget.amount &&
    emoji === (currBudget.icon ?? "");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedBudgetData = await updateBudget(budgetId, {
        name,
        amount,
        icon: emoji,
      });
      editBudget(updatedBudgetData);
      toast.success("Budget updated successfully");
      setOpenDialogue(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update budget");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={openDialogue} onOpenChange={setOpenDialogue}>
      <form>
        <DialogTrigger asChild>
          <Button size={"lg"} className="cursor-pointer">
            <Edit2 />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              Make changes to your budget here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Budget Name</Label>
              <Input
                id="name-1"
                name="name"
                value={name}
                onChange={(d) => setName(d.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="username-1">Amount</Label>
              <Input
                id="username-1"
                name="amount"
                value={amount}
                type="number"
                onChange={(e) => setAmount(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="icon-1">Amount</Label>
              <Input
                className="cursor-pointer"
                onClick={() => setOpneEmoji(!opneEmoji)}
                id="icon-1"
                name="icon"
                value={emoji}
                readOnly
              />
              <EmojiPicker
                onEmojiClick={(e) => {
                  setEmoji(e.emoji);
                  setOpneEmoji(false);
                }}
                open={opneEmoji}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={loading} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleSubmit}
              disabled={isInvalid || isUnchanged || loading}
              type="submit"
            >
              {loading ? (
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
  );
}

export default EditBudgetDialogue;
