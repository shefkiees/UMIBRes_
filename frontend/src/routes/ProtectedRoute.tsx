import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: UserRole;
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && session?.user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
