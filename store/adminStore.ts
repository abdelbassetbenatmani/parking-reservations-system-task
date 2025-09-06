import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminStore {
  currentAdmin: { id: string; username: string; role: string } | null;
  setCurrentAdmin: (admin: { id: string; username: string; role: string } | null) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      currentAdmin: null,
      setCurrentAdmin: (admin) => set({ currentAdmin: admin }),
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({ currentAdmin: state.currentAdmin }),
    }
  )
);