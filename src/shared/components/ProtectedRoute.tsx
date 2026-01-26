import { Navigate } from "react-router-dom";
import { hasToken } from "../../api/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!hasToken()) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};
