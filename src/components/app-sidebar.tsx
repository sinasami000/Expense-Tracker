"use client";
import {
  Home,
  PiggyBank,
  ReceiptText,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Budgets",
    url: "/dashboard/budgets",
    icon: PiggyBank,
  },
  {
    title: "Expenses",
    url: "/dashboard/expenses",
    icon: ReceiptText,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

function AppSideBar() {
  const { openUserProfile } = useClerk();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/"}>
                <Image
                  alt="profile image"
                  height={30}
                  width={30}
                  className="rounded-full"
                  src={"/logo.png"}
                />
                <span>Expense Tracker</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="flex gap-3" key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.title == "Settings" ? (
                      <button
                        onClick={() => openUserProfile()}
                        className="flex gap-3 items-center"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    ) : (
                      <Link className="flex gap-3 items-center" href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                  {item.title === "Inbox" && (
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <UserButton />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSideBar;
