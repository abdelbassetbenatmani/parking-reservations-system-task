import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuditLogEntry {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: any;
  timestamp: string;
}

interface AdminStore {
  auditLog: AuditLogEntry[];
  addAuditLog: (entry: AuditLogEntry) => void;
  clearAuditLog: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      auditLog: [],
      addAuditLog: (entry) =>
        set((state) => ({
          auditLog: [...state.auditLog, entry].slice(-50), // Keep last 50 entries
        })),
      clearAuditLog: () => set({ auditLog: [] }),
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({ auditLog: state.auditLog }),
    }
  )
);