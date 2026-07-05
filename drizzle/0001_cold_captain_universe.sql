ALTER TABLE "budgets" ALTER COLUMN "amount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "budgets" ALTER COLUMN "icon" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "budgets" ALTER COLUMN "createdBy" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;