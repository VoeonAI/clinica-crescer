import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionGateProps {
  children: React.ReactNode;
  allowedRoles?: ('master' | 'editor' | 'viewer')[];
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({ 
  children, 
  allowedRoles, 
  fallback = null 
}) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <>{fallback}</>;
  }

  // Se não tem perfil definido, não tem permissão
  if (!profile) {
    return <>{fallback}</>;
  }

  // Se não tem roles definidos, permite visualização para authenticated users
  if (!allowedRoles) {
    return <>{children}</>;
  }

  // Verifica se o role do usuário está na lista permitida
  if (allowedRoles.includes(profile.role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};