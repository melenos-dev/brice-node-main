import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const RequireAuth = ({ allowedRoles }) => {
  const { auth, isAllowed } = useAuth();
  const location = useLocation();

  return isAllowed(allowedRoles) ? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate to="/404" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
