export interface IGate {
  id: string;
  name: string;
  location: string;
  zoneIds: string[];
}

export type IZone = {
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


export interface ICategory {
  id: string;
  name: string;
  rateNormal: number;
  rateSpecial: number;
}
