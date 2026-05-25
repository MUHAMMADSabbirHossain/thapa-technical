import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { Briefcase, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { logoutUserAction } from "@/features/auth/server/auth.actions";

function Navbar() {
  const user = getCurrentUser();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-blue-600"
        >
          <Briefcase className="h-6 w-6" />
          job
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">
            Find Job
          </Link>
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Employers
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Post a Job</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link
                  href={
                    user?.role === "employer"
                      ? "/employer-dashboard"
                      : "/dashboard/settings"
                  }
                >
                  Dashboard
                </Link>
              </Button>

              <form action={logoutUserAction}>
                <Button
                  variant="ghost"
                  type="submit"
                  size="icon"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5 text-gray-600 hover:text-red-600 transition-colors" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
