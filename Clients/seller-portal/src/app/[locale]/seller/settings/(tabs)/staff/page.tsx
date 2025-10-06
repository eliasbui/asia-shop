import { StaffTable } from '@/components/seller/settings/staff-table';

const staff = [
  { id: 'staff-1', name: 'Mai Tran', email: 'mai.tran@asiashop.com', role: 'manager', status: 'active' },
  { id: 'staff-2', name: 'Hoang Le', email: 'hoang.le@asiashop.com', role: 'staff', status: 'invited' }
];

export default function SettingsStaffPage() {
  return <StaffTable staff={staff} onInvite={() => undefined} />;
}
