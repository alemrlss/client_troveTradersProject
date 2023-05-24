/* eslint-disable react/prop-types */
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthorized, redirectTo = "/login" }) => {

  if(!isAuthorized) { 
    return <Navigate to={redirectTo} replace/>
  }
  return <Outlet/>

};

export default ProtectedRoute;
