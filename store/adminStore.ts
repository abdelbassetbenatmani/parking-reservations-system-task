import { create } from "zustand";

type AuditLogEntry = {
  timestamp: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: any;
};

type AdminState = {
  auditLog: AuditLogEntry[];
  addAuditLog: (entry: AuditLogEntry) => void;
  clearAuditLog: () => void;
};

export const useAdminStore = create<AdminState>((set) => ({
  auditLog: [],
  addAuditLog: (entry) =>
    set((state) => ({
      auditLog: [entry, ...state.auditLog].slice(0, 20),
    })),
  clearAuditLog: () => set({ auditLog: [] }),
}));