"use client";
import { getBudgets } from "@/actions/budgets";
import useBudgets from "@/store";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppSideBar from "@/components/app-sidebar";
import DashboardNavbar from "@/components/Dashboard-Nav";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();
  const email = user?.primaryEmailAddress?.emailAddress;
  const setBudgets = useBudgets((state) => state.setBudget);
  async function checkBudget() {
    if (email) {
      const budgets = await getBudgets(email);
      if (!budgets || budgets.length == 0) {
        router.push("/dashboard/budgets");
      } else {
        setBudgets(budgets);
      }
    }
  }
  useEffect(() => {
    checkBudget();
  }, [user]);
  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="flex flex-col w-full gap-2">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
