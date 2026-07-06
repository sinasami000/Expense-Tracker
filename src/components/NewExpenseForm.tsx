"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createExpense } from "@/actions/expense";
import { useExpenses } from "@/store";
import { Loader2 } from "lucide-react";

export function NewExpenseForm({ budgetId,leftAmount }: { budgetId: string,leftAmount: number }) {
  const formSchema = z.object({
    name: z
      .string()
      .min(5, "Expense name must be at least 5 characters.")
      .max(32, "Expense name must be at most 32 characters."),
    amount: z
      .string()
      .min(1, "Amount is required.")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be a positive number.",
      })
      .refine((val) => Number(val) <= leftAmount, {
        message: `Amount cannot be more than ${leftAmount}.`,
      }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
    },
  });
  const addExpense = useExpenses((state) => state.addExpense);
  async function dbCall(data: z.infer<typeof formSchema>) {
    const res = await createExpense({ ...data, budgetId: Number(budgetId) });
    toast.success("Expense created successfully");
    addExpense(res);
    form.reset();
  }
  async function onSubmit(data: z.infer<typeof formSchema>) {
    await dbCall(data);
  }
  const {
    formState: { isSubmitting },
  } = form;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="font-bold"
                    htmlFor="form-rhf-demo-title"
                  >
                    Expense Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g Football"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="font-bold"
                    htmlFor="form-rhf-demo-amount"
                  >
                    Expense Amount
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-amount"
                    aria-invalid={fieldState.invalid}
                    placeholder="500"
                    autoComplete="off"
                    type="number"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            form="form-rhf-demo"
            disabled={isSubmitting}
            type="submit"
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Creating
              </>
            ) : (
              "Create expense"
            )}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
