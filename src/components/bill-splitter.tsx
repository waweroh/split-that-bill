"use client";

import { useState } from "react";
import type { Bill } from "@/types/bill";
import BillItemRow from "./bill-item";
import BillSummary from "./bill-summary";
import RunningTotal from "./running-total";

interface BillSplitterProps {
  bill: Bill;
}

export default function BillSplitter({ bill }: BillSplitterProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [message, setMessage] = useState<string>("");

  const toggleItemSelection = (itemId: number) => {
    setSelectedItemIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });

    // Clear any existing message when selections change
    if (message) {
      setMessage("");
    }
  };

  const calculateUserTotal = () => {
    // Calculate subtotal of selected items
    const subtotal = selectedItemIds.reduce((total, itemId) => {
      const item = bill.items.find((i) => i.id === itemId);
      return total + (item ? item.price : 0);
    }, 0);

    // Calculate proportional tax and tip
    const billSubtotal = bill.items.reduce((sum, item) => sum + item.price, 0);
    const taxRatio = subtotal / billSubtotal;
    const proportionalTax = bill.tax * taxRatio;
    const proportionalTip = bill.tip * taxRatio;

    return {
      subtotal,
      tax: proportionalTax,
      tip: proportionalTip,
      total: subtotal + proportionalTax + proportionalTip,
    };
  };

  const handleSettleBill = () => {
    const totals = calculateUserTotal();
    const selectedItems = selectedItemIds.map((itemId) => {
      const item = bill.items.find((i) => i.id === itemId);
      return `${item?.name} ($${item?.price.toFixed(2)})`;
    });

    const newMessage = `
My portion of the bill from ${bill.restaurant}:
${selectedItems.join("\n")}

Subtotal: $${totals.subtotal.toFixed(2)}
Tax: $${totals.tax.toFixed(2)}
Tip: $${totals.tip.toFixed(2)}
Total: $${totals.total.toFixed(2)}
    `.trim();

    setMessage(newMessage);
  };

  return (
    <div className='flex flex-col border rounded-lg shadow-sm relative'>
      <div className='p-4 border-b bg-muted/40'>
        <h2 className='text-xl font-semibold'>{bill.restaurant}</h2>
        <p className='text-sm text-muted-foreground'>Date: {bill.date}</p>
      </div>

      <div className='divide-y'>
        <div className='px-4 py-2 bg-muted/20 flex justify-between font-medium'>
          <div>Item</div>
          <div>Price</div>
        </div>

        {bill.items.map((item) => (
          <BillItemRow
            key={item.id}
            item={item}
            isSelected={selectedItemIds.includes(item.id)}
            onToggleSelection={() => toggleItemSelection(item.id)}
          />
        ))}
      </div>

      <BillSummary
        bill={bill}
        userTotals={calculateUserTotal()}
        onSettleBill={handleSettleBill}
        message={message}
      />

      <RunningTotal
        itemCount={selectedItemIds.length}
        total={calculateUserTotal().total}
      />
    </div>
  );
}
