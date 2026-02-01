import Link from 'next/link';
import PermissionCheck from '@/components/guards/PermissionCheck';
import { useRole } from '@/lib/useRole';

export default function AdminNav() {
  const { isExecutiveManager, isConsultant } = useRole();

  return (
    <nav>
      <ul>
        {(isExecutiveManager || isConsultant) && (
          <li>
            <Link href="/admin/island-destinations">Islands</Link>
          </li>
        )}

        <PermissionCheck permissions={["view_contacts"]}>
          <li>
            <Link href="/admin/contacts">Communications</Link>
          </li>
        </PermissionCheck>

        <PermissionCheck permissions={["view_bookings"]}>
          <li>
            <Link href="/admin/bookings">Bookings</Link>
          </li>
        </PermissionCheck>

      </ul>
    </nav>
  );
}
