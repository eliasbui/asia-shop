import { DashboardCard } from '@/components/seller/dashboard/dashboard-card';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">Export revenue, fees, and tax breakdowns.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Monthly gross" value="$12,890" />
        <DashboardCard title="Net payout" value="$11,234" />
        <DashboardCard title="Platform fees" value="$1,656" />
        <DashboardCard title="Refund ratio" value="2.1%" trend="down" delta={-0.3} />
      </div>
      <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
        Detailed charts and export actions go here.
      </div>
    </div>
  );
}
