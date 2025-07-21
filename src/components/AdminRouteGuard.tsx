import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AdminRouteGuardProps {
  children: ReactNode;
}

const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after auth state is loaded and if user is not an admin
    if (!isLoading && !isAdmin) {
      navigate('/admin-login');
    }
  }, [isAdmin, isLoading, navigate]);

  // Show nothing while loading or redirecting
  if (isLoading || !isAdmin) {
    return null;
  }

  // If we get here, the user is an admin
  return <>{children}</>;
};

export default AdminRouteGuard;