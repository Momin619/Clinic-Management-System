import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";
const ProtectedRoutes = () =>
{
  const { user, authChecked } = useAuth();

  if (!authChecked)
  {
    return <Loader />
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;