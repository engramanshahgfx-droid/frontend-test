import ProtectedRoute from '@/components/guards/ProtectedRoute';
import PermissionCheck from '@/components/guards/PermissionCheck';

export default function AdminContactsPage() {
  return (
    <ProtectedRoute permissions={["view_contacts"]}>
      <div>
        <h1>Communications (Contacts)</h1>

        <PermissionCheck permissions={["manage_contacts"]} fallback={<p>You can view contacts but cannot manage them.</p>}>
          <button>Edit Contacts</button>
        </PermissionCheck>

        <p>List of contact messages and contact management tools (placeholder).</p>
      </div>
    </ProtectedRoute>
  );
}
