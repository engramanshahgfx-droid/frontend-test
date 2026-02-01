import ProtectedRoute from '@/components/guards/ProtectedRoute';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminIslandsPage() {
  return (
    // Islands page is protected for exec managers and consultants
    <ProtectedRoute roles={["executive_manager", "consultant"]}>
      <div>
        <h1>Island Destinations</h1>
        <AdminNav />
        <p>Island destinations admin panel (placeholder).</p>
      </div>
    </ProtectedRoute>
  );
}
