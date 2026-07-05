import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import ThemeDropdown from "./ThemeDropdown";
function DashboardNavbar() {
  return (
    <nav className="flex p-4 border-b justify-between items-center w-full">
      <SidebarTrigger />
      <div className="flex gap-4 items-center">
        <ThemeDropdown />
        <UserButton />
      </div>
    </nav>
  );
}

export default DashboardNavbar;
