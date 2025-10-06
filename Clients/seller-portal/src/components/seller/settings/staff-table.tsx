import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'invited' | 'active';
}

interface StaffTableProps {
  staff: StaffMember[];
  onInvite: () => void;
}

export function StaffTable({ staff, onInvite }: StaffTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Staff</h3>
        <Button size="sm" onClick={onInvite}>
          Invite staff
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell className="font-mono text-xs">
                {maskEmail(member.email)}
              </TableCell>
              <TableCell className="capitalize">{member.role}</TableCell>
              <TableCell>
                <Badge variant={member.status === 'active' ? 'success' : 'warning'}>{member.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  const maskedUser = user.length <= 2 ? `${user[0]}*` : `${user.slice(0, 2)}***`;
  return `${maskedUser}@${domain}`;
}
