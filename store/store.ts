import { create } from "zustand";

export type Zone = {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  occupied: number;
  free: number;
  reserved: number;
  availableForVisitors: number;
  availableForSubscribers: number;
  rateNormal: number;
  rateSpecial: number;
  open: boolean;
  specialActive?: boolean;
};

export type Gate = {
  id: string;
  name: string;
  location: string;
};

export type Ticket = {
  id: string;
  type: string;
  zoneId: string;
  gateId: string;
  checkinAt: string;
};

type StoreState = {
  gate: Gate | null;
  zones: Zone[];
  connectionStatus: "connected" | "disconnected" | "connecting";
  ticket: Ticket | null;
  ticketModalOpen: boolean;
  setGate: (gate: Gate) => void;
  setZones: (zones: Zone[]) => void;
  setConnectionStatus: (status: StoreState["connectionStatus"]) => void;
  openTicketModal: (ticket: Ticket) => void;
  closeTicketModal: () => void;
  updateZone: (zone: Zone) => void;
};

export const useGateStore = create<StoreState>((set) => ({
  gate: null,
  zones: [],
  connectionStatus: "connecting",
  ticket: null,
  ticketModalOpen: false,
  setGate: (gate) => set({ gate }),
  setZones: (zones) => set({ zones }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  openTicketModal: (ticket) => set({ ticket, ticketModalOpen: true }),
  closeTicketModal: () => set({ ticket: null, ticketModalOpen: false }),
  updateZone: (zone) =>
    set((state) => ({
      zones: state.zones.map((z) => (z.id === zone.id ? zone : z)),
    })),
}));