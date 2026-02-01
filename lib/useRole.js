import { useContext, useMemo } from 'react';
import { AuthContext } from '@/providers/AuthProvider';

/**
 * Hook to check user roles and permissions
 * 
 * Usage:
 *   const { hasRole, hasPermission, can, roles, permissions } = useRole();
 *   
 *   if (hasRole('executive_manager')) { ... }
 *   if (hasPermission('view_island_destinations')) { ... }
 *   if (can('create_offers')) { ... }
 */
export function useRole() {
  const ctx = useContext(AuthContext) || {};
  const { user, roles = [], permissions = [] } = ctx;

  const roleSet = useMemo(() => new Set(roles), [roles]);
  const permissionSet = useMemo(() => new Set(permissions), [permissions]);

  return {
    /**
     * Check if user has a specific role
     */
    hasRole: (role) => roleSet.has(role),

    /**
     * Check if user has a specific permission
     */
    hasPermission: (permission) => permissionSet.has(permission),

    /**
     * Alias for hasPermission (convenience method)
     */
    can: (permission) => permissionSet.has(permission),

    /**
     * Check if user has any of the given roles
     */
    hasAnyRole: (roleList) => roleList.some(r => roleSet.has(r)),

    /**
     * Check if user has all of the given roles
     */
    hasAllRoles: (roleList) => roleList.every(r => roleSet.has(r)),

    /**
     * Check if user has any of the given permissions
     */
    hasAnyPermission: (permissionList) => permissionList.some(p => permissionSet.has(p)),

    /**
     * Check if user has all of the given permissions
     */
    hasAllPermissions: (permissionList) => permissionList.every(p => permissionSet.has(p)),

    /**
     * Get all user roles
     */
    roles: roles || [],

    /**
     * Get all user permissions
     */
    permissions: permissions || [],

    /**
     * Get the user object
     */
    user,

    /**
     * Check if user is authenticated
     */
    isAuthenticated: !!user,

    /**
     * Check if user is an admin (legacy is_admin field)
     */
    isAdmin: user?.is_admin || false,

    /**
     * Check if user is executive manager with full access
     */
    isExecutiveManager: roleSet.has('executive_manager'),

    /**
     * Check if user is consultant with medium access
     */
    isConsultant: roleSet.has('consultant'),

    /**
     * Check if user is administration with limited access
     */
    isAdministration: roleSet.has('administration'),
  };
}

export default useRole;
