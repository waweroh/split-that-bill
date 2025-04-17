export interface BillItem {
  id: number | string
  name: string
  price: number
}

export interface Bill {
  restaurant: string
  date: string
  items: BillItem[]
}
