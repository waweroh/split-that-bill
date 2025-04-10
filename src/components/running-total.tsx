"use client";

import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RunningTotalProps {
  itemCount: number;
  total: number;
  balance: number;
}

export default function RunningTotal({
  itemCount,
  total,
  balance,
}: RunningTotalProps) {
  if (itemCount === 0) return null;

  return (
    <div className='sticky bottom-0 w-full bg-background border-t p-3 shadow-lg flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <ShoppingCart className='h-5 w-5' />
        <Badge variant='secondary'>
          {itemCount} {itemCount === 1 ? "item" : "items"} selected
        </Badge>
      </div>
      <div className='flex gap-4'>
        <div className='font-medium'>
          Subtotal: <span>${total.toFixed(2)}</span>
        </div>
        <div className='font-bold'>
          Balance:{" "}
          <span
            className={
              balance < 0
                ? "text-green-600"
                : balance > 0
                ? "text-red-600"
                : "text-primary"
            }
          >
            ${balance.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
