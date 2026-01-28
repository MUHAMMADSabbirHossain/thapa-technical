"use client";

import { logoutUserAction } from "@/features/auth/server/auth.actions";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Briefcase,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { URLPattern } from "next/server";

const base = "/dashboard";

const naviagtionItems = [
  {
    name: "Home",
    icon: LayoutDashboard,
    href: base + "/",
  },
  {
    name: "Find Jobs",
    icon: Search,
    href: base + "/find-jobs",
  },
  {
    name: "Applied",
    icon: Briefcase,
    href: base + "/applications",
  },
  { name: "Save Jobs", icon: Bookmark, href: base + "/saved-jobs" },
  { name: "Settings", icon: Settings, href: base + "/settings" },
];

const ApplicantSidebar = () => {
  const pathname = usePathname();
  //   console.log("pathname: ", pathname);

  // to check the link of the matching sidebar
  function isLinkActive({
    href,
    pathname,
    base = "/",
  }: {
    href: string;
    pathname: string;
    base?: string;
  }) {
    const normalizedHref = href.replace(/\/$/, "") || "/";

    // URLPattern is a built-in browser API that lets you define URL matching patterns using a template-like syntax.

    const pattern = new URLPattern({
      pathname: normalizedHref === base ? base : `${normalizedHref}{/*}?`,
    });
    // console.log("pattern: ", pattern);
    // console.log("inside: ", pattern.test({ pathname }));

    return pattern.test({ pathname });
  }

  return (
    <div className="w-64 bg-card border-r border-border fixed bottom-0 top-0">
      <div className="p-6 ">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Applicants Dashboard
        </h2>
      </div>

      <nav className="">
        {naviagtionItems.map((curNav) => {
          const Icon = curNav?.icon;
          return (
            <Link
              key={curNav?.name}
              href={curNav?.href || "#"}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isLinkActive({
                  href: curNav?.href || "",
                  pathname,
                  base: "/dashboard",
                }) && "text-primary bg-blue-300",
              )}
            >
              <Icon />
              {curNav?.name}
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
