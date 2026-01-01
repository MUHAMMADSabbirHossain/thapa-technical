import { logoutUserAction } from "@/features/auth/server/auth.actions";

const applicantDashboard = () => {
  return (
    <div>
      <h1>applicantDashboard</h1>
      <button onClick={logoutUserAction}>Logout</button>
    </div>
  );
};

export default applicantDashboard;
