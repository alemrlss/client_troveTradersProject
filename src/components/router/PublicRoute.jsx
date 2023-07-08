import { Navigate, Outlet } from "react-router-dom";
import { HOME } from "../../routes/paths";
import { useAuthContext } from "../../contexts/authContext";
export default function PublicRoute() {
  const { isAuthenticated } = useAuthContext();


  if (isAuthenticated) {
    return <Navigate to={HOME} />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
