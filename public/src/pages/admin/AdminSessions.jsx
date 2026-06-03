import { useAuthContext } from "@/context/Auth/AuthContext";

const AdminSessions = () => {
  const { user } = useAuthContext();

  return <div className="">admin sessions {user?.role}</div>;
};

export default AdminSessions;
