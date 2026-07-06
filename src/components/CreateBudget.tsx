"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { createBudget } from "@/actions/budgets";
import { useUser } from "@clerk/nextjs";
import useBudgets from "@/store";

function CreateBudget() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const [open, setOpen] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const addBudget = useBudgets((state) => state.addBudget);
  const [formInputs, setFormInputs] = useState({
    name: "Groceries",
    icon: "🛒",
    amount: "4000",
  });
  const handleSubmit = async () => {
    if (email) {
      try {
        setLoading(true);
        const budget = await createBudget(
          { ...formInputs, amount: Number(formInputs.amount) },
          email,
        );
        console.log(budget[0]);
        toast.success("Budget created successfully");
        addBudget(budget[0]);
        setOpen(false);
      } catch (error) {
        toast.error("Failed to create budget. Please try again");
      } finally {
        setLoading(false);
      }
    }
  };
  const disableCond =
    formInputs.amount == "" || formInputs.name == "" || formInputs.icon == "";
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <form
          onSubmit={(e) => {
            console.log(e);
          }}
        >
          <DialogTrigger asChild>
            <Card className="flex h-full cursor-pointer hover:shadow-md items-center justify-center">
              <CardContent className="flex-col flex items-center gap-2">
                <Plus />{" "}
                <span className="text-xl font-bold">Create new Budget</span>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
              <DialogDescription>
                Fill out the below inputs and click the "create" button to
                create a new budget.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">Budget Name</Label>
                <Input
                  id="name-1"
                  name="name"
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, name: e.target.value })
                  }
                  value={formInputs.name}
                />
              </Field>
              <Field>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formInputs.amount}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      amount: e.target.value,
                    })
                  }
                />
              </Field>
              <Field>
                <Label htmlFor="icon">Budget Icon</Label>
                <EmojiPicker
                  onEmojiClick={(e) => {
                    setFormInputs({ ...formInputs, icon: e.emoji });
                    setOpenEmojiPicker(false);
                  }}
                  open={openEmojiPicker}
                />
                <Input
                  id="icon"
                  name="icon"
                  readOnly
                  value={formInputs.icon}
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={disableCond} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              {loading ? (
                <Button disabled>
                  <Loader2 className="animate-spin" /> creating
                </Button>
              ) : (
                <Button
                  disabled={disableCond}
                  onClick={handleSubmit}
                  type="submit"
                >
                  Create Budget
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}

export default CreateBudget;
