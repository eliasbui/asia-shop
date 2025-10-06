"use client";

import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabs = [
  { value: 'profile', label: 'Profile', href: 'profile' },
  { value: 'staff', label: 'Staff', href: 'staff' },
  { value: 'permissions', label: 'Permissions', href: 'permissions' }
];

export function SettingsTabs({ children, locale }: { children: React.ReactNode; locale: string }) {
  const segments = useSelectedLayoutSegments();
  const active = segments.slice(-1)[0] ?? 'profile';

  return (
    <Tabs defaultValue={active} value={active} className="w-full">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} asChild>
            <Link href={`/${locale}/seller/settings/${tab.href}`}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={active}>{children}</TabsContent>
    </Tabs>
  );
}
