import { logoutUserAction } from "@/features/auth/server/auth.actions";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";

const applicantDashboard = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>applicantDashboard</h1>
      <button onClick={logoutUserAction}>Logout</button>
    </div>
  );
};

export default applicantDashboard;
