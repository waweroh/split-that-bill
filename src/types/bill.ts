export interface BillItem {
  id: number;
  name: string;
  price: number;
}

export interface Bill {
  restaurant: string;
  date: string;
  items: BillItem[];
  tax: number;
  tip: number;
}
