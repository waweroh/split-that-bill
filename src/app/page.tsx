import BillSplitter from "@/components/bill-splitter";

export default function Home() {
  // Sample bill data - now with individual items instead of quantities
  const billData = {
    restaurant: "Pasta Palace",
    date: "2023-04-07",
    items: [
      { id: 1, name: "Margherita Pizza", price: 12.99 },
      { id: 2, name: "Margherita Pizza", price: 12.99 },
      { id: 3, name: "Spaghetti Carbonara", price: 14.5 },
      { id: 4, name: "Spaghetti Carbonara", price: 14.5 },
      { id: 5, name: "Spaghetti Carbonara", price: 14.5 },
      { id: 6, name: "Caesar Salad", price: 8.75 },
      { id: 7, name: "Caesar Salad", price: 8.75 },
      { id: 8, name: "Garlic Bread", price: 4.5 },
      { id: 9, name: "Tiramisu", price: 6.99 },
      { id: 10, name: "Tiramisu", price: 6.99 },
      { id: 11, name: "Sparkling Water", price: 3.5 },
      { id: 12, name: "Sparkling Water", price: 3.5 },
      { id: 13, name: "Sparkling Water", price: 3.5 },
      { id: 14, name: "Sparkling Water", price: 3.5 },
    ],
    tax: 5.25,
    tip: 15.0,
  };

  return (
    <main className='min-h-screen p-4 md:p-8 max-w-3xl mx-auto'>
      <h1 className='text-2xl md:text-3xl font-bold mb-6'>Bill Splitter</h1>
      <BillSplitter bill={billData} />
    </main>
  );
}
