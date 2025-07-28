import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AdminRouteGuardProps {
  children: ReactNode;
}

const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user && user.type === "admin";

  useEffect(() => {
    // Only redirect after auth state is loaded and if user is not an admin
    // Prevent redirect loop if already on login page
    if (!isLoading && !isAdmin) {
      if (location.pathname !== "/admin-login") {
        navigate("/admin-login");
      }
    }
  }, [isAdmin, isLoading, navigate, location]);

  // Show nothing while loading or redirecting
  if (isLoading || !isAdmin) {
    return null;
  }

  // If we get here, the user is an admin
  return <>{children}</>;
};

export default AdminRouteGuard;
