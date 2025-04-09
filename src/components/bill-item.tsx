"use client";

import { Check } from "lucide-react";
import type { BillItem } from "@/types/bill";
import { Button } from "@/components/ui/button";

interface BillItemRowProps {
  item: BillItem;
  isSelected: boolean;
  onToggleSelection: () => void;
}


export default function BillItemRow({
  item,
  isSelected,
  onToggleSelection,
}: BillItemRowProps) {
  return (
    <div className={`px-4 py-3 ${isSelected ? "bg-primary/5" : ""}`}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button
            variant={isSelected ? "default" : "outline"}
            size='icon'
            className='h-6 w-6 rounded-full'
            onClick={onToggleSelection}
          >
            {isSelected && <Check className='h-4 w-4' />}
          </Button>
          <span>{item.name}</span>
        </div>
        <div className='font-medium'>${item.price.toFixed(2)}</div>
      </div>
    </div>
  );
}
