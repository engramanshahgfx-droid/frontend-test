import ProtectedRoute from '@/components/guards/ProtectedRoute';
import PermissionCheck from '@/components/guards/PermissionCheck';

export default function AdminBookingsPage() {
  return (
    <ProtectedRoute permissions={["view_bookings"]}>
      <div>
        <h1>Bookings</h1>

        <PermissionCheck permissions={["manage_bookings"]} fallback={<p>Read only access to bookings.</p>}>
          <button>Manage Bookings</button>
        </PermissionCheck>

        <p>Bookings management placeholder.</p>
      </div>
    </ProtectedRoute>
  );
}
