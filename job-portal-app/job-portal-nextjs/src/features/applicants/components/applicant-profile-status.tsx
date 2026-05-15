import { Button } from "@/components/ui/button";
import { ArrowRight, UserCircle } from "lucide-react";
import Link from "next/link";

function ApplicantProfileStatus() {
  // You can add logic here later: if (user?.profileCompleted) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-red-500 p-6 text-white shadow-md">
      {/* Decorative Circles (Optional visual flair) */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
      <div className="absolute right-20 bottom-[-50px] h-24 w-24 rounded-full bg-white/10"></div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-400">
            <UserCircle className="h-10 w-10 text-white" />
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Your profile editing is not completed.
            </h3>
            <p className="text-red-100 text-sm mt-1">
              Complete your profile editing & build your custom Resume to get
              better job recommendations.
            </p>
          </div>
        </div>

        <Link href="/dashboard/settings">
          <Button
            variant={"secondary"}
            className="whitespace-nowrap bg-white text-red-600 hover:bg-gray-100 font-semibold"
          >
            Edit Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ApplicantProfileStatus;
