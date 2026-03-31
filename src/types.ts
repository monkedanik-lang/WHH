export interface Location {
  id: string;
  name: string;
  description?: string;
  updatedAt: number;
}

export interface WarehouseItem {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  minQuantity?: number;
  unit?: string;
  specs?: string;
  weight?: string;
  category: string;
  subclass: string;
  location: string;
  description: string;
  lastChecked?: string;
  imageUrl?: string;
  imageUrls?: string[];
  updatedAt: number;
}

export type ItemFormData = Omit<WarehouseItem, 'id' | 'updatedAt'>;
