import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Role = 'owner' | 'manager' | 'staff' | 'accountant';

interface AuthState {
  token: string | null;
  roles: Role[];
  stores: Array<{ id: string; name: string; default?: boolean }>;
  activeStoreId: string | null;
  setToken: (token: string | null) => void;
  setRoles: (roles: Role[]) => void;
  setStores: (stores: AuthState['stores']) => void;
  switchStore: (storeId: string) => void;
  reset: () => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      roles: ['owner'],
      stores: [],
      activeStoreId: null,
      setToken: (token) => set({ token }),
      setRoles: (roles) => set({ roles }),
      setStores: (stores) =>
        set({
          stores,
          activeStoreId: stores.find((store) => store.default)?.id ?? stores[0]?.id ?? null
        }),
      switchStore: (storeId) => {
        const exists = get().stores.some((store) => store.id === storeId);
        if (exists) {
          set({ activeStoreId: storeId });
        }
      },
      reset: () => set({ token: null, roles: [], stores: [], activeStoreId: null })
    }),
    {
      name: 'seller-auth',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => undefined,
              removeItem: () => undefined
            }
      ),
      partialize: ({ token, roles, stores, activeStoreId }) => ({
        token,
        roles,
        stores,
        activeStoreId
      })
    }
  )
);

export const hasPermission = (permission: string) => {
  const roleMap: Record<Role, string[]> = {
    owner: ['*'],
    manager: ['products.view', 'products.edit', 'orders.view', 'orders.edit', 'reports.view'],
    staff: ['orders.view', 'orders.edit', 'chat.view'],
    accountant: ['payouts.view', 'reports.view']
  };

  const { roles } = authStore.getState();

  return roles.some((role) => roleMap[role]?.includes('*') || roleMap[role]?.includes(permission));
};
