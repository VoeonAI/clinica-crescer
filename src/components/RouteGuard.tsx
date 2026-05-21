import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('master' | 'editor' | 'viewer')[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requireAuth = false, 
  allowedRoles 
}) => {
  const { user, loading, profile } = useAuth();
  const location = useLocation();

  // Timeout de segurança para evitar loading infinito
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn('RouteGuard loading timeout - forcing render');
        setLoadingTimeout(true);
      }
    }, 5000); // 5 segundos de timeout

    return () => clearTimeout(timer);
  }, [loading]);

  // Se timeout atingiu, mostra conteúdo mesmo que loading ainda seja true
  if (loading && !loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  // Se precisa de autenticação e não tem usuário
  if (requireAuth && !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Se tem restrição de roles
  if (allowedRoles) {
    if (!profile) {
      // Se profile ainda não carregou, permite acesso (não bloqueia login)
      return <>{children}</>;
    }
    if (!allowedRoles.includes(profile.role)) {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};