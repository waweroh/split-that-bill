"use client";

import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Bill } from "@/types/bill";

interface GroupedItem {
  name: string;
  price: number;
  count: number;
  ids: number[];
}

interface ItemDetailViewProps {
  groupedItem: GroupedItem;
  selectedIds: number[];
  onToggleSelection: (id: number) => void;
  onClose: () => void;
  bill: Bill;
}

export default function ItemDetailView({
  groupedItem,
  selectedIds,
  onToggleSelection,
  onClose,
  bill,
}: ItemDetailViewProps) {
  const items = groupedItem.ids.map((id) => {
    const item = bill.items.find((item) => item.id === id)!;
    return {
      id,
      name: item.name,
      price: item.price,
      isSelected: selectedIds.includes(id),
    };
  });

  const allSelected = items.every((item) => item.isSelected);
  const someSelected = items.some((item) => item.isSelected);

  const handleSelectAll = () => {
    items.forEach((item) => {
      if (!item.isSelected) {
        onToggleSelection(item.id);
      }
    });
  };

  const handleDeselectAll = () => {
    items.forEach((item) => {
      if (item.isSelected) {
        onToggleSelection(item.id);
      }
    });
  };

  return (
    <div className='flex flex-col border rounded-lg shadow-sm'>
      <div className='p-4 border-b bg-muted/40 flex items-center'>
        <Button variant='ghost' size='icon' onClick={onClose} className='mr-2'>
          <ArrowLeft className='h-4 w-4' />
          <span className='sr-only'>Back</span>
        </Button>
        <div>
          <h2 className='text-xl font-semibold'>{groupedItem.name}</h2>
          <p className='text-sm text-muted-foreground'>
            ${groupedItem.price.toFixed(2)} each
          </p>
        </div>
      </div>

      <div className='p-4 flex justify-between'>
        <span className='text-sm font-medium'>Select individual items</span>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleSelectAll}
            disabled={allSelected}
          >
            Select All
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleDeselectAll}
            disabled={!someSelected}
          >
            Deselect All
          </Button>
        </div>
      </div>

      <div className='divide-y'>
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`px-4 py-3 flex items-center justify-between ${
              item.isSelected ? "bg-primary/5" : ""
            }`}
          >
            <div className='flex items-center gap-3'>
              <Button
                variant={item.isSelected ? "default" : "outline"}
                size='icon'
                className='h-6 w-6 rounded-full'
                onClick={() => onToggleSelection(item.id)}
              >
                {item.isSelected && <Check className='h-4 w-4' />}
              </Button>
              <span>
                {item.name} #{index + 1}
              </span>
            </div>
            <div className='font-medium'>${item.price.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className='p-4 border-t'>
        <Button onClick={onClose} className='w-full'>
          Done
        </Button>
      </div>
    </div>
  );
}
