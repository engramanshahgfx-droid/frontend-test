import { useRole } from '@/lib/useRole';

/**
 * PermissionCheck component for conditionally rendering UI based on permissions
 * 
 * Usage:
 *   <PermissionCheck permissions={['edit_island_destinations']}>
 *     <button>Edit</button>
 *   </PermissionCheck>
 * 
 * With fallback:
 *   <PermissionCheck permissions={['admin']} fallback={<p>No access</p>}>
 *     <button>Admin Action</button>
 *   </PermissionCheck>
 * 
 * Require all permissions:
 *   <PermissionCheck permissions={['view', 'create']} requireAll>
 *     <button>View and Create</button>
 *   </PermissionCheck>
 * 
 * Check roles:
 *   <PermissionCheck roles={['executive_manager']}>
 *     <button>Executive Only</button>
 *   </PermissionCheck>
 */
export function PermissionCheck({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
  fallback = null,
}) {
  const { hasPermission, hasRole, hasAllPermissions, hasAllRoles } = useRole();

  const hasAccess = () => {
    // Check permissions
    if (permissions.length > 0) {
      if (requireAll) {
        return hasAllPermissions(permissions);
      } else {
        return permissions.some(p => hasPermission(p));
      }
    }

    // Check roles
    if (roles.length > 0) {
      if (requireAll) {
        return hasAllRoles(roles);
      } else {
        return roles.some(r => hasRole(r));
      }
    }

    // If no checks specified, show content
    return true;
  };

  if (!hasAccess()) {
    return fallback;
  }

  return children;
}

export default PermissionCheck;
