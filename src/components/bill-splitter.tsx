"use client";

import { useState } from "react";
import type { Bill } from "@/types/bill";
import BillItemRow from "./bill-item";
import BillSummary from "./bill-summary";
import RunningTotal from "./running-total";
import ItemDetailView from "./item-detail";

interface BillSplitterProps {
  bill: Bill;
}

// Interface for grouped items
interface GroupedItem {
  name: string;
  price: number;
  count: number;
  ids: number[];
}

export default function BillSplitter({ bill }: BillSplitterProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [detailViewItem, setDetailViewItem] = useState<GroupedItem | null>(
    null
  );

  // Group identical items
  const groupedItems = bill.items.reduce<GroupedItem[]>((acc, item) => {
    const existingGroup = acc.find(
      (group) => group.name === item.name && group.price === item.price
    );

    if (existingGroup) {
      existingGroup.count += 1;
      existingGroup.ids.push(item.id);
    } else {
      acc.push({
        name: item.name,
        price: item.price,
        count: 1,
        ids: [item.id],
      });
    }

    return acc;
  }, []);

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

  const toggleAllInGroup = (groupIds: number[], select: boolean) => {
    setSelectedItemIds((prev) => {
      const filtered = prev.filter((id) => !groupIds.includes(id));
      return select ? [...filtered, ...groupIds] : filtered;
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

    // Calculate balance (subtotal - amount paid)
    const balance = subtotal - amountPaid;

    return {
      subtotal,
      amountPaid,
      balance,
    };
  };

  const handleAmountPaidChange = (amount: number) => {
    setAmountPaid(amount);
    // Clear any existing message when amount paid changes
    if (message) {
      setMessage("");
    }
  };

  const handleSettleBill = () => {
    const totals = calculateUserTotal();

    // Group selected items by name for a cleaner message
    const selectedItemsMap = new Map<
      string,
      { count: number; price: number }
    >();

    selectedItemIds.forEach((itemId) => {
      const item = bill.items.find((i) => i.id === itemId);
      if (item) {
        const key = `${item.name} ($${item.price.toFixed(2)})`;
        if (selectedItemsMap.has(key)) {
          selectedItemsMap.get(key)!.count += 1;
        } else {
          selectedItemsMap.set(key, { count: 1, price: item.price });
        }
      }
    });

    const selectedItemsText = Array.from(selectedItemsMap.entries())
      .map(([name, { count }]) => `${count}x ${name}`)
      .join("\n");

    const balanceStatus =
      totals.balance > 0
        ? "You still owe $" + totals.balance.toFixed(2)
        : totals.balance < 0
        ? "You overpaid by $" + Math.abs(totals.balance).toFixed(2)
        : "Your bill is fully paid";

    const newMessage = `
My portion of the bill from ${bill.restaurant}:
${selectedItemsText}

Subtotal: $${totals.subtotal.toFixed(2)}
Amount Paid: $${totals.amountPaid.toFixed(2)}
Balance: $${totals.balance.toFixed(2)}

${balanceStatus}
    `.trim();

    setMessage(newMessage);
  };

  const openDetailView = (groupedItem: GroupedItem) => {
    setDetailViewItem(groupedItem);
  };

  const closeDetailView = () => {
    setDetailViewItem(null);
  };

  // If detail view is open, show that instead of the main view
  if (detailViewItem) {
    return (
      <ItemDetailView
        groupedItem={detailViewItem}
        selectedIds={selectedItemIds}
        onToggleSelection={toggleItemSelection}
        onClose={closeDetailView}
        bill={bill}
      />
    );
  }

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

        {groupedItems.map((group) => (
          <BillItemRow
            key={group.name + group.price}
            groupedItem={group}
            selectedCount={
              group.ids.filter((id) => selectedItemIds.includes(id)).length
            }
            onOpenDetailView={() => openDetailView(group)}
            onToggleAll={(select) => toggleAllInGroup(group.ids, select)}
          />
        ))}
      </div>

      <BillSummary
        bill={bill}
        userTotals={calculateUserTotal()}
        onSettleBill={handleSettleBill}
        message={message}
        onAmountPaidChange={handleAmountPaidChange}
      />

      <RunningTotal
        itemCount={selectedItemIds.length}
        total={calculateUserTotal().subtotal}
        balance={calculateUserTotal().balance}
      />
    </div>
  );
}
