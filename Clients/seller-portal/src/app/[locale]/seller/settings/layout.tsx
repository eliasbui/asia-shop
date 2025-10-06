import { SettingsTabs } from '@/components/seller/settings/settings-tabs';

export default function SettingsLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage sellers, staff, and RBAC policies.</p>
      </div>
      <SettingsTabs locale={params.locale}>{children}</SettingsTabs>
    </div>
  );
}
