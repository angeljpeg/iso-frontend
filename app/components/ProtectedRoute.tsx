import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, usuario } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div className="loading-spinner">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles && !requiredRoles.includes(usuario?.rol || '')) {
    navigate('/dashboard');
    return null;
  }

  return <>{children}</>;
}