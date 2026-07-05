ALTER TABLE "expenses" DROP CONSTRAINT "expenses_budgetId_budgets_id_fk";
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_budgetId_budgets_id_fk" FOREIGN KEY ("budgetId") REFERENCES "public"."budgets"("id") ON DELETE cascade ON UPDATE no action;