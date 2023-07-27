import { Navigate, Outlet } from "react-router-dom";
import { LOGIN } from "../../routes/paths";
import { useAuthContext } from "../../contexts/authContext";
import { SocketProvider } from "../../contexts/socketContext";
import NavBar from "../NavBar/NavBar";
import NavBarr from "../NavBar/NavBarr";

export default function PrivateRoute() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to={LOGIN} />;
  }
  return (
    //! SE LE COLOCA EL PROVIDER DE CONEXTO DE SOCKETS(SERVIDOR) SOLO PARA LAS RUTAS PRIVADAS..
    <SocketProvider>
      <div>
       <NavBarr/>
        <Outlet />
      </div>
    </SocketProvider>
  );
}
