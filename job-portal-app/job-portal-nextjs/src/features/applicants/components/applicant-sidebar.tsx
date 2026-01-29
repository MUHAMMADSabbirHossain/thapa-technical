"use client";

import { applicantNavItems } from "@/config/constant";
import { logoutUserAction } from "@/features/auth/server/auth.actions";
import { isActiveLink } from "@/lib/navigation.utils";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ApplicantSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-card border-r border-border fixed bottom-0 top-0">
      <div className="p-6 ">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Applicants Dashboard
        </h2>
      </div>

      <nav className="px-3 space-y-1">
        {applicantNavItems.map((item) => {
          const Icon = item?.icon;
          const active = isActiveLink(pathname, item?.href, item?.exact);

          return (
            <Link
              key={item?.name}
              href={item?.href || "#"}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                active
                  ? "text-primary bg-primary/10" // Note: bg-blue-300 might be too dard, added opacity or stick to your class
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              <Icon />
              {item?.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-3 right-3">
        <button
          onClick={logoutUserAction}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Log-out
        </button>
      </div>
    </div>
  );
};

export default ApplicantSidebar;
