import { IZone } from "@/services/types";
import { create } from "zustand";


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
  zones: IZone[];
  connectionStatus: "connected" | "disconnected" | "connecting";
  ticket: Ticket | null;
  ticketModalOpen: boolean;
  setGate: (gate: Gate) => void;
  setZones: (zones: IZone[]) => void;
  setConnectionStatus: (status: StoreState["connectionStatus"]) => void;
  openTicketModal: (ticket: Ticket) => void;
  closeTicketModal: () => void;
  updateZone: (zone: IZone) => void;
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