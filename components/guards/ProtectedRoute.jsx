import { useRouter } from 'next/navigation';
import { useRole } from '@/lib/useRole';
import { useEffect } from 'react';
import Loading from '@/components/Loading';

/**
 * ProtectedRoute component for protecting pages based on permissions
 * 
 * Usage:
 *   <ProtectedRoute permissions={['view_island_destinations', 'edit_island_destinations']}>
 *     <MyPage />
 *   </ProtectedRoute>
 * 
 * With role requirement:
 *   <ProtectedRoute roles={['executive_manager', 'consultant']}>
 *     <MyPage />
 *   </ProtectedRoute>
 * 
 * With all required:
 *   <ProtectedRoute permissions={['view_X']} requireAll>
 *     <MyPage />
 *   </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
  fallback = null,
  redirectTo = '/login',
}) {
  const router = useRouter();
  const { isAuthenticated, hasPermission, hasRole, hasAllPermissions, hasAllRoles } = useRole();

  const hasAccess = () => {
    // If not authenticated, no access
    if (!isAuthenticated) {
      return false;
    }

    // If specific permissions required
    if (permissions.length > 0) {
      if (requireAll) {
        return hasAllPermissions(permissions);
      } else {
        return permissions.some(p => hasPermission(p));
      }
    }

    // If specific roles required
    if (roles.length > 0) {
      if (requireAll) {
        return hasAllRoles(roles);
      } else {
        return roles.some(r => hasRole(r));
      }
    }

    // If neither specified, require authentication only
    return isAuthenticated;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (!hasAccess()) {
      router.push('/unauthorized');
      return;
    }
  }, [isAuthenticated, hasAccess, router, redirectTo]);

  // Show fallback while checking permissions
  if (!isAuthenticated || !hasAccess()) {
    return fallback || <Loading />;
  }

  return children;
}

export default ProtectedRoute;
