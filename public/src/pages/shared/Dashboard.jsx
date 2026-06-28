import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/Auth/AuthContext";
import AppLayout from "@/Components/layout/AppLayout";
import AdminDashboard from "@/dashboard/Admin";
import SuperAdminDashboard from "@/dashboard/SuperAdmin";
import UserDashboard from "@/dashboard/User";
const Dashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  

  const dashboardRules = {
    user: <UserDashboard />,
    admin: <AdminDashboard />,
    superadmin: <SuperAdminDashboard navigate={navigate} />,
  };

  return <AppLayout page="dashboard">{dashboardRules[user?.role]}</AppLayout>;
};

export default Dashboard;
