import ProtectedRoute from '@/components/guards/ProtectedRoute';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminIndex() {
  return (
    <ProtectedRoute roles={["executive_manager", "consultant", "super_admin"]}>
      <div>
        <h1>Admin Dashboard</h1>
        <AdminNav />
        <p>Welcome to the admin dashboard. Use the links above to navigate.</p>
      </div>
    </ProtectedRoute>
  );
}
